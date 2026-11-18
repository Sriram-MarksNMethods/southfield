import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogList from "@/components/blogs/BlogList";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Lorem ipsum stories on villa living, design and the neighbourhood.",
};

export default function BlogsPage() {
  return (
    <>
      <PageHero label="Blogs" title="Notes from Southfield" text="Lorem ipsum on villa living, design and the neighbourhood." src="/images/interior-dark-dining.jpg" alt="Dining table under arched pendant lights" />
      <BlogList />
    </>
  );
}
