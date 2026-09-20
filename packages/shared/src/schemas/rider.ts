import { z } from "zod";

/**
 * What a rider applies on. Lives here rather than in the web app because
 * the API will validate the same shape once the endpoint exists — the form
 * and the route should never disagree about what a valid application is.
 */

/** What they ride. Nothing else can carry a hot order across Juba. */
export const riderVehicleSchema = z.enum(["MOTORBIKE", "BICYCLE", "CAR"]);

export type RiderVehicle = z.infer<typeof riderVehicleSchema>;

/** Roughly when they can work. Not a shift — riders choose their hours. */
export const riderAvailabilitySchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "WEEKENDS",
  "EVENINGS",
]);

export type RiderAvailability = z.infer<typeof riderAvailabilitySchema>;

export const riderApplicationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Your name is required")
    .min(2, "Enter your full name"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9][0-9\s-]{7,14}$/, "Enter a valid phone number"),
  /** Optional on purpose: plenty of riders have a phone and no email. */
  email: z
    .union([
      z.literal(""),
      z.string().trim().pipe(z.email("Enter a valid email address")),
    ])
    .optional(),
  area: z.string().trim().min(1, "Tell us which part of Juba you ride in"),
  vehicle: riderVehicleSchema,
  availability: riderAvailabilitySchema,
  hasSmartphone: z.boolean(),
  /** Free text, so someone with unusual experience can say so. */
  notes: z
    .string()
    .trim()
    .max(500, "Keep this under 500 characters")
    .optional(),
});

export type RiderApplicationInput = z.infer<typeof riderApplicationSchema>;
