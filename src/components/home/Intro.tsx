"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import ParallaxImage from "@/components/ParallaxImage";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Mākena's opening statement: one centred paragraph in the heading font, then a
// wide photo that opens up to its full width as it scrolls in.
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("[data-intro-text]", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.2 },
          { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: "[data-intro-text]", start: "top 80%", end: "bottom 45%", scrub: true } },
        );
        gsap.fromTo(
          "[data-intro-photo]",
          { clipPath: "inset(0% 14% 0% 14%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: "[data-intro-photo]", start: "top 95%", end: "top 25%", scrub: true } },
        );
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-tone="0" className="section-y">
      <div className="wrap">
        <p data-intro-text className="mx-auto max-w-[38ch] text-center font-heading text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.35]">
          A lorem ipsum of 24 acres spanning from the quiet gardens to the open sky, Southfield is a private residential community of 120 villas, consectetur adipiscing elit.
        </p>
      </div>
      <div className="wrap mt-14 md:mt-20">
        <div data-intro-photo className="mx-auto max-w-[96rem]">
          <ParallaxImage src="/images/night-villa-warm.jpg" alt="Villa with warm lights glowing over a pool" sizes="100vw" className="aspect-[4/3] md:aspect-[21/9]" />
        </div>
      </div>
    </section>
  );
}
