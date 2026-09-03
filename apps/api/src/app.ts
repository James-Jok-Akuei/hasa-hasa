import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyError } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env, isProduction } from "./lib/env.js";
import adminRoutes from "./modules/admin/routes.js";
import authRoutes from "./modules/auth/routes.js";
import authPlugin from "./plugins/auth.js";

export async function buildApp() {
  const app = Fastify({
    logger: isProduction
      ? true
      : { transport: { target: "pino-pretty", options: { colorize: true } } },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  /**
   * The web forms build their field errors from `issue.path[0]`, so the API
   * returns Zod's issues in that same shape. One validation contract for
   * both sides instead of a translation layer in the client.
   */
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.code(400).send({
        error: "VALIDATION",
        message: "Some fields need attention.",
        issues: error.validation.map((issue) => ({
          path: issue.instancePath.replace(/^\//, "").split("/").filter(Boolean),
          message: issue.message ?? "Invalid value",
        })),
      });
    }

    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({
        error: error.code ?? "REQUEST_ERROR",
        message: error.message,
      });
    }

    // Never leak internals; the log keeps the detail.
    request.log.error({ err: error }, "unhandled error");
    return reply.code(500).send({
      error: "INTERNAL",
      message: "Something went wrong on our side.",
    });
  });

  await app.register(cors, { origin: env.WEB_ORIGIN, credentials: true });
  await app.register(cookie);

  // Blunt global ceiling. The OTP endpoints carry their own tighter limits.
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  await app.register(authPlugin);

  app.get("/health", async () => ({ ok: true }));

  await app.register(authRoutes);
  await app.register(adminRoutes);

  return app;
}
