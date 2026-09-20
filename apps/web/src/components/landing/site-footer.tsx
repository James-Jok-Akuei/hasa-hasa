import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logos/logo-main.svg";
import { StoreBadges, storesAreLive } from "@/components/landing/store-badges";
import facebookLogo from "@/app/assets/images/landing/logo-facebook.svg";
import instagramLogo from "@/app/assets/images/landing/logo-instagram.svg";
import whatsappLogo from "@/app/assets/images/landing/logo-whatsapp.svg";
import sspNote from "@/app/assets/images/landing/cash-ssp-note.jpg";

/**
 * Fill these in and each icon appears. Empty ones are left out rather than
 * linking to a profile that does not exist yet — a social icon going
 * nowhere is worse than no icon.
 */
const SOCIALS = {
  facebook: "",
  instagram: "",
  whatsapp: "",
  x: "",
  linkedin: "",
};

/** Matches the CONTACT block in contact.tsx. */
const PHONE = "+211 925 903 077";

/**
 * Only the payment methods the platform actually takes — no Visa or
 * Mastercard, since no card rail is wired up.
 *
 * MoMo is set in MTN's yellow and black rather than using their logo file:
 * MTN's mark is not published under a licence we can redistribute, so the
 * real asset has to come from the merchant brand pack. Drop it in at
 * logo-mtn-momo.svg and swap the chip below for an <Image>.
 */
const PAYMENTS = [
  {
    name: "MoMo",
    detail: "MTN Mobile Money",
    wordmark: true,
  },
  { name: "Cash", detail: "South Sudanese pounds, on delivery" },
];

/** Only routes and anchors that exist. Legal pages are not written yet. */
const LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Partner with us", href: "/#partner" },
  { label: "Ride with us", href: "/riders" },
  { label: "FAQ", href: "/#faq" },
  { label: "Get in touch", href: "/#contact" },
  { label: "Restaurant login", href: "/login" },
];

export function SiteFooter() {
  const socials = [
    {
      key: "facebook",
      label: "Facebook",
      icon: <Image src={facebookLogo} alt="" aria-hidden className="size-5" />,
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: <Image src={instagramLogo} alt="" aria-hidden className="size-5" />,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <Image src={whatsappLogo} alt="" aria-hidden className="size-5" />,
    },
    /* X and LinkedIn publish no reusable mark — both had theirs pulled from
       the icon set over trademark — so these stay as drawn glyphs, tinted
       to each brand's colour. */
    { key: "x", label: "X", icon: <XIcon /> },
    { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
  ].filter((s) => SOCIALS[s.key as keyof typeof SOCIALS]);

  return (
    <footer className="relative overflow-hidden bg-brand-600 px-6 pb-10 pt-16 text-white lg:px-[5.5%] lg:pt-20">
      {/* Faint geometric wash, so the band is not a flat slab of orange */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 22px), repeating-linear-gradient(-45deg, #fff 0 2px, transparent 2px 22px)",
        }}
      />

      <div className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
        {/* Identity */}
        <div>
          <Link href="/" aria-label="HASA HASA home" className="inline-block">
            <Image
              src={logo}
              alt="HASA HASA"
              className="h-9 w-auto brightness-0 invert"
            />
          </Link>
          <p className="mt-5 text-sm font-light text-white/80">
            Juba&apos;s kitchens, at your door.
          </p>

          {socials.length > 0 ? (
            <>
              <p className="mt-8 text-sm font-semibold">Join us on</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={SOCIALS[social.key as keyof typeof SOCIALS]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex size-10 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transform-none"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="mt-8 inline-flex items-center gap-2.5 text-sm font-semibold text-white transition-colors hover:text-white/70"
          >
            <PhoneIcon />
            {PHONE}
          </a>
        </div>

        {/* Payments */}
        <div>
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.01em]">
            Payment methods
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {PAYMENTS.map((method) => (
              <li
                key={method.name}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                {method.wordmark ? (
                  <span className="flex h-9 shrink-0 items-center rounded-xl bg-[#FFCC00] px-2.5 font-heading text-sm font-extrabold tracking-[-0.02em] text-neutral-900">
                    MoMo
                  </span>
                ) : (
                  <Image
                    src={sspNote}
                    alt="A one South Sudanese pound note"
                    className="h-9 w-[4.5rem] shrink-0 rounded-lg object-cover ring-1 ring-black/10"
                  />
                )}
                <span className="leading-tight">
                  <span className="block text-sm font-bold">{method.name}</span>
                  <span className="block text-xs text-white/70">
                    {method.detail}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.01em]">
            Quick links
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Downloads */}
        <div>
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.01em]">
            Downloads
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/80">
            Order from Juba&apos;s kitchens and follow your rider to the door.
          </p>
          <div className="mt-6">
            <StoreBadges size="sm" />
            {!storesAreLive ? (
              <p className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/70">
                Coming soon to both stores
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-14 border-t border-white/20 pt-7 text-center">
        <p className="text-xs text-white/70">
          © {new Date().getFullYear()} HASA HASA. All rights reserved.
        </p>
        {/* The banknote photograph is CC BY-SA 4.0, which obliges us to name
            the photographer and the licence wherever we show it. */}
        <p className="mt-2 text-[0.65rem] text-white/45">
          Banknote photograph by Hispalois,{" "}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors hover:text-white/70"
          >
            CC BY-SA 4.0
          </a>
        </p>
      </div>
    </footer>
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
      className="size-4"
      aria-hidden
    >
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#000000" className="size-4" aria-hidden>
      <path d="M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6.1L5.7 21h-3l7-8L2.5 3h6.2l4.2 5.6zm-1 16h1.7L7.6 4.7H5.8z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#0A66C2" className="size-4" aria-hidden>
      <path d="M6.9 21H3.6V9.1h3.3zM5.2 7.6a1.9 1.9 0 1 1 0-3.9 1.9 1.9 0 0 1 0 3.9zM21 21h-3.3v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H10.2V9.1h3.1v1.6h.1c.5-.8 1.6-1.8 3.2-1.8 3.4 0 4.4 2.2 4.4 5.2z" />
    </svg>
  );
}
