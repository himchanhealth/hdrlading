import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  FileText,
  Download,
  Filter,
  Activity,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { subscribeToReservations, ReservationData } from '@/lib/supabase';
import { format, subDays, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ReportStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  totalPatients: number;
  activePatients: number;
  examTypeStats: { [key: string]: number };
  monthlyTrend: { month: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  peakHours: { hour: string; count: number }[];
}

const ReportsManagement = () => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [reportPeriod, setReportPeriod] = useState<'7days' | '30days' | '3months' | '6months' | 'custom'>('30days');
  const [stats, setStats] = useState<ReportStats>({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    cancelledReservations: 0,
    totalPatients: 0,
    activePatients: 0,
    examTypeStats: {},
    monthlyTrend: [],
    dailyTrend: [],
    statusDistribution: [],
    peakHours: []
  });

  // 실시간 예약 데이터 구독
  useEffect(() => {
    console.log('📊 리포트: 실시간 구독 시작...');
    const unsubscribe = subscribeToReservations((data) => {
      console.log('📊 리포트 데이터 업데이트:', data.length, '개');
      setReservations(data);
      calculateStats(data);
      setLoading(false);
    });

    return () => {
      console.log('📊 리포트: 구독 해제...');
      unsubscribe();
    };
  }, []);

  // 기간 변경 시 통계 재계산
  useEffect(() => {
    if (reservations.length > 0) {
      calculateStats(reservations);
    }
  }, [dateRange, reportPeriod]);

  // 보고서 기간 설정
  const handlePeriodChange = (period: string) => {
    setReportPeriod(period as '7days' | '30days' | '3months' | '1year');
    const now = new Date();
    
    switch (period) {
      case '7days':
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case '30days':
        setDateRange({ from: subDays(now, 30), to: now });
        break;
      case '3months':
        setDateRange({ from: subMonths(now, 3), to: now });
        break;
      case '6months':
        setDateRange({ from: subMonths(now, 6), to: now });
        break;
      default:
        // custom은 수동으로 설정
        break;
    }
  };

  // 통계 계산
  const calculateStats = (data: ReservationData[]) => {
    // 날짜 필터링
    const filteredData = data.filter(reservation => {
      const reservationDate = new Date(reservation.created_at);
      if (dateRange.from && dateRange.to) {
        return isWithinInterval(reservationDate, { start: dateRange.from, end: dateRange.to });
      }
      return true;
    });

    // 기본 통계
    const totalReservations = filteredData.length;
    const pendingReservations = filteredData.filter(r => r.status === 'pending').length;
    const confirmedReservations = filteredData.filter(r => r.status === 'confirmed').length;
    const cancelledReservations = filteredData.filter(r => r.status === 'cancelled').length;

    // 환자 수 (중복 제거)
    const uniquePatients = new Set(filteredData.map(r => r.patient_phone));
    const totalPatients = uniquePatients.size;
    const activePatients = new Set(
      filteredData
        .filter(r => new Date(r.created_at) > subDays(new Date(), 30))
        .map(r => r.patient_phone)
    ).size;

    // 검사 유형별 통계
    const examTypeStats: { [key: string]: number } = {};
    filteredData.forEach(reservation => {
      const examType = reservation.exam_type;
      examTypeStats[examType] = (examTypeStats[examType] || 0) + 1;
    });

    // 월별 트렌드 (최근 6개월)
    const monthlyTrend: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthData = filteredData.filter(r => {
        const createdDate = new Date(r.created_at);
        return isWithinInterval(createdDate, { start: monthStart, end: monthEnd });
      });
      
      monthlyTrend.push({
        month: format(date, 'yyyy.MM', { locale: ko }),
        count: monthData.length
      });
    }

    // 일별 트렌드 (선택된 기간)
    const dailyTrend: { date: string; count: number }[] = [];
    if (dateRange.from && dateRange.to) {
      const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      for (let i = 0; i <= days; i++) {
        const date = new Date(dateRange.from);
        date.setDate(date.getDate() + i);
        const dayData = filteredData.filter(r => {
          const createdDate = new Date(r.created_at);
          return format(createdDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        });
        
        dailyTrend.push({
          date: format(date, 'MM.dd', { locale: ko }),
          count: dayData.length
        });
      }
    }

    // 상태별 분포
    const statusDistribution = [
      { 
        status: '대기', 
        count: pendingReservations, 
        percentage: totalReservations > 0 ? Math.round((pendingReservations / totalReservations) * 100) : 0 
      },
      { 
        status: '확정', 
        count: confirmedReservations, 
        percentage: totalReservations > 0 ? Math.round((confirmedReservations / totalReservations) * 100) : 0 
      },
      { 
        status: '취소', 
        count: cancelledReservations, 
        percentage: totalReservations > 0 ? Math.round((cancelledReservations / totalReservations) * 100) : 0 
      }
    ];

    // 시간대별 예약 분포
    const hourStats: { [key: string]: number } = {};
    filteredData.forEach(reservation => {
      if (reservation.preferred_time) {
        const hour = reservation.preferred_time.split(':')[0] + '시';
        hourStats[hour] = (hourStats[hour] || 0) + 1;
      }
    });

    const peakHours = Object.entries(hourStats)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
      totalPatients,
      activePatients,
      examTypeStats,
      monthlyTrend,
      dailyTrend,
      statusDistribution,
      peakHours
    });
  };

  // 검사 타입 한글 변환
  const getExamTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'mri': 'MRI',
      'ct': 'CT',
      'pet-ct': 'PET-CT',
      'ultrasound': '초음파',
      'xray': 'X-ray',
      'mammography': '유방촬영',
      'bone-density': '골밀도',
      'comprehensive': '종합검진',
      'brain-checkup': '뇌검진',
      'heart-checkup': '심장검진',
      'other': '기타'
    };
    return typeMap[type] || type;
  };

  // 보고서 내보내기
  const exportReport = () => {
    const reportData = {
      period: `${format(dateRange.from!, 'yyyy.MM.dd')} - ${format(dateRange.to!, 'yyyy.MM.dd')}`,
      stats,
      generatedAt: format(new Date(), 'yyyy.MM.dd HH:mm:ss')
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `reservation-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">리포트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            예약 통계 리포트
          </h2>
          <p className="text-muted-foreground">
            예약 현황과 병원 운영 통계를 한눈에 확인하세요
          </p>
        </div>
        <Button onClick={exportReport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          리포트 내보내기
        </Button>
      </div>

      {/* 기간 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            리포트 기간 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">기간 선택</label>
              <Select value={reportPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">최근 7일</SelectItem>
                  <SelectItem value="30days">최근 30일</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                  <SelectItem value="custom">사용자 지정</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {reportPeriod === 'custom' && (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium mb-2 block">날짜 범위</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          format(dateRange.from, 'yyyy.MM.dd')
                        ) : (
                          <span>시작일 선택</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-center py-2">~</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange.to ? (
                          format(dateRange.to, 'yyyy.MM.dd')
                        ) : (
                          <span>종료일 선택</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예약수</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
            <p className="text-xs text-muted-foreground">
              선택된 기간 내 전체 예약
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">확정 예약</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedReservations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalReservations > 0 ? Math.round((stats.confirmedReservations / stats.totalReservations) * 100) : 0}% 확정률
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 환자수</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              중복 제거한 실제 환자 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 환자</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground">
              최근 30일 내 방문
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 예약 상태 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              예약 상태 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === '대기' ? 'bg-yellow-500' :
                      item.status === '확정' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.count}건</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 검사 유형별 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              검사 유형별 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.examTypeStats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([type, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{getExamTypeLabel(type)}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalReservations > 0 ? (count / stats.totalReservations) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 트렌드 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 월별 트렌드 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              월별 예약 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.monthlyTrend.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm w-16">{item.month}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.max(...stats.monthlyTrend.map(m => m.count)) > 0 ? 
                            (item.count / Math.max(...stats.monthlyTrend.map(m => m.count))) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 인기 시간대 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              인기 예약 시간대
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.peakHours.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {index + 1}위
                    </Badge>
                    <span className="text-sm">{item.hour}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.peakHours.length > 0 ? 
                            (item.count / stats.peakHours[0].count) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{item.count}건</span>
                  </div>
                </div>
              ))}
              {stats.peakHours.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  시간대별 데이터가 없습니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 요약 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            리포트 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">예약 현황</h4>
              <ul className="text-sm space-y-1">
                <li>• 총 {stats.totalReservations}건의 예약</li>
                <li>• 확정률: {stats.totalReservations > 0 ? Math.round((stats.confirmedReservations / stats.totalReservations) * 100) : 0}%</li>
                <li>• 취소율: {stats.totalReservations > 0 ? Math.round((stats.cancelledReservations / stats.totalReservations) * 100) : 0}%</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">환자 정보</h4>
              <ul className="text-sm space-y-1">
                <li>• 총 {stats.totalPatients}명의 환자</li>
                <li>• 활성 환자: {stats.activePatients}명</li>
                <li>• 평균 예약/환자: {stats.totalPatients > 0 ? (stats.totalReservations / stats.totalPatients).toFixed(1) : 0}건</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">인기 검사</h4>
              <ul className="text-sm space-y-1">
                {Object.entries(stats.examTypeStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([type, count], index) => (
                    <li key={index}>• {getExamTypeLabel(type)}: {count}건</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;