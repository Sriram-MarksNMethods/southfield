"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/components/SmoothScroll";
import { aerial, spots, stops } from "@/lib/aerial";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Works like the aerial on ownprimland.com (re-measured live, 2026-11-18):
 *  - The section is 12 screens tall; the screen stays pinned for 11 of them.
 *  - The map is anchored top-left and always covers the screen. It zooms
 *    1 -> 3 around the first stop (sine in-out, first 40% of the scroll) while
 *    sliding so that stop ends up in the exact centre of the screen.
 *  - The title grows with the zoom (up to 1.5x) and fades at twice the zoom rate.
 *  - The two clouds start offset (12%), grow 1 -> 2, move out to 25% and fade,
 *    over the first ~32% of the scroll.
 *  - Stops start at 40%, 60% and 80%. Each new stop glides the map (1.2s) so its
 *    pin is centred, opens its pin, lights its "Visit" bullet and shows its card.
 *    The card's top bar fills as you scroll through the stop; earlier bars stay full.
 *  - Amenity pins appear once the first stop opens; hovering shows a label.
 *  - Pins are drawn at 1/3 size so they look normal when the map is at 3x.
 * Extra, from explore.ownprimland.com: birds and drifting clouds over the map.
 * The photo is a free Unsplash placeholder (photo-1776723670896); all positions are % of the photo.
 */

const ZOOM = 3;
const STOP_STARTS = [0.4, 0.6, 0.8];
const STOP_LENGTH = 0.2;

// Two flocks flying across the map: start/end in % of the map, seconds per pass, delay
const flocks = [
  { from: [-8, 78], to: [108, 6], duration: 26, delay: 2 },
  { from: [108, 70], to: [-8, 30], duration: 34, delay: 11 },
];

const easeOut = "ease-[cubic-bezier(0.19,1,0.22,1)]";

function Bird({ className = "" }: { className?: string }) {
  // Seen from above: body, tail and two wings that flap (see .bird-wing in globals.css)
  return (
    <svg viewBox="-20 -12 40 24" className={className} aria-hidden="true">
      <g className="bird-wing">
        <path d="M0 -1 C -6 -4 -12 -6 -19 -3 C -12 -1 -6 1 0 2 Z" />
        <path d="M0 -1 C 6 -4 12 -6 19 -3 C 12 -1 6 1 0 2 Z" />
      </g>
      <ellipse cx="0" cy="1" rx="1.8" ry="6" />
      <path d="M0 6 L -2.5 10 L 2.5 10 Z" />
    </svg>
  );
}

function Flock({ index }: { index: number }) {
  // V formation of five birds, each with its shadow on the ground below.
  // Drawn at 1/3 size, like the pins, so they look right once the map is at 3x.
  const formation = [
    [0, 0],
    [-14, 10],
    [14, 10],
    [-28, 20],
    [28, 20],
  ];
  return (
    <div data-flock={index} className="pointer-events-none absolute top-0 left-0 z-[3] h-0 w-0 will-change-transform">
      {formation.map(([x, y], i) => (
        <div key={i} className="absolute" style={{ left: x / ZOOM, top: y / ZOOM }}>
          <Bird className="absolute top-[7px] left-[5px] h-1 w-[0.42rem] fill-black/30" />
          <Bird className="relative h-1 w-[0.42rem] fill-[#f4efe6]" />
        </div>
      ))}
    </div>
  );
}

