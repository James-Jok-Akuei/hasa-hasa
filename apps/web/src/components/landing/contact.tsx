import Image from "next/image";
import Link from "next/link";
import contactIllustration from "@/app/assets/images/landing/il-contact.svg";
import whatsappLogo from "@/app/assets/images/landing/logo-whatsapp.svg";

/**
 * Fill these in and the cards appear. They are empty rather than filled with
 * a plausible-looking number because a wrong number on a live page rings
 * somebody real, and a customer who tries it once does not try again.
 *
 * phone / whatsapp want the full international form (+211...). Only the
 * channels with a value are rendered, so partial is fine.
 */
const CONTACT = {
  whatsapp: "+211 925 903 077",
  phone: "+211 925 903 077",
  email: "",
};

type Channel = {
  label: string;
  value: string;
  href: string;
  detail: string;
  icon: React.ReactNode;
  /** Renders on white so the logo keeps its own colours. */
  brand?: boolean;
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
      icon: <Image src={whatsappLogo} alt="" aria-hidden className="size-7" />,
      brand: true,
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
                    <span
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transform-none ${
                        channel.brand
                          ? "border border-neutral-900/10 bg-white"
                          : "bg-linear-to-br from-brand-400 to-brand-600 text-white shadow-[0_10px_24px_-10px_rgba(255,109,47,0.95)]"
                      }`}
                    >
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
