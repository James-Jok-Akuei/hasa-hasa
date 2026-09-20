"use client";

import {
  riderApplicationSchema,
  type RiderApplicationInput,
} from "@hasahasa/shared";
import { useState } from "react";

/**
 * The rider application.
 *
 * TODO(api): submit is not wired to anything. `handleSubmit` validates and
 * then stops at the marked line. Wiring it up means a RiderApplication model
 * in the API's Prisma schema, a POST /riders/apply route validating this same
 * schema, and a review list beside the restaurant one in admin. Until then
 * this collects nothing — the success screen is honest about that.
 */

type FieldErrors = Partial<Record<keyof RiderApplicationInput, string>>;
type Status = "idle" | "submitting" | "sent";

const EMPTY: RiderApplicationInput = {
  fullName: "",
  phone: "",
  email: "",
  area: "",
  vehicle: "MOTORBIKE",
  availability: "FULL_TIME",
  hasSmartphone: true,
  notes: "",
};

const VEHICLES: { value: RiderApplicationInput["vehicle"]; label: string }[] = [
  { value: "MOTORBIKE", label: "Motorbike" },
  { value: "BICYCLE", label: "Bicycle" },
  { value: "CAR", label: "Car" },
];

const AVAILABILITY: {
  value: RiderApplicationInput["availability"];
  label: string;
}[] = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "EVENINGS", label: "Evenings" },
  { value: "WEEKENDS", label: "Weekends" },
];

const inputClass =
  "w-full rounded-2xl border border-neutral-900/15 bg-white px-5 py-3.5 text-sm text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors duration-200 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

export function RiderForm() {
  const [values, setValues] = useState<RiderApplicationInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function setValue<K extends keyof RiderApplicationInput>(
    field: K,
    value: RiderApplicationInput[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status !== "idle") return;

    const result = riderApplicationSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RiderApplicationInput;
        fieldErrors[field] ??= issue.message;
      }
      setErrors(fieldErrors);
      // Send focus to the first problem rather than leaving them to hunt.
      document
        .querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`)
        ?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");

    // TODO(api): POST result.data to /riders/apply. Nothing is stored today.
    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="animate-fade-up rounded-[1.75rem] border border-neutral-900/10 bg-white p-10 text-center shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)]">
          <CheckIcon />
        </span>
        <h3 className="mt-6 font-heading text-2xl font-extrabold tracking-[-0.01em] text-neutral-900">
          Thanks, {values.fullName.split(" ")[0]}
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
          We have your details and will call you on{" "}
          <span className="font-semibold text-neutral-900">{values.phone}</span>{" "}
          once riding opens in your area.
        </p>
        <p className="mx-auto mt-5 max-w-sm rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
          Heads up: this form is not connected yet, so nothing was actually
          sent. Reach us directly in the meantime.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setStatus("idle");
          }}
          className="mt-7 text-xs font-bold uppercase tracking-[0.25em] text-brand-600 transition-colors hover:text-brand-500 focus-visible:outline-none"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[1.75rem] border border-neutral-900/10 bg-white p-7 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)] sm:p-9"
    >
      <h3 className="font-heading text-2xl font-extrabold tracking-[-0.01em] text-neutral-900">
        Apply to ride
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Takes a minute. We call you back — no CV, no office visit.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. John Deng"
            value={values.fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+211 9xx xxx xxx"
              value={values.phone}
              onChange={(e) => setValue("phone", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Email" htmlFor="email" optional error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email ?? ""}
              onChange={(e) => setValue("email", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field
          label="Which part of Juba do you ride in?"
          htmlFor="area"
          error={errors.area}
        >
          <input
            id="area"
            name="area"
            type="text"
            placeholder="e.g. Munuki, Gudele, Hai Cinema"
            value={values.area}
            onChange={(e) => setValue("area", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Choices
          legend="What do you ride?"
          options={VEHICLES}
          value={values.vehicle}
          onChange={(v) => setValue("vehicle", v)}
        />

        <Choices
          legend="When can you work?"
          options={AVAILABILITY}
          value={values.availability}
          onChange={(v) => setValue("availability", v)}
        />

        {/* Not a requirement question — orders are routed to a phone, so a
            "no" here tells us to talk to them rather than reject them. */}
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-neutral-900/10 bg-neutral-50 p-4 transition-colors hover:border-neutral-900/20">
          <input
            type="checkbox"
            name="hasSmartphone"
            checked={values.hasSmartphone}
            onChange={(e) => setValue("hasSmartphone", e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-brand-500"
          />
          <span className="text-sm leading-relaxed text-neutral-700">
            I have a smartphone I can use for deliveries
          </span>
        </label>

        <Field
          label="Anything else we should know?"
          htmlFor="notes"
          optional
          error={errors.notes}
        >
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Years riding, areas you know well, when you can start"
            value={values.notes ?? ""}
            onChange={(e) => setValue("notes", e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group relative mt-8 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-500 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(255,109,47,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_18px_40px_-12px_rgba(255,109,47,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70 motion-reduce:transform-none"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 transition-all duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden"
        />
        <span className="relative">
          {status === "submitting" ? "Sending…" : "Send application"}
        </span>
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-neutral-500">
        We only use your details to contact you about riding.
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-neutral-700"
      >
        {label}
        {optional ? (
          <span className="ml-2 font-medium normal-case tracking-normal text-neutral-400">
            optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A radio group that looks like chips — faster to tap than a select. */
function Choices<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-neutral-700">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] transition-all duration-200 ${
                selected
                  ? "border-brand-500 bg-brand-500 text-white shadow-[0_6px_18px_-8px_rgba(255,109,47,0.9)]"
                  : "border-neutral-900/15 bg-white text-neutral-600 hover:border-neutral-900/35 hover:text-neutral-900"
              }`}
            >
              <input
                type="radio"
                name={legend}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <path d="M4 12.5l5.5 5.5L20 6.5" />
    </svg>
  );
}
