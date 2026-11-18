"use client";

import { useEffect } from "react";

/**
 * Tells every .fill-btn where the cursor came in (or went out), so the hover
 * fill grows from that point. One listener for the whole page.
 */
export default function ButtonFill() {
  useEffect(() => {
    const place = (event: PointerEvent, entering: boolean) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>(".fill-btn");
      if (!button) return;
      // ignore moves between the button's own children
      const other = event.relatedTarget as Node | null;
      if (other && button.contains(other)) return;
      const r = button.getBoundingClientRect();
      button.style.setProperty("--x", `${event.clientX - r.left}px`);
      button.style.setProperty("--y", `${event.clientY - r.top}px`);
      if (entering) button.style.setProperty("--d", `${Math.hypot(r.width, r.height) * 2.2}px`);
    };
    const over = (e: PointerEvent) => place(e, true);
    const out = (e: PointerEvent) => place(e, false);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);
  return null;
}
