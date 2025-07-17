import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Car, Phone } from "lucide-react";

const LocationSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
            찾아오시는 길
          </h2>
          <p className="font-korean text-lg text-muted-foreground">
            전북대병원 인근의 편리한 위치에서 여러분을 기다립니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-korean">네이버지도 / 카카오맵</p>
                <p className="font-korean text-sm">지도 연동 영역</p>
              </div>
            </div>
            <p className="font-korean text-sm text-gray-600 text-center">
              전북 전주시 덕진구 백제대로 631 (전북대병원 사거리)
            </p>
          </div>
          
          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-korean font-semibold text-primary mb-2">주소</h3>
                    <p className="font-korean text-gray-700">
                      전북 전주시 덕진구 백제대로 631<br />
                      (전북대병원 사거리)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-korean font-semibold text-primary mb-2">진료시간</h3>
                    <div className="font-korean text-gray-700 space-y-1">
                      <p>평일: 09:00 ~ 18:00</p>
                      <p>토요일: 09:00 ~ 12:00</p>
                      <p className="text-sm text-red-600">일요일, 공휴일 휴무</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-korean font-semibold text-primary mb-2">주차 안내</h3>
                    <p className="font-korean text-gray-700">
                      주차장 구비 · 무료 주차 가능<br />
                      대형 주차공간으로 편리한 이용
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-korean font-semibold text-primary mb-2">연락처</h3>
                    <p className="font-korean text-gray-700 text-lg font-medium">
                      063-250-2800
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;