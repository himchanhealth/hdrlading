import { Card, CardContent } from "@/components/ui/card";
import { Activity, Award, Clock, MapPin, Users } from "lucide-react";
import mriImage from "@/assets/mri-machine.jpg";
import ctImage from "@/assets/ct-machine.jpg";

const StrengthSection = () => {
  const strengths = [
    {
      icon: Activity,
      title: "대학병원급 PET-CT · MRI · CT 장비",
      description: "최첨단 의료 장비로 정확한 진단을 제공합니다",
      image: mriImage,
    },
    {
      icon: Award,
      title: "영상의학과 전문의 직접 판독",
      description: "풍부한 경험의 전문의가 직접 판독합니다",
      image: ctImage,
    },
    {
      icon: Clock,
      title: "당일 결과 제공",
      description: "빠른 결과 확인으로 불안감을 최소화합니다",
    },
    {
      icon: MapPin,
      title: "전북대병원 앞, 주차 편리",
      description: "접근성이 뛰어나고 주차가 편리한 위치입니다",
    },
    {
      icon: Users,
      title: "대기 없는 쾌적한 환경",
      description: "예약제 운영으로 편안한 검진 환경을 제공합니다",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
            왜 현대영상의학과의원인가요?
          </h2>
          <p className="font-korean text-lg text-muted-foreground max-w-2xl mx-auto">
            정확한 진단과 환자 중심의 서비스로 신뢰받는 영상의학 전문기관입니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {strengths.map((strength, index) => {
            const IconComponent = strength.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-2"
                style={{ boxShadow: 'var(--shadow-premium)' }}
              >
                <CardContent className="p-6 text-center">
                  {strength.image ? (
                    <div className="w-full h-40 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={strength.image} 
                        alt={strength.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                  )}
                  
                  <h3 className="font-korean text-lg font-semibold text-primary mb-3">
                    {strength.title}
                  </h3>
                  <p className="font-korean text-muted-foreground">
                    {strength.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StrengthSection;