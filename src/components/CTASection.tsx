import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import QuickReservationModal from "./QuickReservationModal";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-korean text-3xl md:text-4xl font-bold mb-6">
          정확한 진단이 필요할 때,<br />
          <span className="text-accent">지금 상담을 신청하세요</span>
        </h2>
        
        <p className="font-korean text-lg mb-10 opacity-90">
          전문의와의 1:1 상담으로 맞춤형 검진 계획을 세워보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Button 
            size="lg" 
            className="font-korean bg-white text-primary hover:bg-gray-100 py-6 group transition-all duration-300"
            onClick={() => window.open('tel:063-272-3323', '_self')}
          >
            <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            전화 상담
          </Button>
          
          <Button 
            size="lg" 
            className="font-korean bg-accent hover:bg-accent/90 text-white py-6 group transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            문의하기
          </Button>
          
          <QuickReservationModal>
            <Button 
              size="lg" 
              className="font-korean bg-white/10 border border-white/20 hover:bg-white/20 text-white py-6 group transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              온라인 예약
            </Button>
          </QuickReservationModal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;