export default function AerialMap() {
  const root = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [stop, setStop] = useState(-1);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const first = stops[0];

  useGSAP(
    () => {
      const section = root.current!;
      const map = mapRef.current!;
      const pan = panRef.current!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const title = section.querySelector<HTMLElement>("[data-title]")!;
      const bars = barsRef.current;

      // Map size, measured once and again on resize (never during scrolling).
      let w = map.offsetWidth;
      let h = map.offsetHeight;
      const measure = () => {
        w = map.offsetWidth;
        h = map.offsetHeight;
      };
      ScrollTrigger.addEventListener("refreshInit", measure);

      // Where the map has to slide (before scaling) so stop i lands in the centre of the screen.
      const panFor = (i: number) => {
        const ox = (first.x / 100) * w;
        const oy = (first.y / 100) * h;
        const cx = ox + (window.innerWidth / 2 - ox) / ZOOM;
        const cy = oy + (window.innerHeight / 2 - oy) / ZOOM;
        return { x: cx - (stops[i].x / 100) * w, y: cy - (stops[i].y / 100) * h };
      };

      let active = -1;
      const zoom = { t: reduce ? 1 : 0 };

      function applyZoom() {
        const e = zoom.t;
        const s = 1 + (ZOOM - 1) * e;
        gsap.set(map, { scale: s });
        if (active === -1) {
          const p = panFor(0);
          gsap.set(pan, { x: p.x * e, y: p.y * e });
        }
        const ts = Math.min(s, 1.5);
        gsap.set(title, { scale: ts, y: -(ts - 1) * 113.5, opacity: Math.max(0, 1 - 2 * (s - 1)) });
      }

      // Zoom in (scrubbed), first 40% of the section.
      gsap.to(zoom, {
        t: 1,
        ease: "sine.inOut",
        onUpdate: applyZoom,
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${(section.offsetHeight - window.innerHeight) * STOP_STARTS[0]}`, scrub: true, invalidateOnRefresh: true },
      });

      // Clouds part (scrubbed), first ~32% of the section.
      if (!reduce) {
        const clouds = gsap.timeline({
          defaults: { ease: "sine.inOut", duration: 1 },
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${(section.offsetHeight - window.innerHeight) * 0.317}`, scrub: true, invalidateOnRefresh: true },
        });
        clouds
          .fromTo("[data-cloud='1']", { scale: 1, xPercent: 12, yPercent: -12, opacity: 1 }, { scale: 2, xPercent: 25, yPercent: -25, opacity: 0 }, 0)
          .fromTo("[data-cloud='2']", { scale: 1, xPercent: -12, yPercent: 25, opacity: 1 }, { scale: 2, xPercent: -25, yPercent: 25, opacity: 0 }, 0);
      }

      // Stops: which one is open and how far through it we are.
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          let next = -1;
          STOP_STARTS.forEach((t, i) => {
            if (p >= t) next = i;
          });
          // Card bars: earlier stops full, current one filling, later ones empty (no re-render).
          bars.forEach((bar, i) => {
            if (!bar) return;
            const v = i < next ? 1 : i > next ? 0 : Math.min(1, (p - STOP_STARTS[i]) / STOP_LENGTH);
            bar.style.transform = `scaleX(${v})`;
          });
          if (next === active) return;
          const prev = active;
          active = next;
          setStop(next);
          if (next >= 0 && prev >= 0) {
            const to = panFor(next);
            gsap.to(pan, { x: to.x, y: to.y, duration: reduce ? 0 : 1.2, ease: "power3.inOut", overwrite: true });
          } else if (next === -1) {
            gsap.killTweensOf(pan);
            applyZoom();
          } else {
            // first stop opens straight from the zoom, which already centred it
            const to = panFor(0);
            gsap.to(pan, { x: to.x, y: to.y, duration: 0.6, ease: "power2.out", overwrite: true });
          }
        },
      });

      // Birds: each flock crosses the map, rests, and comes round again.
      if (!reduce) {
        flocks.forEach((f, i) => {
          const angle = (Math.atan2(f.to[1] - f.from[1], f.to[0] - f.from[0]) * 180) / Math.PI + 90;
          gsap.fromTo(
            `[data-flock='${i}']`,
            { x: () => (f.from[0] / 100) * w, y: () => (f.from[1] / 100) * h, rotate: angle },
            { x: () => (f.to[0] / 100) * w, y: () => (f.to[1] / 100) * h, rotate: angle, duration: f.duration, delay: f.delay, ease: "none", repeat: -1, repeatDelay: 6 },
          );
        });
      }

      applyZoom();
      return () => ScrollTrigger.removeEventListener("refreshInit", measure);
    },
    { scope: root },
  );

  // "Skip": jump straight past the aerial to the next section (no long scroll).
  function skip() {
    const section = root.current!;
    const y = section.getBoundingClientRect().bottom + window.scrollY;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: "instant" });
  }

  // Clicking a "Visit" bullet scrolls to where that stop opens.
  function goTo(i: number) {
    const section = root.current!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const y = top + (section.offsetHeight - window.innerHeight) * (STOP_STARTS[i] + 0.01);
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }


  return (
    <section ref={root} data-tone="2" aria-label="Location" className="relative h-[1200svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The map: anchored top-left, always covers the screen, zooms around the first stop */}
        <div
          ref={mapRef}
          className="absolute top-0 left-0 z-[1] aspect-[4000/2707] h-[max(100svh,67.68vw)] w-[max(100vw,147.76svh)] will-change-transform"
          style={{ transformOrigin: `${first.x}% ${first.y}%` }}
        >
          <div ref={panRef} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- served at full size so the 3x zoom stays sharp */}
            <img src={aerial.src} alt="Aerial view of tree-lined greens, bunkers and winding paths" className="absolute inset-0 size-full object-cover will-change-transform" decoding="async" />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-black/30" />

            {/* Clouds drifting slowly over the land */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
              <Image src="/images/cloud-right.png" alt="" width={1600} height={600} className="absolute top-[30%] w-[22%] max-w-none animate-[drift_90s_linear_infinite] opacity-[0.16]" />
              <Image src="/images/cloud-left.png" alt="" width={1600} height={880} className="absolute top-[55%] w-[18%] max-w-none animate-[drift_120s_linear_-50s_infinite] opacity-[0.12]" />
            </div>

            {flocks.map((_, i) => (
              <Flock key={i} index={i} />
            ))}

            {/* Stop pins: the ring opens when the stop is active */}
            {stops.map((s, i) => (
              <div key={s.name} className="absolute z-[2] [transform:translate(-50%,-50%)_scale(0.3333)]" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                <span className={`relative block size-[1.875rem] rounded-full bg-white/55 transition-transform duration-1000 md:size-[2.8125rem] ${easeOut} ${i === stop ? "scale-100" : "scale-0"}`} />
                <span className={`absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-transform duration-1000 md:size-1.5 ${easeOut} ${i === stop ? "scale-100" : "scale-0"}`} />
              </div>
            ))}

            {/* Amenity pins: appear when the first stop opens; label on hover */}
            {spots.map((s) => (
              <button
                key={s.name}
                type="button"
                aria-label={s.name}
                tabIndex={stop >= 0 ? 0 : -1}
                className={`group absolute z-[2] cursor-pointer transition-transform duration-1000 ${easeOut}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%, -50%) scale(${stop >= 0 ? 0.3333 : 0})` }}
              >
                <span className="relative block">
                  <span className={`block size-[1.875rem] scale-50 rounded-full bg-white transition-transform duration-1000 group-hover:scale-75 md:size-[2.8125rem] ${easeOut}`} />
                  <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deep md:size-1.5" />
                  <span className="absolute top-1/2 left-full flex h-7 -translate-y-1/2 items-center bg-white px-4 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <svg viewBox="0 0 6 10" className="absolute top-1/2 right-full h-2 w-auto -translate-y-1/2 fill-white" aria-hidden="true"><path d="M6 0v10L0 5z" /></svg>
                    <span className="text-[0.65rem] font-medium tracking-[0.2em] text-deep uppercase">{s.name}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Top and bottom shading, as on Primland */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(rgb(0_0_0/0.3)_0,transparent_20%,transparent_80%,rgb(0_0_0/0.2))]" />

        {/* Title over the first view */}
        <div className="pointer-events-none absolute inset-0 z-[3] flex items-center">
          <div data-title className="wrap grid origin-bottom grid-cols-12 items-start text-moon">
            <svg viewBox="0 0 6 6" className="col-span-1 mt-5 size-1.5" aria-hidden="true"><circle cx="3" cy="3" r="3" className="fill-current" /></svg>
            <h2 className="col-span-11 text-[2rem] leading-[1.2] md:col-span-9 md:col-start-4">
              In the heart of
              <br />
              <em>lorem ipsum valley</em>
            </h2>
          </div>
        </div>

        {/* The two big clouds that part as you zoom in */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
          <div data-cloud="1" className="absolute -top-[12.5%] -right-[150%] w-[350%] origin-left md:-top-[15%] md:-right-[20%] md:w-[125%]">
            <Image src="/images/cloud-right.png" alt="" width={1600} height={600} className="h-auto w-full" />
          </div>
          <div data-cloud="2" className="absolute -bottom-[15%] -left-[35%] w-[350%] origin-right md:-bottom-[25%] md:-left-[20%] md:w-[125%]">
            <Image src="/images/cloud-left.png" alt="" width={1600} height={880} className="h-auto w-full" />
          </div>
        </div>

        {/* "Visit" list, top left (tablets and up) */}
        <div className="absolute top-24 left-5 z-[3] hidden flex-col items-start gap-y-6 text-moon md:flex lg:top-28">
          <span className="text-[0.65rem] tracking-[0.28em] uppercase">Visit</span>
          <ul className="flex flex-col items-start gap-y-2">
            {stops.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`relative pl-4 text-left text-sm transition-opacity duration-300 ease-out before:absolute before:top-1/2 before:left-0 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-current before:transition-transform before:duration-300 before:ease-out ${
                    i === stop ? "opacity-100 before:scale-100" : "opacity-50 before:scale-0"
                  }`}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Skip the whole aerial */}
        <button
          type="button"
          onClick={skip}
          className="absolute top-24 right-5 z-[4] inline-flex items-center gap-2 rounded-[2px] border border-moon/50 bg-night/30 px-4 py-2.5 text-[0.65rem] font-medium tracking-[0.25em] text-moon uppercase backdrop-blur-sm fill-btn [--fill:var(--color-moon)] hover:border-moon hover:text-night md:top-28 lg:right-10"
        >
          Skip
          <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden="true"><path d="M10 4v12m0 0l-5-5m5 5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        {/* Into the full-screen 3D explorer, like Primland's "Explore the map" */}
        <Link
          href="/explore"
          className="absolute bottom-[calc(5rem+env(safe-area-inset-bottom))] left-5 z-[3] inline-flex items-center gap-3 rounded-[2px] bg-[#fffbe7] px-6 py-3.5 text-xs font-medium tracking-[0.2em] text-[#456a4b] uppercase fill-btn [--fill:#456a4b] hover:text-[#fffbe7] max-md:hidden lg:bottom-24"
        >
          Explore the map
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 10h12m0 0l-5-5m5 5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>

        {/* One card per stop, bottom right; only the active one shows */}
        {stops.map((s, i) => (
          <article
            key={s.name}
            aria-hidden={i !== stop}
            className={`absolute right-9 bottom-[calc(5rem+env(safe-area-inset-bottom))] left-9 z-[3] bg-[#fffbe7] px-5 pt-6 pb-10 text-[#456a4b] [@media(max-height:820px)]:pt-4 [@media(max-height:820px)]:pb-6 transition-opacity duration-300 ease-out md:left-auto md:w-full md:max-w-[33.5rem] lg:right-5 lg:bottom-24 ${
              i === stop ? "pointer-events-auto opacity-100 delay-300" : "pointer-events-none opacity-0"
            }`}
          >
            <div ref={(el) => { barsRef.current[i] = el; }} className="absolute top-0 right-0 left-0 h-1 origin-left scale-x-0 bg-[#e9dcb4] will-change-transform" />
            <h3 className="pb-3 text-center font-sans text-base">{s.name}</h3>
            <div className="relative w-full overflow-hidden pt-[37.5%] md:pt-[56.25%] md:[@media(max-height:820px)]:pt-[37.5%]">
              <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 33.5rem, 90vw" className="object-cover" />
            </div>
            <p className="mt-5 text-center text-sm leading-relaxed md:px-4">{s.text}</p>
            {s.href && (
              <div className="mt-4 text-center">
                <Link href={s.href} className="inline-block border-b border-current pb-1 text-[0.65rem] font-medium tracking-[0.28em] uppercase">Learn more</Link>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
