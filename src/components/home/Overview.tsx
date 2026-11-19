import SectionHeading from "@/components/SectionHeading";
import CountUp from "@/components/CountUp";

const stats = [
  { value: 24, suffix: "", label: "Acres" },
  { value: 120, suffix: "", label: "Villas with private pools" },
  { value: 520, suffix: "", prefix: "400 - ", label: "Sq. yd plots" },
];

// Mākena "Overview": the label + heading on the left, the paragraph and stats on
// the right. Text only: the wide photo above and the drifting photo pair below
// were removed 2026-11-19 ("too crowded"); the next section opens with a photo.
export default function Overview() {
  return (
    <section data-tone="1" className="section-y">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-20">
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
    </section>
  );
}
