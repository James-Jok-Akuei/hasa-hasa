export function Field({
  label,
  input,
  trailing,
  error,
}: {
  label: string;
  input: React.ReactNode;
  trailing?: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <label htmlFor={label.toLowerCase()} className="sr-only">
          {label}
        </label>
        {input}
        {trailing}
        {/* Resting underline, with an accent line that sweeps in on focus */}
        <div
          className={`h-px w-full transition-colors ${error ? "bg-red-400/70" : "bg-white/35"}`}
        />
        <div
          className={`absolute bottom-0 left-0 h-0.5 w-full origin-center scale-x-0 transition-transform duration-300 ease-out peer-focus:scale-x-100 ${
            error ? "bg-red-400" : "bg-brand-500"
          }`}
        />
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-center text-xs tracking-wider text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClassName =
  "peer w-full bg-transparent py-2 text-center text-base tracking-widest text-white placeholder:italic placeholder:tracking-[0.15em] placeholder:text-white/55 focus:outline-none";

export function SubmitButton({
  status,
  label,
}: {
  status: "idle" | "submitting" | "success";
  label: string;
}) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      aria-label={label}
      className="group mt-9 flex size-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_10px_40px_-8px_rgba(249,115,22,0.7)] transition-all duration-300 hover:bg-brand-400 hover:shadow-[0_14px_48px_-8px_rgba(249,115,22,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:scale-95 disabled:pointer-events-none"
    >
      {status === "submitting" ? (
        <SpinnerIcon />
      ) : status === "success" ? (
        <CheckIcon />
      ) : (
        <ArrowIcon />
      )}
    </button>
  );
}

export function PasswordToggle({
  shown,
  onToggle,
}: {
  shown: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      // Keep focus on the input when clicking the toggle
      onMouseDown={(e) => e.preventDefault()}
      aria-label={shown ? "Hide password" : "Show password"}
      aria-pressed={shown}
      className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2 transition-colors focus-visible:text-white focus-visible:outline-none ${
        shown ? "text-brand-400 hover:text-brand-300" : "text-white/60 hover:text-white"
      }`}
    >
      {shown ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7 transition-transform duration-300 group-hover:translate-x-1"
      aria-hidden
    >
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7 animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <path d="M4 12.5l5.5 5.5L20 6.5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-6.5 0-10-7-10-7a19.8 19.8 0 0 1 4.22-4.88" />
      <path d="M9.9 4.24A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a19.9 19.9 0 0 1-2.16 2.98" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M2 2l20 20" />
    </svg>
  );
}
