"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import EnquiryButton from "@/components/EnquiryButton";
import { buttonOutline } from "@/lib/ui";

const rooms = [
  { name: "Living room", src: "/images/interior-dark-lounge.jpg", alt: "Living room with low lamps, a patterned rug and dark walls" },
  { name: "Master bedroom", src: "/images/interior-wood-bedroom.jpg", alt: "Bedroom with a timber wall, a crystal ring light and a bedside lamp" },
  { name: "Family lounge", src: "/images/interior-warm-lounge.jpg", alt: "Warm lounge with a fireplace and lamps lit" },
  { name: "Dining room", src: "/images/interior-dark-dining.jpg", alt: "Dining table under arched pendant lights beside a stone wall" },
  { name: "Kitchen", src: "/images/interior-dark-kitchen.jpg", alt: "Dark kitchen with an island and warm under-cabinet light" },
];

// Mākena "Real estate": label, heading and paragraph on the left with a list of
// names under it; pointing at (or tapping) a name swaps the large photo.
export default function Residences() {
  const [active, setActive] = useState(0);

  return (
    <section data-tone="3" className="section-y">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:col-start-2">
          <SectionHeading kicker="The villa">Room for every side of you</SectionHeading>
          <p className="mt-6 max-w-md text-moon/90">From double-height living rooms to quiet bedroom suites, every 4 BHK villa is inspired by lorem ipsum and gives special attention to light, air and privacy.</p>

          <ul className="mt-10 border-t border-moon/15">
            {rooms.map((room, i) => (
              <li key={room.name} className="border-b border-moon/15">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className="group flex w-full items-center justify-between gap-4 py-4 text-left text-moon/75 transition-colors aria-pressed:text-moon"
                >
                  <span className="transition-transform duration-500 ease-soft group-aria-pressed:translate-x-2">{room.name}</span>
                  <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-lamp opacity-0 transition-opacity group-aria-pressed:opacity-100"><path d="M4 10h12m0 0l-5-5m5 5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <EnquiryButton purpose="Brochure" className={buttonOutline}>Request floor plans</EnquiryButton>
            <Link href="/specifications" className={buttonOutline}>Specifications</Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden max-lg:-order-1 md:aspect-[4/3] lg:col-span-6 lg:col-start-7 lg:aspect-auto lg:min-h-[38rem]">
          {rooms.map((room, i) => (
            <Image
              key={room.src}
              src={room.src}
              alt={room.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-cover transition-[opacity,scale] duration-[1200ms] ease-soft ${i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
