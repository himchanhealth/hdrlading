import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EquipmentSection from "@/components/EquipmentSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";

const Index = () => {
  return (
    <div className="min-h-screen font-korean">
      <Header />
      <HeroSection />
      <EquipmentSection />
      <ServicesSection />
      <AboutSection />
      <CTASection />
      <LocationSection />
      <Footer />
      <MobileBottomBar />
    </div>
  );
};

export default Index;
