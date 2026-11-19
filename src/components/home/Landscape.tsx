import Link from "next/link";
import ParallaxImage from "@/components/ParallaxImage";
import SectionHeading from "@/components/SectionHeading";
import Drift from "@/components/Drift";
import { buttonOutline } from "@/lib/ui";

// Mākena: a full-width landscape photo, then a tinted band with text on the left
// and a photo on the right that rises past the band's top edge.
export default function Landscape() {
  return (
    <section data-tone="2">
      <ParallaxImage src="/images/dusk-villa-sky.jpg" alt="Villa at dusk under a coloured sky" sizes="100vw" amount={11} className="h-[70svh] min-h-[24rem] md:h-[88svh]" />

      <div>
        <div className="wrap grid items-center gap-12 pb-20 md:pb-28 lg:grid-cols-12 lg:gap-16">
          <div className="pt-16 md:pt-24 lg:col-span-5 lg:col-start-2">
            <SectionHeading kicker="The community">A place that lets you slow down</SectionHeading>
            <p className="mt-6 max-w-lg text-moon/90 md:text-lg md:leading-[1.75]">
              From wide tree-lined streets to quiet courtyards and glistening pools, lorem ipsum dolor sit amet ensures your comfort every step of the way. Southfield is a gated community that honours privacy and takes to heart a responsibility to its neighbourhood.
            </p>
            <Link href="/about" className={`${buttonOutline} mt-9`}>Learn more</Link>
          </div>
          <Drift speed={0.25} className="lg:col-span-5 lg:col-start-8 lg:-mt-40">
            <ParallaxImage src="/images/twilight-tropical-villa.jpg" alt="Tropical villa and pool at twilight" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" />
          </Drift>
        </div>
      </div>
    </section>
  );
}
