"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "@/app/assets/logos/logo-main.svg";

/**
 * Landing page running order — the nav mirrors it top to bottom:
 *
 *   1. Hero                  (slideshow + copy strip)
 *   2. How it works   #how-it-works   the flow, for buyers and partners
 *   3. Partner with us #partner       supply side: restaurants AND riders
 *   4. Download        #download      get the app (buyer conversion)
 *   5. Get started     #join          choose your path — the nav CTA lands here
 *   6. FAQ             #faq           objections, fees, delivery areas
 *   7. Get in touch    #contact       phone / WhatsApp / email
 *   8. Footer                         About, socials, legal
 */
const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Partner with us", href: "#partner" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
  { label: "Get in touch", href: "#contact" },
];

/** Where both audiences sign up — buyer or restaurant owner. */
const JOIN_HREF = "#join";

/** Floating glass capsule nav: logo, the page's sections, and one action.
 *  The band behind the capsule takes the ambient color of the current hero
 *  slide (bandColor), crossfading in step with the slideshow. */
export function SiteNav({
  bandColor,
  fadeMs = 1000,
}: {
  bandColor?: string;
  fadeMs?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="relative z-30 px-4 pb-2 pt-4 transition-colors ease-in-out sm:px-6 lg:px-[8vw]"
      style={{
        backgroundColor: bandColor,
        transitionDuration: `${fadeMs}ms`,
      }}
    >
      <nav className="flex items-center justify-between gap-3 rounded-full border border-neutral-200/70 bg-white py-2.5 pl-5 pr-2.5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.25)]">
        <Link
          href="/"
          aria-label="HASA HASA home"
          className="shrink-0 transition-transform duration-300 ease-out hover:scale-[1.04] motion-reduce:transform-none"
        >
          <Image src={logo} alt="HASA HASA" priority className="h-5 w-auto sm:h-8" />
        </Link>

        {/* Sections — desktop. Each link wipes an accent underline in from the
            left and lifts a hair; the label itself deepens to brand orange. */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative whitespace-nowrap py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-800 transition-colors duration-300 hover:text-brand-600 focus-visible:text-brand-600 focus-visible:outline-none"
            >
              <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-y-px motion-reduce:transform-none">
                {link.label}
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 rounded-full bg-brand-500 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Primary action: lifts, brightens, and its glow spreads on hover */}
          <Link
            href={JOIN_HREF}
            className="group relative overflow-hidden whitespace-nowrap rounded-full bg-brand-500 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_6px_20px_-8px_rgba(255,109,47,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_14px_34px_-10px_rgba(255,109,47,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-[0.25em]"
          >
            {/* Sheen sweeping across on hover */}
            <span
              aria-hidden
              className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 transition-all duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden"
            />
            <span className="relative">Get started</span>
          </Link>

          {/* Sections — mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="group flex flex-col items-end gap-1.5 p-2 lg:hidden"
          >
            <span className="h-0.5 w-5 rounded-full bg-neutral-900 transition-all duration-300 ease-out group-hover:w-4 group-hover:bg-brand-500" />
            <span className="h-0.5 w-5 rounded-full bg-neutral-900 transition-all duration-300 ease-out group-hover:w-5 group-hover:bg-brand-500" />
          </button>
        </div>
      </nav>

      {/* Sections — mobile overlay */}
      {open ? (
        <div className="fixed inset-0 z-40 flex animate-fade-up flex-col bg-black/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <Image src={logo} alt="HASA HASA" className="h-6 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2 text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="size-6"
                aria-hidden
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-bold uppercase tracking-[0.3em] text-white/90 transition-colors duration-300 hover:text-brand-400 active:text-brand-400"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={JOIN_HREF}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-500 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_8px_30px_-8px_rgba(255,109,47,0.8)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-400 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none"
            >
              Get started
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
