"use client";

import { useState } from "react";
import { Journey } from "@/components/landing/journey";
import { RouteThread } from "@/components/landing/route-thread";

type Audience = "order" | "sell";

const STEPS: Record<
  Audience,
  { title: string; body: string; icon: React.ReactNode }[]
> = {
  order: [
    {
      title: "Find a kitchen",
      body: "Browse menus from restaurants across Juba, with prices you can see before you order.",
      icon: <SearchIcon />,
    },
    {
      title: "Order and pay",
      body: "Pay with MTN MoMo or cash on delivery. Your confirmation arrives by SMS.",
      icon: <PhoneIcon />,
    },
    {
      title: "Eat",
      body: "A rider brings it to your door, or you collect it yourself once it's ready.",
      icon: <ScooterIcon />,
    },
  ],
  sell: [
    {
      title: "List your menu",
      body: "Add your dishes and prices from your phone in minutes. No website, no signboard needed.",
      icon: <MenuIcon />,
    },
    {
      title: "Take orders",
      body: "Accept, cook, and mark ready on your dashboard. Riders handle the delivery for you.",
      icon: <BellIcon />,
    },
    {
      title: "Get paid",
      body: "Money lands in your MoMo account, and your sales and best sellers are always one tap away.",
      icon: <WalletIcon />,
    },
  ],
};

const TABS: { id: Audience; label: string }[] = [
  { id: "order", label: "I want food" },
  { id: "sell", label: "I sell food" },
];

export function HowItWorks() {
  const [audience, setAudience] = useState<Audience>("order");

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-brand-500 px-0 pb-20 pt-8 lg:pb-28 lg:pt-10"
    >
      <div>
        <RouteThread />
        <Journey />

        <div className="flex flex-col items-start gap-6 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-[5.5%]">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-neutral-900/70">
              How it works
            </p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
              Three steps, whichever side of the kitchen you&apos;re on.
            </h2>
          </div>

          {/* Segmented switch — the indicator slides between the two audiences */}
          <div
            role="tablist"
            aria-label="Choose your side"
            className="relative flex shrink-0 rounded-full border border-neutral-900/15 bg-white/70 p-1"
          >
            <span
              aria-hidden
              className={`absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-neutral-900 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                audience === "sell" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={audience === tab.id}
                onClick={() => setAudience(tab.id)}
                className={`relative z-10 whitespace-nowrap rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 sm:px-6 sm:text-xs ${
                  audience === tab.id
                    ? "text-white"
                    : "text-neutral-700 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps — a connected journey, not three loose boxes */}
        <div className="relative mt-12 px-6 lg:px-[5.5%]">
          {/* The thread running behind the cards, through the icon tiles */}
          <span
            aria-hidden
            className="absolute left-[5.5%] right-[5.5%] top-[4.6rem] hidden border-t-2 border-dashed border-white/40 md:block"
          />

          <ol
            key={audience}
            className="relative grid animate-fade-up gap-6 md:grid-cols-3 lg:gap-8"
          >
            {STEPS[audience].map((step, i) => (
              <li
                key={step.title}
                style={{ animationDelay: `${i * 90}ms` }}
                className="group relative animate-fade-up overflow-hidden rounded-[1.75rem] bg-white p-8 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_4px_8px_-2px_rgba(0,0,0,0.14),0_34px_64px_-26px_rgba(0,0,0,0.55)] motion-reduce:transform-none"
              >
                {/* Warm wash that blooms from the corner on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-brand-500/0 blur-2xl transition-colors duration-500 group-hover:bg-brand-500/15"
                />

                {/* Ghost numeral watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-3 -right-1 text-[5.5rem] font-extrabold leading-none tracking-tighter text-neutral-900/[0.045] transition-colors duration-500 group-hover:text-brand-500/[0.1]"
                >
                  {i + 1}
                </span>

                <div className="relative flex items-start justify-between">
                  {/* Gradient icon tile with a soft brand glow */}
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transform-none">
                    {step.icon}
                  </span>

                  <span className="rounded-full bg-neutral-900/[0.06] px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-neutral-500 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                    Step {i + 1}
                  </span>
                </div>

                <h3 className="relative mt-7 font-heading text-xl font-extrabold tracking-[-0.01em] text-neutral-900">
                  {step.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-neutral-600">
                  {step.body}
                </p>

                {/* Accent rule that draws itself across on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-8 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.4-4.4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 18.5h3" />
      <path d="M9.5 8.5h5" />
      <path d="M9.5 12h5" />
    </svg>
  );
}

function ScooterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <circle cx="5.5" cy="17" r="3" />
      <circle cx="18.5" cy="17" r="3" />
      <path d="M8.5 17h7" />
      <path d="M18.5 17V8.5h-3.5" />
      <path d="M3.5 5.5h3l2.6 11.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <rect x="4" y="2.5" width="16" height="19" rx="3" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <path d="M6 10a6 6 0 1 1 12 0c0 3.6 1.4 5 1.4 5H4.6S6 13.6 6 10z" />
      <path d="M9.8 18.5a2.2 2.2 0 0 0 4.4 0" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden
    >
      <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h11a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 17 19H6a2.5 2.5 0 0 1-2.5-2.5z" />
      <path d="M3.5 10.5h16" />
      <circle cx="16" cy="15" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
