// Shared looks, following Mākena (makenagolfandbeachclub.com): small square-cornered
// buttons with spaced capitals, and a small spaced label above each heading.
// Hover: colour pours in from where the cursor enters (see .fill-btn in globals.css).
// (A plain module, not "use client", so server components get the real strings.)
export const buttonSolid =
  "inline-flex items-center justify-center gap-2 rounded-[2px] bg-lamp px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-night uppercase fill-btn [--fill:var(--color-moon)]";
export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-[2px] border border-lamp/70 px-7 py-3.5 text-xs font-medium tracking-[0.2em] text-lamp uppercase fill-btn [--fill:var(--color-lamp)] hover:border-lamp hover:text-night";
export const eyebrow = "block font-sans text-[0.7rem] font-medium tracking-[0.28em] text-lamp uppercase";
