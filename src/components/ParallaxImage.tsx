"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** Classes for the frame: size, aspect ratio, rounding. */
  className?: string;
  priority?: boolean;
  /** How far the photo travels inside the frame, in % of the photo height. Max 11. */
  amount?: number;
  children?: React.ReactNode;
};

/**
 * "Window parallax": the photo is taller than its frame and moves slower than
 * the page, so you seem to look at it through a window as you scroll past.
 */
export default function ParallaxImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  amount = 9,
  children,
}: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          photo.current,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: frame.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden bg-surface ${className}`}>
      <div ref={photo} className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {children}
    </div>
  );
}
