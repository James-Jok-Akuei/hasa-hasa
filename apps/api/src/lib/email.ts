import { OTP_LENGTH } from "@hasahasa/shared";
import { env } from "./env.js";

export interface EmailProvider {
  sendOtp(to: string, code: string): Promise<void>;
}

/** Codes expire in ten minutes; the copy has to match lib/otp.ts. */
const EXPIRY_MINUTES = 10;
const SEND_TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 3;

/**
 * Dev provider: prints the code instead of sending it. Rejected at boot when
 * NODE_ENV=production — see lib/env.ts.
 */
const consoleProvider: EmailProvider = {
  async sendOtp(to, code) {
    console.log(
      `\n  ────────────────────────────────\n` +
        `   OTP for ${to}: ${code}\n` +
        `  ────────────────────────────────\n`,
    );
  },
};

function textBody(code: string): string {
  return [
    `Your HASA HASA code is ${code}`,
    "",
    `It expires in ${EXPIRY_MINUTES} minutes and can be used once.`,
    "",
    "If you did not ask for this, you can ignore this email — no one can",
    "sign in without the code.",
  ].join("\n");
}

/**
 * Deliberately plain. Merchants read this on cheap Android handsets over a
 * slow connection, so it is one table, inline styles, no images and no web
 * fonts. The code is selectable text, not a picture, so it can be copied.
 */
function htmlBody(code: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;">
    <tr><td style="padding:32px;text-align:center;">
      <p style="margin:0 0 24px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#71717a;">HASA HASA</p>
      <p style="margin:0 0 8px;font-size:15px;color:#3f3f46;">Your sign-in code</p>
      <p style="margin:0 0 24px;font-size:36px;font-weight:600;letter-spacing:8px;color:#ff751f;">${code}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
        Expires in ${EXPIRY_MINUTES} minutes and can be used once.<br>
        If you did not ask for this, ignore this email.
      </p>
    </td></tr>
  </table>
</body></html>`;
}

const resendProvider: EmailProvider = {
  async sendOtp(to, code) {
    // env.ts refuses to boot without these, so the assertion is safe.
    const apiKey = env.RESEND_API_KEY!;
    const from = env.RESEND_FROM!;

    let lastError: unknown;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to,
            // The code in the subject means it is readable from a lock screen
            // notification without opening the mail app.
            subject: `${code} is your HASA HASA code`,
            text: textBody(code),
            html: htmlBody(code),
          }),
          signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
        });

        if (response.ok) return;

        const body = await response.text();

        // 4xx is a bad key, an unverified sender or a rejected address.
        // Retrying cannot fix any of those.
        if (response.status < 500) {
          throw new Error(`Resend rejected the message: ${response.status} ${body}`);
        }

        lastError = new Error(`Resend failed: ${response.status} ${body}`);
      } catch (error) {
        // A 4xx above is final; rethrow rather than burning the retries.
        if (error instanceof Error && error.message.startsWith("Resend rejected")) {
          throw error;
        }
        lastError = error;
      }

      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400 * 3 ** attempt));
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Could not send the email");
  },
};

export const email: EmailProvider =
  env.EMAIL_PROVIDER === "resend" ? resendProvider : consoleProvider;

export { OTP_LENGTH };
