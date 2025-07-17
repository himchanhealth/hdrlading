import { Button } from "@/components/ui/button";
import petCtImage from "@/assets/pet-ct-machine.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(var(--gradient-hero)), url(${petCtImage})`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="font-korean text-4xl md:text-6xl font-bold mb-6 leading-tight">
          정확한 진단의 시작,<br />
          <span className="text-accent">영상의학 전문센터</span>에서
        </h1>
        
        <p className="font-korean text-xl md:text-2xl mb-8 opacity-90">
          PET-CT · MRI · CT – 대학병원급 장비, 전문의 직접 판독
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="font-korean text-lg px-8 py-4 bg-accent hover:bg-accent/90 text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            검진 예약하기
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="font-korean text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary font-semibold transition-all duration-300"
          >
            상담 신청하기
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;