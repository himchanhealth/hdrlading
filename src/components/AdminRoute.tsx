import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLoginPage from '@/pages/AdminLoginPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. 현재 로그인된 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // 2. 관리자 권한 확인
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .eq('role', 'admin')
        .single();

      if (error || !adminUser) {
        console.log('관리자 권한 없음:', error);
        setIsAdmin(false);
        // 관리자가 아닌 경우 로그아웃
        await supabase.auth.signOut();
        setIsAuthenticated(false);
      } else {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않았거나 관리자가 아닌 경우 로그인 페이지
  if (!isAuthenticated || !isAdmin) {
    return <AdminLoginPage />;
  }

  // 인증된 관리자인 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default AdminRoute;