"use client";

import { OTP_LENGTH } from "@hasahasa/shared";
import { useEffect, useRef, useState } from "react";
import { Field, inputClassName } from "@/components/auth/field";

/** Seconds before "Resend code" becomes clickable again. */
export const RESEND_SECONDS = 30;

/** Ticks a cooldown down to zero; `start()` puts it back at the top. */
export function useResendCountdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return {
    seconds,
    start: () => setSeconds(RESEND_SECONDS),
    reset: () => setSeconds(0),
  };
}

/** The single centered code box, autofocused as soon as the step appears. */
export function OtpField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Field
      label="Code"
      error={error}
      input={
        <input
          ref={ref}
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={OTP_LENGTH}
          placeholder={"·".repeat(OTP_LENGTH)}
          value={value}
          // Digits only — paste a code with spaces or dashes and it still lands.
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          className={`${inputClassName} text-2xl tracking-[0.6em] indent-[0.6em] placeholder:not-italic placeholder:tracking-[0.6em]`}
        />
      }
    />
  );
}

export function ResendButton({
  seconds,
  disabled,
  onResend,
}: {
  seconds: number;
  disabled: boolean;
  onResend: () => void;
}) {
  return (
    <div className="mt-9 flex flex-col items-center">
      <button
        type="button"
        onClick={onResend}
        disabled={seconds > 0 || disabled}
        className="text-sm font-light uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-brand-300 focus-visible:outline-none disabled:pointer-events-none disabled:text-white/35"
      >
        {seconds > 0 ? `Resend in ${seconds}s` : "Resend code"}
      </button>
    </div>
  );
}

/** "We sent a code to name@example.com" — the same line on both forms. */
export function SentToLine({ email }: { email: string }) {
  return (
    <>
      Enter the {OTP_LENGTH}-digit code we sent to{" "}
      <span className="font-normal text-white">{email}</span>
    </>
  );
}
