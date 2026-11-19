import type { Metadata } from "next";
import { Hanken_Grotesk, Scope_One } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import EnquiryProvider from "@/components/enquiry/EnquiryProvider";
import ToneBackground from "@/components/ToneBackground";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyActions from "@/components/StickyActions";
import ButtonFill from "@/components/ButtonFill";
import "swiper/css";
import "./globals.css";

const scope = Scope_One({ weight: "400", subsets: ["latin"], variable: "--font-scope" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });

export const metadata: Metadata = {
  title: { default: "Southfield | Lorem ipsum villas", template: "%s | Southfield" },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${scope.variable} ${hanken.variable} antialiased`}>
      <body className="text-moon">
        <SmoothScroll>
          <EnquiryProvider>
            <ToneBackground />
            <Header />
            <main>{children}</main>
            <Footer />
            <StickyActions />
            <ButtonFill />
          </EnquiryProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
