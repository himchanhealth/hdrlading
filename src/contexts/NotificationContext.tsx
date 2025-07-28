import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useNotifications, createReservationNotification } from '@/hooks/useNotifications';
import { NotificationData } from '@/components/admin/ReservationNotification';
import { sendCrossTabNotification, subscribeToCrossTabNotifications, CrossTabNotificationData } from '@/lib/crossTabNotification';

interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  // 예약 관련 편의 함수들
  notifyNewReservation: (data: {
    patientName: string;
    phone: string;
    examType: string;
    preferredDate: string;
    preferredTime: string;
  }) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  console.log('🔔 NotificationProvider 렌더링됨');
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll
  } = useNotifications();
  
  console.log('🔔 현재 알림 개수:', notifications.length);

  // 탭 간 알림 수신 설정
  useEffect(() => {
    const unsubscribe = subscribeToCrossTabNotifications((crossTabNotification: CrossTabNotificationData) => {
      console.log('🔄 다른 탭으로부터 알림 수신:', crossTabNotification);
      
      if (crossTabNotification.type === 'NEW_RESERVATION') {
        // 크로스 탭 알림을 로컬 알림으로 변환
        const notification = createReservationNotification(crossTabNotification.data);
        addNotification(notification);
        console.log('🔄 크로스 탭 알림을 로컬 알림으로 추가 완료');
      }
    });

    return unsubscribe;
  }, [addNotification]);

  // 새 예약 알림을 추가하는 편의 함수
  const notifyNewReservation = (data: {
    patientName: string;
    phone: string;
    examType: string;
    preferredDate: string;
    preferredTime: string;
  }) => {
    console.log('🔔 NotificationContext - notifyNewReservation 호출됨:', data);
    console.log('🔔 현재 URL:', window.location.href);
    console.log('🔔 현재 시간:', new Date().toISOString());
    
    try {
      // 로컬 알림 추가
      const notification = createReservationNotification(data);
      console.log('🔔 생성된 알림 객체:', notification);
      addNotification(notification);
      console.log('✅ 로컬 알림 추가 완료');
      
      // 다른 탭으로도 알림 전송
      const crossTabData = {
        type: 'NEW_RESERVATION' as const,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('🔄 탭 간 알림 전송 시작:', crossTabData);
      sendCrossTabNotification(crossTabData);
      console.log('✅ 탭 간 알림 전송 완료');
      
      // 브라우저 알림도 표시 (권한이 있는 경우)
      console.log('🔔 브라우저 알림 권한 상태:', Notification.permission);
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          console.log('🔔 브라우저 알림 표시 중...');
          try {
            new Notification('새로운 예약 신청', {
              body: `${data.patientName}님이 ${data.examType} 예약을 신청했습니다.`,
              icon: '/favicon.ico',
              tag: 'reservation',
              requireInteraction: true
            });
            console.log('✅ 브라우저 알림 표시 완료');
          } catch (notificationError) {
            console.error('❌ 브라우저 알림 표시 실패:', notificationError);
          }
        } else if (Notification.permission === 'default') {
          console.log('🔔 브라우저 알림 권한 요청 중...');
          Notification.requestPermission().then(permission => {
            console.log('🔔 브라우저 알림 권한 결과:', permission);
            if (permission === 'granted') {
              try {
                new Notification('새로운 예약 신청', {
                  body: `${data.patientName}님이 ${data.examType} 예약을 신청했습니다.`,
                  icon: '/favicon.ico',
                  tag: 'reservation',
                  requireInteraction: true
                });
                console.log('✅ 권한 승인 후 브라우저 알림 표시 완료');
              } catch (notificationError) {
                console.error('❌ 권한 승인 후 브라우저 알림 표시 실패:', notificationError);
              }
            }
          });
        } else {
          console.log('🔔 브라우저 알림 권한이 거부됨');
        }
      } else {
        console.log('🔔 브라우저가 Notification API를 지원하지 않음');
      }
      
    } catch (error) {
      console.error('❌ notifyNewReservation 전체 오류:', error);
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    notifyNewReservation
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// 브라우저 알림 권한을 요청하는 함수
export const requestNotificationPermission = async (): Promise<boolean> => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};