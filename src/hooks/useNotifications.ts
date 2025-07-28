import { useState, useCallback, useEffect } from 'react';
import { NotificationData } from '@/components/admin/ReservationNotification';

interface UseNotificationsReturn {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // 로컬 스토리지에서 알림 데이터 로드
  useEffect(() => {
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('알림 데이터 로드 실패:', error);
      }
    }
  }, []);

  // 알림 데이터를 로컬 스토리지에 저장
  const saveToStorage = useCallback((notificationList: NotificationData[]) => {
    localStorage.setItem('admin_notifications', JSON.stringify(notificationList));
  }, []);

  // 새 알림 추가
  const addNotification = useCallback((notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => {
    console.log('🔔 useNotifications - addNotification 호출됨:', notification);
    const newNotification: NotificationData = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };
    console.log('🔔 새로운 알림 생성됨:', newNotification);

    setNotifications(prev => {
      console.log('🔔 현재 알림 목록:', prev.length, '개');
      const updated = [newNotification, ...prev];
      // 최대 50개까지만 보관
      const trimmed = updated.slice(0, 50);
      console.log('🔔 업데이트된 알림 목록:', trimmed.length, '개');
      saveToStorage(trimmed);
      return trimmed;
    });
  }, [saveToStorage]);

  // 알림을 읽음으로 표시
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 모든 알림을 읽음으로 표시
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 알림 삭제
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 모든 알림 삭제
  const clearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem('admin_notifications');
  }, []);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll
  };
};

// 예약 관련 알림을 생성하는 헬퍼 함수들
export const createReservationNotification = (data: {
  patientName: string;
  phone: string;
  examType: string;
  preferredDate: string;
  preferredTime: string;
}): Omit<NotificationData, 'id' | 'timestamp' | 'isRead'> => ({
  type: 'reservation',
  title: '새로운 예약 신청',
  message: `${data.patientName}님이 ${data.examType} 예약을 신청했습니다.`,
  patientName: data.patientName,
  phone: data.phone,
  examType: data.examType,
  preferredDate: data.preferredDate,
  preferredTime: data.preferredTime
});

export const createCancellationNotification = (data: {
  patientName: string;
  phone: string;
  examType: string;
  preferredDate: string;
  preferredTime: string;
}): Omit<NotificationData, 'id' | 'timestamp' | 'isRead'> => ({
  type: 'cancellation',
  title: '예약 취소 요청',
  message: `${data.patientName}님이 예약을 취소 요청했습니다.`,
  patientName: data.patientName,
  phone: data.phone,
  examType: data.examType,
  preferredDate: data.preferredDate,
  preferredTime: data.preferredTime
});

export const createChangeNotification = (data: {
  patientName: string;
  phone: string;
  examType: string;
  preferredDate: string;
  preferredTime: string;
}): Omit<NotificationData, 'id' | 'timestamp' | 'isRead'> => ({
  type: 'change',
  title: '예약 변경 요청',
  message: `${data.patientName}님이 예약 변경을 요청했습니다.`,
  patientName: data.patientName,
  phone: data.phone,
  examType: data.examType,
  preferredDate: data.preferredDate,
  preferredTime: data.preferredTime
});