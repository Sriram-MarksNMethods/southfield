"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";
import EnquiryButton from "./EnquiryButton";
import { buttonOutline, buttonSolid } from "@/lib/ui";
import { useLenis } from "./SmoothScroll";

/**
 * Mākena-style header: "Menu" on the left, the logo in the centre, an outlined
 * enquiry button on the right. See-through over the hero, darkens once you
 * scroll, hides while scrolling down and comes back when scrolling up.
 */
export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the menu is open (menu links close it themselves).
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenis]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,translate] duration-500 ease-soft ${
          solid ? "bg-night/85 backdrop-blur-md" : ""
        } ${hidden && !menuOpen ? "-translate-y-full" : ""}`}
      >
        <div className="wrap grid h-18 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-22">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            className="group inline-flex items-center gap-3 justify-self-start text-[0.7rem] tracking-[0.28em] text-moon uppercase"
          >
            <span className="grid size-9 place-items-center rounded-[2px] border border-moon/50 transition-colors group-hover:border-lamp group-hover:text-lamp">
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 7h12M4 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </span>
            <span className="max-sm:sr-only">Menu</span>
          </button>

          <Link href="/" aria-label="Southfield home" className="text-moon">
            <Logo />
          </Link>

          <EnquiryButton className={`${buttonOutline} justify-self-end px-5 py-2.5 max-sm:hidden`}>Enquire now</EnquiryButton>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-deep pt-[env(safe-area-inset-top)]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            data-lenis-prevent
          >
            <div className="wrap grid h-18 grid-cols-[1fr_auto_1fr] items-center md:h-22">
              <button
                type="button"
                autoFocus
                onClick={() => setMenuOpen(false)}
                className="group inline-flex items-center gap-3 justify-self-start text-[0.7rem] tracking-[0.28em] text-moon uppercase"
              >
                <span className="grid size-9 place-items-center rounded-[2px] border border-moon/50 transition-colors group-hover:border-lamp group-hover:text-lamp">
                  <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                </span>
                <span className="max-sm:sr-only">Close</span>
              </button>
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Southfield home">
                <Logo />
              </Link>
            </div>
            <nav aria-label="Menu" className="wrap flex flex-1 flex-col justify-center">
              <ul className="grid gap-1 md:gap-2">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.7, ease: [0.22, 0.8, 0.16, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="font-heading text-5xl leading-tight text-moon transition-colors hover:text-lamp aria-[current=page]:text-lamp md:text-7xl"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="wrap flex flex-wrap items-center justify-between gap-4 pb-[calc(2rem+env(safe-area-inset-bottom))] text-moon/90">
              <a href={site.phoneHref} className="hover:text-lamp">{site.phone}</a>
              <EnquiryButton purpose="Brochure" className={buttonSolid}>Download brochure</EnquiryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
