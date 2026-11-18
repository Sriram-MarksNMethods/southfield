import Image from "next/image";
import Link from "next/link";
import { buttonOutline, buttonSolid, eyebrow } from "@/lib/ui";

export default function NotFound() {
  return (
    <section data-tone="0" className="relative grid min-h-svh place-items-center overflow-hidden px-5 py-28 text-center">
      <Image src="/images/night-villa-lawn.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-night/80" />
      <div className="relative max-w-xl">
        <span className={eyebrow}>Page not found</span>
        <h1 className="mt-5 text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.05]">This path doesn&apos;t lead anywhere</h1>
        <p className="mt-5 text-moon/90">The page may have moved, or the link may be wrong.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonSolid}>Back to home</Link>
          <Link href="/contact" className={buttonOutline}>Contact us</Link>
        </div>
      </div>
    </section>
  );
}
