import ParallaxImage from "@/components/ParallaxImage";
import SectionHeading from "@/components/SectionHeading";
import EnquiryButton from "@/components/EnquiryButton";
import { buttonSolid } from "@/lib/ui";

const types = [
  { name: "East facing", size: "400 sq. yd", area: "4,800 sq. ft", beds: "4 BHK + home office" },
  { name: "West facing", size: "450 sq. yd", area: "5,200 sq. ft", beds: "4 BHK + family lounge" },
  { name: "Corner villa", size: "520 sq. yd", area: "5,900 sq. ft", beds: "4 BHK + guest suite" },
];

// Floor plans stay inside the brochure (as on Sage): the page lists the villa
// types, and the button opens the enquiry pop-up set to "Brochure".
export default function FloorPlans() {
  return (
    <section id="floor-plans" data-tone="0" className="section-y">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading kicker="Floor plans">Three villa types, one standard</SectionHeading>
          <ul className="mt-10 border-t border-moon/15">
            {types.map((t) => (
              <li key={t.name} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-moon/15 py-5">
                <span className="font-heading text-2xl">{t.name}</span>
                <span className="self-end text-right text-lamp tabular-nums">{t.size}</span>
                <span className="text-sm text-muted">{t.beds}</span>
                <span className="text-right text-sm text-muted tabular-nums">{t.area}</span>
              </li>
            ))}
          </ul>
          <EnquiryButton purpose="Brochure" className={`${buttonSolid} mt-10`}>Request floor plans</EnquiryButton>
        </div>
        <div className="relative lg:col-span-6 lg:col-start-7">
          <ParallaxImage src="/images/interior-dark-suite.jpg" alt="Bedroom suite with warm shelf lighting" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/5]" />
        </div>
      </div>
    </section>
  );
}
