import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    restaurantName: z
      .string()
      .trim()
      .min(1, "Restaurant name is required")
      .min(2, "Restaurant name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Enter a valid email address")),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^\+?[0-9][0-9\s-]{7,14}$/, "Enter a valid phone number"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
