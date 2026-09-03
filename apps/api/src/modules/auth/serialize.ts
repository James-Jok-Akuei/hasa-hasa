import type { Session } from "@hasahasa/shared";
import { prisma } from "../../lib/prisma.js";

/**
 * Builds the payload every auth endpoint returns. One shape, so the client
 * never has to reconcile a login response with a /auth/me response.
 */
export async function serializeSession(userId: string): Promise<Session> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      memberships: {
        include: { restaurant: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const membership = user.memberships[0];

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isPlatformAdmin: user.isPlatformAdmin,
    },
    restaurant: membership
      ? {
          id: membership.restaurant.id,
          name: membership.restaurant.name,
          status: membership.restaurant.status,
          role: membership.role,
          rejectionReason: membership.restaurant.rejectionReason,
        }
      : null,
  };
}
