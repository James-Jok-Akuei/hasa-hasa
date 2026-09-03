import path from "node:path";
import { z } from "zod";

// tsx does not load .env automatically. Node 20.12+ can, without a dependency.
try {
  process.loadEnvFile(path.join(import.meta.dirname, "..", "..", ".env"));
} catch {
  // Deployed environments inject real env vars; there is no file to read.
}

const envSchema = z
  .object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  WEB_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  EMAIL_PROVIDER: z.enum(["console", "resend"]).default("console"),
  RESEND_FROM: z.string().optional(),
  // Peppers the one-time code hashes. Without it a leaked database hands
  // over every live login code, since 6 digits is only a million guesses.
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  RESEND_API_KEY: z.string().optional(),
  })
  /**
   * A missing key must stop the process at boot, not at the first sign-in.
   * Booting "successfully" into an environment where nobody can log in is
   * worse than not booting at all.
   */
  .superRefine((value, ctx) => {
    if (value.EMAIL_PROVIDER === "resend") {
      if (!value.RESEND_API_KEY) {
        ctx.addIssue({
          code: "custom",
          path: ["RESEND_API_KEY"],
          message: "Required when EMAIL_PROVIDER=resend",
        });
      }
      if (!value.RESEND_FROM) {
        ctx.addIssue({
          code: "custom",
          path: ["RESEND_FROM"],
          message: "Required when EMAIL_PROVIDER=resend, e.g. HASA HASA <noreply@yourdomain.com>",
        });
      }
    }

    // console prints codes to stdout. In production that is both a way to
    // leak live codes into logs and a guarantee nobody can actually sign in.
    if (value.NODE_ENV === "production" && value.EMAIL_PROVIDER === "console") {
      ctx.addIssue({
        code: "custom",
        path: ["EMAIL_PROVIDER"],
        message: "Cannot be 'console' in production — nobody would receive a code",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  // Fail at boot, not on the first request that happens to need the value.
  console.error(`Invalid environment:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === "production";
