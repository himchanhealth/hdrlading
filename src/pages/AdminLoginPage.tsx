import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // 이미 로그인된 사용자인지 확인
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email === 'admin@himchanhealth.com') {
      window.location.href = '/admin';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (email !== 'admin@himchanhealth.com') {
      setError('관리자 계정이 아닙니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Supabase 인증 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('로그인 오류:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('이메일 인증이 필요합니다. 이메일을 확인해주세요.');
        } else {
          setError('로그인 중 오류가 발생했습니다: ' + error.message);
        }
        return;
      }

      if (data.user) {
        // 관리자 권한 확인
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (!adminUser) {
          setError('관리자 권한이 없습니다.');
          await supabase.auth.signOut();
          return;
        }

        // 성공적으로 로그인됨
        console.log('로그인 성공:', data.user);
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 임시 접속 함수 (개발용)
  const handleTempLogin = () => {
    // 개발 중에는 임시로 관리자 페이지 접근 허용
    console.log('임시 관리자 접속');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/logo.png" 
            alt="현대영상의학과의원" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            관리자 로그인
          </h2>
          <p className="text-gray-600">
            현대영상의학과의원 관리자 시스템
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              관리자 계정으로 로그인해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@himchanhealth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>

            {/* 개발용 임시 접속 버튼 */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500 mb-3 text-center">
                개발용 (Supabase 인증 설정 전)
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleTempLogin}
                disabled={loading}
              >
                임시 관리자 접속
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                관리자 계정 문의: 
                <a 
                  href="tel:063-272-3323" 
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  063-272-3323
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <a 
            href="/" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← 메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;