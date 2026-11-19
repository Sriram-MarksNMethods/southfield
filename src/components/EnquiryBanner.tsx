import Link from "next/link";
import ParallaxImage from "./ParallaxImage";
import EnquiryButton from "./EnquiryButton";
import { buttonOutline, buttonSolid } from "@/lib/ui";

// Full-width closing banner used at the bottom of most pages.
export default function EnquiryBanner() {
  return (
    <section data-tone="1" className="on-photo px-3 pb-3 sm:px-4 md:px-6 md:pb-6 2xl:px-10">
      <ParallaxImage
        src="/images/night-villa-glass.jpg"
        alt="Villa with a glass gable lit at night"
        sizes="100vw"
        amount={10}
        className="grid min-h-[34rem] place-items-center rounded-[1.75rem] md:min-h-[44rem] md:rounded-[3rem]"
      >
        <div className="absolute inset-0 bg-night/55" />
        <div className="relative px-6 py-16 text-center">
          <h2 className="mx-auto max-w-[16ch] text-heading">A finer way of living awaits</h2>
          <p className="mx-auto mt-5 max-w-xl text-moon/90 md:text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Book a visit and walk through a show villa.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className={buttonSolid}>Book a site visit</Link>
            <EnquiryButton purpose="Brochure" className={buttonOutline}>Download brochure</EnquiryButton>
          </div>
        </div>
      </ParallaxImage>
    </section>
  );
}
