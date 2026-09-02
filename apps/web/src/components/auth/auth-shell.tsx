import Image from "next/image";
import { VideoBackground } from "@/components/auth/video-background";
import authBgLandscape from "@/app/assets/images/auth-bg-landscape.jpeg";
import authBgPortrait from "@/app/assets/images/auth-bg-portrait.jpeg";
import logo from "@/app/assets/logos/logo-main.svg";

/**
 * Shared scaffold for the auth screens: photographic poster layer,
 * ambient video on top, contrast scrim, brand header, and a form slot
 * that centers on mobile and docks to the dark left half on desktop.
 */
export function AuthShell({
  video = true,
  desktopVideoSrc = "/videos/auth-bg-landscape.mp4",
  mobileVideoSrc = "/videos/auth-bg-portrait.mp4",
  children,
}: {
  video?: boolean;
  desktopVideoSrc?: string;
  mobileVideoSrc?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* Poster layer — instant paint, video fallback, reduced-motion fallback */}
      <Image
        src={authBgPortrait}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover lg:hidden"
      />
      <Image
        src={authBgLandscape}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="hidden object-cover lg:block"
      />

      {video ? (
        <VideoBackground desktopSrc={desktopVideoSrc} mobileSrc={mobileVideoSrc} />
      ) : null}

      {/* Contrast overlays — vignette on small screens, left-side scrim on desktop */}
      <div className="absolute inset-0 bg-linear-to-b from-black/65 via-black/20 to-black/50 lg:bg-linear-to-r lg:from-black/75 lg:via-black/35 lg:to-transparent" />

      {/* Brand mark */}
      <header className="absolute inset-x-0 top-0 z-10 px-6 py-6 lg:px-[8vw]">
        {/* Mirrors the form column: centered max-w-sm below lg, left-anchored on lg+ */}
        <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-3 lg:mx-0">
          <Image src={logo} alt="HASA HASA" priority className="h-8 w-auto sm:h-9" />
          <span className="whitespace-nowrap text-[0.6rem] font-light uppercase tracking-[0.25em] text-white/50 sm:text-[0.65rem] sm:tracking-[0.3em]">
            Restaurant Dashboard
          </span>
        </div>
      </header>

      {/* Form — centered on mobile, anchored to the dark left half on desktop */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6 py-16 lg:justify-start lg:px-[8vw]">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </div>
    </main>
  );
}
