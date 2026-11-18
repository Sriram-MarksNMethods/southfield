"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "@/components/SmoothScroll";

// Ported 1:1 from Sage's gallery (index.html #gallery + initGallery()): photos on a
// 3D coil that winds by itself, one photo per swipe, centre photo opens full screen.
// Only the colours changed (Night Pool) and the photos (Unsplash placeholders).

const photos = [
  { file: "night-villa-pool", group: "Villa", alt: "Villa lit up at night above its pool" },
  { file: "night-villa-warm", group: "Villa", alt: "Villa with warm lights over a pool" },
  { file: "interior-dark-lounge", group: "Villa", alt: "Living room with low lamps and a patterned rug" },
  { file: "night-courtyard-pool", group: "Villa", alt: "Courtyard pool lit at night" },
  { file: "interior-wood-bedroom", group: "Villa", alt: "Master bedroom with a timber wall" },
  { file: "dusk-villa-trees", group: "Villa", alt: "Glass villa at dusk among trees" },
  { file: "interior-warm-lounge", group: "Villa", alt: "Warm lounge with a fireplace" },
  { file: "night-villa-glass", group: "Villa", alt: "Villa with a glass gable lit at night" },
  { file: "night-resort-pool", group: "Clubhouse", alt: "Clubhouse pool lit among palms" },
  { file: "night-pool-swing", group: "Clubhouse", alt: "Pool deck with a hanging chair at night" },
  { file: "interior-dark-dining", group: "Villa", alt: "Dining table under arched pendant lights" },
  { file: "twilight-tropical-villa", group: "Clubhouse", alt: "Tropical villa and pool at twilight" },
];

