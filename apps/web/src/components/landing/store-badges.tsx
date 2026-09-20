import Image from "next/image";
import appStoreBadge from "@/app/assets/images/landing/badge-app-store.svg";
import googlePlayBadge from "@/app/assets/images/landing/badge-google-play.png";

/**
 * Apple's and Google's own badge artwork, from their official endpoints.
 *
 * Both companies ask that a badge link to the app's listing and nothing
 * else. Until the listings exist these are not links: dimmed, greyed and
 * hidden from the accessibility tree, with the caller's note carrying the
 * news. Set either env var and that badge becomes a real link on its own.
 */

const STORES = [
  {
    name: "App Store",
    href: process.env.NEXT_PUBLIC_IOS_URL,
    badge: appStoreBadge,
    alt: "Download on the App Store",
    /* Apple's lockup is trimmed; Google's carries its required clear space
       inside the file, so it needs more height to match optically. */
    size: { sm: "h-9 w-auto", lg: "h-11 w-auto sm:h-12" },
    nudge: "",
  },
  {
    name: "Google Play",
    href: process.env.NEXT_PUBLIC_ANDROID_URL,
    badge: googlePlayBadge,
    alt: "Get it on Google Play",
    size: { sm: "h-[3rem] w-auto", lg: "h-[3.6rem] w-auto sm:h-[3.9rem]" },
    nudge: "-my-2 -ml-2.5",
  },
];

/** True once at least one listing is live, so callers can drop their note. */
export const storesAreLive = STORES.some((store) => store.href);

export function StoreBadges({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {STORES.map((store) => {
        const className = `${store.size[size]} ${store.nudge}`;

        return store.href ? (
          <a
            key={store.name}
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 motion-reduce:transform-none"
          >
            <Image src={store.badge} alt={store.alt} className={className} />
          </a>
        ) : (
          <Image
            key={store.name}
            src={store.badge}
            alt=""
            aria-hidden
            className={`${className} cursor-not-allowed opacity-45 grayscale`}
          />
        );
      })}
    </div>
  );
}
