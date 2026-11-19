"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import ParallaxImage from "@/components/ParallaxImage";
import { eyebrow } from "@/lib/ui";

gsap.registerPlugin(SplitText, useGSAP);

// Mākena hero: one full-screen photo, a small label and a short two-line title
// in the middle. The photo sits behind the page like a window (parallax).
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-hero-title]", { type: "lines", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-hero-photo]", { scale: 1.12, duration: 2.6 }, 0)
          .from("[data-hero-label]", { autoAlpha: 0, y: 16, duration: 1.2 }, 0.4)
          .from(split.lines, { yPercent: 110, duration: 1.5, stagger: 0.12 }, 0.5)
          .from("[data-hero-scroll]", { autoAlpha: 0, duration: 1 }, 1.4);
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="0" aria-label="Southfield" className="on-photo relative h-svh min-h-[36rem] overflow-hidden">
      <div data-hero-photo className="absolute inset-0">
        <ParallaxImage
          src="/images/night-villa-pool.jpg"
          alt="A two-storey villa lit up at night above its pool"
          sizes="100vw"
          priority
          amount={10}
          className="size-full"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-night/60 via-night/40 to-night/75" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
        <span data-hero-label className={eyebrow}>Welcome</span>
        <h1 data-hero-title className="mt-6 max-w-[18ch] text-[clamp(2.4rem,5vw,5.25rem)] leading-[1.08]">
          Lorem ipsum&apos;s premier villa escape
        </h1>
      </div>

      <div data-hero-scroll aria-hidden="true" className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-[0.65rem] tracking-[0.28em] text-moon/80 uppercase max-lg:bottom-20">
        Scroll
        <span className="h-10 w-px origin-top animate-pulse bg-moon/60" />
      </div>
    </section>
  );
}
