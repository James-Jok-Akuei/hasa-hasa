import Image from "next/image";
import Link from "next/link";
import faqIllustration from "@/app/assets/images/landing/il-faq.svg";

/**
 * Built on <details>/<summary> rather than React state: an accordion is
 * exactly what the element is for, it opens before hydration, and it is
 * keyboard and screen-reader correct without any of our own code.
 *
 * Every answer here is something the product actually does. The questions
 * that need a number — what we charge a restaurant, what a delivery costs,
 * which parts of Juba we cover — are deliberately absent rather than
 * answered with a guess. They go in once those numbers are decided.
 */

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Who can list a restaurant?",
    a: (
      <>
        Any kitchen in Juba that can cook to order — a restaurant, a takeaway,
        or someone cooking from home. You sign up with your name, email and
        phone, and every application is reviewed before your menu goes live.
      </>
    ),
  },
  {
    q: "How long does approval take?",
    a: (
      <>
        Someone reviews every application by hand, so it is not instant. You can
        sign in while you wait — your dashboard shows where the application has
        got to, and we contact you on the number you signed up with.
      </>
    ),
  },
  {
    q: "Do I need a password?",
    a: (
      <>
        No. Signing in sends a six-digit code to your email, and the code is all
        you need. There is no password to forget, to write down, or for anyone
        else to guess.
      </>
    ),
  },
  {
    q: "How do customers pay?",
    a: (
      <>
        MTN MoMo or cash on delivery. Your earnings reach the MoMo number on
        your account, and your sales sit in the dashboard alongside your best
        selling dishes.
      </>
    ),
  },
  {
    q: "Do I need a computer?",
    a: (
      <>
        No. The dashboard is built for a phone — adding dishes, accepting
        orders, and marking them ready all work from the handset in your pocket.
        It works on a computer too, if you prefer one.
      </>
    ),
  },
  {
    q: "Can I deliver my own orders?",
    a: (
      <>
        Yes. You can hand orders to our riders, deliver them yourself, or let
        customers collect. If you want to ride for other kitchens as well,{" "}
        <Link
          href="/riders"
          className="font-semibold text-brand-600 underline-offset-4 hover:underline"
        >
          apply to ride
        </Link>
        .
      </>
    ),
  },
];

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-white px-6 py-20 lg:px-[5.5%] lg:py-24"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-brand-600">
            FAQ
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
            The things people ask first.
          </h2>
          <Image
            src={faqIllustration}
            alt=""
            sizes="(min-width: 1024px) 30vw, 70vw"
            className="mt-8 h-auto w-full max-w-xs"
          />
        </div>

        <ul className="flex flex-col">
          {FAQS.map((item) => (
            <li key={item.q} className="border-b border-neutral-900/10">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading text-base font-extrabold tracking-[-0.01em] text-neutral-900 transition-colors group-hover:text-brand-600 sm:text-lg">
                    {item.q}
                  </h3>
                  {/* One glyph, rotated — no second icon to keep in sync */}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900/[0.06] text-neutral-700 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white group-open:rotate-45 motion-reduce:transition-none">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pr-14 text-sm leading-relaxed text-neutral-600">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      className="size-4"
      aria-hidden
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
