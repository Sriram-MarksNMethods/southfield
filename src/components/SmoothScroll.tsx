"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

/** The page's Lenis instance (null before it starts, or with reduced motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/** Puts the page at the very top at once: no smooth scroll back up. */
function jumpToTop(lenis: Lenis | null) {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/**
 * Smooth scrolling for the whole site. The mouse wheel moves the page in
 * ~100px steps; Lenis glides between them so the window-parallax photos never
 * jump. GSAP's ticker drives Lenis, so ScrollTrigger animations stay in sync.
 *
 * Page changes always open at the very top, and a link to the page you're
 * already on (the logo on Home, say) also jumps straight to the top.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.09, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Lenis is an outside system created here, so handing it to React from the effect is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New page: start at the top before it paints, then let scroll animations re-measure.
  useLayoutEffect(() => {
    jumpToTop(lenis);
    ScrollTrigger.refresh();
    // Only on page changes; lenis is read from the latest render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Same-page links (no #section): jump to the top instead of doing nothing.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // (Next.js links always preventDefault, so that flag is not checked here.)
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement).closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      if (url.pathname === window.location.pathname) jumpToTop(lenis);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
