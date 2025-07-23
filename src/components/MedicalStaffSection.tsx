import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Award, Calendar, Star } from "lucide-react";

const MedicalStaffSection = () => {
  const medicalStaff = [
    {
      id: 1,
      name: "문무창",
      position: "원장 / 영상의학과 전문의",
      specialization: "MRI, CT, 초음파 영상진단",
      experience: "40년",
      education: "전북대학교 의과대학",
      certifications: ["대한영상의학회 정회원", "대한자기공명의학회 정회원"],
      image: "/api/placeholder/200/240"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-korean text-2xl font-bold text-primary mb-2">
          의료진 소개
        </h3>
        <p className="font-korean text-gray-600">
          풍부한 경험과 전문성을 갖춘 의료진이 정확한 진단을 제공합니다
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              {/* 프로필 이미지 */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <User className="w-20 h-20 text-blue-400" />
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-blue-600">
                    {medicalStaff[0].experience}
                  </Badge>
                </div>
              </div>
              
              {/* 의료진 정보 */}
              <div className="p-4 space-y-3">
                <div className="text-center">
                  <h4 className="font-korean text-lg font-bold text-primary">
                    {medicalStaff[0].name}
                  </h4>
                  <p className="font-korean text-sm text-blue-600 font-medium">
                    {medicalStaff[0].position}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-accent" />
                    <span className="font-korean text-gray-700">
                      {medicalStaff[0].specialization}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="font-korean text-gray-700">
                      {medicalStaff[0].education}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-accent mt-0.5" />
                    <div className="space-y-1">
                      {medicalStaff[0].certifications.map((cert, index) => (
                        <div key={index} className="font-korean text-gray-700">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicalStaffSection;