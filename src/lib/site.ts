// Everything a new developer needs to change site-wide lives here.
// All copy is lorem ipsum until the client sends real content.

export const site = {
  name: "Southfield",
  tagline: "Lorem ipsum villas in dolor sit, Amet",
  phone: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  email: "hello@southfield.example",
  rera: "RERA No. P00000000000",
  siteAddress: "Lorem ipsum 12, Dolor Sit Amet Road, Consectetur, 500000",
  officeAddress: "Office 4, Ipsum Towers, Adipiscing Elit, 500000",
  mapEmbed:
    "https://www.google.com/maps?q=17.385,78.4867&z=12&output=embed",
};

// photo = shown in the menu overlay while that link is hovered.
export const nav = [
  { href: "/", label: "Home", photo: "/images/night-villa-pool.jpg" },
  { href: "/about", label: "About us", photo: "/images/villa-garden.jpg" },
  { href: "/specifications", label: "Specifications", photo: "/images/interior-warm-lounge.jpg" },
  { href: "/blogs", label: "Blogs", photo: "/images/tropical-pool-deck.jpg" },
  { href: "/contact", label: "Contact", photo: "/images/twilight-tropical-villa.jpg" },
];

export const purposes = ["Site visit", "Brochure", "General enquiry"] as const;
export type Purpose = (typeof purposes)[number];
