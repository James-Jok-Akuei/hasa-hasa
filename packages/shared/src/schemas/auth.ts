import { z } from "zod";

/** Length of the one-time codes we mail out. */
export const OTP_LENGTH = 6;

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .pipe(z.email("Enter a valid email address"));

/** The mailed code itself — shared by the login and signup verify steps. */
const otpCode = z
  .string()
  .trim()
  .min(1, "Enter the code we sent you")
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `The code is ${OTP_LENGTH} digits`);

/** Login is passwordless: step one asks for the email we send the code to. */
export const requestOtpSchema = z.object({ email });

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

/** Step two: the code from the email, checked against the address it went to. */
export const verifyOtpSchema = requestOtpSchema.extend({ code: otpCode });

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

/** Signup is passwordless too — step one is the restaurant's details. */
export const signupSchema = z.object({
  restaurantName: z
    .string()
    .trim()
    .min(1, "Restaurant name is required")
    .min(2, "Restaurant name must be at least 2 characters"),
  email,
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9][0-9\s-]{7,14}$/, "Enter a valid phone number"),
});

export type SignupInput = z.infer<typeof signupSchema>;

/** Step two: confirm the email owner before the account is created. */
export const signupVerifySchema = signupSchema.extend({ code: otpCode });

export type SignupVerifyInput = z.infer<typeof signupVerifySchema>;

export const forgotPasswordSchema = z.object({ email });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
