import { createClient } from '@supabase/supabase-js';

// Supabase 설정
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://gttwyjidrqjopxmxfphz.supabase.co';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dHd5amlkcnFqb3B4bXhmcGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODc2OTgsImV4cCI6MjA2ODY2MzY5OH0.zcUJ1Me9q3k08t7Zv27NL1WRsajDtjFsC75hvtvQQLs';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface ReservationData {
  id?: number;
  patient_name: string;
  patient_phone: string;
  patient_birth_date: string;
  patient_gender: 'male' | 'female';
  exam_type: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

// 의료진 데이터 타입 정의
export interface MedicalStaffData {
  id?: number;
  name: string;
  position: string;
  specialty: string;
  experience?: string;
  education?: string;
  philosophy?: string;
  photo_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// 게시판 데이터 타입 정의
export interface BoardPostData {
  id?: number;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_published: boolean;
  view_count: number;
  author: string;
  created_at?: string;
  updated_at?: string;
}

// 예약 데이터 저장 함수
export const saveReservation = async (data: Omit<ReservationData, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: ReservationData; error?: string }> => {
  try {
    console.log('Supabase에 예약 데이터 저장 중...', data);

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert([
        {
          ...data,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase 저장 오류:', error);
      return { success: false, error: error.message };
    }

    console.log('Supabase 저장 성공:', reservation);
    return { success: true, data: reservation };
  } catch (error) {
    console.error('예약 저장 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

// 예약 데이터 조회 함수
export const getReservations = async (): Promise<ReservationData[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('예약 조회 중 오류:', error);
    return [];
  }
};

// 예약 상태 업데이트 함수
export const updateReservationStatus = async (id: number, status: 'pending' | 'confirmed' | 'cancelled'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error('상태 업데이트 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('상태 업데이트 중 오류:', error);
    return false;
  }
};

// 환자별 예약 내역 조회 함수
export const getPatientHistory = async (patientName: string, patientPhone: string): Promise<ReservationData[]> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('patient_name', patientName)
      .eq('patient_phone', patientPhone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('환자 내역 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('환자 내역 조회 중 오류:', error);
    return [];
  }
};

// ========== 의료진 관련 함수들 ==========

// 의료진 목록 조회
export const getMedicalStaff = async (): Promise<MedicalStaffData[]> => {
  try {
    const { data, error } = await supabase
      .from('medical_staff')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('의료진 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('의료진 조회 중 오류:', error);
    return [];
  }
};

// 의료진 추가
export const addMedicalStaff = async (data: Omit<MedicalStaffData, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: MedicalStaffData; error?: string }> => {
  try {
    const { data: staff, error } = await supabase
      .from('medical_staff')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('의료진 추가 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: staff };
  } catch (error) {
    console.error('의료진 추가 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

// 의료진 수정
export const updateMedicalStaff = async (id: number, data: Partial<MedicalStaffData>): Promise<{ success: boolean; data?: MedicalStaffData; error?: string }> => {
  try {
    const { data: staff, error } = await supabase
      .from('medical_staff')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('의료진 수정 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: staff };
  } catch (error) {
    console.error('의료진 수정 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

// 의료진 삭제 (비활성화)
export const deactivateMedicalStaff = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('medical_staff')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('의료진 비활성화 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('의료진 비활성화 중 오류:', error);
    return false;
  }
};

// ========== 게시판 관련 함수들 ==========

// 게시글 목록 조회 (공개된 글만)
export const getBoardPosts = async (category?: string, limit?: number): Promise<BoardPostData[]> => {
  try {
    let query = supabase
      .from('board_posts')
      .select('*')
      .eq('is_published', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('게시글 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('게시글 조회 중 오류:', error);
    return [];
  }
};

// 모든 게시글 조회 (관리자용)
export const getAllBoardPosts = async (): Promise<BoardPostData[]> => {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('모든 게시글 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('모든 게시글 조회 중 오류:', error);
    return [];
  }
};

// 게시글 상세 조회
export const getBoardPost = async (id: number): Promise<BoardPostData | null> => {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      console.error('게시글 상세 조회 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('게시글 상세 조회 중 오류:', error);
    return null;
  }
};

// 게시글 추가
export const addBoardPost = async (data: Omit<BoardPostData, 'id' | 'view_count' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: BoardPostData; error?: string }> => {
  try {
    const { data: post, error } = await supabase
      .from('board_posts')
      .insert([{ ...data, view_count: 0 }])
      .select()
      .single();

    if (error) {
      console.error('게시글 추가 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error('게시글 추가 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

// 게시글 수정
export const updateBoardPost = async (id: number, data: Partial<BoardPostData>): Promise<{ success: boolean; data?: BoardPostData; error?: string }> => {
  try {
    const { data: post, error } = await supabase
      .from('board_posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('게시글 수정 오류:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: post };
  } catch (error) {
    console.error('게시글 수정 중 오류:', error);
    return { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류' };
  }
};

// 게시글 삭제
export const deleteBoardPost = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('board_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('게시글 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('게시글 삭제 중 오류:', error);
    return false;
  }
};

// 조회수 증가
export const incrementViewCount = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('board_posts')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', id);

    if (error) {
      console.error('조회수 증가 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('조회수 증가 중 오류:', error);
    return false;
  }
};

// ========== 리포트 통계 관련 함수들 ==========

// 예약 통계 데이터 조회
export const getReservationStats = async () => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*');

    if (error) {
      console.error('예약 통계 조회 오류:', error);
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        examTypes: {},
        monthlyTrend: []
      };
    }

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    // 기본 통계
    const stats = {
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      confirmed: data.filter(r => r.status === 'confirmed').length,
      cancelled: data.filter(r => r.status === 'cancelled').length,
      examTypes: {} as Record<string, number>,
      monthlyTrend: [] as Array<{ month: string, count: number }>
    };

    // 검사 유형별 통계
    data.forEach(reservation => {
      const examType = reservation.exam_type;
      stats.examTypes[examType] = (stats.examTypes[examType] || 0) + 1;
    });

    // 월별 트렌드 (최근 6개월)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
      const monthData = data.filter(r => {
        const createdDate = new Date(r.created_at);
        return createdDate.getFullYear() === date.getFullYear() &&
               createdDate.getMonth() === date.getMonth();
      });
      
      stats.monthlyTrend.push({
        month: monthKey,
        count: monthData.length
      });
    }

    return stats;
  } catch (error) {
    console.error('예약 통계 조회 중 오류:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      examTypes: {},
      monthlyTrend: []
    };
  }
};

// 기간별 예약 데이터 조회
export const getDateRangeReservations = async (startDate: string, endDate: string) => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('기간별 예약 조회 오류:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('기간별 예약 조회 중 오류:', error);
    return [];
  }
};

// 게시판 통계 데이터 조회
export const getBoardPostStats = async () => {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .select('*');

    if (error) {
      console.error('게시판 통계 조회 오류:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        pinned: 0,
        categories: {},
        totalViews: 0,
        averageViews: 0,
        monthlyPosts: []
      };
    }

    const now = new Date();
    
    // 기본 통계
    const stats = {
      total: data.length,
      published: data.filter(p => p.is_published).length,
      draft: data.filter(p => !p.is_published).length,
      pinned: data.filter(p => p.is_pinned).length,
      categories: {} as Record<string, number>,
      totalViews: data.reduce((sum, p) => sum + (p.view_count || 0), 0),
      averageViews: 0,
      monthlyPosts: [] as Array<{ month: string, count: number }>
    };

    // 평균 조회수
    stats.averageViews = data.length > 0 ? Math.round(stats.totalViews / data.length) : 0;

    // 카테고리별 통계
    data.forEach(post => {
      const category = post.category;
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });

    // 월별 게시글 수 (최근 6개월)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
      const monthData = data.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate.getFullYear() === date.getFullYear() &&
               createdDate.getMonth() === date.getMonth();
      });
      
      stats.monthlyPosts.push({
        month: monthKey,
        count: monthData.length
      });
    }

    return stats;
  } catch (error) {
    console.error('게시판 통계 조회 중 오류:', error);
    return {
      total: 0,
      published: 0,
      draft: 0,
      pinned: 0,
      categories: {},
      totalViews: 0,
      averageViews: 0,
      monthlyPosts: []
    };
  }
};

// 일별 예약 트렌드 (최근 30일)
export const getDailyReservationTrend = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('reservations')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('일별 트렌드 조회 오류:', error);
      return [];
    }

    // 일별 그룹핑
    const dailyCount: Record<string, number> = {};
    data.forEach(reservation => {
      const date = new Date(reservation.created_at).toLocaleDateString('ko-KR');
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });

    // 배열로 변환
    return Object.entries(dailyCount).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('일별 트렌드 조회 중 오류:', error);
    return [];
  }
};

console.log('Supabase 클라이언트 초기화됨:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});