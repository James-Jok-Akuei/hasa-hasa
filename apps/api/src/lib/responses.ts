import { restaurantStatusSchema, sessionSchema } from "@hasahasa/shared";
import { z } from "zod";

/**
 * The single error envelope every failure uses. `issues` is only present on
 * validation failures, keyed by field path so clients can attach each message
 * to its input without a translation layer.
 */
export const errorResponse = z.object({
  error: z.string().describe("Machine-readable code, e.g. EMAIL_IN_USE"),
  message: z.string().describe("Human-readable, safe to show a user"),
  issues: z
    .array(
      z.object({
        path: z.array(z.string()),
        message: z.string(),
      }),
    )
    .optional()
    .describe("Only on validation failures"),
  retryAfterSeconds: z
    .number()
    .optional()
    .describe("Only on 429 — seconds until the next attempt is allowed"),
});

/** Both verify endpoints answer with the session plus a bearer token. */
export const sessionResponse = sessionSchema.extend({
  token: z
    .string()
    .describe("Bearer token for native clients. The web app uses the cookie."),
});

export const otpSentResponse = z.object({
  sent: z.literal(true),
});

export const restaurantResponse = z.object({
  id: z.string(),
  name: z.string(),
  status: restaurantStatusSchema,
  contactEmail: z.string(),
  contactPhone: z.string(),
  rejectionReason: z.string().nullable(),
  reviewedAt: z.date().nullable(),
  reviewedById: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const restaurantListResponse = z.object({
  restaurants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: restaurantStatusSchema,
      contactEmail: z.string(),
      contactPhone: z.string(),
      owner: z
        .object({
          id: z.string(),
          email: z.string(),
          phone: z.string().nullable(),
        })
        .nullable(),
      rejectionReason: z.string().nullable(),
      reviewedAt: z.date().nullable(),
      createdAt: z.date(),
    }),
  ),
  nextCursor: z
    .string()
    .nullable()
    .describe("Pass back as ?cursor= for the next page. Null on the last page."),
});
