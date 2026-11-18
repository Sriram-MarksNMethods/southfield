import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, posts } from "@/lib/blogs";
import { eyebrow } from "@/lib/ui";
import EnquiryBanner from "@/components/EnquiryBanner";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blogs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: PageProps<"/blogs/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article data-tone="0">
        <header className="wrap pt-36 md:pt-44">
          <Link href="/blogs" className="text-[0.7rem] tracking-[0.28em] text-moon/80 uppercase underline-offset-4 hover:underline">← All blogs</Link>
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <span className={eyebrow}>{post.category}</span>
            <h1 className="mt-5 text-[clamp(2.4rem,4.6vw,4.75rem)] leading-[1.08]">{post.title}</h1>
            <p className="mt-6 text-sm text-muted">{formatDate(post.date)} · {post.readMinutes} min read</p>
          </div>
        </header>

        <div className="wrap mt-12 md:mt-16">
          <div className="relative mx-auto aspect-[16/9] max-w-[90rem] overflow-hidden">
            <Image src={post.image} alt={post.alt} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>

        <div className="wrap section-y">
          <div className="mx-auto max-w-[42rem]">
            <p className="font-heading text-2xl leading-[1.45] md:text-3xl">{post.excerpt}</p>
            {post.body.map((block, i) => (
              <div key={i} className="mt-8">
                {block.heading && <h2 className="mb-4 text-3xl">{block.heading}</h2>}
                <p className="text-lg leading-[1.8] text-moon/90">{block.text}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <section data-tone="1" className="section-y pt-0!">
        <div className="wrap">
          <h2 className="border-t border-moon/15 pt-12 text-[clamp(1.8rem,2.8vw,3rem)]">Keep reading</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/blogs/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={p.image} alt={p.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-soft group-hover:scale-105" />
                  </div>
                  <p className="mt-4 text-[0.7rem] tracking-[0.28em] text-lamp uppercase">{p.category}</p>
                  <h3 className="mt-2 text-2xl leading-snug transition-colors group-hover:text-lamp">{p.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EnquiryBanner />
    </>
  );
}
