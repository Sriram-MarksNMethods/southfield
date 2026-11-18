"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { eyebrow } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Every section h2 on the site. Its lines slide up out of a mask the first
 * time the heading scrolls into view.
 */
export default function SectionHeading({
  kicker,
  children,
  className = "",
}: {
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current!.querySelector("[data-lines]"), { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h2 ref={ref} className={`text-[clamp(2rem,3.2vw,3.75rem)] leading-[1.12] ${className}`}>
      {kicker && <span className={`${eyebrow} mb-5`}>{kicker}</span>}
      <span data-lines className="block">{children}</span>
    </h2>
  );
}
