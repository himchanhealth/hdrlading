import { Button } from "@/components/ui/button";
import { Phone, Calendar, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 병원명 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">현</span>
            </div>
            <div>
              <h1 className="font-korean font-bold text-lg text-primary">현대영상의학과의원</h1>
              <p className="font-korean text-xs text-gray-600">정확한 진단의 시작</p>
            </div>
          </div>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#equipment" className="font-korean text-gray-700 hover:text-primary transition-colors">검사장비</a>
            <a href="#services" className="font-korean text-gray-700 hover:text-primary transition-colors">검진안내</a>
            <a href="#about" className="font-korean text-gray-700 hover:text-primary transition-colors">병원소개</a>
            <a href="#location" className="font-korean text-gray-700 hover:text-primary transition-colors">오시는길</a>
          </nav>

          {/* CTA 버튼들 */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="outline" size="sm" className="font-korean">
              <Phone className="w-4 h-4 mr-2" />
              상담문의
            </Button>
            <Button size="sm" className="font-korean bg-accent hover:bg-accent/90">
              <Calendar className="w-4 h-4 mr-2" />
              빠른예약
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <a href="#equipment" className="font-korean text-gray-700 py-2">검사장비</a>
              <a href="#services" className="font-korean text-gray-700 py-2">검진안내</a>
              <a href="#about" className="font-korean text-gray-700 py-2">병원소개</a>
              <a href="#location" className="font-korean text-gray-700 py-2">오시는길</a>
              <div className="flex space-x-3 pt-3">
                <Button variant="outline" size="sm" className="font-korean flex-1">상담문의</Button>
                <Button size="sm" className="font-korean flex-1 bg-accent hover:bg-accent/90">빠른예약</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;