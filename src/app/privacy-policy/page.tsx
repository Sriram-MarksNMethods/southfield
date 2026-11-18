import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { eyebrow } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Southfield collects and uses your information.",
};

// Same structure as Sage's privacy page (a contents list beside the text).
// Every word is lorem ipsum: the real policy needs the client's (or a lawyer's) wording.
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.";
const lorem2 =
  "Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.";

const sections = [
  { id: "who-we-are", title: "Who we are" },
  { id: "what-we-collect", title: "What we collect" },
  { id: "how-we-use-it", title: "How we use it" },
  { id: "sharing", title: "Sharing" },
  { id: "other-services", title: "Other services this site uses" },
  { id: "cookies", title: "Cookies and storage" },
  { id: "your-choices", title: "Your choices" },
  { id: "keeping", title: "How long we keep it" },
  { id: "children", title: "Children" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyPolicyPage() {
  return (
    <section data-tone="5" className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="wrap">
        <span className={eyebrow}>Legal</span>
        <h1 className="mt-5 text-[clamp(2.6rem,5vw,5rem)] leading-[1.05]">Privacy policy</h1>
        <p className="mt-4 text-sm text-muted">Last updated: 18 November 2026</p>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <nav aria-label="On this page" className="lg:col-span-3">
            <ol className="grid gap-2 border-l border-moon/15 pl-5 text-sm lg:sticky lg:top-28">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-moon/80 transition-colors hover:text-lamp">{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-[42rem] lg:col-span-8 lg:col-start-5">
            {sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-28 border-t border-moon/15 py-10 first:border-t-0 first:pt-0">
                <h2 className="text-3xl">{s.title}</h2>
                <p className="mt-4 leading-[1.8] text-moon/90">{lorem}</p>
                {s.id === "contact" ? (
                  <p className="mt-4 leading-[1.8] text-moon/90">
                    Write to us at <a href={`mailto:${site.email}`} className="text-lamp underline underline-offset-4">{site.email}</a>, call <a href={site.phoneHref} className="text-lamp underline underline-offset-4">{site.phone}</a>, or visit {site.officeAddress}.
                  </p>
                ) : (
                  <p className="mt-4 leading-[1.8] text-moon/90">{lorem2}</p>
                )}
              </div>
            ))}
            <Link href="/" className="mt-6 inline-block text-[0.7rem] tracking-[0.28em] text-lamp uppercase underline-offset-4 hover:underline">← Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
