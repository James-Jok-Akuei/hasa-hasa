import Image from "next/image";
import Link from "next/link";
import promoBanner from "@/app/assets/images/other/hero-chicken.png";

/**
 * The buyer-facing "get the app" band.
 *
 * There is no app in a store yet, so nothing here pretends otherwise: the
 * badges are marked coming soon and are not links. A dead App Store button
 * on a launch page costs more trust than an honest "not yet" does.
 *
 * Swap the two badges for real links the day the listings go live — that is
 * the only change this section needs.
 */

/** Android first: it is what Juba carries. iOS follows. */
const STORES = ["Google Play", "App Store"];

export function Download() {
  return (
    <section
      id="download"
      className="scroll-mt-24 bg-brand-500 px-6 py-20 lg:px-[5.5%] lg:py-24"
    >
      <div className="overflow-hidden rounded-[2rem] bg-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="grid lg:grid-cols-2">
          {/* Copy */}
          <div className="order-2 p-8 sm:p-12 lg:order-1 lg:p-14">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
              Download
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.4rem]">
              The app is on its way.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Ordering from your phone lands soon — Android first, since that is
              what Juba carries. Until then, the two sides of the kitchen can
              already get started.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {STORES.map((store) => (
                <div
                  key={store}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5"
                >
                  <span className="text-white/40">
                    <DeviceIcon />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-300">
                      Coming soon
                    </span>
                    <span className="text-sm font-semibold text-white/70">
                      {store}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* The honest alternative: two things that do work today. */}
            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-white/40">
                Open now
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="group relative overflow-hidden rounded-full bg-brand-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(255,109,47,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-0 motion-reduce:transform-none"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 transition-all duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden"
                  />
                  <span className="relative">List your restaurant</span>
                </Link>
                <Link
                  href="/riders"
                  className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:translate-y-0 motion-reduce:transform-none"
                >
                  Ride with us
                </Link>
              </div>
            </div>
          </div>

          {/* The banner carries its own headline, so it gets a panel to
              itself rather than sitting behind text that competes with it. */}
          <div className="relative order-1 min-h-[16rem] lg:order-2 lg:min-h-full">
            <Image
              src={promoBanner}
              alt="Juba — HASA HASA is here. Get your food delivered now."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
            {/* Feathers the banner's black edge into the panel beside it */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-24 bg-linear-to-r from-neutral-950 to-transparent lg:block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DeviceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
      aria-hidden
    >
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}
