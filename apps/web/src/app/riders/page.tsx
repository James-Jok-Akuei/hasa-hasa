import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { RiderForm } from "@/components/riders/rider-form";
import riderIllustration from "@/app/assets/images/riderImages/rider-illustration.png";
import staffPhoto from "@/app/assets/images/riderImages/staff-explaining.jpg";
import heroIllustration from "@/app/assets/images/riderImages/il-hero-deliveries.svg";
import momoIllustration from "@/app/assets/images/riderImages/il-momo.svg";
import motorbikeIllustration from "@/app/assets/images/riderImages/il-motorbike.svg";
import smartphoneIllustration from "@/app/assets/images/riderImages/il-smartphone.svg";
import streetsIllustration from "@/app/assets/images/riderImages/il-streets.svg";

/**
 * The illustrations are unDraw, whose licence allows commercial use with no
 * attribution. Each was recoloured from unDraw's purple (#6c63ff) to the
 * brand orange, so they read as ours rather than as stock. Source slugs, so
 * any of them can be traced or swapped:
 *   il-hero-deliveries  deliveries_qutl
 *   il-motorbike        on-the-way_zwi3
 *   il-smartphone       order-food_c92i
 *   il-streets          finding-the-way_qp1z
 *   il-momo             mobile-payments_uate
 */

export const metadata: Metadata = {
  title: "Ride with HASA HASA — deliver across Juba",
  description:
    "Deliver orders across Juba on your own hours. Apply to ride with HASA HASA.",
};

/**
 * Where the Partner section's rider card lands.
 *
 * Everything a rider asks before applying, answered above the form: what
 * they need, how the day runs, how they get paid. The form itself is
 * short on purpose — a rider fills this on a phone, probably on data.
 */

const REQUIREMENTS = [
  {
    title: "A motorbike you can ride",
    body: "Yours or one you have regular use of. Bicycles work for short central runs.",
    icon: <BikeIcon />,
    illustration: motorbikeIllustration,
    illustrationAlt:
      "A delivery rider on a scooter with a food box on the back",
  },
  {
    title: "A smartphone",
    body: "Orders reach you in the app, so you need something that can run it and stay online.",
    icon: <PhoneIcon />,
    illustration: smartphoneIllustration,
    illustrationAlt: "A food ordering app open on a phone",
  },
  {
    title: "You know Juba",
    body: "Street names help, but knowing how to find a compound without them helps more.",
    icon: <MapIcon />,
    illustration: streetsIllustration,
    illustrationAlt: "Someone reading a map with a location pin above it",
  },
  {
    title: "An MTN MoMo number",
    body: "That is where your earnings land, so it needs to be registered in your name.",
    icon: <WalletIcon />,
    illustration: momoIllustration,
    illustrationAlt: "Payment confirmations arriving on a phone",
  },
];

const JOINING = [
  "Fill in the form — name, phone, and where in Juba you ride.",
  "We call you back and answer whatever you want to ask.",
  "Bring your bike and your MoMo number, and we set you up on the app.",
  "Go online and take your first delivery.",
];

const DAY = [
  {
    title: "Go online",
    body: "Open the app when you want to work. No shift to book, no one to tell.",
  },
  {
    title: "Take the order",
    body: "Nearby jobs come to your phone with the pickup, the drop and what it pays. Accept the ones that suit you.",
  },
  {
    title: "Collect and deliver",
    body: "The kitchen has it packed and waiting. Hand it over, mark it delivered, move on.",
  },
  {
    title: "Get paid",
    body: "Earnings go to your MoMo number. Your completed runs are in the app whenever you want to check.",
  },
];

