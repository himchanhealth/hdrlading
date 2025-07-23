import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import QuickReservationModal from "./QuickReservationModal";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="현대영상의학과의원" 
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* 헤더 액션 버튼들 */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              onClick={() => window.open('tel:063-272-3323', '_self')}
            >
              <Phone className="w-4 h-4 mr-2" />
              전화 상담
            </Button>

            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              문의하기
            </Button>

            <QuickReservationModal>
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                온라인 예약
              </Button>
            </QuickReservationModal>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 shadow-sm"
              onClick={() => window.open('tel:063-272-3323', '_self')}
            >
              <Phone className="w-4 h-4" />
            </Button>

            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white p-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>

            <QuickReservationModal>
              <Button 
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white p-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
              </Button>
            </QuickReservationModal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;