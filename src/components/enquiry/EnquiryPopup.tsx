"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Purpose } from "@/lib/site";
import { useLenis } from "@/components/SmoothScroll";
import EnquiryForm from "./EnquiryForm";

export default function EnquiryPopup({
  open,
  purpose,
  onClose,
}: {
  open: boolean;
  purpose: Purpose;
  onClose: () => void;
}) {
  const lenis = useLenis();

  // Escape closes it; the page behind doesn't scroll while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose, lenis]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-night/70 p-3 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            className="grid max-h-[94svh] w-full max-w-[58rem] overflow-y-auto rounded-[1.75rem] bg-surface ring-1 ring-moon/10 md:grid-cols-[1fr_1.3fr]"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 0.8, 0.16, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative hidden min-h-full md:block">
              <Image src="/images/night-villa-pool.jpg" alt="" fill sizes="24rem" className="object-cover" />
            </div>
            <div className="relative p-6 md:p-9">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-moon/80 transition-colors hover:bg-moon/10 hover:text-moon"
              >
                <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
              <h2 id="popup-title" className="pr-10 text-3xl leading-tight md:text-4xl">Lorem ipsum dolor sit amet?</h2>
              <p className="mt-3 mb-6 text-moon/90">Consectetur adipiscing elit. Leave your details and our team will call you back.</p>
              <EnquiryForm key={purpose} defaultPurpose={purpose} idPrefix="popup" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
