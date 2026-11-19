"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import ParallaxImage from "./ParallaxImage";
import { eyebrow } from "@/lib/ui";

gsap.registerPlugin(SplitText, useGSAP);

// Top of every inner page: a full-width photo (window parallax) with the
// label and page title over it, in the same style as the Home hero.
export default function PageHero({
  label,
  title,
  text,
  src,
  alt,
  tone = "0",
}: {
  label: string;
  title: string;
  text?: string;
  src: string;
  alt: string;
  tone?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-page-title]", { type: "lines", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-page-photo]", { scale: 1.1, duration: 2.4 }, 0)
          .from("[data-page-label]", { autoAlpha: 0, y: 14, duration: 1 }, 0.3)
          .from(split.lines, { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.4)
          .from("[data-page-text]", { autoAlpha: 0, y: 14, duration: 1 }, 0.8);
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone={tone} className="on-photo relative h-[78svh] min-h-[30rem] overflow-hidden">
      <div data-page-photo className="absolute inset-0">
        <ParallaxImage src={src} alt={alt} sizes="100vw" priority amount={10} className="size-full" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-night/60 via-night/30 to-night/80" />
      <div className="wrap relative flex h-full flex-col justify-end pb-14 md:pb-20">
        <span data-page-label className={eyebrow}>{label}</span>
        <h1 data-page-title className="mt-5 max-w-[16ch] text-[clamp(2.6rem,5.6vw,6rem)] leading-[1.04]">{title}</h1>
        {text && <p data-page-text className="mt-5 max-w-xl text-moon/90 md:text-lg">{text}</p>}
      </div>
    </section>
  );
}
