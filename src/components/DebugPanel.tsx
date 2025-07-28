import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { sendCrossTabNotification } from '@/lib/crossTabNotification';

const DebugPanel = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<any>({});
  const { notifyNewReservation, notifications } = useNotificationContext();

  useEffect(() => {
    // 환경 정보 수집
    setEnvironment({
      url: window.location.href,
      userAgent: navigator.userAgent,
      localStorage: typeof localStorage !== 'undefined',
      broadcastChannel: typeof BroadcastChannel !== 'undefined',
      notification: 'Notification' in window,
      notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported',
      timestamp: new Date().toISOString()
    });

    // 기존 콘솔 로그 캡처
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev.slice(-50), `[LOG] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
    };

    const originalError = console.error;
    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev.slice(-50), `[ERROR] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const testLocalNotification = () => {
    console.log('🧪 로컬 알림 테스트 시작');
    notifyNewReservation({
      patientName: '테스트환자',
      phone: '010-1234-5678',
      examType: 'MRI 검사',
      preferredDate: '2024-12-01',
      preferredTime: '10:00'
    });
  };

  const testCrossTabNotification = () => {
    console.log('🧪 탭 간 알림 테스트 시작');
    sendCrossTabNotification({
      type: 'NEW_RESERVATION',
      data: {
        patientName: '크로스탭테스트',
        phone: '010-9876-5432',
        examType: 'CT 검사',
        preferredDate: '2024-12-01',
        preferredTime: '14:00',
        timestamp: new Date().toISOString()
      }
    });
  };

  const testBrowserNotification = () => {
    console.log('🧪 브라우저 알림 테스트 시작');
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('테스트 알림', {
          body: '브라우저 알림이 정상 작동합니다.',
          icon: '/favicon.ico'
        });
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('테스트 알림', {
              body: '브라우저 알림이 정상 작동합니다.',
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  const checkLocalStorage = () => {
    console.log('🧪 localStorage 테스트 시작');
    try {
      const testKey = 'debug_test';
      const testValue = { test: true, timestamp: new Date().toISOString() };
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = localStorage.getItem(testKey);
      console.log('localStorage 저장/읽기 성공:', retrieved);
      localStorage.removeItem(testKey);
    } catch (error) {
      console.error('localStorage 테스트 실패:', error);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="bg-white shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-blue-800">
            🧪 디버그 패널
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 환경 정보 */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-700">환경 정보</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <Badge variant={environment.localStorage ? "default" : "destructive"}>
                localStorage: {environment.localStorage ? '✓' : '✗'}
              </Badge>
              <Badge variant={environment.broadcastChannel ? "default" : "destructive"}>
                BroadcastChannel: {environment.broadcastChannel ? '✓' : '✗'}
              </Badge>
              <Badge variant={environment.notification ? "default" : "destructive"}>
                Notification: {environment.notification ? '✓' : '✗'}
              </Badge>
              <Badge variant={environment.notificationPermission === 'granted' ? "default" : "secondary"}>
                권한: {environment.notificationPermission}
              </Badge>
            </div>
          </div>

          {/* 알림 상태 */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-700">알림 상태</h4>
            <Badge variant="outline">
              현재 알림: {notifications.length}개
            </Badge>
          </div>

          {/* 테스트 버튼들 */}
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" onClick={testLocalNotification} className="text-xs">
              로컬 알림
            </Button>
            <Button size="sm" onClick={testCrossTabNotification} className="text-xs">
              탭간 알림
            </Button>
            <Button size="sm" onClick={testBrowserNotification} className="text-xs">
              브라우저 알림
            </Button>
            <Button size="sm" onClick={checkLocalStorage} className="text-xs">
              localStorage
            </Button>
          </div>

          {/* 로그 영역 */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-gray-700">로그</h4>
              <Button size="sm" variant="outline" onClick={clearLogs} className="text-xs px-2 py-1">
                지우기
              </Button>
            </div>
            <div className="bg-gray-900 text-green-400 p-2 rounded text-xs h-32 overflow-y-auto font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-500">로그가 없습니다...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* URL 정보 */}
          <div className="text-xs text-gray-500 truncate">
            URL: {environment.url}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;