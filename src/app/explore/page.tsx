import type { Metadata } from "next";
import ExplorerLoader from "./ExplorerLoader";

export const metadata: Metadata = {
  title: "Explore the map",
  description: "Fly over Southfield: drag to move, scroll to zoom, tap a place to visit it.",
};

export default function ExplorePage() {
  return <ExplorerLoader />;
}
