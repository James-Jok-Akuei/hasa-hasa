import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { resolveSession, SESSION_COOKIE } from "../lib/session.js";

type ResolvedSession = NonNullable<Awaited<ReturnType<typeof resolveSession>>>;

declare module "fastify" {
  interface FastifyRequest {
    session: ResolvedSession | null;
  }
}

/**
 * The dashboard sends the session as a cookie; the mobile app will send it
 * as a bearer token. Accepting both keeps one session model for all clients.
 */
function readToken(request: FastifyRequest): string | null {
  const header = request.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);

  const cookie = request.cookies[SESSION_COOKIE];
  return cookie ?? null;
}

const authPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest("session", null);

  app.addHook("onRequest", async (request) => {
    const token = readToken(request);
    request.session = token ? await resolveSession(token) : null;
  });
};

export default fp(authPlugin, { name: "auth" });

/** Route guard: any signed-in user. */
export async function requireUser(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session) {
    return reply.code(401).send({ error: "UNAUTHENTICATED", message: "Sign in to continue." });
  }
}

/** Route guard: platform ops only. */
export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session) {
    return reply.code(401).send({ error: "UNAUTHENTICATED", message: "Sign in to continue." });
  }
  if (!request.session.user.isPlatformAdmin) {
    // 404 rather than 403: the admin surface should not confirm it exists.
    return reply.code(404).send({ error: "NOT_FOUND", message: "Not found." });
  }
}

/**
 * Route guard: the caller's restaurant must be approved. Authentication and
 * authorization stay separate — a PENDING owner is signed in, and sees the
 * holding screen, but cannot reach dashboard data.
 */
export async function requireApprovedRestaurant(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (!request.session) {
    return reply.code(401).send({ error: "UNAUTHENTICATED", message: "Sign in to continue." });
  }
  const membership = request.session.user.memberships[0];
  if (!membership) {
    return reply.code(403).send({ error: "NO_RESTAURANT", message: "No restaurant on this account." });
  }
  if (membership.restaurant.status !== "APPROVED") {
    return reply.code(403).send({
      error: "RESTAURANT_NOT_APPROVED",
      message: "This restaurant is still awaiting approval.",
      status: membership.restaurant.status,
    });
  }
}
