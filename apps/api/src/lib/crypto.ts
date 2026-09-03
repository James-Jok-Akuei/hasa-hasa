import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { env } from "./env.js";

/**
 * One-time codes are only six digits — a million possibilities — so a plain
 * hash in a leaked database is brute-forced in seconds. HMAC with a secret
 * the database does not hold makes a dump useless on its own.
 */
export function hashOtp(code: string): string {
  return createHmac("sha256", env.AUTH_SECRET).update(code).digest("hex");
}

/** Session tokens are 256 bits of entropy, so a plain digest is enough. */
export function hashToken(token: string): string {
  return createHmac("sha256", env.AUTH_SECRET).update(token).digest("hex");
}

export function generateOtp(length: number): string {
  let code = "";
  for (let i = 0; i < length; i += 1) code += randomInt(0, 10).toString();
  return code;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Compares digests without leaking how much of the value matched. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
