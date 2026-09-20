"use client";

import { authApi } from "@hasahasa/api-client";
import {
  requestOtpSchema,
  verifyOtpSchema,
  type VerifyOtpInput,
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
  const [formError, setFormError] = useState<string>();
  /** Set when the address has no account, so we can offer signup inline. */
  const [unregistered, setUnregistered] = useState(false);
  const resend = useResendCountdown();
  const router = useRouter();

  /** Routes a thrown API error to the field or the form line. */
  function applyError(error: unknown) {
    const next = toFormState(error);
    setErrors(next.fieldErrors as FieldErrors);
    setUnregistered(next.errorCode === "EMAIL_NOT_REGISTERED");
    setFormError(next.formError);
    if (next.retryAfterSeconds) resend.start(next.retryAfterSeconds);
  }

  /** Clears whatever the last attempt left on screen. */
  function clearFormError() {
    setFormError(undefined);
    setUnregistered(false);
  }

  function setValue(field: keyof VerifyOtpInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  /**
   * Asks the API to mail a code. An address with no account comes back as
   * EMAIL_NOT_REGISTERED, which `applyError` turns into the signup prompt
   * rather than advancing to a code screen nothing was sent for.
   */
  async function sendCode(): Promise<boolean> {
    setStatus("submitting");
    clearFormError();
    try {
      await authApi.requestLoginOtp({ email: values.email });
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
    clearFormError();

    if (step === "email") {
      // Only advance if the code actually went out, otherwise the next screen
      // asks for something that was never sent.
      if (await sendCode()) setStep("code");
      return;
    }

    setStatus("submitting");
    try {
      await authApi.loginVerify(values);
      setStatus("success");
      // Where they land depends on the restaurant's review status, which the
      // holding screen reads from the session.
      router.push("/pending");
    } catch (error) {
      applyError(error);
      setStatus("idle");
    }
  }

  /** Back to step one, so a typo in the address is one click from fixed. */
  function editEmail() {
    setValues((prev) => ({ ...prev, code: "" }));
    setErrors({});
    clearFormError();
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

      {unregistered ? (
        /* Not a plain error: the way out is signup, so the link is the point. */
        <p
          role="alert"
          className="mt-6 text-center text-xs leading-relaxed tracking-wider text-white/70"
        >
          <span className="text-red-300">{formError}</span>
          <br />
          <Link
            href="/signup"
            className="mt-1 inline-block font-semibold uppercase tracking-[0.25em] text-brand-300 underline-offset-4 transition-colors hover:text-brand-200 hover:underline"
          >
            Sign up instead
          </Link>
        </p>
      ) : (
        <FormError message={formError} />
      )}

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
