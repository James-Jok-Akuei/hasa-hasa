import {
  requestOtpSchema,
  signupSchema,
  signupVerifySchema,
  verifyOtpSchema,
} from "@hasahasa/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { isProduction } from "../../lib/env.js";
import { consumeOtp, issueOtp, OtpError } from "../../lib/otp.js";
import { prisma } from "../../lib/prisma.js";
import {
  createSession,
  revokeSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "../../lib/session.js";
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
    { schema: { body: signupSchema } },
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
    { schema: { body: signupVerifySchema } },
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
    { schema: { body: requestOtpSchema } },
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
    { schema: { body: verifyOtpSchema } },
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
  app.get("/auth/me", { preHandler: requireUser }, async (request, reply) => {
    return reply.send(await serializeSession(request.session!.userId));
  });

  app.post("/auth/logout", { preHandler: requireUser }, async (request, reply) => {
    const header = request.headers.authorization;
    const token = header?.startsWith("Bearer ")
      ? header.slice(7)
      : request.cookies[SESSION_COOKIE];

    if (token) await revokeSession(token);
    reply.clearCookie(SESSION_COOKIE, { path: "/" });
    return reply.code(204).send();
  });
};

export default authRoutes;
