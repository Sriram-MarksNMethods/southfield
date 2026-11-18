import ParallaxImage from "@/components/ParallaxImage";
import SectionHeading from "@/components/SectionHeading";
import Drift from "@/components/Drift";
import CountUp from "@/components/CountUp";

const stats = [
  { value: 24, suffix: "", label: "Acres" },
  { value: 120, suffix: "", label: "Villas with private pools" },
  { value: 520, suffix: "", prefix: "400 - ", label: "Sq. yd plots" },
];

// Mākena "Overview": a wide photo pushed to the right, then the label + heading on
// the left and the paragraph on the right. Two smaller photos below drift at
// different speeds, like Mākena's scattered photo pairs.
export default function Overview() {
  return (
    <section data-tone="1" className="pb-20 md:pb-32">
      <div className="pl-5 md:pl-[18vw]">
        <ParallaxImage src="/images/night-courtyard-pool.jpg" alt="Courtyard pool lit at night between villa wings" sizes="85vw" className="aspect-[4/3] md:aspect-[16/7]" />
      </div>

      <div className="wrap mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-16">
        <SectionHeading kicker="Overview" className="lg:col-span-6 lg:col-start-2">
          Private, family-friendly lorem living in Southfield
        </SectionHeading>
        <div className="lg:col-span-4 lg:col-start-8 lg:pt-12">
          <p className="text-moon/90 md:text-lg md:leading-[1.75]">
            A quiet villa community nestled on the edge of lorem ipsum, Southfield brings breathtaking gardens, wide streets, private pools and a clubhouse for every season. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-moon/15 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="text-xs leading-snug text-muted">{s.label}</dt>
                <dd className="font-heading text-2xl whitespace-nowrap text-lamp md:text-4xl">
                  {s.prefix}
                  <CountUp to={s.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="wrap mt-20 grid grid-cols-12 items-start gap-4 md:mt-28">
        <Drift speed={0.08} className="col-span-8 md:col-span-6 md:col-start-2">
          <ParallaxImage src="/images/night-villa-modern.jpg" alt="Modern villa with every window lit at night" sizes="50vw" className="aspect-[4/3]" />
        </Drift>
        <Drift speed={0.32} className="col-span-4 mt-32 md:col-span-3 md:col-start-10 md:mt-56">
          <ParallaxImage src="/images/night-garden-pool.jpg" alt="Garden pool among palms at night" sizes="25vw" className="aspect-[3/4]" />
        </Drift>
      </div>
    </section>
  );
}
