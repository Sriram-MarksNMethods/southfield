"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { stops } from "@/lib/aerial";
import { useLenis } from "@/components/SmoothScroll";
import ExploreScene, { INTRO_POS, type Phase } from "./ExploreScene";

/*
 * Full-screen map explorer, working like explore.ownprimland.com:
 *  1. Intro: the estate seen from high above, under clouds, with the title and
 *     an "Explore the map" button.
 *  2. The camera drops down through the clouds.
 *  3. Hints: drag to move, scroll to zoom. Birds and clouds drift over the land.
 *  4. Pins: tapping a place (or its name in the Visit list) flies there and
 *     opens its card.
 * Primland's map is a 3D terrain model; ours is the aerial photo laid flat
 * until the client's site model or drone shot arrives.
 */
export default function Explorer() {
  const lenis = useLenis();
  const [phase, setPhase] = useState<Phase>("intro");
  const [active, setActive] = useState<number | null>(null);
  const [focus, setFocus] = useState(0);
  const [hints, setHints] = useState(false);

  // The page itself doesn't scroll while the map is open.
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    html.style.overflow = "hidden";
    return () => {
      lenis?.start();
      html.style.overflow = "";
    };
  }, [lenis]);

  const onLanded = useCallback(() => {
    setPhase("explore");
    setHints(true);
  }, []);
  const onInteract = useCallback(() => setHints(false), []);
  const pick = useCallback((i: number) => {
    setActive(i);
    setFocus((f) => f + 1);
    setHints(false);
  }, []);

  // Hints fade by themselves after a while.
  useEffect(() => {
    if (!hints) return;
    const t = window.setTimeout(() => setHints(false), 6000);
    return () => window.clearTimeout(t);
  }, [hints]);

  return (
    <div className="fixed inset-0 z-30 bg-night">
      <Canvas
        camera={{ fov: 40, near: 0.1, far: 200, position: [INTRO_POS.x, INTRO_POS.y, INTRO_POS.z] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        className="touch-none"
      >
        <Suspense fallback={null}>
          <ExploreScene phase={phase} active={active} focus={focus} onLanded={onLanded} onPick={pick} onInteract={onInteract} />
        </Suspense>
      </Canvas>

      {/* soft dark edges, like Primland */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(15_26_32/0.65))]" />

      {/* 1. Intro */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 grid place-items-center px-6 text-center text-moon"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <div>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="text-[0.7rem] tracking-[0.3em] uppercase">
                In the heart of
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{ opacity: 1, letterSpacing: "0.16em" }}
                transition={{ delay: 0.8, duration: 1.8, ease: [0.22, 0.8, 0.16, 1] }}
                className="mt-4 text-[clamp(2rem,5vw,4.25rem)] leading-[1.15] uppercase [text-shadow:0_2px_30px_rgb(0_0_0/0.45)]"
              >
                Lorem ipsum
                <br />
                valley
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }} className="mt-5 text-moon/90">
                Journey to a quiet villa paradise, lorem ipsum dolor sit amet.
              </motion.p>
              <motion.button
                type="button"
                onClick={() => setPhase("flying")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="mt-8 inline-flex min-w-60 items-center justify-center rounded-[2px] bg-[#fffbe7] px-8 py-4 text-xs font-medium tracking-[0.2em] text-[#456a4b] uppercase fill-btn [--fill:#456a4b] hover:text-[#fffbe7]"
              >
                Explore the map
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Hints */}
      <AnimatePresence>
        {hints && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-1/2 grid -translate-y-1/2 place-items-center text-center text-moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-3xl leading-tight [text-shadow:0_2px_20px_rgb(0_0_0/0.5)]">
              Drag
              <br />
              to move
            </p>
            <svg viewBox="0 0 40 40" className="mt-4 size-10" aria-hidden="true">
              <path d="M16 30V14a2 2 0 014 0v10m0-4a2 2 0 014 0v4m0-2a2 2 0 014 0v3m0-1a2 2 0 014 0v5c0 5-3 9-9 9h-2c-4 0-6-2-8-5l-4-6a2 2 0 013-2l4 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-3 text-[0.65rem] tracking-[0.25em] uppercase">Scroll to zoom · tap a pin to visit</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Visit list + card */}
      {phase === "explore" && (
        <div className="absolute top-24 left-5 hidden flex-col items-start gap-y-6 text-moon md:flex lg:top-28">
          <span className="text-[0.65rem] tracking-[0.28em] uppercase">Visit</span>
          <ul className="flex flex-col items-start gap-y-2">
            {stops.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  className={`relative pl-4 text-left text-sm transition-opacity duration-300 before:absolute before:top-1/2 before:left-0 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-current before:transition-transform before:duration-300 ${
                    i === active ? "opacity-100 before:scale-100" : "opacity-60 before:scale-0 hover:opacity-90"
                  }`}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
          <Link href="/" className="mt-4 text-[0.65rem] tracking-[0.28em] text-moon/80 uppercase underline-offset-4 hover:underline">← Back to site</Link>
        </div>
      )}

      <AnimatePresence>
        {active !== null && phase === "explore" && (
          <motion.article
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute right-9 bottom-[calc(5rem+env(safe-area-inset-bottom))] left-9 bg-[#fffbe7] px-5 pt-6 pb-10 text-[#456a4b] md:left-auto md:w-full md:max-w-[33.5rem] lg:right-5 lg:bottom-24"
          >
            <button type="button" onClick={() => setActive(null)} aria-label="Close" className="absolute top-3 right-3 grid size-8 place-items-center rounded-full hover:bg-black/5">
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
            <h2 className="pb-3 text-center font-sans text-base">{stops[active].name}</h2>
            <div className="relative w-full overflow-hidden pt-[37.5%] md:pt-[56.25%]">
              <Image src={stops[active].src} alt={stops[active].alt} fill sizes="(min-width: 768px) 33.5rem, 90vw" className="object-cover" />
            </div>
            <p className="mt-5 text-center text-sm leading-relaxed md:px-4">{stops[active].text}</p>
            {stops[active].href && (
              <div className="mt-4 text-center">
                <Link href={stops[active].href!} className="inline-block border-b border-current pb-1 text-[0.65rem] font-medium tracking-[0.28em] uppercase">Learn more</Link>
              </div>
            )}
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
