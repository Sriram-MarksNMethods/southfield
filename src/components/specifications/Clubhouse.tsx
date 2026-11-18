"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import SectionHeading from "@/components/SectionHeading";

const floors = [
  { name: "Ground floor", text: "Swimming pool, banquet hall, lobby lounge and kids' pool.", src: "/images/night-resort-pool.jpg", alt: "Clubhouse pool lit among palms" },
  { name: "First floor", text: "Indoor games, a badminton court and an outdoor café.", src: "/images/night-pool-swing.jpg", alt: "Pool deck with a hanging chair" },
  { name: "Second floor", text: "Mini bowling alley, an activity room and a library.", src: "/images/interior-warm-lounge.jpg", alt: "Warm lounge with a fireplace" },
  { name: "Third floor", text: "Gym, yoga deck, spa, steam and sauna.", src: "/images/interior-dark-suite.jpg", alt: "Calm suite with warm shelf lights" },
  { name: "Terrace", text: "Sky lounge, open-air cinema and a terrace bar.", src: "/images/dusk-villa-trees.jpg", alt: "Glass terrace at dusk among trees" },
];

// Mākena "Moments you'll never forget": centred heading, a carousel with the
// next and previous photos peeking in at the sides, the name under the photo,
// and arrows with a progress line below.
export default function Clubhouse() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <section id="clubhouse" data-tone="3" className="section-y overflow-hidden">
      <div className="wrap text-center">
        <SectionHeading kicker="The clubhouse" className="whitespace-nowrap max-sm:text-[7vw]">Moments you&apos;ll never forget</SectionHeading>
        <p className="mx-auto mt-6 max-w-xl text-moon/90">A G+3 clubhouse with a terrace, where lorem ipsum meets the perfect blend of freedom and fun for families and friends.</p>
      </div>

      <Swiper
        modules={[Autoplay, Navigation]}
        onSwiper={setSwiper}
        onSlideChange={(s) => setIndex(s.realIndex)}
        loop
        centeredSlides
        speed={1000}
        autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        slidesPerView={1.25}
        spaceBetween={16}
        breakpoints={{ 768: { slidesPerView: 1.6, spaceBetween: 32 }, 1280: { slidesPerView: 1.9, spaceBetween: 48 } }}
        className="mt-14! md:mt-20!"
      >
        {floors.map((f, i) => (
          <SwiperSlide key={f.name}>
            <div className={`transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-45"}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1280px) 52vw, 80vw" className="object-cover" />
              </div>
              <div className={`mt-6 text-center transition-[opacity,translate] duration-700 ease-soft ${i === index ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                <h3 className="text-3xl md:text-4xl">{f.name}</h3>
                <p className="mx-auto mt-3 max-w-md text-moon/90">{f.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="wrap mt-10 flex items-center gap-6 md:mt-12">
        <div className="flex gap-2">
          <button type="button" aria-label="Previous floor" onClick={() => swiper?.slidePrev()} className="grid size-11 place-items-center rounded-[2px] border border-moon/30 transition-colors hover:border-lamp hover:text-lamp">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M16 10H4m0 0l5-5m-5 5l5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next floor" onClick={() => swiper?.slideNext()} className="grid size-11 place-items-center rounded-[2px] border border-moon/30 transition-colors hover:border-lamp hover:text-lamp">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 10h12m0 0l-5-5m5 5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div aria-hidden="true" className="relative h-px flex-1 bg-moon/15">
          <div className="absolute inset-y-0 left-0 bg-lamp transition-[width] duration-700 ease-soft" style={{ width: `${((index + 1) / floors.length) * 100}%` }} />
        </div>
        <span className="text-sm text-moon/90 tabular-nums">{String(index + 1).padStart(2, "0")} / {String(floors.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
