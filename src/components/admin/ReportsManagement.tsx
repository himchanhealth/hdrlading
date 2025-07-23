import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import StatCard from './charts/StatCard';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import { 
  getReservationStats, 
  getBoardPostStats, 
  getDailyReservationTrend 
} from '@/lib/supabase';

interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  examTypes: Record<string, number>;
  monthlyTrend: Array<{ month: string; count: number }>;
}

interface BoardStats {
  total: number;
  published: number;
  draft: number;
  pinned: number;
  categories: Record<string, number>;
  totalViews: number;
  averageViews: number;
  monthlyPosts: Array<{ month: string; count: number }>;
}

interface DailyTrend {
  date: string;
  count: number;
}

const ReportsManagement: React.FC = () => {
  const [reservationStats, setReservationStats] = useState<ReservationStats | null>(null);
  const [boardStats, setBoardStats] = useState<BoardStats | null>(null);
  const [dailyTrend, setDailyTrend] = useState<DailyTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [reservationData, boardData, dailyData] = await Promise.all([
        getReservationStats(),
        getBoardPostStats(),
        getDailyReservationTrend()
      ]);

      setReservationStats(reservationData);
      setBoardStats(boardData);
      setDailyTrend(dailyData);
    } catch (error) {
      console.error('리포트 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 예약 상태별 데이터 변환
  const reservationStatusData = reservationStats ? [
    { name: '대기', value: reservationStats.pending, color: '#F59E0B' },
    { name: '확정', value: reservationStats.confirmed, color: '#10B981' },
    { name: '취소', value: reservationStats.cancelled, color: '#EF4444' }
  ] : [];

  // 검사 유형별 데이터 변환
  const examTypeData = reservationStats ? 
    Object.entries(reservationStats.examTypes).map(([name, value]) => ({
      name,
      value
    })) : [];

  // 카테고리별 게시글 데이터 변환
  const categoryData = boardStats ?
    Object.entries(boardStats.categories).map(([name, value]) => ({
      name,
      value
    })) : [];

  // 일별 트렌드 데이터 변환
  const dailyTrendData = dailyTrend.map(item => ({
    name: item.date,
    value: item.count
  }));

  // 월별 예약 트렌드 데이터 변환
  const monthlyReservationData = reservationStats?.monthlyTrend?.map(item => ({
    name: item.month.replace('년 ', '/').replace('월', ''),
    value: item.count
  })) || [];

  // 월별 게시글 트렌드 데이터 변환
  const monthlyPostData = boardStats?.monthlyPosts?.map(item => ({
    name: item.month.replace('년 ', '/').replace('월', ''),
    value: item.count
  })) || [];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 예약"
          value={reservationStats?.total || 0}
          icon={Calendar}
          color="blue"
          description="전체 예약 건수"
        />
        <StatCard
          title="대기 중인 예약"
          value={reservationStats?.pending || 0}
          icon={Users}
          color="yellow"
          description="확인이 필요한 예약"
        />
        <StatCard
          title="총 게시글"
          value={boardStats?.total || 0}
          icon={FileText}
          color="green"
          description="전체 게시글 수"
        />
        <StatCard
          title="총 조회수"
          value={boardStats?.totalViews || 0}
          icon={Eye}
          color="purple"
          description="누적 조회수"
        />
      </div>

      {/* 예약 관련 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title="예약 상태 분포"
          data={reservationStatusData}
          height={350}
        />
        <BarChart
          title="검사 유형별 예약"
          data={examTypeData}
          height={350}
          xAxisLabel="검사 유형"
          yAxisLabel="예약 수"
        />
      </div>

      {/* 트렌드 차트들 */}
      <div className="grid grid-cols-1 gap-6">
        <LineChart
          title="월별 예약 트렌드"
          data={monthlyReservationData}
          height={300}
          color="#3B82F6"
          xAxisLabel="월"
          yAxisLabel="예약 수"
        />
      </div>

      {/* 게시판 관련 차트들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          title="카테고리별 게시글"
          data={categoryData}
          height={350}
        />
        <BarChart
          title="월별 게시글 발행"
          data={monthlyPostData}
          height={350}
          color="#10B981"
          xAxisLabel="월"
          yAxisLabel="게시글 수"
        />
      </div>

      {/* 일별 예약 트렌드 (최근 30일) */}
      {dailyTrendData.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <LineChart
            title="일별 예약 트렌드 (최근 30일)"
            data={dailyTrendData}
            height={300}
            color="#8B5CF6"
            xAxisLabel="날짜"
            yAxisLabel="예약 수"
            showDots={false}
          />
        </div>
      )}

      {/* 상세 통계 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              예약 상세 통계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">총 예약</div>
                <div className="text-xl font-bold">{reservationStats?.total || 0}건</div>
              </div>
              <div>
                <div className="text-gray-500">확정률</div>
                <div className="text-xl font-bold text-green-600">
                  {reservationStats?.total ? 
                    ((reservationStats.confirmed / reservationStats.total) * 100).toFixed(1) + '%' 
                    : '0%'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-500">대기 중</div>
                <div className="text-xl font-bold text-yellow-600">{reservationStats?.pending || 0}건</div>
              </div>
              <div>
                <div className="text-gray-500">취소율</div>
                <div className="text-xl font-bold text-red-600">
                  {reservationStats?.total ? 
                    ((reservationStats.cancelled / reservationStats.total) * 100).toFixed(1) + '%' 
                    : '0%'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              게시판 상세 통계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">총 게시글</div>
                <div className="text-xl font-bold">{boardStats?.total || 0}개</div>
              </div>
              <div>
                <div className="text-gray-500">발행률</div>
                <div className="text-xl font-bold text-green-600">
                  {boardStats?.total ? 
                    ((boardStats.published / boardStats.total) * 100).toFixed(1) + '%' 
                    : '0%'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-500">평균 조회수</div>
                <div className="text-xl font-bold text-blue-600">{boardStats?.averageViews || 0}회</div>
              </div>
              <div>
                <div className="text-gray-500">고정글</div>
                <div className="text-xl font-bold text-purple-600">{boardStats?.pinned || 0}개</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsManagement;