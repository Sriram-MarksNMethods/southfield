import Link from "next/link";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";

const label = "font-sans text-xs font-semibold tracking-[0.24em] text-moon uppercase";

// Mākena footer: a solid colour band, the logo on the left, link columns on the right.
export default function Footer() {
  return (
    <footer className="satin-olive pt-16 pb-28 text-moon/90 md:pt-24 lg:pb-12">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Southfield home" className="inline-block text-2xl text-moon">
            <Logo />
          </Link>
          <p className="mt-6 max-w-xs text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.</p>
        </div>
        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
          <div>
            <h2 className={label}>General</h2>
            <ul className="mt-5 grid gap-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}><Link href={item.href} className="transition-colors hover:text-lamp">{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={label}>Visit</h2>
            <p className="mt-5 text-sm">{site.siteAddress}</p>
            <h2 className={`${label} mt-8`}>Office</h2>
            <p className="mt-5 text-sm">{site.officeAddress}</p>
          </div>
          <div>
            <h2 className={label}>Contact</h2>
            <ul className="mt-5 grid gap-2.5 text-sm">
              <li><a href={site.phoneHref} className="transition-colors hover:text-lamp">{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="transition-colors hover:text-lamp">{site.email}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap mt-16 flex flex-wrap justify-between gap-4 border-t border-moon/15 pt-6 text-xs text-muted md:mt-24">
        <p>© 2026 Southfield. All rights reserved. {site.rera}</p>
        <Link href="/privacy-policy" className="transition-colors hover:text-moon">Privacy policy</Link>
      </div>
    </footer>
  );
}
