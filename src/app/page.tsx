import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { OccasionsPreview } from "@/components/landing/occasions-preview";
import { PhysicalExperience } from "@/components/landing/physical-experience";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <OccasionsPreview />
      <PhysicalExperience />
      <CtaSection />
      <Footer />
      <ScrollToTop />
    </>
  );
}