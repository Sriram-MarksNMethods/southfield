import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Overview from "@/components/home/Overview";
import Landscape from "@/components/home/Landscape";
import Residences from "@/components/home/Residences";
import SpoolGallery from "@/components/home/SpoolGallery";
import AerialMap from "@/components/home/AerialMap";
import Faq from "@/components/Faq";

// Section designs follow makenagolfandbeachclub.com's home page; the content
// follows Sage. The gallery is Sage's own, unchanged.
export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Overview />
      <Landscape />
      <Residences />
      <SpoolGallery />
      <AerialMap />
      <Faq />
    </>
  );
}
