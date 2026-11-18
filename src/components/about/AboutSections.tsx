import Image from "next/image";
import ParallaxImage from "@/components/ParallaxImage";
import SectionHeading from "@/components/SectionHeading";
import Drift from "@/components/Drift";
import CountUp from "@/components/CountUp";
import { eyebrow } from "@/lib/ui";

// About: the story, the numbers, the developer and what they stand for.

export function AboutStory() {
  return (
    <section data-tone="0" className="section-y">
      <div className="wrap">
        <p className="mx-auto max-w-[36ch] text-center font-heading text-[clamp(1.5rem,2.4vw,2.6rem)] leading-[1.35]">
          Southfield began with one lorem ipsum idea: a villa should feel like a retreat the moment you turn in at the gate, consectetur adipiscing elit.
        </p>
      </div>
      <div className="wrap mt-16 grid grid-cols-12 items-start gap-4 md:mt-24">
        <Drift speed={0.08} className="col-span-10 md:col-span-5 md:col-start-2">
          <ParallaxImage src="/images/night-villa-modern.jpg" alt="Modern villa with every window lit at night" sizes="45vw" className="aspect-[4/5]" />
        </Drift>
        <div className="col-span-12 mt-12 md:col-span-4 md:col-start-8 md:mt-40">
          <span className={eyebrow}>Our story</span>
          <p className="mt-5 text-moon/90 md:text-lg md:leading-[1.75]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <Drift speed={0.3} className="mt-10 ml-auto w-2/3 md:ml-0 md:w-auto">
            <ParallaxImage src="/images/night-pool-swing.jpg" alt="Pool deck with a hanging chair at night" sizes="30vw" className="aspect-[4/3]" />
          </Drift>
        </div>
      </div>
    </section>
  );
}

const numbers = [
  { value: 18, suffix: "+", label: "Years building homes" },
  { value: 24, suffix: "", label: "Projects delivered" },
  { value: 3200, suffix: "+", label: "Families moved in" },
  { value: 6, suffix: "M", label: "Sq. ft delivered" },
];

export function AboutNumbers() {
  return (
    <section data-tone="1" className="section-y">
      <div className="wrap">
        <dl className="grid grid-cols-2 gap-y-12 border-y border-moon/15 py-12 md:grid-cols-4 md:py-16">
          {numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse items-center gap-2 text-center">
              <dt className="text-sm text-muted">{n.label}</dt>
              <dd className="font-heading text-5xl text-lamp md:text-6xl">
                <CountUp to={n.value} />
                {n.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function AboutDeveloper() {
  return (
    <section data-tone="3" className="section-y">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <ParallaxImage src="/images/interior-wood-bedroom.jpg" alt="Bedroom with a timber wall and a crystal ring light" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3]" />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SectionHeading kicker="The developer">A vision built into every detail</SectionHeading>
          <p className="mt-6 text-moon/90 md:text-lg md:leading-[1.75]">
            Lorem Ipsum Developers has spent nearly two decades building homes across the city, duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="mt-4 text-moon/90">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </section>
  );
}

const values = [
  { title: "Built honestly", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor." },
  { title: "Designed for living", text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip." },
  { title: "Delivered on time", text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore." },
];

export function AboutValues() {
  return (
    <section data-tone="3" className="pb-20 md:pb-32">
      <div className="wrap grid gap-10 md:grid-cols-3 md:gap-8">
        {values.map((v) => (
          <div key={v.title} className="border-t border-moon/15 pt-8">
            <h3 className="text-3xl">{v.title}</h3>
            <p className="mt-3 text-moon/90">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const updates = [
  { month: "November 2026", text: "Villa block A: roof slab complete.", src: "/images/night-villa-glass.jpg", alt: "Villa with a glass gable" },
  { month: "October 2026", text: "Clubhouse: third floor in progress.", src: "/images/night-resort-pool.jpg", alt: "Clubhouse pool" },
  { month: "September 2026", text: "Landscaping: main avenue planted.", src: "/images/night-garden-pool.jpg", alt: "Garden pool among palms" },
];

export function ConstructionUpdates() {
  return (
    <section data-tone="2" className="section-y">
      <div className="wrap">
        <SectionHeading kicker="Construction update" className="max-w-[18ch]">Lorem ipsum, month by month</SectionHeading>
        <ul className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {updates.map((u) => (
            <li key={u.month}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={u.src} alt={u.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 text-[0.7rem] tracking-[0.28em] text-lamp uppercase">{u.month}</p>
              <p className="mt-2 text-moon/90">{u.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
