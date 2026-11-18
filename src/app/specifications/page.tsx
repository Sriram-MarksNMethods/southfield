import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SpecList from "@/components/specifications/SpecList";
import AmenitiesStrip from "@/components/specifications/AmenitiesStrip";
import Clubhouse from "@/components/specifications/Clubhouse";
import FloorPlans from "@/components/specifications/FloorPlans";
import EnquiryBanner from "@/components/EnquiryBanner";

export const metadata: Metadata = {
  title: "Specifications",
  description: "Lorem ipsum specifications, amenities and clubhouse at Southfield.",
};

export default function SpecificationsPage() {
  return (
    <>
      <PageHero
        label="Specifications"
        title="Everything that goes into a Southfield villa"
        text="Lorem ipsum dolor sit amet: the build, the amenities and the clubhouse, in one place."
        src="/images/interior-dark-lounge.jpg"
        alt="Living room with low lamps and a patterned rug"
      />
      <AmenitiesStrip />
      <Clubhouse />
      <FloorPlans />
      <SpecList />
      <EnquiryBanner />
    </>
  );
}
