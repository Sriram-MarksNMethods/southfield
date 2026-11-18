"use client";

import dynamic from "next/dynamic";

// The 3D map only runs in the browser (WebGL), so it isn't rendered on the server.
const Explorer = dynamic(() => import("@/components/explore/Explorer"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-30 grid place-items-center bg-night text-[0.7rem] tracking-[0.3em] text-moon/80 uppercase">Loading the map</div>,
});

export default function ExplorerLoader() {
  return <Explorer />;
}
