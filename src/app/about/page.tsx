import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { AboutDeveloper, AboutNumbers, AboutStory, AboutValues, ConstructionUpdates } from "@/components/about/AboutSections";
import EnquiryBanner from "@/components/EnquiryBanner";

export const metadata: Metadata = {
  title: "About us",
  description: "Lorem ipsum: the story behind Southfield and the people building it.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About us"
        title="A quieter way to live, lorem ipsum"
        src="/images/dusk-villa-trees.jpg"
        alt="Glass villa at dusk among trees"
      />
      <AboutStory />
      <AboutNumbers />
      <AboutDeveloper />
      <AboutValues />
      <ConstructionUpdates />
      <EnquiryBanner />
    </>
  );
}
