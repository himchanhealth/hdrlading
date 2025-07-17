import { Button } from "@/components/ui/button";
import { Brain, Zap, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        {/* AI 영상판독 배지 */}
        <div className="inline-flex items-center bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-6 py-2 mb-8">
          <Brain className="w-5 h-5 mr-2 text-accent" />
          <span className="font-korean text-accent font-medium">AI 영상판독 시스템 도입</span>
        </div>

        <h1 className="font-korean text-4xl md:text-6xl font-bold mb-6 leading-tight">
          현대영상의학과<br />
          <span className="text-accent">정확한 진단의 새로운 기준</span>
        </h1>
        
        <p className="font-korean text-lg md:text-xl mb-10 opacity-90 max-w-3xl mx-auto">
          최첨단 MRI, CT, PET-CT 장비와 AI 영상판독 시스템으로<br />
          더욱 정확하고 빠른 진단을 제공합니다
        </p>
        
        {/* 주요 특징 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-korean font-semibold mb-1">AI 영상판독</h3>
            <p className="font-korean text-sm opacity-80">인공지능 보조 진단</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-korean font-semibold mb-1">전문의 직접판독</h3>
            <p className="font-korean text-sm opacity-80">풍부한 경험의 전문의</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="font-korean font-semibold mb-1">당일 결과</h3>
            <p className="font-korean text-sm opacity-80">빠른 진단 결과 제공</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            size="lg" 
            className="font-korean text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
          >
            검진 빠른예약
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="font-korean text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary font-semibold transition-all duration-300 flex-1"
          >
            상담문의
          </Button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;