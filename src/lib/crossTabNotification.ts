// 탭 간 알림 통신을 위한 유틸리티
export interface CrossTabNotificationData {
  type: 'NEW_RESERVATION' | 'RESERVATION_UPDATE';
  data: {
    patientName: string;
    phone: string;
    examType: string;
    preferredDate: string;
    preferredTime: string;
    timestamp: string;
  };
}

const NOTIFICATION_KEY = 'cross_tab_notification';

// 다른 탭으로 알림 전송
export const sendCrossTabNotification = (notificationData: CrossTabNotificationData) => {
  console.log('🔄 탭 간 알림 전송:', notificationData);
  const message = {
    ...notificationData,
    id: `cross_tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  // localStorage에 임시로 저장했다가 즉시 제거하여 storage 이벤트 발생
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(message));
  localStorage.removeItem(NOTIFICATION_KEY);
};

// 다른 탭으로부터의 알림 수신
export const subscribeToCrossTabNotifications = (
  callback: (notification: CrossTabNotificationData) => void
) => {
  console.log('🔄 탭 간 알림 구독 시작');
  
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === NOTIFICATION_KEY && event.newValue) {
      try {
        const notification = JSON.parse(event.newValue) as CrossTabNotificationData;
        console.log('🔄 탭 간 알림 수신:', notification);
        callback(notification);
      } catch (error) {
        console.error('탭 간 알림 파싱 오류:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageEvent);
  
  // 구독 해제 함수 반환
  return () => {
    console.log('🔄 탭 간 알림 구독 해제');
    window.removeEventListener('storage', handleStorageEvent);
  };
};