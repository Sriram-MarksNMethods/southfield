import SectionHeading from "@/components/SectionHeading";

const specs = [
  ["Structure", "RCC framed structure designed for seismic zone lorem ipsum, dolor sit amet consectetur."],
  ["Walls", "Solid concrete blocks, 8\" outer and 4\" inner walls, adipiscing elit sed do eiusmod."],
  ["Flooring", "Imported marble in living and dining, wooden-finish tiles in bedrooms, tempor incididunt."],
  ["Kitchen", "Granite platform with stainless steel sink, provision for chimney and water purifier."],
  ["Bathrooms", "Premium sanitaryware and CP fittings, anti-skid tiles, ut labore et dolore magna aliqua."],
  ["Doors", "Teak wood main door with designer hardware; engineered wood internal doors."],
  ["Windows", "UPVC sliding windows with toughened glass and mosquito mesh, ut enim ad minim veniam."],
  ["Painting", "Weatherproof exterior emulsion; smooth acrylic emulsion inside, quis nostrud exercitation."],
  ["Electrical", "Concealed copper wiring with modular switches, provision for AC in all rooms."],
  ["Plumbing", "CPVC and UPVC pipes for water supply and drainage, duis aute irure dolor."],
  ["Lift", "Provision for a private home lift, in reprehenderit in voluptate velit esse."],
  ["Power backup", "100% DG backup for common areas and lorem kVA per villa, cillum dolore eu fugiat."],
  ["Security", "Gated community with CCTV, video door phone and 24x7 manned security."],
  ["Water", "Underground sump, overhead tank and water treatment plant, excepteur sint occaecat."],
  ["Landscaping", "Avenue plantation, landscaped parks and courtyards, sunt in culpa qui officia."],
];

// Two equal columns. With an odd number of specs, the last one sits below them,
// across both columns.
const half = Math.floor(specs.length / 2);
const columns = [specs.slice(0, half), specs.slice(half, half * 2)];
const last = specs.length % 2 ? specs[specs.length - 1] : null;

function SpecItem({ name, text }: { name: string; text: string }) {
  return (
    <li className="border-b border-moon/20">
      <details name="spec" className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading text-xl transition-colors hover:text-lamp md:py-6 md:text-2xl [&::-webkit-details-marker]:hidden">
          {name}
          <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-[2px] border border-moon/30 text-lamp">
            <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-500 ease-soft group-open:rotate-45"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </span>
        </summary>
        <p className="max-w-2xl pb-6 leading-[1.8] text-moon/90">{text}</p>
      </details>
    </li>
  );
}

// Sage's "Project specifications" as an accordion: all closed to start, one
// open at a time (native <details name>, so it works without JavaScript).
export default function SpecList() {
  return (
    <section id="specifications" data-tone="1" className="section-y">
      <div className="wrap">
        <div className="text-center">
          <SectionHeading kicker="Specifications" className="whitespace-nowrap max-sm:text-[6.4vw]">Built to last, finished to delight</SectionHeading>
          <p className="mx-auto mt-6 max-w-xl text-moon/90">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Every villa is built with the same care, from the frame to the fittings.</p>
        </div>

        {/* Two columns; still one item open at a time across both (same details name). */}
        <div className="mt-12 grid items-start gap-x-12 md:mt-16 md:grid-cols-2">
          {columns.map((column, c) => (
            <ul key={c} className={`border-t border-moon/20 ${c === 1 ? "max-md:border-t-0" : ""}`}>
              {column.map(([name, text]) => (
                <SpecItem key={name} name={name} text={text} />
              ))}
            </ul>
          ))}
          {last && (
            <ul className="md:col-span-2">
              <SpecItem name={last[0]} text={last[1]} />
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
