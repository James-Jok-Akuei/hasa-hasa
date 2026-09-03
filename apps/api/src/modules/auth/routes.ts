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
          return reply.code(429).send({
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
   * Step one of login. Always answers the same way: telling the caller
   * whether an address has an account is an enumeration oracle.
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
          "**Always answers 202, whether or not the account exists.** Telling",
          "a caller which addresses are registered would let anyone enumerate",
          "the merchant list.",
          "",
          "Subject to the same 60 second cooldown as signup.",
        ].join("\n"),
        body: requestOtpSchema,
        response: {
          202: otpSentResponse.describe("Answered identically for unknown addresses"),
          400: errorResponse.describe("Validation failed"),
          429: errorResponse.describe("Cooldown — see retryAfterSeconds"),
        },
      },
    },
    async (request, reply) => {
      const user = await prisma.user.findUnique({
        where: { email: request.body.email },
      });

      if (user) {
        try {
          await issueOtp(user.email, "LOGIN");
        } catch (error) {
          if (error instanceof OtpError && error.code === "COOLDOWN") {
            return reply.code(429).send({
              error: error.code,
              message: error.message,
              retryAfterSeconds: error.retryAfterSeconds,
            });
          }
          throw error;
        }
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
