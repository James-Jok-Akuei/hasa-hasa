import {
  listRestaurantsQuerySchema,
  rejectRestaurantSchema,
} from "@hasahasa/shared";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import {
  errorResponse,
  restaurantListResponse,
  restaurantResponse,
} from "../../lib/responses.js";
import { requireAdmin } from "../../plugins/auth.js";

const idParams = z.object({ id: z.string().min(1) });

const adminRoutes: FastifyPluginAsyncZod = async (app) => {
  // Every route below is ops-only.
  app.addHook("preHandler", requireAdmin);

  /** The review queue. Defaults to newest first so the backlog is visible. */
  app.get(
    "/admin/restaurants",
    {
      schema: {
        tags: ["Admin"],
        summary: "The review queue",
        description: [
          "Restaurants awaiting or past review, newest first.",
          "",
          "Filter with `?status=PENDING` for the outstanding queue. Paginate",
          "with `?limit=` and `?cursor=`, passing back the `nextCursor` from",
          "the previous page — it is null on the last page.",
          "",
          "Each row includes the owner who applied, so a reviewer can contact",
          "them without a second request.",
        ].join("\n"),
        querystring: listRestaurantsQuerySchema,
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        response: {
          200: restaurantListResponse,
          404: errorResponse.describe("Not an admin"),
        },
      },
    },
    async (request, reply) => {
      const { status, limit, cursor } = request.query;

      const rows = await prisma.restaurant.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        include: {
          memberships: {
            where: { role: "OWNER" },
            include: { user: { select: { id: true, email: true, phone: true } } },
          },
        },
      });

      // One row over the limit tells us whether another page exists without
      // a second count query.
      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;

      return reply.send({
        restaurants: page.map((r) => ({
          id: r.id,
          name: r.name,
          status: r.status,
          contactEmail: r.contactEmail,
          contactPhone: r.contactPhone,
          owner: r.memberships[0]?.user ?? null,
          rejectionReason: r.rejectionReason,
          reviewedAt: r.reviewedAt,
          createdAt: r.createdAt,
        })),
        nextCursor: hasMore ? (page.at(-1)?.id ?? null) : null,
      });
    },
  );

  /**
   * Approve. Guarded on the current status so a double-click cannot
   * overwrite the original reviewer and timestamp.
   */
  app.post(
    "/admin/restaurants/:id/approve",
    {
      schema: {
        tags: ["Admin"],
        summary: "Approve a restaurant",
        description: [
          "Moves a **PENDING** restaurant to **APPROVED**, opening the",
          "dashboard for its owner. Records who approved it and when.",
          "",
          "Only acts on a PENDING restaurant — approving one that has already",
          "been reviewed returns 409 rather than overwriting the original",
          "reviewer and timestamp. A double-click is safe.",
        ].join("\n"),
        params: idParams,
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        response: {
          200: restaurantResponse,
          404: errorResponse.describe("Not an admin, or no such restaurant"),
          409: errorResponse.describe("Already reviewed — not PENDING"),
        },
      },
    },
    async (request, reply) => {
      const result = await prisma.restaurant.updateMany({
        where: { id: request.params.id, status: "PENDING" },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedById: request.session!.userId,
          rejectionReason: null,
        },
      });

      if (result.count === 0) {
        return reply.code(409).send({
          error: "NOT_PENDING",
          message: "That restaurant is not awaiting review.",
        });
      }

      return reply.send(
        await prisma.restaurant.findUniqueOrThrow({ where: { id: request.params.id } }),
      );
    },
  );

  /** Reject. A reason is required — the merchant is shown it. */
  app.post(
    "/admin/restaurants/:id/reject",
    {
      schema: {
        tags: ["Admin"],
        summary: "Reject a restaurant",
        description: [
          "Moves a **PENDING** restaurant to **REJECTED**.",
          "",
          "A reason is required and is **shown to the merchant** on their",
          "holding screen, so write it for them rather than as an internal",
          "note.",
          "",
          "Guarded on PENDING the same way approve is.",
        ].join("\n"),
        params: idParams,
        body: rejectRestaurantSchema,
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        response: {
          200: restaurantResponse,
          400: errorResponse.describe("Reason missing"),
          404: errorResponse.describe("Not an admin, or no such restaurant"),
          409: errorResponse.describe("Already reviewed — not PENDING"),
        },
      },
    },
    async (request, reply) => {
      const result = await prisma.restaurant.updateMany({
        where: { id: request.params.id, status: "PENDING" },
        data: {
          status: "REJECTED",
          reviewedAt: new Date(),
          reviewedById: request.session!.userId,
          rejectionReason: request.body.reason,
        },
      });

      if (result.count === 0) {
        return reply.code(409).send({
          error: "NOT_PENDING",
          message: "That restaurant is not awaiting review.",
        });
      }

      return reply.send(
        await prisma.restaurant.findUniqueOrThrow({ where: { id: request.params.id } }),
      );
    },
  );
};

export default adminRoutes;
