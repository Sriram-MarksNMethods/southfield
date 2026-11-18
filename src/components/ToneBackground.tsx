"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Sage's shifting page colour, in Night Pool shades. Each section says which
// tone it wants with data-tone="0..5"; the one crossing the middle of the screen
// fades its layer in (opacity only, so it stays smooth).
const tones = [
  // 0 night: blue-black with a faint pool glow
  "radial-gradient(90% 70% at 85% 15%, #16343d 0%, transparent 65%), radial-gradient(70% 60% at 10% 90%, #0d2229 0%, transparent 70%), linear-gradient(165deg, #0b151a 0%, #0f1a20 55%, #0c1a1f 100%)",
  // 1 deep water: teal
  "radial-gradient(80% 70% at 15% 80%, #11505a 0%, transparent 65%), radial-gradient(60% 50% at 90% 10%, #0d3a43 0%, transparent 70%), linear-gradient(165deg, #08242b 0%, #0a2f37 60%, #082228 100%)",
  // 2 pool: aqua-green glow
  "radial-gradient(80% 70% at 80% 30%, #1b5f5c 0%, transparent 65%), radial-gradient(60% 60% at 10% 90%, #123f3f 0%, transparent 70%), linear-gradient(165deg, #0a1f22 0%, #103435 60%, #0b2526 100%)",
  // 3 lamp: warm amber in the dark
  "radial-gradient(80% 70% at 25% 70%, #5a3f22 0%, transparent 65%), radial-gradient(60% 60% at 90% 15%, #3a2a1a 0%, transparent 70%), linear-gradient(165deg, #17140f 0%, #2a2116 60%, #1a1610 100%)",
  // 4 dusk: indigo sky
  "radial-gradient(80% 70% at 70% 40%, #2c2f5a 0%, transparent 65%), radial-gradient(60% 60% at 10% 10%, #1d2144 0%, transparent 70%), linear-gradient(165deg, #0f1124 0%, #1a1d3a 60%, #11132a 100%)",
  // 5 surface: calm slate for forms and the footer area
  "radial-gradient(90% 60% at 50% 0%, #1f3a44 0%, transparent 65%), linear-gradient(180deg, #13232b 0%, #16262e 100%)",
];

export default function ToneBackground() {
  const pathname = usePathname();
  const [tone, setTone] = useState("0");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setTone((entry.target as HTMLElement).dataset.tone ?? "0");
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[data-tone]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {tones.map((background, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-soft ${String(i) === tone ? "opacity-100" : "opacity-0"}`}
          style={{ background }}
        />
      ))}
    </div>
  );
}
