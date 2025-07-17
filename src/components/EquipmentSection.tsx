import { Card, CardContent } from "@/components/ui/card";
import { Brain, Scan, Activity, Zap } from "lucide-react";

const EquipmentSection = () => {
  const equipment = [
    {
      icon: Brain,
      name: "MRI",
      title: "자기공명영상",
      features: ["고해상도 영상", "무방사선", "연조직 진단"],
      description: "뇌, 척추, 관절 등의 정밀 진단",
      color: "bg-blue-500"
    },
    {
      icon: Scan,
      name: "CT",
      title: "컴퓨터단층촬영",
      features: ["3D 영상구현", "빠른 촬영", "정확한 진단"],
      description: "흉부, 복부, 뇌혈관 등 전신 검사",
      color: "bg-green-500"
    },
    {
      icon: Activity,
      name: "PET-CT",
      title: "양전자방출단층촬영",
      features: ["암 조기발견", "대사질환 진단", "전신 스캔"],
      description: "종양, 치매, 심장질환 정밀 진단",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="equipment" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
            첨단 검사 장비
          </h2>
          <p className="font-korean text-lg text-gray-600 max-w-2xl mx-auto">
            대학병원급 최첨단 장비로 정확하고 안전한 검사를 제공합니다
          </p>
        </div>

        {/* 장비 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {equipment.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-korean text-2xl font-bold text-primary mb-1">{item.name}</h3>
                    <p className="font-korean text-sm text-gray-600">{item.title}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {item.features.map((feature, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-korean">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <p className="font-korean text-gray-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI 영상판독 하이라이트 */}
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8 md:p-12 border border-accent/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-accent/20 rounded-full px-6 py-3 mb-6">
              <Zap className="w-6 h-6 text-accent mr-3" />
              <span className="font-korean text-accent font-bold text-lg">AI 영상판독 시스템</span>
            </div>
            
            <h3 className="font-korean text-2xl md:text-3xl font-bold text-primary mb-4">
              인공지능이 함께하는 정확한 진단
            </h3>
            
            <p className="font-korean text-lg text-gray-700 mb-8 leading-relaxed">
              최첨단 AI 기술과 전문의의 경험이 결합되어<br />
              더욱 정확하고 빠른 영상 판독을 제공합니다
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-korean font-semibold text-primary mb-2">빠른 분석</h4>
                <p className="font-korean text-sm text-gray-600">AI가 영상을 즉시 분석하여 판독 시간을 단축</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-korean font-semibold text-primary mb-2">정확한 진단</h4>
                <p className="font-korean text-sm text-gray-600">딥러닝 기술로 미세한 병변까지 정확히 감지</p>
              </div>
              
              <div className="bg-white/80 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-korean font-semibold text-primary mb-2">전문의 검증</h4>
                <p className="font-korean text-sm text-gray-600">AI 분석 결과를 전문의가 최종 검증하여 신뢰성 확보</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;