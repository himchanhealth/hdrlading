import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, UserCheck, FileText, CheckCircle } from "lucide-react";

const ServicesSection = () => {
  const procedures = [
    {
      step: "01",
      icon: UserCheck,
      title: "내원 및 상담",
      description: "전문의와 상담 후 검사 계획 수립",
      time: "10-15분"
    },
    {
      step: "02",
      icon: Clock,
      title: "영상 촬영",
      description: "최첨단 장비로 정밀 영상 촬영",
      time: "20-60분"
    },
    {
      step: "03",
      icon: FileText,
      title: "전문의 판독",
      description: "40년 경력 영상의학과 전문의 정밀 판독",
      time: "30분-2시간"
    },
    {
      step: "04",
      icon: CheckCircle,
      title: "결과 안내",
      description: "상세한 결과 설명 및 향후 계획",
      time: "10-20분"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* 검사 절차 안내 */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
              검사 절차 안내
            </h2>
            <p className="font-korean text-lg text-gray-600">
              간단한 4단계로 정확한 진단을 받으실 수 있습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {procedures.map((procedure, index) => {
              const IconComponent = procedure.icon;
              return (
                <div key={index} className="relative">
                  <Card className="text-center p-6 h-full border-2 hover:border-accent/50 transition-colors">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-accent" />
                      </div>
                      
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                        {procedure.step}
                      </div>
                      
                      <h3 className="font-korean font-bold text-lg text-primary mb-2">
                        {procedure.title}
                      </h3>
                      
                      <p className="font-korean text-gray-600 mb-3 text-sm">
                        {procedure.description}
                      </p>
                      
                      <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        <span className="font-korean text-sm text-gray-600">{procedure.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* 화살표 (마지막 제외) */}
                  {index < procedures.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-accent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;