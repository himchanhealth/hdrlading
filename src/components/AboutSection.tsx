import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Star } from "lucide-react";

const AboutSection = () => {
  const doctors = [
    {
      name: "김현대",
      position: "원장",
      specialty: "영상의학과 전문의",
      experience: "15년",
      education: "서울대학교 의과대학",
      philosophy: "정확한 진단을 통해 환자의 건강한 삶을 지원합니다"
    },
    {
      name: "이영상",
      position: "과장",
      specialty: "신경영상 전문",
      experience: "12년",
      education: "연세대학교 의과대학",
      philosophy: "첨단 기술과 따뜻한 마음으로 진료합니다"
    }
  ];


  const achievements = [
    {
      icon: Award,
      title: "대한영상의학회 인증",
      description: "영상의학 전문 인증 기관"
    },
    {
      icon: Users,
      title: "연간 10,000건+ 검사",
      description: "풍부한 임상 경험"
    },
    {
      icon: Star,
      title: "환자 만족도 98%",
      description: "높은 신뢰도와 만족도"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
            병원 소개
          </h2>
          <p className="font-korean text-lg text-gray-600 max-w-2xl mx-auto">
            전문성과 신뢰를 바탕으로 최고의 영상의학 서비스를 제공합니다
          </p>
        </div>

        {/* 의료진 소개 */}
        <div className="mb-20">
          <h3 className="font-korean text-2xl font-bold text-primary text-center mb-12">
            전문 의료진
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {doctors.map((doctor, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  {/* 의사 이미지 플레이스홀더 */}
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-korean text-xl font-bold text-primary">{doctor.name}</h4>
                      <p className="font-korean text-accent font-medium">{doctor.position}</p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="font-korean text-sm text-gray-600">
                        <span className="font-medium">전문분야:</span> {doctor.specialty}
                      </p>
                      <p className="font-korean text-sm text-gray-600">
                        <span className="font-medium">경력:</span> {doctor.experience}
                      </p>
                      <p className="font-korean text-sm text-gray-600">
                        <span className="font-medium">학력:</span> {doctor.education}
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="font-korean text-sm text-gray-700 italic">
                        "{doctor.philosophy}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 장비 및 환경 */}
        <div className="mb-20">
          <h3 className="font-korean text-2xl font-bold text-primary text-center mb-12">
            최첨단 장비 및 쾌적한 환경
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="font-korean text-blue-600 font-medium">MRI 검사실</span>
              </div>
              <h4 className="font-korean font-semibold text-primary mb-2">최신 MRI 장비</h4>
              <p className="font-korean text-sm text-gray-600">고해상도 영상으로 정밀한 진단이 가능한 최신 MRI 장비</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="font-korean text-green-600 font-medium">CT 검사실</span>
              </div>
              <h4 className="font-korean font-semibold text-primary mb-2">고속 CT 스캐너</h4>
              <p className="font-korean text-sm text-gray-600">빠른 촬영과 3D 영상 구현이 가능한 최첨단 CT 장비</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                <span className="font-korean text-purple-600 font-medium">대기실</span>
              </div>
              <h4 className="font-korean font-semibold text-primary mb-2">쾌적한 대기공간</h4>
              <p className="font-korean text-sm text-gray-600">편안하고 안락한 환경에서 검사를 기다리실 수 있습니다</p>
            </div>
          </div>
        </div>

        {/* 신뢰 요소 */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  <h4 className="font-korean font-bold text-primary mb-2">{achievement.title}</h4>
                  <p className="font-korean text-gray-600">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;