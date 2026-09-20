import Image from "next/image";
import Link from "next/link";
import { StoreBadges, storesAreLive } from "@/components/landing/store-badges";
import downloadIllustration from "@/app/assets/images/landing/il-download.svg";

/**
 * The buyer-facing "get the app" band. The badges and their link-or-dim
 * behaviour live in store-badges, which the footer shares.
 */

export function Download() {
  return (
    <section
      id="download"
      className="scroll-mt-24 bg-brand-500 px-6 py-20 lg:px-[5.5%] lg:py-24"
    >
      <div className="overflow-hidden rounded-[2rem] bg-neutral-950 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="grid items-center lg:grid-cols-2">
          {/* Illustration */}
          <div className="order-1 flex justify-center p-8 sm:p-12 lg:p-14">
            <Image
              src={downloadIllustration}
              alt="Two people setting up the app on a phone"
              sizes="(min-width: 1024px) 45vw, 80vw"
              className="h-auto w-full max-w-sm lg:max-w-md"
            />
          </div>

          {/* Copy, QR and badges */}
          <div className="order-2 p-8 pt-0 sm:p-12 sm:pt-0 lg:p-14 lg:pl-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
              Download
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.4rem]">
              The app is on its way.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Order from Juba&apos;s kitchens and follow your rider to the door.
              Android first, since that is what Juba carries.
            </p>

            <div className="mt-9">
              <StoreBadges />
              {!storesAreLive ? (
                <p className="mt-4 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-300">
                  Coming soon to both stores
                </p>
              ) : null}
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
        </div>
      </div>
    </section>
  );
}
