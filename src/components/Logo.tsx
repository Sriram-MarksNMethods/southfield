// Dummy logo until the client's real one arrives: a low sun over three field
// lines, next to the wordmark.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-[1.6em] w-[1.6em]">
        <path d="M8 24a12 12 0 0 1 24 0" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4 24h32M9 29h22M14 34h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="24" r="4.5" className="fill-lamp" />
      </svg>
      <span className="font-heading text-[1.35em] leading-none tracking-wide">Southfield</span>
    </span>
  );
}
