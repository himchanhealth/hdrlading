import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Car, ExternalLink } from "lucide-react";

// 로고 컴포넌트들
const NaverLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
  </svg>
);

const KakaoLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 3C6.925 3 2.5 6.74 2.5 11.25c0 2.896 1.895 5.44 4.797 6.878l-1.25 4.559c-.078.284.228.53.485.39L12.5 19.5c-.167-.01-.33-.023-.5-.023C17.799 19.477 22.5 15.776 22.5 11.25S17.799 3 12 3z"/>
  </svg>
);

const GoogleLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LocationSection = () => {
  // 병원 위치 정보
  const hospitalInfo = {
    name: "현대영상의학과의원",
    address: "전북 전주시 덕진구 백제대로 631",
    addressDetail: "(전북대병원 사거리)",
    // 실제 좌표 (예시 - 전북대병원 근처)
    lat: 35.8468,
    lng: 127.1287,
    // 검색용 주소
    searchAddress: "전북 전주시 덕진구 백제대로 631"
  };

  // 네이버지도 열기
  const openNaverMap = () => {
    const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(hospitalInfo.searchAddress)}`;
    window.open(naverMapUrl, '_blank');
  };

  // 카카오맵 열기
  const openKakaoMap = () => {
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(hospitalInfo.searchAddress)}`;
    window.open(kakaoMapUrl, '_blank');
  };

  // 구글맵 열기
  const openGoogleMap = () => {
    const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(hospitalInfo.searchAddress)}`;
    window.open(googleMapUrl, '_blank');
  };


  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-korean text-3xl md:text-4xl font-bold text-primary mb-4">
            찾아오시는 길
          </h2>
          <p className="font-korean text-lg text-muted-foreground">
            전북대병원 사거리 편리한 위치에서 여러분을 기다립니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Map Section */}
          <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col h-full">
            {/* 지도 영역 */}
            <div className="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-600">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="font-korean font-semibold text-lg text-primary mb-2">
                  {hospitalInfo.name}
                </h3>
                <p className="font-korean text-sm mb-1">{hospitalInfo.address}</p>
                <p className="font-korean text-sm text-gray-500">{hospitalInfo.addressDetail}</p>
              </div>
            </div>

            {/* 지도 서비스 버튼들 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
              <Button 
                variant="default" 
                className="font-korean bg-green-600 text-white border-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 px-4 py-3"
                onClick={openNaverMap}
              >
                <NaverLogo className="w-5 h-5" />
                <span className="font-medium">네이버지도</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </Button>
              
              <Button 
  variant="default" 
  className="font-korean bg-[#FEE500] text-black border-[#FEE500] hover:bg-[#FEE500] hover:text-black hover:border-[#FEE500] hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 px-4 py-3"
  onClick={openKakaoMap}
>
  <KakaoLogo className="w-5 h-5" />
  <span className="font-medium">카카오맵</span>
  <ExternalLink className="w-4 h-4 opacity-70" />
</Button>
              
              <Button 
                variant="default" 
                className="font-korean bg-blue-600 text-white border-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2 px-4 py-3"
                onClick={openGoogleMap}
              >
                <GoogleLogo className="w-5 h-5" />
                <span className="font-medium">구글맵</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </Button>
            </div>
          </div>
          
          {/* Info Cards */}
          <div className="flex flex-col justify-between space-y-6 h-full">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;