import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { buttonOutline, buttonSolid } from "@/lib/ui";
import BrochureAutoDownload from "./BrochureAutoDownload";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

// Copied from Sage's thank-you page: the villa full-screen behind a dark veil,
// a drawn tick, and a brochure download (automatic after a brochure request).
export default function ThankYouPage() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden px-5 py-28">
      <Image src="/images/night-villa-warm.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-deep/85" />

      <div className="relative mx-auto max-w-2xl text-center">
        <svg viewBox="0 0 64 64" aria-hidden="true" className="mx-auto size-20 text-lamp">
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" className="[stroke-dasharray:183] [stroke-dashoffset:183] animate-[draw_1s_var(--ease-soft)_forwards]" />
          <path d="M20 33l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="[stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_0.6s_var(--ease-soft)_0.7s_forwards]" />
        </svg>
        <h1 className="mt-8 text-[clamp(3rem,8vw,6rem)] leading-none">Thank you</h1>
        <p className="mt-6 text-lg text-moon/90">Lorem ipsum dolor sit amet. Our team will call you shortly to consectetur adipiscing elit.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="/downloads/southfield-brochure.pdf" download className={buttonSolid}>Download brochure</a>
          <Link href="/" className={buttonOutline}>Back to home</Link>
        </div>
        <p className="mt-8 text-moon/90">Need us sooner? <a href={site.phoneHref} className="text-lamp underline underline-offset-4">Call {site.phone}</a></p>
      </div>

      <Suspense>
        <BrochureAutoDownload />
      </Suspense>
    </section>
  );
}
