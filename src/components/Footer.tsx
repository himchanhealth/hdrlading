const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Hospital Info */}
          <div>
            <h3 className="font-korean text-xl font-bold mb-4">
              현대영상의학과의원 건강검진센터
            </h3>
            <div className="font-korean space-y-2 text-gray-300">
              <p>대표자: 김현대</p>
              <p>사업자번호: 123-45-67890</p>
              <p>주소: 전북 전주시 덕진구 백제대로 631</p>
              <p>전화: 063-250-2800</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-korean text-lg font-semibold mb-4">빠른 메뉴</h4>
            <div className="font-korean space-y-2 text-gray-300">
              <p className="hover:text-accent cursor-pointer transition-colors">검진 예약</p>
              <p className="hover:text-accent cursor-pointer transition-colors">검진 안내</p>
              <p className="hover:text-accent cursor-pointer transition-colors">진료과 소개</p>
              <p className="hover:text-accent cursor-pointer transition-colors">찾아오시는 길</p>
            </div>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="font-korean text-lg font-semibold mb-4">이용안내</h4>
            <div className="font-korean space-y-2 text-gray-300">
              <p className="hover:text-accent cursor-pointer transition-colors">개인정보처리방침</p>
              <p className="hover:text-accent cursor-pointer transition-colors">이용약관</p>
              <p className="hover:text-accent cursor-pointer transition-colors">의료진 소개</p>
              <p className="hover:text-accent cursor-pointer transition-colors">장비 안내</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="font-korean text-gray-400">
            © 2024 현대영상의학과의원 건강검진센터. All rights reserved.
          </p>
          <p className="font-korean text-sm text-gray-500 mt-2">
            정확한 진단, 신뢰할 수 있는 건강검진 파트너
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;