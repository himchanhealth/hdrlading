import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar, Phone, User, Clock, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { sendReservationEmail, type ReservationData } from "@/lib/email";
import { saveReservation } from "@/lib/supabase";
import { format } from "date-fns";
import { useNotificationContext } from "@/contexts/NotificationContext";

interface QuickReservationModalProps {
  children: React.ReactNode;
}

const QuickReservationModal = ({ children }: QuickReservationModalProps) => {
  const { notifyNewReservation } = useNotificationContext();
  
  console.log('🔔 QuickReservationModal - notifyNewReservation function:', typeof notifyNewReservation);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    gender: "",
    examType: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });
  
  const [birthDate, setBirthDate] = useState<Date | undefined>();
  const [preferredDate, setPreferredDate] = useState<Date | undefined>();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleBirthDateChange = (date: Date | undefined) => {
    setBirthDate(date);
    setFormData(prev => ({
      ...prev,
      birthDate: date ? format(date, 'yyyy-MM-dd') : ''
    }));
  };
  
  const handlePreferredDateChange = (date: Date | undefined) => {
    setPreferredDate(date);
    setFormData(prev => ({
      ...prev,
      preferredDate: date ? format(date, 'yyyy-MM-dd') : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 예약 신청 시작...");
    
    // 이미 제출 중이면 중복 제출 방지
    if (isSubmitting) {
      console.log("⚠️ 이미 제출 중입니다. 중복 제출 방지됨");
      return;
    }
    
    // 필수 필드 유효성 검사
    if (!formData.name || !formData.phone || !formData.birthDate || !formData.gender || !formData.examType || !formData.preferredDate || !formData.preferredTime) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    console.log("🔍 제출 상태를 true로 변경");
    
    try {
      console.log("🔍 전송할 데이터:", formData);
      
      // 1. Supabase에 예약 데이터 저장
      console.log("🔍 Supabase에 예약 데이터 저장 시작...");
      const supabaseResult = await saveReservation({
        patient_name: formData.name,
        patient_phone: formData.phone,
        patient_birth_date: formData.birthDate,
        patient_gender: formData.gender as 'male' | 'female',
        exam_type: formData.examType,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        notes: formData.notes
      });

      console.log("🔍 Supabase 저장 결과:", supabaseResult);

      if (!supabaseResult.success) {
        console.error("❌ Supabase 저장 실패:", supabaseResult.error);
        alert(`예약 저장에 실패했습니다: ${supabaseResult.error}\n\n직접 연락주세요:\n📞 063-272-3323`);
        return;
      }

      console.log("✅ Supabase에 예약 데이터 저장 성공!");
      
      // 2. 이메일 전송 (선택사항)
      console.log("🔍 이메일 전송 시작...");
      const emailSent = await sendReservationEmail(formData as ReservationData);
      
      if (emailSent) {
        console.log("✅ 이메일 전송 성공!");
      } else {
        console.warn("⚠️ 이메일 전송 실패 (예약은 저장됨)");
      }

      console.log("✅ 예약 신청 성공!");
      alert("예약 신청이 완료되었습니다. 곧 연락드리겠습니다.");
        
        // 관리자에게 알림 전송
        console.log('🔔 예약 성공! 알림 전송 시작...');
        const examTypeMap: { [key: string]: string } = {
          'mri': 'MRI 검사',
          'ct': 'CT 검사',
          'pet-ct': 'PET-CT 검사',
          'ultrasound': '초음파 검사',
          'xray': 'X-ray 검사',
          'mammography': '유방촬영술',
          'bone-density': '골밀도 검사',
          'comprehensive': '종합건강검진',
          'brain-checkup': '뇌검진',
          'heart-checkup': '심장검진',
          'other': '기타 검사'
        };
        
        const notificationData = {
          patientName: formData.name,
          phone: formData.phone,
          examType: examTypeMap[formData.examType] || formData.examType,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime
        };
        
        console.log('🔔 알림 데이터:', notificationData);
        console.log('🔔 notifyNewReservation 함수 타입:', typeof notifyNewReservation);
        
        try {
          console.log('🔔 예약 완료! 관리자 알림 전송 시작...');
          notifyNewReservation(notificationData);
          console.log('✅ 알림 전송 완료! (로컬 + 탭 간 통신)');
          console.log('🔄 관리자 페이지 탭에서 알림을 확인하세요!');
        } catch (error) {
          console.error('❌ 알림 전송 실패:', error);
        }
        
        // 폼 초기화
        setFormData({
          name: "",
          phone: "",
          birthDate: "",
          gender: "",
          examType: "",
          preferredDate: "",
          preferredTime: "",
          notes: ""
        });
        setBirthDate(undefined);
        setPreferredDate(undefined);
        
        // 모달 닫기
        setIsDialogOpen(false);
    } catch (error) {
      console.error("예약 신청 처리 중 오류:", error);
      alert("예약 신청 중 오류가 발생했습니다.\n\n직접 연락주세요:\n📞 063-272-3323");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-korean text-xl text-center text-primary">
            검진예약 신청
          </DialogTitle>
          <DialogDescription className="font-korean text-sm text-gray-600 text-center mt-2">
            정확한 정보를 입력해주시면 담당자가 빠르게 연락드리겠습니다.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-korean text-sm font-medium">
                <User className="w-4 h-4 inline mr-1" />
                성명 *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="font-korean"
                placeholder="홍길동"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-korean text-sm font-medium">
                <Phone className="w-4 h-4 inline mr-1" />
                연락처 *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="font-korean"
                placeholder="010-1234-5678"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-korean text-sm font-medium">
                생년월일 *
              </Label>
              <DatePicker
                date={birthDate}
                onDateChange={handleBirthDateChange}
                placeholder="생년월일을 선택하세요"
                maxDate={new Date()}
                yearRange={{ from: 1900, to: new Date().getFullYear() }}
                className="font-korean"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-korean text-sm font-medium">
                성별 *
              </Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className="font-korean">
                  <SelectValue placeholder="선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male" className="font-korean">남성</SelectItem>
                  <SelectItem value="female" className="font-korean">여성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 검사 정보 */}
          <div className="space-y-2">
            <Label className="font-korean text-sm font-medium">
              검사 종류 *
            </Label>
            <Select value={formData.examType} onValueChange={(value) => handleInputChange("examType", value)}>
              <SelectTrigger className="font-korean">
                <SelectValue placeholder="검사 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mri" className="font-korean">MRI 검사</SelectItem>
                <SelectItem value="ct" className="font-korean">CT 검사</SelectItem>
                <SelectItem value="pet-ct" className="font-korean">PET-CT 검사</SelectItem>
                <SelectItem value="ultrasound" className="font-korean">초음파 검사</SelectItem>
                <SelectItem value="xray" className="font-korean">X-ray 검사</SelectItem>
                <SelectItem value="mammography" className="font-korean">유방촬영술</SelectItem>
                <SelectItem value="bone-density" className="font-korean">골밀도 검사</SelectItem>
                <SelectItem value="comprehensive" className="font-korean">종합건강검진</SelectItem>
                <SelectItem value="brain-checkup" className="font-korean">뇌검진</SelectItem>
                <SelectItem value="heart-checkup" className="font-korean">심장검진</SelectItem>
                <SelectItem value="other" className="font-korean">기타 (상담 후 결정)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 예약 희망 일시 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-korean text-sm font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                희망 날짜 *
              </Label>
              <DatePicker
                date={preferredDate}
                onDateChange={handlePreferredDateChange}
                placeholder="희망 날짜를 선택하세요"
                minDate={new Date()}
                maxDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                useAdvancedSelector={true}
                className="font-korean"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="font-korean text-sm font-medium">
                <Clock className="w-4 h-4 inline mr-1" />
                희망 시간 *
              </Label>
              <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                <SelectTrigger className="font-korean">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00" className="font-korean">오전 9시</SelectItem>
                  <SelectItem value="10:00" className="font-korean">오전 10시</SelectItem>
                  <SelectItem value="11:00" className="font-korean">오전 11시</SelectItem>
                  <SelectItem value="14:00" className="font-korean">오후 2시</SelectItem>
                  <SelectItem value="15:00" className="font-korean">오후 3시</SelectItem>
                  <SelectItem value="16:00" className="font-korean">오후 4시</SelectItem>
                  <SelectItem value="17:00" className="font-korean">오후 5시</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 추가 요청사항 */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-korean text-sm font-medium">
              <FileText className="w-4 h-4 inline mr-1" />
              추가 요청사항
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="font-korean resize-none"
              placeholder="특별한 요청사항이 있으시면 적어주세요"
              rows={3}
            />
          </div>

          {/* 안내사항 */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-korean text-sm text-gray-600 leading-relaxed">
              • 예약 신청 후 담당자가 전화로 확인 연락을 드립니다.<br />
              • 검사 전 주의사항은 예약 확정 시 안내해드립니다.<br />
              • 예약 변경이나 취소는 검사 1일 전까지 가능합니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="font-korean flex-1 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                "예약 신청하기"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickReservationModal;