"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { formatDate, posts } from "@/lib/blogs";
import { eyebrow } from "@/lib/ui";

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

// Blog listing: the newest post as a large feature, the rest in a grid,
// with category filters above.
export default function BlogList() {
  const [category, setCategory] = useState("All");
  const [feature, ...rest] = posts;
  const shown = category === "All" ? rest : posts.filter((p) => p.category === category);

  return (
    <>
      {category === "All" && (
        <section data-tone="0" className="section-y pb-0!">
          <div className="wrap">
            <Link href={`/blogs/${feature.slug}`} className="group grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
              <div className="relative aspect-[4/3] overflow-hidden lg:col-span-7">
                <Image src={feature.image} alt={feature.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-105" />
              </div>
              <div className="lg:col-span-5">
                <span className={eyebrow}>Featured · {feature.category}</span>
                <h2 className="mt-5 text-[clamp(2rem,3.2vw,3.5rem)] leading-[1.1] transition-colors group-hover:text-lamp">{feature.title}</h2>
                <p className="mt-5 text-moon/90 md:text-lg">{feature.excerpt}</p>
                <p className="mt-6 text-sm text-muted">{formatDate(feature.date)} · {feature.readMinutes} min read</p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section data-tone="1" className="section-y">
        <div className="wrap">
          <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2 border-b border-moon/15 pb-6">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === category}
                onClick={() => setCategory(c)}
                className="rounded-[2px] border border-moon/25 px-4 py-2 text-[0.7rem] tracking-[0.2em] text-moon/80 uppercase transition-colors hover:border-moon hover:text-moon aria-pressed:border-btn aria-pressed:bg-btn aria-pressed:text-on-btn"
              >
                {c}
              </button>
            ))}
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.li key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 0.8, 0.16, 1] }}>
                  <Link href={`/blogs/${p.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-105" />
                    </div>
                    <p className="mt-5 text-[0.7rem] tracking-[0.28em] text-lamp uppercase">{p.category}</p>
                    <h3 className="mt-3 text-2xl leading-snug transition-colors group-hover:text-lamp">{p.title}</h3>
                    <p className="mt-3 text-sm text-muted">{formatDate(p.date)} · {p.readMinutes} min read</p>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </section>
    </>
  );
}
