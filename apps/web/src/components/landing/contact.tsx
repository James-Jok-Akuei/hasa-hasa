import Image from "next/image";
import Link from "next/link";
import contactIllustration from "@/app/assets/images/landing/il-contact.svg";
import whatsappMark from "@/app/assets/images/landing/logo-whatsapp-white.svg";

/**
 * Fill these in and the card appears. They are empty rather than filled with
 * a plausible-looking number because a wrong number on a live page rings
 * somebody real, and a customer who tries it once does not try again.
 *
 * phone / whatsapp want the full international form (+211...).
 */
const CONTACT = {
  whatsapp: "+211 925 903 077",
  phone: "+211 925 903 077",
  email: "",
};

/** wa.me wants digits only; tel: wants no spaces. */
const digits = (value: string) => value.replace(/\D/g, "");
const dial = (value: string) => value.replace(/\s/g, "");

export function Contact() {
  const { whatsapp, phone, email } = CONTACT;
  /* One number, two ways to use it. Printing it on a card per channel meant
     the same digits twice down the page, which reads as a mistake. */
  const primary = whatsapp || phone;

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-brand-500 px-6 py-20 lg:px-[5.5%] lg:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-neutral-900/70">
            Get in touch
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-3xl font-extrabold leading-[1.12] tracking-[-0.02em] text-neutral-900 sm:text-[2.4rem]">
            A person answers, not a form.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-900/70 sm:text-base">
            Questions about listing your kitchen, riding with us, or an order
            that went wrong — whichever it is, reach us directly.
          </p>

          {primary ? (
            <div className="mt-10 max-w-md animate-float overflow-hidden rounded-[1.75rem] bg-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_30px_60px_-30px_rgba(0,0,0,0.55)] hover:[animation-play-state:paused] motion-reduce:animate-none">
              <div className="p-7 sm:p-8">
                <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-neutral-400">
                  Call or message
                </p>
                {/* The number is the fact; the buttons below are the verbs */}
                <a
                  href={`tel:${dial(primary)}`}
                  className="mt-2 block font-heading text-[1.75rem] font-extrabold tracking-[-0.02em] text-neutral-900 transition-colors hover:text-brand-600 sm:text-[2rem]"
                >
                  {primary}
                </a>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  WhatsApp is usually quickest, but either reaches the same
                  person.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {whatsapp ? (
                    <a
                      href={`https://wa.me/${digits(whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-[0_10px_26px_-12px_rgba(37,211,102,0.9)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1FBE5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transform-none"
                    >
                      <Image
                        src={whatsappMark}
                        alt=""
                        aria-hidden
                        className="size-[1.15rem]"
                      />
                      WhatsApp
                    </a>
                  ) : null}

                  {phone ? (
                    <a
                      href={`tel:${dial(phone)}`}
                      className="flex flex-1 items-center justify-center gap-2.5 rounded-full border-2 border-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transform-none"
                    >
                      <span className="animate-ring motion-reduce:animate-none">
                        <PhoneIcon />
                      </span>
                      Call
                    </a>
                  ) : null}
                </div>
              </div>

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 border-t border-neutral-900/10 bg-neutral-50 px-7 py-5 transition-colors hover:bg-neutral-100 sm:px-8"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-neutral-700 ring-1 ring-black/5">
                    <MailIcon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-neutral-400">
                      Email
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-semibold text-neutral-900">
                      {email}
                    </span>
                  </span>
                  <span className="text-neutral-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500 motion-reduce:transform-none">
                    <ArrowIcon />
                  </span>
                </a>
              ) : null}
            </div>
          ) : (
            /* Nothing is configured yet. Say that, and point at the two doors
               that do work, rather than rendering dead contact cards. */
            <div className="mt-10 max-w-md rounded-[1.75rem] bg-white p-7 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)]">
              <p className="text-sm leading-relaxed text-neutral-600">
                Our phone and WhatsApp lines are being set up. In the meantime,
                both sign-up routes reach us directly and we answer every one.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transform-none"
                >
                  List your restaurant
                </Link>
                <Link
                  href="/riders"
                  className="rounded-full border-2 border-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-900 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 active:translate-y-0 motion-reduce:transform-none"
                >
                  Ride with us
                </Link>
              </div>
            </div>
          )}
        </div>

        <Image
          src={contactIllustration}
          alt=""
          sizes="(min-width: 1024px) 40vw, 80vw"
          className="mx-auto h-auto w-full max-w-sm lg:max-w-none"
        />
      </div>
    </section>
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
      className="size-[1.1rem]"
      aria-hidden
    >
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function MailIcon() {
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
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
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
      className="size-5"
      aria-hidden
    >
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
