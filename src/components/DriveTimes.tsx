"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const driveTimes = {
  Essentials: [
    ["Lorem International School", 5],
    ["Ipsum Public School", 8],
    ["Dolor Multi-speciality Hospital", 12],
    ["Sit Amet Business School", 15],
    ["Consectetur Hospital", 22],
  ],
  Leisure: [
    ["Adipiscing Golf Club", 10],
    ["Elit Resort & Spa", 14],
    ["Sed Do Mall", 25],
  ],
  Connectivity: [
    ["Outer Ring Road", 6],
    ["Tempor IT Park", 12],
    ["Incididunt Financial District", 20],
    ["International Airport", 30],
  ],
} satisfies Record<string, [string, number][]>;

type Tab = keyof typeof driveTimes;
const MAX_MINUTES = 30;

/** Sage's drive-time bars: each place gets a bar on a shared 0-30 minute scale. */
export default function DriveTimes() {
  const root = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("Essentials");

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-drive-bar]",
        { scaleX: 0 },
        {
          scaleX: (_, el: HTMLElement) => Number(el.dataset.w),
          duration: 1.4,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        },
      );
    },
    { scope: root, dependencies: [tab], revertOnUpdate: true },
  );

  return (
    <div ref={root}>
      <div role="tablist" aria-label="Places near Southfield" className="flex gap-6 border-b border-moon/20">
        {(Object.keys(driveTimes) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === tab}
            onClick={() => setTab(t)}
            className="-mb-px border-b-2 border-transparent pt-3 pb-4 text-moon/80 transition-colors hover:text-moon aria-selected:border-lamp aria-selected:text-moon"
          >
            {t}
          </button>
        ))}
      </div>
      <div aria-hidden="true" className="mt-5 flex justify-between text-xs text-muted tabular-nums">
        <span>0</span><span>10</span><span>20</span><span>30 mins</span>
      </div>
      <ul role="tabpanel" className="mt-1">
        {driveTimes[tab].map(([place, mins]) => (
          <li key={place} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <span>{place}</span>
              <span className="shrink-0 font-heading text-lg tabular-nums">{mins} mins</span>
            </div>
            <div aria-hidden="true" className="mt-2.5 h-1 rounded-full bg-moon/10">
              <div data-drive-bar data-w={mins / MAX_MINUTES} className="h-full origin-left rounded-full bg-linear-to-r from-pool to-lamp" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
