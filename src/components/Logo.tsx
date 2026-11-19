// Client's SouthField logos, exactly as supplied:
// - "block": olive wordmark on the cream block (from Southfield-Logo-new.jpg).
// - "light": cream wordmark on transparent, for dark solid backgrounds
//   (from Southfield-Logo-for-dark-bg.png).
// Pass the height in className (e.g. h-10); defaults to 3.4em.
const logos = {
  block: { src: "/images/logo-southfield-cream.png", width: 1200, height: 450 },
  light: { src: "/images/logo-southfield-dark-bg.png", width: 1200, height: 357 },
};

export default function Logo({ variant = "light", className = "" }: { variant?: keyof typeof logos; className?: string }) {
  const logo = logos[variant];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo.src}
      alt="SouthField, Globus South"
      width={logo.width}
      height={logo.height}
      className={`inline-block w-auto align-middle ${className || "h-[3.4em]"}`}
    />
  );
}
