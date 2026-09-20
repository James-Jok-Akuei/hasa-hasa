import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import riderPhoto from "@/app/assets/images/other/hero-boxes.png";
import kitchenPhoto from "@/app/assets/images/hero-counter.png";

/**
 * The supply side of the marketplace. Two audiences with nothing in common
 * except that both earn from it, so they get a card each rather than the
 * tab switch How it works uses — a rider should not have to find their
 * half behind a toggle.
 *
 * Dark, to break the run of brand-orange sections either side of it. Each
 * card opens on its own photograph — our own branded packaging, not stock —
 * fading into the card so the two halves read as one surface.
 */

type Track = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  cta: { label: string; href: string };
  icon: React.ReactNode;
  photo: StaticImageData;
  /** Describes the photo; these carry meaning, so they are not decorative. */
  photoAlt: string;
  /** The restaurant track is the one we actually want clicked. */
  primary?: boolean;
};

const TRACKS: Track[] = [
  {
    eyebrow: "For restaurants",
    title: "Put your kitchen on the map",
    body: "Take orders from across Juba without building a website or printing a menu. Your dashboard runs on the phone already in your pocket.",
    points: [
      "List your dishes and prices in minutes",
      "Accept, cook, mark ready — riders do the rest",
      "Paid to MTN MoMo, with your best sellers one tap away",
    ],
    cta: { label: "List your restaurant", href: "/signup" },
    icon: <StorefrontIcon />,
    photo: kitchenPhoto,
    photoAlt:
      "A restaurant counter with HASA HASA bags and cups packed and ready to collect",
    primary: true,
  },
  {
    eyebrow: "For riders",
    title: "Ride the orders, keep the earnings",
    body: "If you have a motorbike and know the city, you have the job. Pick up from kitchens near you and choose the hours that suit you.",
    points: [
      "Work the hours you choose, no shifts",
      "Deliveries near you, routed to your phone",
      "Earnings paid straight to MTN MoMo",
    ],
    cta: { label: "Ride with us", href: "#contact" },
    icon: <HelmetIcon />,
    photo: riderPhoto,
    photoAlt:
      "HASA HASA boxes and a paper bag left on a doorstep at the end of a delivery",
  },
];

export function Partner() {
  return (
    <section
      id="partner"
      className="relative scroll-mt-24 overflow-hidden bg-neutral-950 px-6 py-20 lg:px-[5.5%] lg:py-28"
    >
      {/* Warm glow bleeding in from the top, tying the dark band to the
          orange sections above and below it */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]"
      />

      <div className="relative">
        <div className="max-w-2xl">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
            Partner with us
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.4rem]">
            Two ways to earn on HASA HASA.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Every order needs a kitchen to cook it and someone to carry it.
            Whichever one you are, signing up costs nothing.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {TRACKS.map((track, i) => (
            <article
              key={track.eyebrow}
              style={{ animationDelay: `${i * 120}ms` }}
              className={`group relative flex animate-fade-up flex-col overflow-hidden rounded-[1.75rem] border transition-all duration-500 ease-out hover:-translate-y-1.5 motion-reduce:transform-none ${
                track.primary
                  ? "border-brand-500/40 bg-linear-to-br from-brand-500/15 to-brand-500/[0.03] hover:border-brand-500/70"
                  : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              {/* Photo band. The gradient carries it down into the card so the
                  two do not read as a picture stuck on a box. */}
              <div className="relative h-52 w-full overflow-hidden sm:h-60">
                <Image
                  src={track.photo}
                  alt={track.photoAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transform-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/5"
                />

                {/* Icon and label ride on the photo rather than below it,
                    which buys back the vertical space the band costs. */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-7 sm:p-9">
                  <span
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transform-none ${
                      track.primary
                        ? "bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)]"
                        : "bg-white/15 text-white backdrop-blur-md"
                    }`}
                  >
                    {track.icon}
                  </span>
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-white/70">
                    {track.eyebrow}
                  </p>
                </div>
              </div>

              <div className="relative flex grow flex-col p-7 pt-6 sm:p-9 sm:pt-7">
                {/* Corner bloom on hover, same gesture as the How it works cards */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-20 top-0 size-48 rounded-full bg-brand-500/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-500/20"
                />

                <h3 className="relative font-heading text-2xl font-extrabold tracking-[-0.01em] text-white">
                  {track.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                  {track.body}
                </p>

                <ul className="relative mt-7 flex flex-col gap-3.5">
                  {track.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                          track.primary
                            ? "bg-brand-500 text-white"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                      <span className="text-sm leading-relaxed text-white/75">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Pushed to the bottom so both cards' buttons line up however
                  much copy sits above them */}
                <div className="relative mt-9 flex grow items-end">
                  <Link
                    href={track.cta.href}
                    className={`group/cta relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none ${
                      track.primary
                        ? "bg-brand-500 text-white shadow-[0_10px_30px_-10px_rgba(255,109,47,0.9)] hover:bg-brand-400 hover:shadow-[0_18px_40px_-12px_rgba(255,109,47,1)]"
                        : "border border-white/25 text-white hover:border-white/60"
                    }`}
                  >
                    {/* Sheen sweep, matching the hero's primary button */}
                    <span
                      aria-hidden
                      className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/20 transition-all duration-700 ease-out group-hover/cta:left-[150%] motion-reduce:hidden"
                    />
                    <span className="relative">{track.cta.label}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorefrontIcon() {
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
      <path d="M3.5 9.5V19a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5V9.5" />
      <path d="M2.5 9.5 4.2 4.6A1.5 1.5 0 0 1 5.6 3.5h12.8a1.5 1.5 0 0 1 1.4 1.1l1.7 4.9a3 3 0 0 1-5.8 1 3 3 0 0 1-5.8 0 3 3 0 0 1-5.8-1z" />
      <path d="M9.5 20.5v-5h5v5" />
    </svg>
  );
}

function HelmetIcon() {
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
      <path d="M3.5 14a8.5 8.5 0 0 1 17 0" />
      <path d="M3.5 14v1.5A1.5 1.5 0 0 0 5 17h14a1.5 1.5 0 0 0 1.5-1.5V14" />
      <path d="M12 5.5V14" />
      <path d="M7.5 17v2a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
      aria-hidden
    >
      <path d="M4 12.5l5.5 5.5L20 6.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative size-4 transition-transform duration-300 group-hover/cta:translate-x-1 motion-reduce:transform-none"
      aria-hidden
    >
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
