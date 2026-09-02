"use client";

import { useEffect, useRef, useState } from "react";

const BEATS = [
  {
    src: "/journey/1-order.mp4",
    poster: "/journey/1-order.jpg",
    label: "Order",
    caption: "Pick your dishes and pay in a few taps — MTN MoMo or cash.",
  },
  {
    src: "/journey/2-wait.mp4",
    poster: "/journey/2-wait.jpg",
    label: "Relax",
    caption: "The kitchen starts cooking. Carry on with your evening.",
  },
  {
    src: "/journey/3-otw.mp4",
    poster: "/journey/3-otw.jpg",
    label: "On the way",
    caption: "A rider collects your order and heads across town.",
  },
  {
    src: "/journey/4-received.mp4",
    poster: "/journey/4-received.jpg",
    label: "Delivered",
    caption: "It reaches your door — or your gate, if that's easier.",
  },
  {
    src: "/journey/5-served.mp4",
    poster: "/journey/5-served.jpg",
    label: "Served",
    caption: "Straight onto the table, still hot from the kitchen.",
  },
  {
    src: "/journey/6-enjoy.mp4",
    poster: "/journey/6-enjoy.jpg",
    label: "Enjoy",
    caption: "Good food at home, with the people you like.",
  },
];

/**
 * The six clips play as one film, chapter after chapter. Two stacked <video>
 * elements alternate: one plays while the other quietly buffers the next beat,
 * then they crossfade — so there's no black frame between chapters. Only the
 * current (and next) clip is ever fetched.
 */
export function Journey() {
  const slotRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ] as const;

  const [srcs, setSrcs] = useState<[string, string]>([
    BEATS[0]!.src,
    BEATS[1]!.src,
  ]);
  const [slot, setSlot] = useState(0); // which element is on screen
  const [index, setIndex] = useState(0); // which beat is showing
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true); // the viewer's own intent
  const [inView, setInView] = useState(false); // whether the stage is on screen
  const [started, setStarted] = useState(false);
  const pendingSlot = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const beat = BEATS[index]!;

  // Start once the section is actually on screen (and never for reduced motion)
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Only record visibility here — the effect below does the playing, so
        // scrolling back resumes even though `playing` never changed.
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Single place that decides whether footage is rolling: the viewer wants it
  // playing AND the stage is on screen.
  useEffect(() => {
    if (!started) return;
    const active = slotRefs[slot]?.current;
    if (!active) return;
    if (playing && inView) {
      active.play().catch(() => {});
    } else {
      active.pause();
    }
    slotRefs[1 - slot]?.current?.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot, playing, inView, started, srcs]);

  // Buffer the following beat in the hidden element
  useEffect(() => {
    if (pendingSlot.current !== null) return;
    const idle = 1 - slot;
    const nextSrc = BEATS[(index + 1) % BEATS.length]!.src;
    setSrcs((current) => {
      if (current[idle] === nextSrc) return current;
      const updated: [string, string] = [...current] as [string, string];
      updated[idle] = nextSrc;
      return updated;
    });
  }, [index, slot]);

  /** Swap to a beat: if the hidden element already holds it (the usual case on
   *  auto-advance) crossfade straight away, otherwise load it and wait. */
  function goTo(next: number) {
    const idle = 1 - slot;
    const idleEl = slotRefs[idle]?.current;
    const nextSrc = BEATS[next]!.src;

    setIndex(next);
    setProgress(0);

    if (idleEl && srcs[idle] === nextSrc && idleEl.readyState >= 3) {
      pendingSlot.current = null;
      idleEl.currentTime = 0;
      setSlot(idle);
      if (playing && inView) idleEl.play().catch(() => {});
      slotRefs[slot]?.current?.pause();
      return;
    }

    pendingSlot.current = idle;
    setSrcs((current) => {
      const updated: [string, string] = [...current] as [string, string];
      updated[idle] = nextSrc;
      return updated;
    });
  }

  function handleCanPlay(which: number) {
    if (pendingSlot.current !== which) return;
    pendingSlot.current = null;
    const el = slotRefs[which]?.current;
    if (el) el.currentTime = 0;
    setSlot(which);
    if (playing && inView) el?.play().catch(() => {});
    slotRefs[1 - which]?.current?.pause();
  }

  return (
    <div className="mb-14 border-b border-neutral-900/15 pb-12">
      <div className="flex flex-col gap-2 px-6 sm:flex-row sm:items-end sm:justify-between lg:px-[5.5%]">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-neutral-900/70">
            Watch it happen
          </p>
          <h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight tracking-[-0.02em] text-neutral-900 sm:text-3xl">
            From your phone to your table.
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-neutral-900/80">
          Six moments, start to finish — order from where you are, and let the
          evening carry on until the food arrives.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative mt-8 w-full overflow-hidden bg-neutral-900 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.7)]"
      >
        {/* Stage — two elements crossfading between chapters. Cinematic crop:
            shorter than the source 16:9 (5:2 desktop, 21:9 mobile) so the strip does not dominate the section. */}
        <div className="relative aspect-21/9 w-full sm:aspect-5/2">
          {[0, 1].map((which) => (
            <video
              key={which}
              ref={slotRefs[which]}
              src={started ? srcs[which] : undefined}
              poster={which === 0 ? BEATS[0]!.poster : undefined}
              muted
              playsInline
              preload={started ? "auto" : "none"}
              onCanPlay={() => handleCanPlay(which)}
              onTimeUpdate={
                which === slot
                  ? (e) => {
                      const el = e.currentTarget;
                      if (el.duration)
                        setProgress(el.currentTime / el.duration);
                    }
                  : undefined
              }
              onEnded={
                which === slot
                  ? () => goTo((index + 1) % BEATS.length)
                  : undefined
              }
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out ${
                which === slot ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Caption — the interlude explaining the chapter */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/50 to-transparent px-6 pb-6 pt-20 sm:pb-9 lg:px-[5.5%]">
            <div key={index} className="animate-fade-up">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-brand-400">
                Step {index + 1} of {BEATS.length}
              </p>
              <p className="mt-2 font-heading text-2xl font-extrabold leading-none tracking-[-0.01em] text-white sm:text-3xl">
                {beat.label}
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                {beat.caption}
              </p>
            </div>
          </div>

          {/* Play / pause */}
          <button
            type="button"
            onClick={() => {
              setStarted(true);
              setPlaying((p) => !p);
            }}
            aria-label={playing ? "Pause the story" : "Play the story"}
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>

        {/* Chapter bar — segments fill as each clip plays; click one to jump */}
        <div className="flex gap-2 bg-neutral-900 px-6 pb-4 sm:pb-5 lg:px-[5.5%]">
          {BEATS.map((chapter, i) => (
            <button
              key={chapter.label}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Step ${i + 1}: ${chapter.label}`}
              aria-current={i === index}
              className="group flex-1 pt-3 focus-visible:outline-none"
            >
              <span className="block h-1 w-full overflow-hidden rounded-full bg-white/20">
                <span
                  className="block h-full rounded-full bg-brand-500 transition-[width] duration-200 ease-linear"
                  style={{
                    width:
                      i < index
                        ? "100%"
                        : i === index
                          ? `${Math.max(progress * 100, 2)}%`
                          : "0%",
                  }}
                />
              </span>
              <span
                className={`mt-2 hidden text-[0.6rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 sm:block ${
                  i === index
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/80"
                }`}
              >
                {chapter.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <rect x="7" y="5.5" width="3.5" height="13" rx="1" />
      <rect x="13.5" y="5.5" width="3.5" height="13" rx="1" />
    </svg>
  );
}
