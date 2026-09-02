"use client";

import {
  signupSchema,
  signupVerifySchema,
  type SignupVerifyInput,
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

type FieldErrors = Partial<Record<keyof SignupVerifyInput, string>>;
type Status = "idle" | "submitting" | "success";
/** Two screens on one route: the restaurant's details, then the mailed code. */
type Step = "details" | "code";

const EMPTY: SignupVerifyInput = {
  restaurantName: "",
  email: "",
  phone: "",
  code: "",
};

export function SignupForm() {
  const [step, setStep] = useState<Step>("details");
  const [values, setValues] = useState<SignupVerifyInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const resend = useResendCountdown();

  function setValue(field: keyof SignupVerifyInput, value: string) {
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

    const schema = step === "details" ? signupSchema : signupVerifySchema;
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupVerifyInput;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (step === "details") {
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

  /** Back to step one, so a typo in the details is one click from fixed. */
  function editDetails() {
    setValues((prev) => ({ ...prev, code: "" }));
    setErrors({});
    resend.reset();
    setStep("details");
  }

  async function handleResend() {
    if (status !== "idle" || resend.seconds > 0) return;
    setValue("code", "");
    await sendCode();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
        Sign up
      </h1>
      <p className="mt-4 text-center text-sm font-light tracking-wide text-white/60">
        {step === "details" ? (
          "Create your restaurant account"
        ) : (
          <SentToLine email={values.email} />
        )}
      </p>

      <div className="mt-8 flex w-full flex-col gap-5">
        {step === "details" ? (
          <>
            <Field
              label="Restaurant name"
              error={errors.restaurantName}
              input={
                <input
                  id="restaurant name"
                  name="restaurantName"
                  type="text"
                  autoComplete="organization"
                  placeholder="restaurant name"
                  value={values.restaurantName}
                  onChange={(e) => setValue("restaurantName", e.target.value)}
                  className={inputClassName}
                />
              }
            />

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

            <Field
              label="Phone"
              error={errors.phone}
              input={
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="phone number"
                  value={values.phone}
                  onChange={(e) => setValue("phone", e.target.value)}
                  className={inputClassName}
                />
              }
            />
          </>
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
        label={step === "details" ? "Send code" : "Create account"}
      />

      {step === "details" ? (
        <GoogleAuth />
      ) : (
        <ResendButton
          seconds={resend.seconds}
          disabled={status !== "idle"}
          onResend={handleResend}
        />
      )}

      <div className="mt-10 flex flex-col items-center">
        {step === "details" ? (
          <Link
            href="/login"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
          >
            Already have an account
          </Link>
        ) : (
          <button
            type="button"
            onClick={editDetails}
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300 focus-visible:outline-none"
          >
            Edit details
          </button>
        )}
      </div>
    </form>
  );
}
