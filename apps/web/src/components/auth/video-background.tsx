"use client";

import { useEffect, useRef, useState } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Ambient video layer that sits on top of the poster image. It only
 * mounts the video for the active breakpoint (so mobile never downloads
 * the desktop file), fades in once playback starts, and stays on the
 * poster entirely for users who prefer reduced motion.
 */
export function VideoBackground({
  desktopSrc,
  mobileSrc,
}: {
  desktopSrc: string;
  mobileSrc: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = window.matchMedia(DESKTOP_QUERY);
    const pick = () => {
      setVisible(false);
      setSrc(media.matches ? desktopSrc : mobileSrc);
    };
    pick();
    media.addEventListener("change", pick);
    return () => media.removeEventListener("change", pick);
  }, [desktopSrc, mobileSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    // React can drop the muted attribute during hydration; set it
    // imperatively so autoplay is never blocked.
    video.muted = true;
    video.play().catch(() => {});
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onPlaying={() => setVisible(true)}
      className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
