"use client";

import { authApi } from "@hasahasa/api-client";
import {
  signupSchema,
  signupVerifySchema,
  type SignupVerifyInput,
} from "@hasahasa/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toFormState } from "@/components/auth/api-error";
import { Field, inputClassName, SubmitButton } from "@/components/auth/field";
import { FormError } from "@/components/auth/form-error";
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
  const [formError, setFormError] = useState<string>();
  const resend = useResendCountdown();
  const router = useRouter();

  /** Routes a thrown API error to the field or the form line. */
  function applyError(error: unknown) {
    const next = toFormState(error);
    setErrors(next.fieldErrors as FieldErrors);
    setFormError(next.formError);
    if (next.retryAfterSeconds) resend.start(next.retryAfterSeconds);
  }

  function setValue(field: keyof SignupVerifyInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /** Asks the API to mail a code. Nothing is created until it is verified. */
  async function sendCode(): Promise<boolean> {
    setStatus("submitting");
    setFormError(undefined);
    try {
      await authApi.signup({
        restaurantName: values.restaurantName,
        email: values.email,
        phone: values.phone,
      });
      resend.start();
      return true;
    } catch (error) {
      applyError(error);
      return false;
    } finally {
      setStatus("idle");
    }
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
    setFormError(undefined);

    if (step === "details") {
      // Only advance if the code actually went out, otherwise the next screen
      // asks for something that was never sent.
      if (await sendCode()) setStep("code");
      return;
    }

    setStatus("submitting");
    try {
      await authApi.signupVerify(values);
      setStatus("success");
      // Signing up creates an application, not a live restaurant — the
      // holding screen is where it waits for review.
      router.push("/pending");
    } catch (error) {
      applyError(error);
      setStatus("idle");
    }
  }

  /** Back to step one, so a typo in the details is one click from fixed. */
  function editDetails() {
    setValues((prev) => ({ ...prev, code: "" }));
    setErrors({});
    setFormError(undefined);
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

      <FormError message={formError} />

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
