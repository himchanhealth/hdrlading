import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EquipmentSection from "@/components/EquipmentSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import DebugPanel from "@/components/DebugPanel";

const Index = () => {
  // 디버그 모드 확인 (URL에 ?debug=true가 있으면 디버그 패널 표시)
  const isDebugMode = new URLSearchParams(window.location.search).get('debug') === 'true';

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
      {isDebugMode && <DebugPanel />}
    </div>
  );
};

export default Index;
