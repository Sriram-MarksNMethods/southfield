import SectionHeading from "./SectionHeading";

const faqs = [
  ["What makes Southfield lorem ipsum different?", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."],
  ["How well connected is Southfield to the city?", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident."],
  ["What sizes do the villas come in?", "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore."],
  ["Is Southfield registered with RERA?", "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."],
  ["How do I book a site visit?", "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Use the Enquire now button and our team will call you back."],
];

// Native <details name> accordion: one open at a time, no JavaScript needed.
export default function Faq() {
  return (
    <section data-tone="5" className="section-y">
      <div className="wrap">
        <div className="mx-auto max-w-5xl">
        <SectionHeading kicker="FAQs" className="text-center">Questions, answered</SectionHeading>
        <ul className="mt-12 border-t border-moon/20 md:mt-16">
          {faqs.map(([q, a], i) => (
            <li key={q} className="border-b border-moon/20">
              <details name="faq" open={i === 0} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-heading text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-[2px] border border-moon/30 text-lamp">
                    <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-500 ease-soft group-open:rotate-45"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </span>
                </summary>
                <p className="max-w-3xl pb-7 leading-[1.8] text-moon/90">{a}</p>
              </details>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
