import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import orderIllustration from "@/app/assets/images/landing/il-join-order.svg";
import rideIllustration from "@/app/assets/images/landing/il-join-ride.svg";
import sellIllustration from "@/app/assets/images/landing/il-join-sell.svg";

/**
 * Where the nav's "Get started" lands. Three doors, because by this point in
 * the page a visitor knows which one they are — the job here is to send them
 * through it in one click, not to sell again.
 *
 * Two of the three are real destinations today. Ordering waits on the app,
 * and says so rather than looking broken.
 *
 * The illustrations sit on light panels: unDraw draws hair and clothing in
 * near-black, which would disappear against this section's background.
 */

type Door = {
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  illustration: StaticImageData;
  illustrationAlt: string;
  /** Renders muted, with the CTA reading as a status instead of an action. */
  pending?: boolean;
};

const DOORS: Door[] = [
  {
    label: "I want food",
    title: "Order from Juba's kitchens",
    body: "Browse menus, pay with MoMo or cash, and have it delivered or ready to collect.",
    href: "#download",
    illustration: orderIllustration,
    illustrationAlt: "Two people sharing a meal at a table",
    cta: "App coming soon",
    pending: true,
  },
  {
    label: "I sell food",
    title: "Put your restaurant online",
    body: "Take orders from your phone. Set up your menu in minutes and start the same day you are approved.",
    href: "/signup",
    illustration: sellIllustration,
    illustrationAlt: "A street food kitchen serving customers",
    cta: "List your restaurant",
  },
  {
    label: "I ride",
    title: "Deliver on your own hours",
    body: "Pick up from kitchens near you, choose the jobs that suit you, and get paid to MoMo.",
    href: "/riders",
    illustration: rideIllustration,
    illustrationAlt: "A delivery rider on a scooter with a food box",
    cta: "Apply to ride",
  },
];

export function Join() {
  return (
    <section
      id="join"
      className="scroll-mt-24 bg-neutral-950 px-6 py-20 lg:px-[5.5%] lg:py-28"
    >
      <div className="max-w-2xl">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-300">
          Get started
        </p>
        <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.4rem]">
          Which one are you?
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-7">
        {DOORS.map((door, i) => (
          <article
            key={door.label}
            style={{ animationDelay: `${i * 90}ms` }}
            className={`group relative flex animate-fade-up flex-col overflow-hidden rounded-[1.75rem] border transition-all duration-500 ease-out motion-reduce:transform-none ${
              door.pending
                ? "border-white/[0.08] bg-white/[0.015]"
                : "border-white/10 bg-white/[0.03] hover:-translate-y-1.5 hover:border-brand-500/60"
            }`}
          >
            <div
              className={`flex h-40 w-full items-end justify-center px-8 pt-7 ${
                door.pending ? "bg-brand-50/50" : "bg-brand-50"
              }`}
            >
              <Image
                src={door.illustration}
                alt={door.illustrationAlt}
                sizes="(min-width: 768px) 33vw, 100vw"
                className={`h-full w-auto max-w-full object-contain transition-all duration-500 ease-out motion-reduce:transform-none ${
                  door.pending
                    ? "opacity-55 saturate-50"
                    : "group-hover:-translate-y-1"
                }`}
              />
            </div>

            <div className="flex grow flex-col p-8">
              <p
                className={`text-[0.6rem] font-extrabold uppercase tracking-[0.25em] ${
                  door.pending ? "text-white/30" : "text-brand-300"
                }`}
              >
                {door.label}
              </p>
              <h3
                className={`mt-3 font-heading text-xl font-extrabold tracking-[-0.01em] ${
                  door.pending ? "text-white/45" : "text-white"
                }`}
              >
                {door.title}
              </h3>
              <p
                className={`mt-2.5 text-sm leading-relaxed ${
                  door.pending ? "text-white/30" : "text-white/60"
                }`}
              >
                {door.body}
              </p>

              <div className="mt-8 flex grow items-end">
                {door.pending ? (
                  /* Not a link: there is nowhere to go yet, and a button that
                   does nothing is worse than a label that explains. */
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
                    {door.cta}
                  </span>
                ) : (
                  <Link
                    href={door.href}
                    className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950"
                  >
                    {door.cta}
                    <ArrowIcon />
                  </Link>
                )}
              </div>
            </div>

            {/* Accent rule drawing itself across on hover */}
            {door.pending ? null : (
              <span
                aria-hidden
                className="absolute inset-x-8 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-linear-to-r from-brand-400 to-brand-600 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
            )}
          </article>
        ))}
      </div>
    </section>
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
      className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
      aria-hidden
    >
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
