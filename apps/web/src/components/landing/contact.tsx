import Image from "next/image";
import Link from "next/link";
import contactIllustration from "@/app/assets/images/landing/il-contact.svg";

/**
 * Fill these in and the cards appear. They are empty rather than filled with
 * a plausible-looking number because a wrong number on a live page rings
 * somebody real, and a customer who tries it once does not try again.
 *
 * phone / whatsapp want the full international form (+211...). Only the
 * channels with a value are rendered, so partial is fine.
 */
const CONTACT = {
  whatsapp: "",
  phone: "",
  email: "",
};

type Channel = {
  label: string;
  value: string;
  href: string;
  detail: string;
  icon: React.ReactNode;
};

function channels(): Channel[] {
  const out: Channel[] = [];

  if (CONTACT.whatsapp) {
    out.push({
      label: "WhatsApp",
      value: CONTACT.whatsapp,
      // wa.me wants digits only.
      href: `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`,
      detail: "Fastest. Message us and we reply here.",
      icon: <WhatsAppIcon />,
    });
  }

  if (CONTACT.phone) {
    out.push({
      label: "Call us",
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
      detail: "If you would rather talk than type.",
      icon: <PhoneIcon />,
    });
  }

  if (CONTACT.email) {
    out.push({
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      detail: "For anything that needs a paper trail.",
      icon: <MailIcon />,
    });
  }

  return out;
}

export function Contact() {
  const list = channels();

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

          {list.length > 0 ? (
            <ul className="mt-10 flex flex-col gap-4">
              {list.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={
                      channel.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      channel.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-center gap-5 rounded-[1.5rem] bg-white p-5 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 motion-reduce:transform-none"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)] transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none">
                      {channel.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.6rem] font-extrabold uppercase tracking-[0.25em] text-neutral-400">
                        {channel.label}
                      </span>
                      <span className="mt-1 block truncate font-heading text-lg font-extrabold tracking-[-0.01em] text-neutral-900">
                        {channel.value}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500">
                        {channel.detail}
                      </span>
                    </span>
                    <span className="text-neutral-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500 motion-reduce:transform-none">
                      <ArrowIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            /* Nothing is configured yet. Say that, and point at the two doors
               that do work, rather than rendering dead contact cards. */
            <div className="mt-10 rounded-[1.5rem] bg-white p-7 shadow-[0_2px_4px_-2px_rgba(0,0,0,0.12),0_20px_46px_-28px_rgba(0,0,0,0.5)]">
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" />
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
      className="size-6"
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
