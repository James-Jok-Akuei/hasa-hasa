"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { Journey } from "@/components/landing/journey";
import { RouteThread } from "@/components/landing/route-thread";
import browseStep from "@/app/assets/images/landing/il-step-browse.svg";
import eatStep from "@/app/assets/images/landing/il-step-eat.svg";
import menuStep from "@/app/assets/images/landing/il-step-menu.svg";
import ordersStep from "@/app/assets/images/landing/il-step-orders.svg";
import paidStep from "@/app/assets/images/landing/il-step-paid.svg";
import payStep from "@/app/assets/images/landing/il-step-pay.svg";

type Audience = "order" | "sell";

type Step = {
  title: string;
  body: string;
  illustration: StaticImageData;
  illustrationAlt: string;
};

const STEPS: Record<Audience, Step[]> = {
  order: [
    {
      title: "Find a kitchen",
      body: "Browse menus from restaurants across Juba, with prices you can see before you order.",
      illustration: browseStep,
      illustrationAlt: "A food ordering app open on a phone",
    },
    {
      title: "Order and pay",
      body: "Pay with MTN MoMo or cash on delivery. Your confirmation arrives by SMS.",
      illustration: payStep,
      illustrationAlt: "Payment confirmations arriving on a phone",
    },
    {
      title: "Eat",
      body: "A rider brings it to your door, or you collect it yourself once it's ready.",
      illustration: eatStep,
      illustrationAlt: "Someone sitting down to a plate of food",
    },
  ],
  sell: [
    {
      title: "List your menu",
      body: "Add your dishes and prices from your phone in minutes. No website, no signboard needed.",
      illustration: menuStep,
      illustrationAlt: "Two cooks working together in a kitchen",
    },
    {
      title: "Take orders",
      body: "Accept, cook, and mark ready on your dashboard. Riders handle the delivery for you.",
      illustration: ordersStep,
      illustrationAlt: "Someone holding up a new order notification",
    },
    {
      title: "Get paid",
      body: "Money lands in your MoMo account, and your sales and best sellers are always one tap away.",
      illustration: paidStep,
      illustrationAlt: "A payment landing on a phone",
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

                <div className="relative flex items-end justify-between gap-4">
                  <Image
                    src={step.illustration}
                    alt={step.illustrationAlt}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-28 w-auto max-w-[60%] object-contain object-bottom transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transform-none sm:h-32"
                  />

                  <span className="shrink-0 rounded-full bg-neutral-900/[0.06] px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-neutral-500 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
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
