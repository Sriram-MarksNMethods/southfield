"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Purpose } from "@/lib/site";
import EnquiryPopup from "./EnquiryPopup";

type Ctx = { openEnquiry: (purpose?: Purpose) => void };
const EnquiryContext = createContext<Ctx>({ openEnquiry: () => {} });

/** Opens the enquiry pop-up from anywhere: `const { openEnquiry } = useEnquiry()`. */
export function useEnquiry() {
  return useContext(EnquiryContext);
}

const AUTO_OPEN_MS = 10_000;
const SEEN_KEY = "southfield-popup-seen";

export default function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The pop-up remembers which page it was opened on, so it closes by itself
  // when the visitor moves to another page (e.g. after submitting the form).
  const [openOn, setOpenOn] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<Purpose>("Site visit");
  const open = openOn === pathname;

  const openEnquiry = useCallback(
    (p: Purpose = "Site visit") => {
      setPurpose(p);
      setOpenOn(pathname);
    },
    [pathname],
  );
  const close = useCallback(() => setOpenOn(null), []);

  // Open once per visit, 10 seconds after the first page loads.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;
    const timer = window.setTimeout(() => {
      setOpenOn(window.location.pathname);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
    }, AUTO_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <EnquiryContext.Provider value={{ openEnquiry }}>
      {children}
      <EnquiryPopup open={open} purpose={purpose} onClose={close} />
    </EnquiryContext.Provider>
  );
}
