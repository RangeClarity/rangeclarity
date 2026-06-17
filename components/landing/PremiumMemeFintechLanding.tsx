import { AudienceSection } from "./AudienceSection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";
import { FAQSection } from "./FAQSection";
import { HeroSection } from "./HeroSection";
import { NotSignalBotSection } from "./NotSignalBotSection";
import { PricingSection } from "./PricingSection";
import { ProcessSection } from "./ProcessSection";
import { SampleAnalysisCard } from "./SampleAnalysisCard";
import { ToolkitSection } from "./ToolkitSection";

export function PremiumMemeFintechLanding() {
  return (
    <>
      <HeroSection />
      <ToolkitSection />
      <ProcessSection />
      <SampleAnalysisCard />
      <AudienceSection />
      <NotSignalBotSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