export default function RidersPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-brand-500 font-body">
      <SiteNav />

      {/* Hero — illustration beside the copy, not behind it. A transparent
          SVG cannot carry a full-bleed background the way a photo did. */}
      <section className="relative overflow-hidden bg-neutral-950">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 size-[34rem] rounded-full bg-brand-500/20 blur-[130px]"
        />

        <div className="relative grid items-center gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-[5.5%] lg:py-24">
          <div>
            <p className="animate-fade-up text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
              Ride with us
            </p>
            <h1 className="mt-4 max-w-2xl animate-fade-up font-heading text-4xl font-extrabold leading-[1.08] tracking-[-0.02em] text-white [animation-delay:90ms] sm:text-5xl lg:text-6xl">
              Your bike, your hours, your city.
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-sm leading-relaxed text-white/70 [animation-delay:180ms] sm:text-base">
              Juba&apos;s kitchens need people who can get food across town
              while it is still hot. If that is you and your motorbike, the work
              is here whenever you want it.
            </p>

            <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:270ms]">
              <a
                href="#apply"
                className="group relative overflow-hidden rounded-full bg-brand-500 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(255,109,47,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-1/2 skew-x-12 bg-white/25 transition-all duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden"
                />
                <span className="relative">Apply to ride</span>
              </a>
              <Link
                href="/#partner"
                className="rounded-full border border-white/25 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:translate-y-0 motion-reduce:transform-none"
              >
                I run a restaurant
              </Link>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:360ms]">
            <Image
              src={heroIllustration}
              alt="Two delivery riders collecting orders"
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="mx-auto h-auto w-full max-w-lg lg:max-w-none"
            />
          </div>
        </div>
      </section>

      {/* What you need */}
      <section className="bg-brand-500 px-6 py-20 lg:px-[5.5%] lg:py-24">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-neutral-900/70">
          What you need
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
          Four things, and none of them are paperwork.
        </h2>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {REQUIREMENTS.map((item, i) => (
            <li
              key={item.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group flex animate-fade-up flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out hover:-translate-y-1.5 motion-reduce:transform-none"
            >
              {/* Illustrations are transparent, so they need a tinted panel
                  to sit on rather than bleeding to the card edge. */}
              <div className="flex h-44 w-full items-end justify-center bg-brand-50 px-6 pt-6">
                <Image
                  src={item.illustration}
                  alt={item.illustrationAlt}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transform-none"
                />
              </div>

              <div className="relative flex grow flex-col p-7">
                <span className="absolute -top-7 left-7 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)] transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transform-none">
                  {item.icon}
                </span>
                <h3 className="mt-9 font-heading text-lg font-extrabold tracking-[-0.01em] text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Joining — the staff photo does the reassuring here: a real person
          walks you through it, which is the thing riders actually worry about */}
      <section className="bg-white px-6 py-20 lg:px-[5.5%] lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]">
            <Image
              src={staffPhoto}
              alt="A member of the HASA HASA team showing the rider app on a phone"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-600">
              Joining
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
              Someone walks you through it.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
              Send the form below and we call you back. We go through how the
              app works, what a delivery pays and how your MoMo payouts run —
              and you ask whatever you want before deciding.
            </p>
            <ol className="mt-8 flex flex-col gap-4">
              {JOINING.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[0.7rem] font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-neutral-700">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How the day runs */}
      <section className="bg-neutral-950 px-6 py-20 lg:px-[5.5%] lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
          {/* The illustration carries this band — the steps beside it are
              instructions, and a photograph would fight them for attention */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <span
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-brand-500/20 blur-[90px]"
            />
            <Image
              src={riderIllustration}
              alt="A delivery rider on a scooter checking the route on a phone"
              placeholder="blur"
              sizes="(min-width: 1024px) 35vw, 80vw"
              className="h-auto w-full"
            />
          </div>

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
              How the day runs
            </p>
            <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.4rem]">
              Online when you want to be.
            </h2>

            <ol className="mt-10 grid gap-6 sm:grid-cols-2">
              {DAY.map((step, i) => (
                <li
                  key={step.title}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="relative animate-fade-up rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 transition-colors duration-500 hover:border-white/25"
                >
                  <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-brand-300">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-extrabold tracking-[-0.01em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* The form */}
      <section
        id="apply"
        className="scroll-mt-24 bg-brand-500 px-6 py-20 lg:px-[5.5%] lg:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-neutral-900/70">
              Apply
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
              Tell us where you ride.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-900/70 sm:text-base">
              We are signing up riders area by area. Leave your details and we
              will call you when we reach yours — or sooner, if there is already
              demand where you are.
            </p>
          </div>

          <RiderForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function BikeIcon() {
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
    </svg>
  );
}

function MapIcon() {
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
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
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
