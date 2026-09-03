import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify, { type FastifyError } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { isAllowedOrigin } from "./lib/cors.js";
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

  // The spec is generated from the same Zod schemas the routes validate
  // with, so the docs cannot drift from the actual behaviour.
  await app.register(swagger, {
    openapi: {
      info: {
        title: "HASA HASA API",
        version: "0.1.0",
        description: [
          "Backend for the HASA HASA restaurant platform.",
          "",
          "**Authentication is passwordless.** Every sign-in is a two-step",
          "exchange: request a code, then verify it. There are no passwords",
          "to store or reset.",
          "",
          "**Restaurants are applications, not accounts.** Signing up creates",
          "a PENDING restaurant that ops must approve before the dashboard",
          "opens. Being signed in and being approved are separate: a PENDING",
          "owner authenticates normally and `GET /auth/me` reports their",
          "status, so the client can route them to a holding screen.",
          "",
          "**Sessions** are returned two ways. The web dashboard uses the",
          "`HttpOnly` cookie set on verify; native clients send the same",
          "token as `Authorization: Bearer <token>`.",
        ].join("\n"),
      },
      servers: [{ url: `http://localhost:${env.PORT}`, description: "Local" }],
      tags: [
        { name: "Auth", description: "Passwordless sign-up and sign-in" },
        {
          name: "Admin",
          description:
            "Ops review queue. Answers 404 to non-admins rather than 403, so the surface does not confirm it exists.",
        },
        { name: "System", description: "Health and service metadata" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer" },
          cookieAuth: { type: "apiKey", in: "cookie", name: "hasahasa_session" },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list", deepLinking: true },
  });

  await app.register(cors, {
    origin: (origin, callback) => {
      // Reject by not allowing the origin, rather than by erroring — an error
      // here produces a 500 where the browser expects a plain CORS refusal.
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
  });
  await app.register(cookie);

  // Blunt global ceiling. The OTP endpoints carry their own tighter limits.
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  await app.register(authPlugin);

  app.get(
    "/health",
    {
      schema: {
        tags: ["System"],
        summary: "Liveness check",
        description:
          "Answers 200 as soon as the process is serving. Does not touch the database — it reports that the API is up, not that it is healthy end to end.",
      },
    },
    async () => ({ ok: true }),
  );

  // A bare GET / is what everyone tries first. Answering with the route list
  // beats a 404 that looks like the server is broken.
  app.get(
    "/",
    {
      schema: {
        tags: ["System"],
        summary: "Service index",
        description: "The route list, for anyone who opens the API in a browser. Full documentation is at /docs.",
      },
    },
    async () => ({
    service: "@hasahasa/api",
    status: "ok",
    endpoints: {
      health: "GET /health",
      signup: "POST /auth/signup -> POST /auth/signup/verify",
      login: "POST /auth/login -> POST /auth/login/verify",
      me: "GET /auth/me",
      logout: "POST /auth/logout",
      reviewQueue: "GET /admin/restaurants?status=PENDING",
      approve: "POST /admin/restaurants/:id/approve",
      reject: "POST /admin/restaurants/:id/reject",
      docs: "GET /docs",
    },
  }),
  );

  await app.register(authRoutes);
  await app.register(adminRoutes);

  return app;
}
