"use client";

import { loginSchema, type LoginInput } from "@hasahasa/shared";
import Link from "next/link";
import { useState } from "react";
import {
  Field,
  inputClassName,
  PasswordToggle,
  SubmitButton,
} from "@/components/auth/field";
import { GoogleAuth } from "@/components/auth/google-button";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;
type Status = "idle" | "submitting" | "success";

export function LoginForm() {
  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  function setValue(field: keyof LoginInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginInput;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    // No backend yet — simulate the round trip so the flow feels real.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center">
      <h1 className="text-center text-3xl font-light uppercase tracking-[0.45em] text-white indent-[0.45em] sm:text-4xl">
        Login
      </h1>
      <p className="mt-4 text-center text-sm font-light tracking-wide text-white/60">
        Sign in to manage your restaurant
      </p>

      <div className="mt-9 flex w-full flex-col gap-7">
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
          label="Password"
          error={errors.password}
          trailing={
            <PasswordToggle
              shown={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          }
          input={
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="password"
              value={values.password}
              onChange={(e) => setValue("password", e.target.value)}
              className={`${inputClassName} pr-10`}
            />
          }
        />
      </div>

      <SubmitButton status={status} label="Sign in" />

      <GoogleAuth />

      <div className="mt-10 flex flex-col items-center gap-5">
        <Link
          href="/signup"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
        >
          New account
        </Link>
        <Link
          href="/forgot-password"
          className="text-sm font-light uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-brand-300"
        >
          Forgot password
        </Link>
      </div>
    </form>
  );
}
