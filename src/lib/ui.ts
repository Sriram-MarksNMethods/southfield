// Shared looks, following Mākena (makenagolfandbeachclub.com): small square-cornered
// buttons with spaced capitals, and a small spaced label above each heading.
// Hover: colour pours in from where the cursor enters (see .fill-btn in globals.css).
// (A plain module, not "use client", so server components get the real strings.)
export const buttonSolid =
  "inline-flex items-center justify-center gap-2 rounded-[2px] bg-btn px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-on-btn uppercase fill-btn hover:text-on-btn-fill";
export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-[2px] border border-line/60 px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-line uppercase fill-btn hover:border-btn-fill hover:text-on-btn-fill";
export const eyebrow = "block font-sans text-[0.7rem] font-medium tracking-[0.28em] text-lamp uppercase";
