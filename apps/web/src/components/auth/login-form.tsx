"use client";

import {
  requestOtpSchema,
  verifyOtpSchema,
  type VerifyOtpInput,
} from "@hasahasa/shared";
import Link from "next/link";
import { useState } from "react";
import { Field, inputClassName, SubmitButton } from "@/components/auth/field";
import { GoogleAuth } from "@/components/auth/google-button";
import {
  OtpField,
  ResendButton,
  SentToLine,
  useResendCountdown,
} from "@/components/auth/otp-step";

type FieldErrors = Partial<Record<keyof VerifyOtpInput, string>>;
type Status = "idle" | "submitting" | "success";
/** Two screens on one route: ask for the email, then for the mailed code. */
type Step = "email" | "code";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [values, setValues] = useState<VerifyOtpInput>({
    email: "",
    code: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const resend = useResendCountdown();

  function setValue(field: keyof VerifyOtpInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /** Fakes the "mail them a code" round trip and starts the cooldown. */
  async function sendCode() {
    setStatus("submitting");
    // No backend yet — simulate the round trip so the flow feels real.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("idle");
    resend.start();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const schema = step === "email" ? requestOtpSchema : verifyOtpSchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof VerifyOtpInput;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (step === "email") {
      await sendCode();
      setStep("code");
      return;
    }

    setStatus("submitting");
    // No backend yet — simulate the round trip so the flow feels real.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  }

  /** Back to step one, so a typo in the address is one click from fixed. */
  function editEmail() {
    setValues((prev) => ({ ...prev, code: "" }));
    setErrors({});
    resend.reset();
    setStep("email");
  }

  async function handleResend() {
    if (status !== "idle" || resend.seconds > 0) return;
    setValue("code", "");
    await sendCode();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
        Login
      </h1>
      <p className="mt-4 text-center text-sm font-light tracking-wide text-white/60">
        {step === "email" ? (
          "Enter your email and we'll send you a sign-in code"
        ) : (
          <SentToLine email={values.email} />
        )}
      </p>

      <div className="mt-9 flex w-full flex-col gap-7">
        {step === "email" ? (
          <Field
            label="Email"
            error={errors.email}
            input={
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="email"
                value={values.email}
                onChange={(e) => setValue("email", e.target.value)}
                className={inputClassName}
              />
            }
          />
        ) : (
          <OtpField
            value={values.code}
            error={errors.code}
            onChange={(code) => setValue("code", code)}
          />
        )}
      </div>

      <SubmitButton
        status={status}
        label={step === "email" ? "Send code" : "Sign in"}
      />

      {step === "email" ? (
        <GoogleAuth />
      ) : (
        <ResendButton
          seconds={resend.seconds}
          disabled={status !== "idle"}
          onResend={handleResend}
        />
      )}

      <div className="mt-10 flex flex-col items-center">
        {step === "email" ? (
          <Link
            href="/signup"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
          >
            New account
          </Link>
        ) : (
          <button
            type="button"
            onClick={editEmail}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300 focus-visible:outline-none"
          >
            Use another email
          </button>
        )}
      </div>
    </form>
  );
}