export default function SpoolGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = section.querySelector<HTMLElement>("[data-spool]")!;
    const plates = [...stage.querySelectorAll<HTMLButtonElement>("[data-plate]")];
    const count = plates.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window | Document, type: K | string, fn: EventListener, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    const STEP = 0.34; // radians between neighbouring plates along the coil
    const RISE = 54; // how far plates rise and fall (px)
    const COIL = 0.9;
    const FALLOFF = 0.52; // how quickly plates shrink away from the centre
    const AUTOPLAY = 3000; // ms per photo
    let spread = 600; // coil width (px); smaller on phones and tablets
    let range = 5; // plates drawn on each side of the centre
    function readSize() {
      spread = window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 280 : plates[0].offsetWidth * 0.95;
      range = window.innerWidth < 1024 ? 3 : 5;
    }

    // Load and decode every photo shortly before the gallery scrolls into view.
    const preload = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;
        plates.forEach((plate) => {
          const image = plate.firstElementChild as HTMLImageElement;
          image.loading = "eager";
          image.decode().catch(() => {});
        });
        observer.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    preload.observe(stage);

    let pos = 0;
    let target = 0;
    let running = false;
    let shown = -1;
    let frame = 0;
    let startTarget = 0;

    // Distance of plate i from the centre, wrapped so the coil loops (-count/2 .. count/2).
    const offset = (i: number) => ((i - pos + count / 2 + count * 2) % count) - count / 2;

    function render() {
      let nearest = 0;
      let nearestDistance = Infinity;
      plates.forEach((plate, i) => {
        const d = offset(i);
        const a = Math.abs(d);
        const hide = a > range + 0.5;
        const visibility = hide ? "hidden" : "";
        if (plate.style.visibility !== visibility) plate.style.visibility = visibility;
        if (hide) return;
        if (a < nearestDistance) {
          nearestDistance = a;
          nearest = i;
        }
        const angle = d * STEP;
        const x = Math.sin(angle) * spread;
        const y = -Math.sin(d * COIL) * RISE;
        const scale = Math.max(0.36, 1 / (1 + FALLOFF * Math.pow(a, 1.15)));
        const edgeFade = Math.min(1, Math.max(0, range + 0.5 - a));
        const opacity = Math.max(0.14, 1 - 0.34 * a) * edgeFade;
        plate.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateY(${(-angle * 57.2958 * 0.85).toFixed(2)}deg) rotateZ(${(d * 1.4).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        plate.style.opacity = opacity.toFixed(3);
        const z = String(Math.round(1000 - a * 10));
        if (plate.style.zIndex !== z) plate.style.zIndex = z;
      });
      if (nearest !== shown) setCaption(nearest);
    }

    function loop() {
      pos += (target - pos) * 0.14;
      if (Math.abs(target - pos) < 0.0004) {
        pos = target;
        running = false;
        render();
        return;
      }
      render();
      frame = requestAnimationFrame(loop);
    }

    function go() {
      if (Math.abs(target) > count * 2) {
        const turns = Math.round(target / count) * count;
        target -= turns;
        pos -= turns;
        startTarget -= turns;
      }
      if (reduceMotion) {
        pos = target;
        render();
        return;
      }
      if (!running) {
        running = true;
        frame = requestAnimationFrame(loop);
      }
    }

    function setCaption(i: number) {
      shown = i;
      plates.forEach((plate, k) => {
        const alt = (plate.firstElementChild as HTMLImageElement).alt;
        plate.setAttribute("aria-label", k === i ? `View full screen: ${alt}` : `Show photo ${k + 1}: ${alt}`);
      });
    }

    /* ---- Slideshow: winds on its own while the gallery is on screen ---- */
    let onScreen = false;
    let holding = false;
    let timer = 0;
    function restartAutoplay() {
      window.clearInterval(timer);
      if (reduceMotion || !onScreen || holding || document.hidden) return;
      timer = window.setInterval(() => {
        target = Math.round(target) + 1;
        go();
      }, AUTOPLAY);
    }
    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        restartAutoplay();
      },
      { threshold: 0.3 },
    );
    visible.observe(stage);
    on(document, "visibilitychange", restartAutoplay);

    /* ---- Dragging: one swipe always moves exactly one photo ---- */
    let moved = false;
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let dragDx = 0;
    const clampOne = (value: number) => Math.max(-1, Math.min(1, value));

    on(stage, "pointerdown", ((event: PointerEvent) => {
      holding = true;
      restartAutoplay();
      moved = false;
      startX = lastX = event.clientX;
      startTarget = Math.round(target);
      lastTime = performance.now();
      velocity = 0;
      dragDx = 0;
      stage.toggleAttribute("data-grabbing", true);
    }) as EventListener);
    on(stage, "pointermove", ((event: PointerEvent) => {
      if (!holding) return;
      dragDx = event.clientX - startX;
      if (Math.abs(dragDx) > 4 && !moved) {
        moved = true;
        stage.setPointerCapture(event.pointerId);
      }
      if (!moved) return;
      target = startTarget + clampOne(-dragDx / plates[0].offsetWidth);
      const now = performance.now();
      if (now > lastTime) {
        velocity = (event.clientX - lastX) / (now - lastTime);
        lastX = event.clientX;
        lastTime = now;
      }
      go();
    }) as EventListener);
    const endDrag = () => {
      if (!holding) return;
      holding = false;
      stage.toggleAttribute("data-grabbing", false);
      if (moved) {
        const far = Math.abs(dragDx) > plates[0].offsetWidth * 0.15;
        const quick = Math.abs(velocity) > 0.35;
        const direction = far ? -Math.sign(dragDx) : quick ? -Math.sign(velocity) : 0;
        target = startTarget + direction;
        go();
      }
      restartAutoplay();
    };
    on(stage, "pointerup", endDrag);
    on(stage, "pointercancel", endDrag);
    on(window, "pointerup", endDrag);

    // Sideways trackpad scrolling: one photo per gesture. Up/down still scrolls the page.
    let wheelTotal = 0;
    let wheelLocked = false;
    let wheelTimer = 0;
    on(
      stage,
      "wheel",
      ((event: WheelEvent) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => {
          wheelTotal = 0;
          wheelLocked = false;
          restartAutoplay();
        }, 250);
        if (wheelLocked) return;
        wheelTotal += event.deltaX;
        if (Math.abs(wheelTotal) > 40) {
          wheelLocked = true;
          target = Math.round(target) + Math.sign(wheelTotal);
          go();
          window.clearInterval(timer);
        }
      }) as EventListener,
      { passive: false },
    );

    // Arrow keys, only while focus is inside the gallery.
    on(section, "keydown", ((event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("dialog")) return;
      if (event.key === "ArrowLeft") {
        target = Math.round(target) - 1;
        go();
        restartAutoplay();
        event.preventDefault();
      }
      if (event.key === "ArrowRight") {
        target = Math.round(target) + 1;
        go();
        restartAutoplay();
        event.preventDefault();
      }
    }) as EventListener);

    /* ---- Plates: a side plate winds to the centre; the centre plate opens full-screen ---- */
    const dialog = section.querySelector<HTMLDialogElement>("[data-lightbox]")!;
    const bigImage = dialog.querySelector<HTMLImageElement>("[data-lightbox-image]")!;
    let viewing = 0;
    function showBig(index: number) {
      viewing = (index + count) % count;
      const image = plates[viewing].firstElementChild as HTMLImageElement;
      bigImage.src = image.dataset.full!;
      bigImage.alt = image.alt;
    }

    plates.forEach((plate, i) => {
      on(plate, "click", () => {
        if (moved) return;
        const d = offset(i);
        if (Math.abs(d) < 0.5) {
          showBig(i);
          dialog.showModal();
          lenisRef.current?.stop();
          window.clearInterval(timer);
        } else {
          target = Math.round(pos + d);
          go();
          restartAutoplay();
        }
      });
    });

    on(dialog.querySelector<HTMLElement>("[data-lightbox-close]")!, "click", () => dialog.close());
    on(dialog.querySelector<HTMLElement>("[data-lightbox-prev]")!, "click", () => showBig(viewing - 1));
    on(dialog.querySelector<HTMLElement>("[data-lightbox-next]")!, "click", () => showBig(viewing + 1));
    on(dialog, "keydown", ((event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") showBig(viewing - 1);
      if (event.key === "ArrowRight") showBig(viewing + 1);
    }) as EventListener);
    on(dialog, "click", ((event: MouseEvent) => {
      if (event.target === dialog || event.target === dialog.firstElementChild) dialog.close();
    }) as EventListener);
    on(dialog, "close", () => {
      lenisRef.current?.start();
      target = Math.round(pos + offset(viewing));
      go();
      restartAutoplay();
    });

    // Only redo the layout when the width changes (phones fire resize as the address bar moves).
    let lastWidth = window.innerWidth;
    let resizeTimer = 0;
    on(window, "resize", () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        readSize();
        render();
      }, 120);
    });

    readSize();
    setCaption(0);
    render();

    return () => {
      cleanups.forEach((fn) => fn());
      preload.disconnect();
      visible.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} id="gallery" data-tone="2" className="overflow-hidden py-10 md:py-12 lg:py-20 2xl:py-24">
      <div className="wrap">
        <h2 className="text-center text-heading uppercase">Gallery</h2>
      </div>

      <div
        data-spool
        role="group"
        aria-label="Gallery, drag sideways to wind through the photos"
        className="relative mt-4 h-[19rem] cursor-grab touch-pan-y overflow-hidden select-none [perspective:1400px] data-grabbing:cursor-grabbing sm:h-[min(48vh,26rem)] sm:min-h-[280px] lg:h-[min(74vh,60rem)] lg:min-h-[24rem]"
      >
        {photos.map((p) => (
          <button
            key={p.file}
            type="button"
            data-plate
            data-group={p.group}
            className="absolute top-1/2 left-1/2 aspect-[16/10] w-[min(80vw,360px)] cursor-pointer rounded-lg [backface-visibility:hidden] [transform-style:preserve-3d] will-change-[transform,opacity] shadow-[0_22px_46px_-20px_rgb(0_0_0/0.7),0_2px_6px_rgb(0_0_0/0.25)] focus-visible:outline-offset-[6px] sm:w-[min(74vw,420px)] lg:w-[min(50vw,calc(64vh*1.6))]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- the coil decodes these itself (see preload above) */}
            <img
              src={`/images/gallery/${p.file}.webp`}
              data-full={`/images/${p.file}.jpg`}
              alt={p.alt}
              width={1240}
              height={775}
              loading="lazy"
              draggable={false}
              className="pointer-events-none size-full rounded-lg bg-surface object-cover"
            />
          </button>
        ))}
      </div>

      {/* Full-screen viewer: every photo sits in the same 16:9 frame */}
      <dialog data-lightbox aria-label="Photo viewer" className="m-auto max-h-none max-w-none bg-transparent p-0 text-moon backdrop:bg-night/95">
        <div className="flex h-svh w-screen flex-col items-center justify-center gap-6 px-4 md:px-24">
          <figure className="w-full max-w-[min(72rem,calc((100svh-12rem)*16/9))]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-lightbox-image src={`/images/${photos[0].file}.jpg`} alt={photos[0].alt} className="aspect-video w-full rounded-2xl bg-surface object-cover md:rounded-[2rem]" />
          </figure>
          <div className="flex gap-4 md:contents">
            <button type="button" data-lightbox-prev aria-label="Previous photo" className="grid size-12 place-items-center rounded-full border border-moon/30 bg-night/60 text-moon backdrop-blur-sm transition-colors hover:border-moon hover:bg-moon hover:text-night md:fixed md:top-1/2 md:left-6 md:size-14 md:-translate-y-1/2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" data-lightbox-next aria-label="Next photo" className="grid size-12 place-items-center rounded-full border border-moon/30 bg-night/60 text-moon backdrop-blur-sm transition-colors hover:border-moon hover:bg-moon hover:text-night md:fixed md:top-1/2 md:right-6 md:size-14 md:-translate-y-1/2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <button type="button" data-lightbox-close aria-label="Close" className="fixed top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-11 place-items-center rounded-full border border-moon/30 bg-night/60 text-moon backdrop-blur-sm transition-colors hover:border-moon hover:bg-moon hover:text-night md:right-6 md:size-12">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </dialog>
    </section>
  );
}
