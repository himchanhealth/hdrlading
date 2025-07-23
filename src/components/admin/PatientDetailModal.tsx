import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  User,
  Phone,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Mail,
  Cake,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  History
} from 'lucide-react';
import { getPatientHistory, ReservationData } from '@/lib/supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientPhone: string;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientPhone
}) => {
  const [patientHistory, setPatientHistory] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && patientName && patientPhone) {
      loadPatientHistory();
    }
  }, [isOpen, patientName, patientPhone]);

  const loadPatientHistory = async () => {
    try {
      setLoading(true);
      const history = await getPatientHistory(patientName, patientPhone);
      setPatientHistory(history);
    } catch (error) {
      console.error('환자 내역 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 상태별 아이콘 및 색상 가져오기
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: CheckCircle,
          label: '확정됨',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          badgeVariant: 'default' as const
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: '취소됨',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          badgeVariant: 'destructive' as const
        };
      default:
        return {
          icon: AlertCircle,
          label: '대기중',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          badgeVariant: 'secondary' as const
        };
    }
  };

  // 검사 종류 한글 변환
  const getExamTypeName = (examType: string) => {
    const examTypes: { [key: string]: string } = {
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
      'other': '기타'
    };
    return examTypes[examType] || examType;
  };

  // 통계 계산
  const stats = {
    total: patientHistory.length,
    confirmed: patientHistory.filter(r => r.status === 'confirmed').length,
    pending: patientHistory.filter(r => r.status === 'pending').length,
    cancelled: patientHistory.filter(r => r.status === 'cancelled').length,
  };

  // 최근 예약 정보
  const latestReservation = patientHistory[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            {patientName} 환자 상세정보
          </DialogTitle>
          <DialogDescription>
            환자의 기본 정보와 예약 내역을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">환자 정보를 불러오는 중...</span>
            </div>
          ) : (
            <>
              {/* 환자 기본 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    기본 정보
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">이름:</span>
                        <span>{patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">연락처:</span>
                        <span>{patientPhone}</span>
                      </div>
                      {latestReservation && (
                        <>
                          <div className="flex items-center gap-2">
                            <Cake className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">생년월일:</span>
                            <span>{latestReservation.patient_birth_date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">성별:</span>
                            <span>{latestReservation.patient_gender === 'male' ? '남성' : '여성'}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* 예약 통계 */}
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        예약 통계
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-lg">{stats.total}</div>
                          <div className="text-xs text-gray-600">총 예약</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-lg text-green-600">{stats.confirmed}</div>
                          <div className="text-xs text-gray-600">확정</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-bold text-lg text-yellow-600">{stats.pending}</div>
                          <div className="text-xs text-gray-600">대기</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-bold text-lg text-red-600">{stats.cancelled}</div>
                          <div className="text-xs text-gray-600">취소</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 예약 내역 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    예약 내역 ({patientHistory.length}건)
                  </CardTitle>
                  <CardDescription>
                    최신 예약부터 시간순으로 정렬되어 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 w-full">
                    {patientHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>예약 내역이 없습니다.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patientHistory.map((reservation, index) => {
                          const statusInfo = getStatusInfo(reservation.status || 'pending');
                          const StatusIcon = statusInfo.icon;
                          
                          return (
                            <div
                              key={reservation.id}
                              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1 rounded-full ${statusInfo.bgColor}`}>
                                    <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                                  </div>
                                  <span className="font-medium text-sm">
                                    예약 #{patientHistory.length - index}
                                  </span>
                                </div>
                                <Badge variant={statusInfo.badgeVariant}>
                                  {statusInfo.label}
                                </Badge>
                              </div>

                              <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-600">예약일:</span>
                                    <span className="font-medium">
                                      {format(new Date(reservation.preferred_date), 'yyyy년 M월 d일 (E)', { locale: ko })}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-600">시간:</span>
                                    <span className="font-medium">{reservation.preferred_time || '미정'}</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <FileText className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-600">검사:</span>
                                    <span className="font-medium">{getExamTypeName(reservation.exam_type)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-600">신청일:</span>
                                    <span className="text-xs text-gray-500">
                                      {reservation.created_at && format(new Date(reservation.created_at), 'yyyy.MM.dd', { locale: ko })}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {reservation.notes && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-xs text-gray-600">
                                    <strong>요청사항:</strong> {reservation.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}

          {/* 닫기 버튼 */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailModal;