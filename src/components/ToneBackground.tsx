"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Sage's shifting page colour, 1:1 with the Sage landing page: six DARK tones,
// each a deep base with two soft glows, stacked as fixed layers. The section
// crossing the middle of the screen fades its layer in (opacity, 1.6s). Every
// tone is dark, so cream text works everywhere and the fades never flash.
//
// Built from the client palette (olive #5a634b, mid-olive #969469, sage #b8b99a,
// sand #b7a58a, terracotta #b8755a); no charcoal/grey backgrounds, darkened
// where needed so they sit together like Sage's teal/forest/olive/bronze/rust.
const tones = [
  // 0 olive
  "radial-gradient(90% 70% at 85% 20%, #7b7f55 0%, transparent 65%), radial-gradient(70% 60% at 10% 90%, #3a4130 0%, transparent 70%), linear-gradient(165deg, #2b3023 0%, #4f573f 55%, #343a2b 100%)",
  // 1 sage
  "radial-gradient(80% 70% at 15% 80%, #73765c 0%, transparent 65%), radial-gradient(60% 50% at 90% 10%, #4a5040 0%, transparent 70%), linear-gradient(165deg, #23271d 0%, #434a38 60%, #2a2f23 100%)",
  // 2 sand
  "radial-gradient(80% 70% at 80% 30%, #857659 0%, transparent 65%), radial-gradient(60% 60% at 10% 90%, #464230 0%, transparent 70%), linear-gradient(165deg, #24221a 0%, #4a4433 60%, #2c2a21 100%)",
  // 3 terracotta
  "radial-gradient(80% 70% at 25% 70%, #9a6249 0%, transparent 65%), radial-gradient(60% 60% at 90% 15%, #5e3b2a 0%, transparent 70%), linear-gradient(165deg, #2b1c15 0%, #5c3a29 60%, #35251b 100%)",
  // 4 rust
  "radial-gradient(80% 70% at 70% 60%, #a35f45 0%, transparent 65%), radial-gradient(60% 60% at 10% 10%, #5b3324 0%, transparent 70%), linear-gradient(165deg, #2f1b14 0%, #633626 60%, #38231a 100%)",
  // 5 mid-olive (was charcoal; the user asked for no dark grey backgrounds)
  "radial-gradient(90% 60% at 50% 0%, #8f8c5c 0%, transparent 65%), radial-gradient(60% 60% at 10% 90%, #4a4930 0%, transparent 70%), linear-gradient(180deg, #2d2c1e 0%, #57553a 100%)",
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
