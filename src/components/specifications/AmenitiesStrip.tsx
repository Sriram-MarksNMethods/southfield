"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { useGSAP } from "@gsap/react";
import SectionHeading from "@/components/SectionHeading";

gsap.registerPlugin(Draggable, InertiaPlugin, useGSAP);

// Photo sizes and heights vary on purpose, like Mākena's "In pursuit of wonder" strip.
const amenities = [
  { src: "/images/night-resort-pool.jpg", name: "Infinity pool", alt: "Pool lit among palms at night", box: "w-[62vw] md:w-[24vw] aspect-[3/4]", top: "md:mt-24" },
  { src: "/images/night-pool-swing.jpg", name: "Pool lounge", alt: "Pool deck with a hanging chair at night", box: "w-[70vw] md:w-[30vw] aspect-[4/3]", top: "md:mt-0" },
  { src: "/images/night-courtyard-pool.jpg", name: "Courtyard gardens", alt: "Courtyard pool lit at night", box: "w-[56vw] md:w-[20vw] aspect-[4/5]", top: "md:mt-40" },
  { src: "/images/night-pool-overhead.jpg", name: "Lagoon pool", alt: "Lagoon pool seen from above at night", box: "w-[70vw] md:w-[28vw] aspect-[4/3]", top: "md:mt-12" },
  { src: "/images/night-garden-pool.jpg", name: "Kids' pool", alt: "Garden pool among palms at night", box: "w-[56vw] md:w-[20vw] aspect-[3/4]", top: "md:mt-32" },
];

const GLIDE = 40; // px per second while nobody is touching it

/**
 * Mākena "In pursuit of wonder": centred heading, then an endless row of photos
 * of different sizes. Not tied to the page scroll. It glides on its own
 * (pausing under the mouse) and can be dragged and thrown either way.
 *
 * How it loops: the photos are drawn twice in one strip. A single number
 * (`pos`) says how far the strip has moved; it is wrapped to one set's width,
 * so when the first set has slid out, the copy is exactly where it was. Only
 * one transform changes per frame, which keeps dragging smooth.
 */
export default function AmenitiesStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const viewport = root.current!.querySelector<HTMLElement>("[data-viewport]")!;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const proxy = document.createElement("div");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let setWidth = track.scrollWidth / 2;
      let pos = 0;
      let hovering = false;
      let dragging = false;
      let start = 0;

      const setX = gsap.quickSetter(track, "x", "px");
      const render = () => setX(gsap.utils.wrap(-setWidth, 0, pos));

      const tick = (_time: number, deltaMs: number) => {
        if (!reduce && !hovering && !dragging) pos -= (GLIDE * deltaMs) / 1000;
        render();
      };
      gsap.ticker.add(tick);

      const drag = Draggable.create(proxy, {
        trigger: viewport,
        type: "x",
        inertia: true,
        allowContextMenu: true,
        onPress() {
          dragging = true;
          start = pos;
          gsap.set(proxy, { x: 0 });
          this.update();
        },
        onDrag() {
          pos = start + this.x;
        },
        onThrowUpdate() {
          pos = start + this.x;
        },
        onRelease() {
          if (!this.isThrowing) dragging = false;
        },
        onThrowComplete() {
          dragging = false;
        },
      })[0];

      const enter = () => (hovering = true);
      const leave = () => (hovering = false);
      viewport.addEventListener("pointerenter", enter);
      viewport.addEventListener("pointerleave", leave);

      const measure = () => {
        setWidth = track.scrollWidth / 2;
        render();
      };
      window.addEventListener("resize", measure);

      return () => {
        gsap.ticker.remove(tick);
        drag.kill();
        viewport.removeEventListener("pointerenter", enter);
        viewport.removeEventListener("pointerleave", leave);
        window.removeEventListener("resize", measure);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="amenities" data-tone="2" className="section-y overflow-hidden">
      <div className="wrap text-center">
        <SectionHeading kicker="Amenities" className="mx-auto max-w-[18ch]">In pursuit of everyday leisure</SectionHeading>
        <p className="mx-auto mt-6 max-w-xl text-moon/90">From the poolside to the garden, there are few places where families and friends can lorem ipsum with carefree ease and safety.</p>
      </div>

      <div data-viewport className="mt-14 cursor-grab touch-pan-y select-none active:cursor-grabbing md:mt-20">
        <ul data-track className="flex w-max items-start will-change-transform">
          {[0, 1].map((copy) =>
            amenities.map((a) => (
              <li key={`${copy}-${a.name}`} aria-hidden={copy === 1} className={`shrink-0 pr-4 md:pr-8 ${a.top}`}>
                <div className={`relative overflow-hidden ${a.box}`}>
                  <Image src={a.src} alt={copy === 1 ? "" : a.alt} fill sizes="(min-width: 768px) 30vw, 70vw" draggable={false} className="pointer-events-none object-cover" />
                </div>
                <p className="mt-4 text-[0.7rem] tracking-[0.28em] text-moon/90 uppercase">{a.name}</p>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}
