"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** After a brochure request (?for=brochure) the PDF downloads by itself. */
export default function BrochureAutoDownload() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("for") !== "brochure") return;
    const link = document.createElement("a");
    link.href = "/downloads/southfield-brochure.pdf";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [params]);

  return null;
}
