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
const CHANNEL_NAME = 'notification_channel';

// BroadcastChannel 지원 여부 확인
const supportsBroadcastChannel = typeof BroadcastChannel !== 'undefined';
let broadcastChannel: BroadcastChannel | null = null;

if (supportsBroadcastChannel) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    console.log('🔄 BroadcastChannel 초기화 완료');
  } catch (error) {
    console.warn('🔄 BroadcastChannel 초기화 실패:', error);
  }
}

// 다른 탭으로 알림 전송
export const sendCrossTabNotification = (notificationData: CrossTabNotificationData) => {
  console.log('🔄 탭 간 알림 전송:', notificationData);
  const message = {
    ...notificationData,
    id: `cross_tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  // 방법 1: BroadcastChannel 사용 (더 안정적)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
      console.log('✅ BroadcastChannel로 알림 전송 완료');
    } catch (error) {
      console.warn('❌ BroadcastChannel 전송 실패:', error);
    }
  }
  
  // 방법 2: localStorage 이벤트 사용 (백업)
  try {
    // localStorage에 직접 저장하여 다른 탭에서 감지할 수 있도록 함
    const existingData = localStorage.getItem(NOTIFICATION_KEY);
    const notifications = existingData ? JSON.parse(existingData) : [];
    notifications.push(message);
    
    // 최근 10개 알림만 유지
    if (notifications.length > 10) {
      notifications.splice(0, notifications.length - 10);
    }
    
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
    
    // 즉시 제거하지 않고 일정 시간 후 정리
    setTimeout(() => {
      const currentData = localStorage.getItem(NOTIFICATION_KEY);
      if (currentData) {
        const currentNotifications = JSON.parse(currentData);
        const filteredNotifications = currentNotifications.filter((n: any) => 
          new Date().getTime() - new Date(n.timestamp).getTime() < 60000 // 1분 이내 알림만 유지
        );
        if (filteredNotifications.length !== currentNotifications.length) {
          localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(filteredNotifications));
        }
      }
    }, 5000);
    
    console.log('✅ localStorage로 알림 저장 완료');
  } catch (error) {
    console.warn('❌ localStorage 저장 실패:', error);
  }
};

// 다른 탭으로부터의 알림 수신
export const subscribeToCrossTabNotifications = (
  callback: (notification: CrossTabNotificationData) => void
) => {
  console.log('🔄 탭 간 알림 구독 시작');
  const processedNotifications = new Set<string>();
  
  // 방법 1: BroadcastChannel 수신
  const handleBroadcastMessage = (event: MessageEvent) => {
    try {
      const notification = event.data as CrossTabNotificationData;
      const notificationId = notification.id || `${notification.data.patientName}_${notification.data.timestamp}`;
      
      if (!processedNotifications.has(notificationId)) {
        processedNotifications.add(notificationId);
        console.log('🔄 BroadcastChannel 알림 수신:', notification);
        callback(notification);
      }
    } catch (error) {
      console.error('BroadcastChannel 알림 파싱 오류:', error);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }
  
  // 방법 2: localStorage 이벤트 수신 (백업)
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === NOTIFICATION_KEY && event.newValue) {
      try {
        const notifications = JSON.parse(event.newValue) as CrossTabNotificationData[];
        const recentNotifications = notifications.filter(n => 
          new Date().getTime() - new Date(n.timestamp).getTime() < 60000 // 60초 이내로 증가
        );
        
        recentNotifications.forEach(notification => {
          const notificationId = notification.id || `${notification.data.patientName}_${notification.data.timestamp}`;
          
          if (!processedNotifications.has(notificationId)) {
            processedNotifications.add(notificationId);
            console.log('🔄 localStorage 알림 수신:', notification);
            callback(notification);
          }
        });
      } catch (error) {
        console.error('localStorage 알림 파싱 오류:', error);
      }
    }
  };

  window.addEventListener('storage', handleStorageEvent);
  
  // 방법 3: 주기적으로 localStorage 확인 (추가 백업)
  const checkStoredNotifications = () => {
    try {
      const storedData = localStorage.getItem(NOTIFICATION_KEY);
      if (storedData) {
        const notifications = JSON.parse(storedData) as CrossTabNotificationData[];
        const recentNotifications = notifications.filter(n => 
          new Date().getTime() - new Date(n.timestamp).getTime() < 60000 // 60초 이내로 증가
        );
        
        recentNotifications.forEach(notification => {
          const notificationId = notification.id || `${notification.data.patientName}_${notification.data.timestamp}`;
          
          if (!processedNotifications.has(notificationId)) {
            processedNotifications.add(notificationId);
            console.log('🔄 주기적 확인으로 알림 발견:', notification);
            callback(notification);
          }
        });
      }
    } catch (error) {
      console.error('주기적 알림 확인 오류:', error);
    }
  };

  // 5초마다 확인
  const intervalId = setInterval(checkStoredNotifications, 5000);
  
  // 구독 해제 함수 반환
  return () => {
    console.log('🔄 탭 간 알림 구독 해제');
    
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    
    window.removeEventListener('storage', handleStorageEvent);
    clearInterval(intervalId);
  };
};