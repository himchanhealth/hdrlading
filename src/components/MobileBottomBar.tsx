import { Button } from "@/components/ui/button";
import { Calendar, FileText, MapPin, Phone } from "lucide-react";
import QuickReservationModal from "./QuickReservationModal";

const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4 gap-1 p-2">
        <QuickReservationModal>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center py-3 px-2 h-auto font-korean text-xs"
          >
            <Calendar className="w-5 h-5 mb-1 text-accent" />
            빠른예약
          </Button>
        </QuickReservationModal>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center py-3 px-2 h-auto font-korean text-xs"
        >
          <FileText className="w-5 h-5 mb-1 text-primary" />
          검진안내
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center py-3 px-2 h-auto font-korean text-xs"
        >
          <MapPin className="w-5 h-5 mb-1 text-primary" />
          위치보기
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex flex-col items-center py-3 px-2 h-auto font-korean text-xs"
          onClick={() => window.open('tel:063-272-3323', '_self')}
        >
          <Phone className="w-5 h-5 mb-1 text-primary" />
          전화상담
        </Button>
      </div>
    </div>
  );
};

export default MobileBottomBar;