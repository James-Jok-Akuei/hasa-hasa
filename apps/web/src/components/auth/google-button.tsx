"use client";

import { useState } from "react";

/**
 * "Continue with Google" — OR divider + pill button. Currently simulates
 * the round trip; wire to the real OAuth redirect when the backend lands.
 */
export function GoogleAuth() {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    // No OAuth backend yet — simulate briefly so the control feels alive.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setBusy(false);
  }

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center gap-4" aria-hidden>
        <div className="h-px flex-1 bg-white/25" />
        <span className="text-xs font-light uppercase tracking-[0.35em] text-white/50 indent-[0.35em]">
          or
        </span>
        <div className="h-px flex-1 bg-white/25" />
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 py-3 text-sm font-normal uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
      >
        {busy ? <GoogleSpinner /> : <GoogleIcon />}
        Continue with Google
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.88c2.26-2.09 3.58-5.17 3.58-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.96H1.27v3.11A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27a7.21 7.21 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function GoogleSpinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5 shrink-0 animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
