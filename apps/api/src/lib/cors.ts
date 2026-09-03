import { env, isProduction } from "./env.js";

/** Private ranges, so a phone on the same wifi can reach a dev machine. */
const LAN_HOST =
  /^(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

/** WEB_ORIGIN takes a comma-separated list, so staging can allow more than one. */
const allowed = env.WEB_ORIGIN.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

/**
 * Production allows exactly what WEB_ORIGIN lists and nothing else.
 *
 * Development additionally allows any private LAN address, because the app is
 * opened at http://192.168.x.x:3000 when testing from a real handset — which
 * is not optional here, the target devices behave differently from a laptop.
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  // Same-origin requests, curl and server-to-server send no Origin at all.
  if (!origin) return true;

  if (allowed.includes(origin)) return true;
  if (isProduction) return false;

  try {
    const url = new URL(origin);
    return url.protocol === "http:" && LAN_HOST.test(url.hostname);
  } catch {
    return false;
  }
}
