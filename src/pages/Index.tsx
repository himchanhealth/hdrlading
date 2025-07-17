import HeroSection from "@/components/HeroSection";
import StrengthSection from "@/components/StrengthSection";
import CTASection from "@/components/CTASection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen font-korean">
      <HeroSection />
      <StrengthSection />
      <CTASection />
      <LocationSection />
      <Footer />
    </div>
  );
};

export default Index;
