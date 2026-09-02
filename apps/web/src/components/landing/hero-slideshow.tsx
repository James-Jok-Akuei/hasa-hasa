import Image from "next/image";
// Images in assets/images/other are reserved for later sections
// (e.g. a "we deliver" section) — don't add them here.
import heroPizza from "@/app/assets/images/hero-pizza.png";
import heroHasa from "@/app/assets/images/hero-hasa.png";
import heroCounter from "@/app/assets/images/hero-counter.png";
import heroApp from "@/app/assets/images/hero-app.png";

// `band` is the ambient color the nav band takes while the slide is showing —
// sampled from each image's top edge.
// `anchor` decides which edge survives the cover crop: the two artboards whose
// lettering sits at the top stay top-anchored; the rest ride up so their lower
// content (packaging, buttons, the rider) stays in frame.
export const SLIDES = [
  {
    src: heroHasa,
    alt: "HASA HASA — Juba, we are here",
    band: "#ffffff",
    anchor: "object-top",
  },
  {
    src: heroPizza,
    alt: "Pizza is here — we can deliver it to you",
    band: "#ff6d2f",
    anchor: "object-top",
  },
  {
    src: heroCounter,
    alt: "Takeout counter with HASA HASA packaging",
    band: "#000000",
    anchor: "object-center",
  },
  {
    src: heroApp,
    alt: "Hey Juba — order and pick it up, or order and we deliver",
    band: "#ffffff",
    anchor: "object-center",
  },
];

export const SLIDE_MS = 8000;
export const FADE_MS = 2000;

/** Crossfading slide stack. Controlled: the parent owns the active index so
 *  the nav band color and the slides stay in sync. Slides render with
 *  object-cover anchored per slide (see `anchor`): the artwork fills the stage
 *  edge to edge, and each slide keeps the edge that carries its content.
 *  The stage still wears the slide's band color as a backstop. */
export function HeroSlideshow({
  className = "",
  index,
}: {
  className?: string;
  index: number;
}) {
  return (
    <div
      className={`transition-colors ease-in-out ${className}`}
      style={{
        backgroundColor: SLIDES[index]?.band,
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.alt}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          fill
          priority={i === 0}
          placeholder="blur"
          sizes="100vw"
          style={{ transitionDuration: `${FADE_MS}ms` }}
          className={`object-cover ${slide.anchor} transition-opacity ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
