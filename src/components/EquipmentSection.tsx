import { Badge } from "@/components/ui/badge";

const EquipmentSection = () => {
  const equipment = [
    {
      name: "MRI",
      title: "자기공명영상",
      features: ["고해상도 영상", "무방사선", "연조직 진단"],
      description: "뇌, 척추, 관절 등을 고해상도로 정밀하게 진단합니다. 정밀검사나 만성질환 모니터링에 적합하며, 방사선 노출이 없어 안전한 진단이 가능합니다.",
      image: "https://cdn.imweb.me/upload/S202505065183c8257f7bc/bc3a6931727e5.png"
    },
    {
      name: "CT",
      title: "컴퓨터단층촬영",
      features: ["3D 영상 구현", "빠른 촬영", "정확한 진단"],
      description: "고속 회전 기술로 짧은 시간 내에 정밀한 3D 영상을 구현하여 흉부, 복부, 뇌혈관 등 전신 주요 부위의 이상 유무를 정확하게 진단합니다.",
      image: "https://cdn.imweb.me/upload/S202505065183c8257f7bc/6a3db8346ecf0.png"
    },
    {
      name: "PET-CT",
      title: "양전자방출단층촬영",
      features: ["암 조기발견", "대사질환 진단", "전신 스캔"],
      description: "세포의 대사활동을 실시간으로 확인하여 종양, 치매, 심장질환 등 조기 진단이 중요한 질환의 기능적 변화를 정밀하게 파악합니다.",
      image: "https://cdn.imweb.me/upload/S202505065183c8257f7bc/f6b8665a0e684.png"
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
            대학병원급 최신 장비를 통해 정밀하고 안전한 검사를 제공합니다.
          </p>
        </div>

        {/* 장비 목록 */}
        <div className="space-y-12">
          {equipment.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* 이미지 영역 */}
                <div className="relative h-80 lg:h-96">
                  <img 
                    src={item.image} 
                    alt={`${item.name} 장비`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* 내용 영역 */}
                <div className="p-8 lg:px-20 lg:py-16 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="font-korean text-2xl lg:text-3xl font-bold text-primary mb-2">
                      {item.name} ({item.title})
                    </h3>
                    
                    {/* 포인트 태그 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="font-korean text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* 설명 */}
                    <p className="font-korean text-gray-700 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;