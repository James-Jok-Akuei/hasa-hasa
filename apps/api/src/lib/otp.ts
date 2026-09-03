import { OTP_LENGTH } from "@hasahasa/shared";
import type { OtpPurpose, Prisma } from "@prisma/client";
import { generateOtp, hashOtp, safeEqual } from "./crypto.js";
import { email } from "./email.js";
import { prisma } from "./prisma.js";

const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

export class OtpError extends Error {
  constructor(
    readonly code:
      | "COOLDOWN"
      | "INVALID"
      | "EXPIRED"
      | "TOO_MANY_ATTEMPTS"
      | "SEND_FAILED",
    message: string,
    readonly retryAfterSeconds?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
  }
}

/**
 * Issues a code and mails it. Any earlier unconsumed code for the same
 * address and purpose is invalidated, so only the newest code works —
 * otherwise a resend leaves several valid codes in flight at once.
 */
export async function issueOtp(
  address: string,
  purpose: OtpPurpose,
  payload?: Prisma.InputJsonValue,
): Promise<void> {
  const recent = await prisma.otpCode.findFirst({
    where: { email: address, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    const elapsed = Date.now() - recent.createdAt.getTime();
    if (elapsed < RESEND_COOLDOWN_MS) {
      throw new OtpError(
        "COOLDOWN",
        "A code was just sent. Wait a moment before asking for another.",
        Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000),
      );
    }
  }

  const code = generateOtp(OTP_LENGTH);

  const created = await prisma.$transaction(async (tx) => {
    await tx.otpCode.updateMany({
      where: { email: address, purpose, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    return tx.otpCode.create({
      data: {
        email: address,
        purpose,
        codeHash: hashOtp(code),
        payload,
        expiresAt: new Date(Date.now() + TTL_MS),
      },
    });
  });

  try {
    await email.sendOtp(address, code);
  } catch (error) {
    // The row exists but nobody received the code. Left in place it would
    // start the cooldown, so the user is told to wait 60 seconds for a code
    // that never arrived. Remove it so they can retry at once.
    await prisma.otpCode
      .delete({ where: { id: created.id } })
      .catch(() => undefined);

    throw new OtpError(
      "SEND_FAILED",
      "We could not send the code just now. Try again in a moment.",
      undefined,
      { cause: error },
    );
  }
}

/**
 * Verifies and consumes a code. Returns the payload the code was issued
 * with, which is how signup details survive between the two steps without
 * trusting the client to resend them unchanged.
 */
export async function consumeOtp(
  address: string,
  purpose: OtpPurpose,
  code: string,
): Promise<Prisma.JsonValue | null> {
  const record = await prisma.otpCode.findFirst({
    where: { email: address, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  // Same error either way: revealing "no code for this address" would let
  // anyone enumerate which emails have signed up.
  if (!record) {
    throw new OtpError("INVALID", "That code is not valid.");
  }

  if (record.expiresAt.getTime() < Date.now()) {
    throw new OtpError("EXPIRED", "That code has expired. Ask for a new one.");
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    throw new OtpError(
      "TOO_MANY_ATTEMPTS",
      "Too many attempts. Ask for a new code.",
    );
  }

  if (!safeEqual(record.codeHash, hashOtp(code))) {
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new OtpError("INVALID", "That code is not valid.");
  }

  await prisma.otpCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return record.payload;
}
