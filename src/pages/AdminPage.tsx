import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  CalendarDays,
  Phone, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Users,
  FileText,
  LogOut
} from 'lucide-react';
import CalendarView from '@/components/admin/CalendarView';
import PatientDetailModal from '@/components/admin/PatientDetailModal';
import AdminSidebar from '@/components/AdminSidebar';
import BoardManagement from '@/components/admin/BoardManagement';
import ContentManagement from '@/components/admin/ContentManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import { getReservations, updateReservationStatus, ReservationData } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { sendReservationConfirmationSMS } from '@/lib/sms';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const AdminPage = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [patientDetailModal, setPatientDetailModal] = useState<{
    isOpen: boolean;
    patientName: string;
    patientPhone: string;
  }>({
    isOpen: false,
    patientName: '',
    patientPhone: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0
  });

  useEffect(() => {
    checkUser();
    loadReservations();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data);
      
      // 통계 계산
      const stats = data.reduce((acc, reservation) => {
        acc.total++;
        acc[reservation.status || 'pending']++;
        return acc;
      }, { total: 0, pending: 0, confirmed: 0, cancelled: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('예약 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const success = await updateReservationStatus(id, newStatus);
      if (success) {
        // 로컬 상태 업데이트
        setReservations(prev => 
          prev.map(reservation => 
            reservation.id === id 
              ? { ...reservation, status: newStatus, updated_at: new Date().toISOString() }
              : reservation
          )
        );
        
        // 예약 확정 시 SMS 알림 전송
        if (newStatus === 'confirmed') {
          const reservation = reservations.find(r => r.id === id);
          if (reservation) {
            try {
              // 날짜 형식 변환 (안전한 방식)
              let appointmentDate = reservation.preferred_date || '';
              try {
                if (appointmentDate) {
                  const dateObj = new Date(appointmentDate);
                  if (!isNaN(dateObj.getTime())) {
                    appointmentDate = format(dateObj, 'yyyy년 M월 d일', { locale: ko });
                  }
                }
              } catch (dateError) {
                console.warn('날짜 형식 변환 실패:', dateError);
                appointmentDate = reservation.preferred_date || '날짜 미정';
              }
              const appointmentTime = reservation.preferred_time || '시간 미정';
              
              // 전화번호 확인
              if (!reservation.patient_phone || reservation.patient_phone.trim() === '') {
                alert(`예약이 확정되었습니다.\n${reservation.patient_name}님의 전화번호가 등록되지 않아 문자를 발송할 수 없습니다.\n직접 연락해주세요.`);
              } else {
                const smsResult = await sendReservationConfirmationSMS(
                  reservation.patient_phone,
                  reservation.patient_name,
                  reservation.exam_type,
                  appointmentDate,
                  appointmentTime
                );
                
                if (smsResult) {
                  alert(`예약이 확정되었습니다.\n${reservation.patient_name}님께 확정 알림 문자를 발송했습니다.\n(발송번호: ${reservation.patient_phone})`);
                } else {
                  alert(`예약이 확정되었습니다.\n문자 발송에 실패했습니다. 직접 연락해주세요.\n(연락처: ${reservation.patient_phone})`);
                }
              }
            } catch (smsError) {
              console.error('SMS 발송 오류:', smsError);
              alert(`예약이 확정되었습니다.\n문자 발송 중 오류가 발생했습니다. 직접 연락해주세요.`);
            }
          }
        } else if (newStatus === 'cancelled') {
          alert('예약이 취소되었습니다.');
        } else {
          alert('상태가 변경되었습니다.');
        }
        
        // 통계 재계산
        await loadReservations();
      } else {
        alert('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };


  // 환자 상세 모달 열기
  const handlePatientClick = (patientName: string, patientPhone: string) => {
    setPatientDetailModal({
      isOpen: true,
      patientName,
      patientPhone
    });
  };

  // 환자 상세 모달 닫기
  const handleClosePatientModal = () => {
    setPatientDetailModal({
      isOpen: false,
      patientName: '',
      patientPhone: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: '대기중', variant: 'secondary' as const, icon: AlertCircle },
      confirmed: { label: '확정됨', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: '취소됨', variant: 'destructive' as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getExamTypeName = (examType: string): string => {
    const examTypes: Record<string, string> = {
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
      'other': '기타 (상담 후 결정)'
    };
    
    return examTypes[examType] || examType;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const renderBoardManagement = () => {
    return <BoardManagement />;
  };

  const renderContentManagement = () => {
    return <ContentManagement />;
  };

  // 필터링된 예약 목록
  const filteredReservations = reservations.filter(reservation => {
    if (statusFilter === 'all') return true;
    return reservation.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // 리포트 케이스 처리
    if (activeTab === 'reports') {
      return <ReportsManagement />;
    }
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* 통계 카드 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">전체 예약</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">대기중</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">확정됨</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">취소됨</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                </CardContent>
              </Card>
            </div>

            {/* 최근 예약 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 예약 신청</CardTitle>
                <CardDescription>
                  최근에 신청된 예약 목록입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.slice(0, 5).map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePatientClick(reservation.patient_name, reservation.patient_phone)}
                    >
                      <div className="flex items-center space-x-4">
                        <User className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{reservation.patient_name}</p>
                          <p className="text-sm text-gray-500">{getExamTypeName(reservation.exam_type)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reservation.status || 'pending')}
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDateTime(reservation.created_at || '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );


      case 'calendar':
        return <CalendarView />;
      
      case 'content-basic':
        return renderContentManagement();
      
      case 'board-management':
        return renderBoardManagement();

      case 'reservations':
        return (
          <div className="space-y-6">
            {/* 대기중 예약 알림 카드 */}
            {stats.pending > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      확정 대기중인 예약이 <span className="font-bold text-lg">{stats.pending}건</span> 있습니다.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* 예약 관리 콘텐츠 */}
            <Card>
              <CardHeader>
                <CardTitle>예약 관리</CardTitle>
                <CardDescription>
                  모든 예약을 조회하고 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 상태 필터 버튼 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className={`flex items-center gap-2 ${
                      statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    전체 ({stats.total})
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                    className={`flex items-center gap-2 ${
                      statusFilter === 'pending' 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'hover:bg-yellow-50 text-yellow-600 border-yellow-200'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    대기중 ({stats.pending})
                  </Button>
                  <Button
                    variant={statusFilter === 'confirmed' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('confirmed')}
                    className={`flex items-center gap-2 ${
                      statusFilter === 'confirmed' 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'hover:bg-green-50 text-green-600 border-green-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    확정됨 ({stats.confirmed})
                  </Button>
                  <Button
                    variant={statusFilter === 'cancelled' ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('cancelled')}
                    className={`flex items-center gap-2 ${
                      statusFilter === 'cancelled' 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'hover:bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    취소됨 ({stats.cancelled})
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredReservations.map((reservation) => (
                    <div 
                      key={reservation.id} 
                      className="border rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePatientClick(reservation.patient_name, reservation.patient_phone)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <User className="h-6 w-6 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {reservation.patient_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {reservation.patient_gender === 'male' ? '남성' : '여성'} • 
                              생년월일: {reservation.patient_birth_date}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(reservation.status || 'pending')}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{reservation.patient_phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{getExamTypeName(reservation.exam_type)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{reservation.preferred_date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{reservation.preferred_time}</span>
                          </div>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <p className="text-sm"><strong>추가 요청사항:</strong></p>
                          <p className="text-sm text-gray-700">{reservation.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          신청일: {formatDateTime(reservation.created_at || '')}
                          {reservation.updated_at !== reservation.created_at && (
                            <> • 수정일: {formatDateTime(reservation.updated_at || '')}</>
                          )}
                        </p>
                        
                        <div className="flex space-x-2">
                          {reservation.status !== 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(reservation.id!, 'confirmed');
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              확정
                            </Button>
                          )}
                          {reservation.status !== 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(reservation.id!, 'pending');
                              }}
                            >
                              대기
                            </Button>
                          )}
                          {reservation.status !== 'cancelled' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(reservation.id!, 'cancelled');
                              }}
                            >
                              취소
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>선택된 메뉴의 기능</p>
                <p className="text-sm">현재 activeTab: {activeTab}</p>
                <p className="text-sm">해당 기능이 구현 중입니다.</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        stats={stats}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">현대영상의학과 관리자</h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user?.email || 'admin@himchanhealth.com'}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 p-6">
          {renderContent()}
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

export default AdminPage;