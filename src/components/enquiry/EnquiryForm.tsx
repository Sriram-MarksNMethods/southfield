"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { purposes, type Purpose } from "@/lib/site";

type State = "idle" | "sending" | "sent";

const field =
  "w-full rounded-xl border border-moon/25 bg-moon/[0.06] px-4 py-3 text-moon placeholder:text-moon/55 transition-colors focus:border-pool focus:outline-none";

const purposeLabels: Record<Purpose, string> = {
  "Site visit": "Book a site visit",
  Brochure: "Get the brochure",
  "General enquiry": "Ask a question",
};

// Contact-page field: small label above, open input, one underline that draws
// in gold from the left when the field is focused.
function UnderlineField({
  id,
  label,
  multiline = false,
  required = true,
  className = "",
  ...input
}: {
  id: string;
  label: string;
  multiline?: boolean;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const control = "peer w-full bg-transparent pt-2 pb-3 text-lg text-moon placeholder:text-moon/35 focus:outline-none md:text-xl";
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="text-[0.65rem] font-medium tracking-[0.28em] text-lamp uppercase">{label}</label>
      {multiline ? (
        <textarea id={id} name={input.name} rows={3} required={required} placeholder="Lorem ipsum dolor sit amet…" className={`${control} resize-none`} />
      ) : (
        <input id={id} required={required} className={control} {...input} />
      )}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-moon/25" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lamp transition-transform duration-700 ease-soft peer-focus:scale-x-100" />
    </div>
  );
}

/**
 * Front-end only for now: no lead backend yet. Submit shows Sage's three
 * button states (idle, sending, sent), then a circle wipes out from the button
 * and the visitor lands on /thank-you.
 */
export default function EnquiryForm({
  defaultPurpose = "Site visit",
  idPrefix,
  variant = "compact",
}: {
  defaultPurpose?: Purpose;
  idPrefix: string;
  /** "compact": boxed fields (pop-up). "full": the open, underlined layout on the Contact page. */
  variant?: "compact" | "full";
}) {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [wipe, setWipe] = useState<{ x: number; y: number } | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || state !== "idle") return;
    const purpose = new FormData(form).get("purpose") as Purpose;
    const button = form.querySelector("button[type=submit]")!.getBoundingClientRect();

    setState("sending");
    // TODO: send the lead to the CRM here once the client shares the endpoint.
    await new Promise((r) => setTimeout(r, 1200));
    setState("sent");
    await new Promise((r) => setTimeout(r, 700));
    setWipe({ x: button.left + button.width / 2, y: button.top + button.height / 2 });
    await new Promise((r) => setTimeout(r, 650));
    router.push(purpose === "Brochure" ? "/thank-you?for=brochure" : "/thank-you");
  }

  const disabled = state !== "idle";

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={variant === "full" ? "grid gap-6" : "grid gap-4"}>
        {variant === "full" ? (
          <fieldset disabled={disabled} className="grid gap-x-10 gap-y-9 transition-opacity disabled:opacity-60 sm:grid-cols-2">
            <legend className="sr-only">Your details</legend>
            <UnderlineField id={`${idPrefix}-name`} label="Full name" name="name" autoComplete="name" />
            <UnderlineField id={`${idPrefix}-phone`} label="Phone number" name="phone" type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{10,15}" />
            <UnderlineField id={`${idPrefix}-email`} label="Email" name="email" type="email" autoComplete="email" className="sm:col-span-2" />

            <div role="radiogroup" aria-labelledby={`${idPrefix}-purpose-label`} className="sm:col-span-2">
              <p id={`${idPrefix}-purpose-label`} className="text-[0.65rem] font-medium tracking-[0.28em] text-lamp uppercase">I&apos;d like to</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {purposes.map((p) => (
                  <label key={p} className="cursor-pointer">
                    <input type="radio" name="purpose" value={p} defaultChecked={p === defaultPurpose} className="peer sr-only" />
                    <span className="inline-flex rounded-[2px] border border-moon/30 px-5 py-3 text-sm text-moon/85 transition-colors peer-checked:border-lamp peer-checked:bg-lamp peer-checked:text-night peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-lamp hover:border-moon">
                      {purposeLabels[p]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <UnderlineField id={`${idPrefix}-message`} label="Message (optional)" name="message" multiline required={false} className="sm:col-span-2" />
          </fieldset>
        ) : (
      <fieldset disabled={disabled} className="grid gap-4 transition-opacity disabled:opacity-60 sm:grid-cols-2">
            <label htmlFor={`${idPrefix}-name`} className="sr-only">Full name</label>
            <input id={`${idPrefix}-name`} name="name" required autoComplete="name" placeholder="Full name" className={field} />
            <label htmlFor={`${idPrefix}-phone`} className="sr-only">Phone number</label>
            <input id={`${idPrefix}-phone`} name="phone" required type="tel" inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{10,15}" placeholder="Phone number" className={field} />
            <label htmlFor={`${idPrefix}-email`} className="sr-only">Email</label>
            <input id={`${idPrefix}-email`} name="email" required type="email" autoComplete="email" placeholder="Email" className={field} />
            <label htmlFor={`${idPrefix}-purpose`} className="sr-only">Purpose</label>
            <select id={`${idPrefix}-purpose`} name="purpose" defaultValue={defaultPurpose} className={`${field} appearance-none`}>
              {purposes.map((p) => (
                <option key={p} value={p} className="bg-surface">{p}</option>
              ))}
            </select>
          </fieldset>
        )}
        <button
          type="submit"
          data-state={state}
          className={`relative inline-flex items-center justify-center gap-2 justify-self-start overflow-hidden bg-lamp font-medium text-night transition-[background-color,width] duration-300 fill-btn [--fill:var(--color-moon)] data-[state=sent]:bg-pool ${
            variant === "full" ? "mt-4 h-14 min-w-56 rounded-[2px] px-9 text-xs tracking-[0.2em] uppercase" : "h-12 rounded-full px-7"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2"
            >
              {state === "idle" && (variant === "full" ? (
                <>
                  Send enquiry
                  <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 10h12m0 0l-5-5m5 5l-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </>
              ) : "Submit")}
              {state === "sending" && (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-night/30 border-t-night" aria-hidden="true" />
                  Sending
                </>
              )}
              {state === "sent" && (
                <>
                  <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
                    <motion.path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </svg>
                  Sent
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <p className="text-sm text-muted">By submitting, you agree to our <a href="/privacy-policy" className="underline underline-offset-4 hover:text-moon">privacy policy</a>.</p>
        <p className="sr-only" aria-live="polite">{state === "sending" ? "Sending your details" : state === "sent" ? "Sent" : ""}</p>
      </form>

      {wipe && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-[100] rounded-full bg-deep"
          style={{ left: wipe.x, top: wipe.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
          initial={{ scale: 0 }}
          animate={{ scale: 120 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
    </>
  );
}
