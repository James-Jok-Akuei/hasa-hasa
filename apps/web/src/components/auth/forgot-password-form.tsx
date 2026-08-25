"use client";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@cieng/shared";
import Link from "next/link";
import { useState } from "react";
import { Field, inputClassName, SubmitButton } from "@/components/auth/field";

type FieldErrors = Partial<Record<keyof ForgotPasswordInput, string>>;
type Status = "idle" | "submitting" | "sent";

export function ForgotPasswordForm() {
  const [values, setValues] = useState<ForgotPasswordInput>({ email: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function setValue(field: keyof ForgotPasswordInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const result = forgotPasswordSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForgotPasswordInput;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    // No backend yet — simulate the round trip so the flow feels real.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex animate-fade-up flex-col items-center text-center">
        <h1 className="text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
          Sent
        </h1>
        <p className="mt-6 text-sm font-light leading-relaxed tracking-wide text-white/70">
          If an account exists for{" "}
          <span className="font-normal text-white">{values.email}</span>, a
          password reset link is on its way. Check your inbox.
        </p>
        <div className="mt-12 flex flex-col items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
          >
            Back to login
          </Link>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-sm font-light uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-brand-300 focus-visible:outline-none"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
        Reset
      </h1>
      <p className="mt-4 text-center text-sm font-light tracking-wide text-white/60">
        Enter your email and we&apos;ll send you a reset link
      </p>

      <div className="mt-9 flex w-full flex-col">
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
      </div>

      <SubmitButton status={status} label="Send reset link" />

      <div className="mt-10 flex flex-col items-center">
        <Link
          href="/login"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
