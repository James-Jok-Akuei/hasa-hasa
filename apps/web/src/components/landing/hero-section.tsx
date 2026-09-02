"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/landing/site-nav";
import {
  FADE_MS,
  HeroSlideshow,
  SLIDE_MS,
  SLIDES,
} from "@/components/landing/hero-slideshow";

function HeroText({ chip = false }: { chip?: boolean }) {
  return (
    <p
      className={`max-w-xl animate-fade-up text-xs leading-relaxed [animation-delay:140ms] sm:text-sm ${
        chip
          ? "max-w-md rounded-2xl border border-white/50 bg-white/60 px-4 py-3 text-neutral-700 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.25)] backdrop-blur-md"
          : "text-neutral-900"
      }`}
    >
      Juba&apos;s restaurants and customers in one place, get food delivered or
      for pickup, or list your restaurant and take orders from your phone.
    </p>
  );
}

function HeroButtons({ solid = false }: { solid?: boolean }) {
  return (
    <div className="flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:280ms]">
      {/* Primary: lifts with a spreading glow and a sheen sweep */}
      <Link
        href="#download"
        className="group relative overflow-hidden rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-brand-600 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-12px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none sm:text-sm"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-brand-500/15 transition-all duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden"
        />
        <span className="relative">Order food</span>
      </Link>

      {/* Secondary: brand fill wipes in from the left, label flips to white.
          Restaurant owners land straight on the dashboard login. */}
      <Link
        href="/login"
        className={`group relative overflow-hidden rounded-full border-2 border-neutral-900 px-6 py-2 text-xs font-semibold text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none sm:text-sm ${
          solid ? "shadow-[0_8px_32px_-16px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 bg-neutral-900 transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
        />
        <span className="relative transition-colors duration-300 group-hover:text-white">
          List your restaurant
        </span>
      </Link>
    </div>
  );
}

/** Owns the slide index so the nav band's ambient color and the slideshow
 *  crossfade stay in lockstep. */
export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <SiteNav bandColor={SLIDES[index]?.band} fadeMs={FADE_MS} />

      {/* Mobile / tablet: slideshow stacked above the copy, below the nav */}
      <div className="flex flex-1 flex-col justify-center gap-8 px-6 pb-16 pt-4 lg:hidden">
        <HeroSlideshow
          index={index}
          className="relative aspect-video w-full animate-fade-up"
        />
        <div className="flex max-w-md flex-col gap-5">
          <HeroText />
          <HeroButtons />
        </div>
      </div>

      {/* Desktop: the stage matches the artwork's own 16:9 ratio, so the whole
          image is visible edge to edge — nothing cropped, nothing overlaid.
          The copy block starts immediately below it and the page scrolls. */}
      <div className="hidden lg:block">
        <HeroSlideshow index={index} className="relative aspect-video w-full" />
        <div className="flex items-center justify-between gap-8 bg-brand-500 px-[5.5%] py-5">
          <HeroText />
          <HeroButtons />
        </div>
      </div>
    </>
  );
}
