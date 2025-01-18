import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { CTASection } from "@/components/home/CTASection";
import { PricingSection } from "@/components/home/PricingSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-light/5">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default Index;