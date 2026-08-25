import { z } from "zod";

// Starter schema — shared between web, mobile, and the backend.
// Grow this as the domain model takes shape.

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
