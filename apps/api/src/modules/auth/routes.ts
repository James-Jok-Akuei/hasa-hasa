import {
  requestOtpSchema,
  signupSchema,
  signupVerifySchema,
  verifyOtpSchema,
} from "@hasahasa/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { sessionSchema } from "@hasahasa/shared";
import { z } from "zod";
import { isProduction } from "../../lib/env.js";
import { consumeOtp, issueOtp, OtpError } from "../../lib/otp.js";
import { prisma } from "../../lib/prisma.js";
import {
  createSession,
  revokeSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "../../lib/session.js";
import {
  errorResponse,
  otpSentResponse,
  sessionResponse,
} from "../../lib/responses.js";
import { requireUser } from "../../plugins/auth.js";
import { serializeSession } from "./serialize.js";

const authRoutes: FastifyPluginAsyncZod = async (app) => {
  /**
   * Step one of signup. Nothing is written to User or Restaurant here — the
   * application details ride along on the OTP row and only become rows once
   * the address is proven. Otherwise anyone could fill the merchant review
   * queue with applications for addresses they do not control.
   */
  app.post(
    "/auth/signup",
    {
      schema: {
        tags: ["Auth"],
        summary: "Start a restaurant application",
        description: [
          "Step one of two. Mails a six-digit code to the address given.",
          "",
          "**Nothing is written to the database yet.** The application details",
          "are held against the code and only become a User and a Restaurant",
          "once `/auth/signup/verify` succeeds. Without this, anyone could",
          "fill the review queue with applications for addresses they do not",
          "control.",
          "",
          "One code is live per address at a time — requesting another",
          "invalidates the previous one. There is a 60 second cooldown.",
        ].join("\n"),
        body: signupSchema,
        response: {
          202: otpSentResponse.describe("Code sent"),
          400: errorResponse.describe("Validation failed"),
          409: errorResponse.describe("An account already exists for this email"),
          429: errorResponse.describe("Cooldown — see retryAfterSeconds"),
          502: errorResponse.describe("The email could not be sent — safe to retry immediately"),
        },
      },
    },
    async (request, reply) => {
      const body = request.body;

      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existing) {
        return reply.code(409).send({
          error: "EMAIL_IN_USE",
          message: "An account already exists for this email. Sign in instead.",
        });
      }

      try {
        await issueOtp(body.email, "SIGNUP", body);
      } catch (error) {
        if (error instanceof OtpError) {
          request.log.warn({ err: error, code: error.code }, "signup otp failed");
          return reply.code(error.code === "COOLDOWN" ? 429 : 502).send({
            error: error.code,
            message: error.message,
            retryAfterSeconds: error.retryAfterSeconds,
          });
        }
        throw error;
      }

      return reply.code(202).send({ sent: true });
    },
  );

  /** Step two: the code proves the address, so the application is created. */
  app.post(
    "/auth/signup/verify",
    {
      schema: {
        tags: ["Auth"],
        summary: "Verify the code and create the application",
        description: [
          "Step two of two. Consumes the code and creates the User, the",
          "Restaurant as **PENDING**, and an OWNER membership joining them.",
          "",
          "The restaurant details come from what was captured at step one,",
          "not from this request body — a client cannot change the name or",
          "phone between the two steps.",
          "",
          "Sets the session cookie and returns the same session as a bearer",
          "token. The account exists but the dashboard stays closed until an",
          "admin approves it.",
        ].join("\n"),
        body: signupVerifySchema,
        response: {
          201: sessionResponse.describe("Application created, restaurant PENDING"),
          400: errorResponse.describe("Code invalid, expired, or too many attempts"),
        },
      },
    },
    async (request, reply) => {
      const { code, email: address } = request.body;

      let payload: unknown;
      try {
        payload = await consumeOtp(address, "SIGNUP", code);
      } catch (error) {
        if (error instanceof OtpError) {
          return reply.code(400).send({ error: error.code, message: error.message });
        }
        throw error;
      }

      // Trust the details captured at step one, not whatever the client
      // re-sent at step two.
      const details = signupSchema.parse(payload);

      const user = await prisma.$transaction(async (tx) => {
        const created = await tx.user.create({
          data: { email: details.email, phone: details.phone },
        });
        const restaurant = await tx.restaurant.create({
          data: {
            name: details.restaurantName,
            contactEmail: details.email,
            contactPhone: details.phone,
            // Explicit, though it is also the default: a new restaurant is
            // an application, not a live merchant.
            status: "PENDING",
          },
        });
        await tx.membership.create({
          data: { userId: created.id, restaurantId: restaurant.id, role: "OWNER" },
        });
        return created;
      });

      const token = await createSession(user.id);
      reply.setCookie(SESSION_COOKIE, token, sessionCookieOptions(isProduction));

      const session = await serializeSession(user.id);
      return reply.code(201).send({ ...session, token });
    },
  );

  /**
   * Step one of login. Answers 404 for an address with no account, so the
   * form can say so instead of asking for a code that was never sent.
   *
   * That makes this an enumeration oracle: anyone can learn which addresses
   * are registered by trying them. Accepted deliberately — a merchant who
   * mistypes their address would otherwise sit on the code screen waiting
   * for mail that is never coming. The rate limit is what keeps the oracle
   * slow; nothing here reveals more than "registered or not".
   */
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Request a sign-in code",
        description: [
          "Step one of two. Mails a six-digit code if the address has an",
          "account.",
          "",
          "**Answers 404 when the address has no account**, so the caller can",
          "point the person at signup. This is knowingly an enumeration",
          "oracle — the rate limit, not the response shape, is what bounds it.",
          "",
          "Subject to the same 60 second cooldown as signup.",
        ].join("\n"),
        body: requestOtpSchema,
        response: {
          202: otpSentResponse.describe("Code sent"),
          400: errorResponse.describe("Validation failed"),
          404: errorResponse.describe("EMAIL_NOT_REGISTERED — no account for this address"),
          429: errorResponse.describe("Cooldown — see retryAfterSeconds"),
          502: errorResponse.describe("The email could not be sent — safe to retry immediately"),
        },
      },
    },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { email: request.body.email },
      });

      if (!user) {
        return reply.code(404).send({
          error: "EMAIL_NOT_REGISTERED",
          message:
            "That email is not registered yet. Create an account to get started.",
        });
      }

      try {
        await issueOtp(user.email, "LOGIN");
      } catch (error) {
        if (error instanceof OtpError) {
          request.log.warn({ err: error, code: error.code }, "login otp failed");
          return reply.code(error.code === "COOLDOWN" ? 429 : 502).send({
            error: error.code,
            message: error.message,
            retryAfterSeconds: error.retryAfterSeconds,
          });
        }
        throw error;
      }

      return reply.code(202).send({ sent: true });
    },
  );

  app.post(
    "/auth/login/verify",
    {
      schema: {
        tags: ["Auth"],
        summary: "Verify the code and open a session",
        description: [
          "Step two of two. Sets the session cookie and returns the same",
          "token for native clients.",
          "",
          "Succeeds regardless of the restaurant's review status — check",
          "`restaurant.status` on the response to decide where to send them.",
          "A PENDING or REJECTED owner is signed in and belongs on a holding",
          "screen, not the dashboard.",
        ].join("\n"),
        body: verifyOtpSchema,
        response: {
          200: sessionResponse.describe("Signed in — check restaurant.status"),
          400: errorResponse.describe("Code invalid, expired, or too many attempts"),
        },
      },
    },
    async (request, reply) => {
      const { code, email: address } = request.body;

      try {
        await consumeOtp(address, "LOGIN", code);
      } catch (error) {
        if (error instanceof OtpError) {
          return reply.code(400).send({ error: error.code, message: error.message });
        }
        throw error;
      }

      const user = await prisma.user.findUnique({ where: { email: address } });
      if (!user) {
        return reply
          .code(400)
          .send({ error: "INVALID", message: "That code is not valid." });
      }

      const token = await createSession(user.id);
      reply.setCookie(SESSION_COOKIE, token, sessionCookieOptions(isProduction));

      const session = await serializeSession(user.id);
      return reply.send({ ...session, token });
    },
  );

  /**
   * The dashboard calls this on load. `restaurant.status` is what it routes
   * on: APPROVED goes to the dashboard, anything else to the holding screen.
   */
  app.get(
    "/auth/me",
    {
      preHandler: requireUser,
      schema: {
        tags: ["Auth"],
        summary: "The current session",
        description: [
          "What the dashboard calls on load.",
          "",
          "`restaurant.status` is the field to route on: **APPROVED** opens",
          "the dashboard, anything else belongs on the holding screen.",
          "`restaurant.rejectionReason` carries the explanation to show a",
          "rejected merchant.",
          "",
          "`restaurant` is null for a platform admin, who belongs to none.",
        ].join("\n"),
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        response: {
          200: sessionSchema,
          401: errorResponse.describe("No valid session"),
        },
      },
    },
    async (request, reply) => {
      return reply.send(await serializeSession(request.session!.userId));
    },
  );

  app.post(
    "/auth/logout",
    {
      preHandler: requireUser,
      schema: {
        tags: ["Auth"],
        summary: "End the session",
        description:
          "Revokes the session server-side and clears the cookie. The token is dead immediately, not just forgotten by the client.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        response: {
          204: z.null().describe("Session revoked"),
          401: errorResponse.describe("No valid session"),
        },
      },
    },
    async (request, reply) => {
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : request.cookies[SESSION_COOKIE];

      if (token) await revokeSession(token);
      reply.clearCookie(SESSION_COOKIE, { path: "/" });
      return reply.code(204).send(null);
    },
  );
};

export default authRoutes;
