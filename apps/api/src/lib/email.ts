import { env } from "./env.js";

export interface EmailProvider {
  sendOtp(to: string, code: string): Promise<void>;
}

/**
 * Dev provider: prints the code instead of sending it. Lets the whole auth
 * flow be built and tested before a transactional email account exists.
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

const resendProvider: EmailProvider = {
  async sendOtp(to, code) {
    if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
      throw new Error("RESEND_API_KEY and RESEND_FROM are required");
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to,
        subject: `${code} is your HASA HASA code`,
        text: `Your code is ${code}. It expires in 10 minutes.`,
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
    }
  },
};

export const email: EmailProvider =
  env.EMAIL_PROVIDER === "resend" ? resendProvider : consoleProvider;
