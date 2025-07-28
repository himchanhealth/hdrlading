import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  Calendar, 
  User, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface NotificationData {
  id: string;
  type: 'reservation' | 'cancellation' | 'change';
  title: string;
  message: string;
  patientName: string;
  phone: string;
  examType: string;
  preferredDate: string;
  preferredTime: string;
  timestamp: Date;
  isRead: boolean;
}

interface ReservationNotificationProps {
  notifications: NotificationData[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onNavigateToReservation?: (notification: NotificationData) => void;
}

const ReservationNotification = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onNavigateToReservation
}: ReservationNotificationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNewNotificationAlert, setShowNewNotificationAlert] = useState(false);
  const [latestNotification, setLatestNotification] = useState<NotificationData | null>(null);
  const shownToastsRef = useRef<Set<string>>(new Set());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 새로운 알림이 오면 알림창 표시
  useEffect(() => {
    console.log('🔔 ReservationNotification - 알림 변경됨:', notifications.length, '개');
    console.log('🔔 현재 알림 목록:', notifications.map(n => ({ id: n.id, timestamp: n.timestamp, isRead: n.isRead })));
    
    const now = new Date();
    const recentThreshold = 60 * 1000; // 60초로 증가 (1분 이내의 알림)
    
    // 읽지 않은 알림 중에서 최근 1분 이내에 생성된 것들만 필터링
    const recentNotifications = notifications.filter(n => {
      const notificationTime = new Date(n.timestamp);
      const timeDiff = now.getTime() - notificationTime.getTime();
      const isRecent = timeDiff < recentThreshold;
      const isUnread = !n.isRead;
      const notShownYet = !shownToastsRef.current.has(n.id);
      
      console.log(`🔔 알림 ${n.id}: 시간차이=${timeDiff}ms, 최근=${isRecent}, 미읽음=${isUnread}, 미표시=${notShownYet}`);
      
      return isUnread && isRecent && notShownYet;
    });
    
    console.log('🔔 표시할 최근 알림:', recentNotifications.length, '개');
    console.log('🔔 이미 표시된 알림 ID들:', Array.from(shownToastsRef.current));
    
    if (recentNotifications.length > 0) {
      // 가장 최근 알림을 표시 (배열의 첫 번째가 가장 최근)
      const newest = recentNotifications[0];
      console.log('🔔 새로운 알림창 표시:', newest);
      
      // 이미 표시된 알림으로 기록
      recentNotifications.forEach(n => {
        shownToastsRef.current.add(n.id);
        console.log('🔔 알림 ID 추가됨:', n.id);
      });
      
      setLatestNotification(newest);
      setShowNewNotificationAlert(true);
      
      // 8초 후 자동으로 알림창 닫기 (시간 연장)
      setTimeout(() => {
        console.log('🔔 알림창 자동 닫기');
        setShowNewNotificationAlert(false);
      }, 8000);
    } else {
      console.log('🔔 표시할 새로운 알림이 없음');
    }
  }, [notifications]);

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'cancellation':
        return <X className="h-4 w-4 text-red-500" />;
      case 'change':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'reservation':
        return 'border-l-blue-500 bg-blue-50';
      case 'cancellation':
        return 'border-l-red-500 bg-red-50';
      case 'change':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <>

      {/* 우측 상단 알림 벨 아이콘 */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsExpanded(!isExpanded);
            // 알림 아이콘 클릭 시 새로운 알림창 닫기
            if (showNewNotificationAlert) {
              setShowNewNotificationAlert(false);
            }
          }}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* 새로운 알림 팝업 */}
        {showNewNotificationAlert && latestNotification && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-300">
            <div className={`border-l-4 ${getNotificationColor(latestNotification.type)} p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getNotificationIcon(latestNotification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {latestNotification.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                        NEW
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {latestNotification.message}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{latestNotification.patientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{latestNotification.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{latestNotification.preferredDate} {latestNotification.preferredTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewNotificationAlert(false)}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex justify-end mt-3 space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onMarkAsRead(latestNotification.id);
                    setShowNewNotificationAlert(false);
                  }}
                  className="text-xs h-7"
                >
                  확인
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onMarkAsRead(latestNotification.id);
                    setShowNewNotificationAlert(false);
                    // 예약 관리 페이지로 이동
                    if (onNavigateToReservation) {
                      onNavigateToReservation(latestNotification);
                    }
                  }}
                  className="text-xs h-7"
                >
                  상세보기
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 알림 드롭다운 */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-96 bg-white border rounded-lg shadow-lg z-40 max-h-96 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900">알림</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    모두 읽음
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => {
                      onMarkAsRead(notification.id);
                      setIsExpanded(false);
                      // 예약 관리 페이지로 이동
                      if (onNavigateToReservation) {
                        console.log('🎯 알림 드롭다운에서 클릭 - 예약 관리 탭으로 이동:', notification);
                        onNavigateToReservation(notification);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{notification.patientName}</span>
                          <span>{notification.phone}</span>
                          <span>
                            {format(notification.timestamp, 'MM/dd HH:mm', { locale: ko })}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReservationNotification;