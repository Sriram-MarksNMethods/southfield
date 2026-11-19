"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useEnquiry } from "./enquiry/EnquiryProvider";

/**
 * Phones/tablets: a call + enquire bar fixed to the bottom.
 * Desktop: a "Download brochure" pill that slides in once the hero is passed
 * and steps aside near the footer. On short screens (laptops at 125-150%
 * scaling) it shrinks to a round icon so it doesn't cover the content.
 */
export default function StickyActions() {
  const { openEnquiry } = useEnquiry();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.body.scrollHeight - 500;
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => openEnquiry("Brochure")}
        aria-label="Download brochure"
        className={`fixed right-6 bottom-6 z-30 hidden items-center gap-2 rounded-full bg-btn px-5 py-3 font-medium [@media(max-height:820px)]:p-3.5 text-on-btn shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)] transition-[translate,opacity] duration-500 ease-soft fill-btn hover:text-on-btn-fill lg:inline-flex ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M10 3v10m0 0l-4-4m4 4l4-4M4 16h12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="[@media(max-height:820px)]:sr-only">Download brochure</span>
      </button>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-moon/10 bg-night/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <a href={site.phoneHref} className="flex h-14 items-center justify-center gap-2 text-moon">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M6.6 3.5l1.7 3.4-1.6 1.3a9 9 0 004.9 4.9l1.3-1.6 3.4 1.7-.6 2.9c-6.6.4-12.4-5.4-12-12z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          Call us
        </a>
        <button type="button" onClick={() => openEnquiry("Site visit")} className="h-14 bg-btn font-medium text-on-btn">
          Enquire now
        </button>
      </div>
    </>
  );
}
