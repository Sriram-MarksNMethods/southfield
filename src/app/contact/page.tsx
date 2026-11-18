import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import EnquiryForm from "@/components/enquiry/EnquiryForm";
import DriveTimes from "@/components/DriveTimes";
import { site } from "@/lib/site";
import { eyebrow } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit Southfield, call us, or leave your details and we'll call you back.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero label="Contact" title="Come and see Southfield" text="Lorem ipsum dolor sit amet: book a site visit, or ask us anything." src="/images/night-villa-stars.jpg" alt="Villa under a starry sky" />

      {/* Form + details */}
      <section data-tone="5" className="section-y">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading kicker="Enquire">Leave your details</SectionHeading>
            <p className="mt-5 mb-10 max-w-lg text-moon/90">Our team will call you back within one working day, consectetur adipiscing elit.</p>
            <EnquiryForm idPrefix="contact" variant="full" />
          </div>
          <dl className="grid content-start gap-8 border-t border-moon/15 pt-8 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <div>
              <dt className={eyebrow}>Call</dt>
              <dd className="mt-3 font-heading text-2xl"><a href={site.phoneHref} className="hover:text-lamp">{site.phone}</a></dd>
            </div>
            <div>
              <dt className={eyebrow}>Email</dt>
              <dd className="mt-3"><a href={`mailto:${site.email}`} className="hover:text-lamp">{site.email}</a></dd>
            </div>
            <div>
              <dt className={eyebrow}>Site address</dt>
              <dd className="mt-3 text-moon/90">{site.siteAddress}</dd>
            </div>
            <div>
              <dt className={eyebrow}>Office address</dt>
              <dd className="mt-3 text-moon/90">{site.officeAddress}</dd>
            </div>
            <div>
              <dt className={eyebrow}>Site visits</dt>
              <dd className="mt-3 text-moon/90">Every day, 10 am to 7 pm</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Location: map + drive times */}
      <section id="location" data-tone="2" className="section-y">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-5">
            <SectionHeading kicker="Location">Positioned for a better way of living</SectionHeading>
            <div className="mt-10">
              <DriveTimes />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface md:aspect-[4/3]">
              <iframe
                title="Southfield on Google Maps"
                src={site.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 [filter:grayscale(0.4)_contrast(1.05)]"
              />
            </div>
            <a href="https://maps.google.com/?q=17.385,78.4867" target="_blank" rel="noopener" className="mt-4 inline-block text-[0.7rem] tracking-[0.28em] text-lamp uppercase underline-offset-4 hover:underline">Open in Google Maps</a>
          </div>
        </div>
      </section>
    </>
  );
}
