import { z } from "zod";

/** Mirrors the RestaurantStatus enum in the API's Prisma schema. */
export const restaurantStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
]);

export type RestaurantStatus = z.infer<typeof restaurantStatusSchema>;

export const memberRoleSchema = z.enum(["OWNER", "MANAGER", "STAFF"]);

export type MemberRole = z.infer<typeof memberRoleSchema>;

/**
 * What `GET /auth/me` returns. `restaurant.status` is what the dashboard
 * routes on: anything other than APPROVED goes to the holding screen
 * rather than the dashboard.
 */
export const sessionSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().nullable(),
    isPlatformAdmin: z.boolean(),
  }),
  restaurant: z
    .object({
      id: z.string(),
      name: z.string(),
      status: restaurantStatusSchema,
      role: memberRoleSchema,
      rejectionReason: z.string().nullable(),
    })
    .nullable(),
});

export type Session = z.infer<typeof sessionSchema>;

/** Admin review actions. */
export const rejectRestaurantSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "A reason is required")
    .max(500, "Keep the reason under 500 characters"),
});

export type RejectRestaurantInput = z.infer<typeof rejectRestaurantSchema>;

export const listRestaurantsQuerySchema = z.object({
  status: restaurantStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  cursor: z.string().optional(),
});

export type ListRestaurantsQuery = z.infer<typeof listRestaurantsQuerySchema>;
