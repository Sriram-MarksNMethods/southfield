"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";
import EnquiryButton from "./EnquiryButton";
import { buttonOutline, buttonSolid } from "@/lib/ui";
import { useLenis } from "./SmoothScroll";

const menuLabel = "font-sans text-xs font-semibold tracking-[0.24em] text-moon uppercase";

/**
 * Header: the logo on the left, an outlined enquiry button + "Menu" on the
 * right. The menu overlay has the links on the left and a contact panel on the right. See-through over the hero, darkens once you
 * scroll, hides while scrolling down and comes back when scrolling up.
 */
export default function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Menu hover photo: which link is hovered, and the photo box's offset so it
  // sits level with that link.
  const [hovered, setHovered] = useState<string | null>(null);
  const [photoY, setPhotoY] = useState(0);
  const showPhoto = (href: string, link: HTMLElement) => {
    const li = link.parentElement!;
    setPhotoY(li.offsetTop + li.offsetHeight / 2 - 88); // 88 = half of the 176px box
    setHovered(href);
  };

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
          solid ? "bg-deep/90 backdrop-blur-md" : ""
        } ${hidden && !menuOpen ? "-translate-y-full" : ""}`}
      >
        {/* Logo small on the left; Enquire + Menu on the right. */}
        <div className="wrap flex h-18 items-center justify-between gap-4 md:h-22">
          <Link href="/" aria-label="Southfield home" className="text-moon">
            <Logo className="h-9 md:h-11" />
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/contact" className={`${buttonOutline} px-5 py-2.5 max-sm:hidden`}>Enquire now</Link>
            <button
              type="button"
              onClick={() => { setHovered(null); setMenuOpen(true); }}
              aria-expanded={menuOpen}
              className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.28em] text-moon uppercase"
            >
              <span className="grid size-9 place-items-center rounded-[2px] border border-moon/50 transition-colors group-hover:border-lamp group-hover:text-lamp">
                <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 7h12M4 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </span>
              <span className="max-sm:sr-only">Menu</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col satin-olive pt-[env(safe-area-inset-top)]"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            data-lenis-prevent
          >
            <div className="wrap flex h-18 items-center justify-between gap-4 md:h-22">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Southfield home">
                <Logo className="h-9 md:h-11" />
              </Link>
              <button
                type="button"
                autoFocus
                onClick={() => setMenuOpen(false)}
                className="group inline-flex items-center gap-3 text-[0.7rem] tracking-[0.28em] text-moon uppercase"
              >
                <span className="grid size-9 place-items-center rounded-[2px] border border-moon/50 transition-colors group-hover:border-lamp group-hover:text-lamp">
                  <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                </span>
                <span className="max-sm:sr-only">Close</span>
              </button>
            </div>
            {/* Links on the left; contact panel on the right. */}
            <div className="wrap grid flex-1 content-center gap-12 overflow-y-auto py-10 lg:grid-cols-12 lg:gap-10">
              <nav aria-label="Menu" className="relative lg:col-span-7">
                <ul className="grid gap-1 md:gap-2" onMouseLeave={() => setHovered(null)}>
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
                        onMouseEnter={(e) => showPhoto(item.href, e.currentTarget)}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className="font-heading text-5xl leading-tight text-moon transition-colors hover:text-lamp aria-[current=page]:text-lamp md:text-7xl"
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* sidthailand.com-style hover photo: hidden until a link is hovered, then a
                    small square wipes up from the bottom (zooming 1.2 -> 1) beside that link
                    and glides to whichever link you move to. Mouse only (lg and up). */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-[25rem] hidden size-44 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:block"
                  style={{ transform: `translateY(${photoY}px)` }}
                >
                  {nav.map((item, i) => {
                    const shown = item.href === hovered;
                    return (
                      <div
                        key={item.href}
                        className="absolute inset-0 overflow-hidden transition-[clip-path,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ zIndex: i, clipPath: shown ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)", scale: shown ? "1" : "1.2" }}
                      >
                        <Image src={item.photo} alt="" fill sizes="176px" className="object-cover" />
                      </div>
                    );
                  })}
                </div>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 0.8, 0.16, 1] }}
                className="grid content-center gap-7 border-moon/20 pb-[env(safe-area-inset-bottom)] text-moon/90 lg:col-span-4 lg:col-start-9 lg:border-l lg:pl-12"
              >
                <div>
                  <p className={menuLabel}>Visit</p>
                  <p className="mt-2 max-w-xs">{site.siteAddress}</p>
                </div>
                <div>
                  <p className={menuLabel}>Call</p>
                  <a href={site.phoneHref} className="mt-2 inline-block transition-colors hover:text-lamp">{site.phone}</a>
                </div>
                <div>
                  <p className={menuLabel}>Email</p>
                  <a href={`mailto:${site.email}`} className="mt-2 inline-block transition-colors hover:text-lamp">{site.email}</a>
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link href="/contact" onClick={() => setMenuOpen(false)} className={buttonSolid}>Book a site visit</Link>
                  <EnquiryButton purpose="Brochure" className={buttonOutline}>Download brochure</EnquiryButton>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
