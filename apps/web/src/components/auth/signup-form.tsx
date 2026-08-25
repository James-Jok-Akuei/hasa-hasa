"use client";

import { signupSchema, type SignupInput } from "@cieng/shared";
import Link from "next/link";
import { useState } from "react";
import {
  Field,
  inputClassName,
  PasswordToggle,
  SubmitButton,
} from "@/components/auth/field";
import { GoogleAuth } from "@/components/auth/google-button";

type FieldErrors = Partial<Record<keyof SignupInput, string>>;
type Status = "idle" | "submitting" | "success";

const EMPTY: SignupInput = {
  restaurantName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function SignupForm() {
  const [values, setValues] = useState<SignupInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  function setValue(field: keyof SignupInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const result = signupSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignupInput;
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
        Sign up
      </h1>
      <p className="mt-4 text-center text-sm font-light tracking-wide text-white/60">
        Create your restaurant account
      </p>

      <div className="mt-8 flex w-full flex-col gap-5">
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
              autoComplete="new-password"
              placeholder="password"
              value={values.password}
              onChange={(e) => setValue("password", e.target.value)}
              className={`${inputClassName} pr-10`}
            />
          }
        />

        <Field
          label="Confirm password"
          error={errors.confirmPassword}
          trailing={
            <PasswordToggle
              shown={showConfirm}
              onToggle={() => setShowConfirm((v) => !v)}
            />
          }
          input={
            <input
              id="confirm password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="confirm password"
              value={values.confirmPassword}
              onChange={(e) => setValue("confirmPassword", e.target.value)}
              className={`${inputClassName} pr-10`}
            />
          }
        />
      </div>

      <SubmitButton status={status} label="Create account" />

      <GoogleAuth />

      <div className="mt-10 flex flex-col items-center">
        <Link
          href="/login"
          className="text-sm font-semibold uppercase tracking-[0.3em] text-white transition-colors hover:text-brand-300"
        >
          Already have an account
        </Link>
      </div>
    </form>
  );
}
