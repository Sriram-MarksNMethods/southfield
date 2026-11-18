"use client";

import type { Purpose } from "@/lib/site";
import { useEnquiry } from "./enquiry/EnquiryProvider";

/** Any button that opens the enquiry pop-up. Usable from server components. */
export default function EnquiryButton({
  purpose = "Site visit",
  className = "",
  children,
}: {
  purpose?: Purpose;
  className?: string;
  children: React.ReactNode;
}) {
  const { openEnquiry } = useEnquiry();
  return (
    <button type="button" onClick={() => openEnquiry(purpose)} className={className}>
      {children}
    </button>
  );
}

