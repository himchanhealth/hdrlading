import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText
} from 'lucide-react';
import { getReservations, ReservationData } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import PatientDetailModal from './PatientDetailModal';

interface CalendarViewProps {
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [patientDetailModal, setPatientDetailModal] = useState<{
    isOpen: boolean;
    patientName: string;
    patientPhone: string;
  }>({
    isOpen: false,
    patientName: '',
    patientPhone: ''
  });

  // 예약 데이터 로드
  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error('예약 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 월의 첫날과 마지막날 계산
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // 캘린더 그리드를 위한 시작일과 끝일 계산 (이전 달 마지막 주와 다음 달 첫째 주 포함)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay()); // 일요일부터 시작
  
  const endDate = new Date(monthEnd);
  const endDateDay = endDate.getDay();
  if (endDateDay !== 6) { // 토요일이 아니면 다음 주 토요일까지
    endDate.setDate(endDate.getDate() + (6 - endDateDay));
  }
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 특정 날짜의 예약 가져오기 (취소된 예약 제외)
  const getReservationsForDate = (date: Date) => {
    return reservations.filter(reservation => {
      const reservationDate = new Date(reservation.preferred_date);
      return isSameDay(reservationDate, date) && reservation.status !== 'cancelled';
    });
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setSelectedDate(null);
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setSelectedDate(null);
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // 환자 카드 클릭 핸들러
  const handlePatientClick = (patientName: string, patientPhone: string) => {
    setPatientDetailModal({
      isOpen: true,
      patientName,
      patientPhone
    });
  };

  // 환자 상세 모달 닫기 핸들러
  const handleClosePatientModal = () => {
    setPatientDetailModal({
      isOpen: false,
      patientName: '',
      patientPhone: ''
    });
  };

  // 선택된 날짜의 예약 목록 (시간순 정렬)
  const selectedDateReservations = selectedDate ? 
    getReservationsForDate(selectedDate).sort((a, b) => {
      const timeA = a.preferred_time || '';
      const timeB = b.preferred_time || '';
      return timeA.localeCompare(timeB);
    }) : [];

  // 상태별 색상 가져오기
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  // 상태별 라벨 가져오기
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '확정';
      case 'cancelled': return '취소';
      default: return '대기';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 캘린더 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                예약 캘린더
              </CardTitle>
              <CardDescription>
                월별 예약 현황을 확인하고 관리하세요
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                오늘
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="px-4 py-2 text-lg font-semibold min-w-[150px] text-center">
                  {format(currentDate, 'yyyy년 M월', { locale: ko })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 캘린더 그리드 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">로딩 중...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* 요일 헤더 */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                      <div
                        key={day}
                        className={`p-3 text-center text-sm font-medium ${
                          index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 날짜 그리드 */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, dayIdx) => {
                      const dayReservations = getReservationsForDate(day);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const isDayToday = isToday(day);
                      const dayOfWeek = day.getDay();

                      return (
                        <button
                          key={day.toString()}
                          onClick={() => handleDateClick(day)}
                          className={`
                            relative p-2 min-h-[80px] border rounded-lg transition-all duration-200 hover:bg-gray-50
                            ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
                            ${isDayToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                            ${!isSameMonth(day, currentDate) ? 'opacity-30 bg-gray-50/50' : ''}
                          `}
                        >
                          <div className="flex flex-col h-full">
                            <span className={`
                              text-sm font-medium mb-1
                              ${!isSameMonth(day, currentDate) ? 'text-gray-400' :
                                isDayToday ? 'text-blue-600' : 
                                dayOfWeek === 0 ? 'text-red-600' : 
                                dayOfWeek === 6 ? 'text-blue-600' : 'text-gray-700'}
                            `}>
                              {format(day, 'd')}
                            </span>
                            
                            {/* 예약 표시 (현재 월의 날짜만) */}
                            <div className="flex-1 flex flex-col gap-1">
                              {isSameMonth(day, currentDate) && dayReservations.length > 0 && (
                                <>
                                  {dayReservations.slice(0, 2).map((reservation, idx) => (
                                    <div
                                      key={reservation.id}
                                      className={`
                                        w-full h-1.5 rounded-full
                                        ${getStatusColor(reservation.status || 'pending')}
                                      `}
                                    />
                                  ))}
                                  {dayReservations.length > 2 && (
                                    <span className="text-xs text-gray-500 font-medium">
                                      +{dayReservations.length - 2}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            {/* 예약 개수 (현재 월의 날짜만) */}
                            {isSameMonth(day, currentDate) && dayReservations.length > 0 && (
                              <Badge
                                variant="secondary"
                                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                              >
                                {dayReservations.length}
                              </Badge>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 선택된 날짜의 예약 목록 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? (
                  <>
                    {format(selectedDate, 'M월 d일 (E)', { locale: ko })}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      예약 {selectedDateReservations.length}건
                    </span>
                  </>
                ) : (
                  '날짜를 선택하세요'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-3">
                  {selectedDateReservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>해당 날짜에 예약이 없습니다.</p>
                    </div>
                  ) : (
                    selectedDateReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handlePatientClick(reservation.patient_name, reservation.patient_phone)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-sm">{reservation.patient_name}</span>
                          </div>
                          <Badge
                            variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}
                            className={`${getStatusColor(reservation.status || 'pending')} text-white text-xs`}
                          >
                            {getStatusLabel(reservation.status || 'pending')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">{reservation.preferred_time || '시간 미정'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            <span>{reservation.exam_type}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>캘린더에서 날짜를 클릭하여</p>
                  <p>예약 내역을 확인하세요.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 환자 상세 정보 모달 */}
      <PatientDetailModal
        isOpen={patientDetailModal.isOpen}
        onClose={handleClosePatientModal}
        patientName={patientDetailModal.patientName}
        patientPhone={patientDetailModal.patientPhone}
      />
    </div>
  );
};

export default CalendarView;