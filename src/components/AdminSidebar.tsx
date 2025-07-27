import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  FileText,
  Settings,
  Image,
  Globe,
  Mail,
  BarChart3,
  MessageSquare,
  Shield,
  Phone,
  MapPin,
  Clock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Newspaper
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
  stats?: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  className,
  stats
}) => {
  console.log('🔍 AdminSidebar props 확인:');
  console.log('🔍 onTabChange 타입:', typeof onTabChange);
  console.log('🔍 onTabChange 이름:', onTabChange.name);
  console.log('🔍 activeTab:', activeTab);
  
  const [contentExpanded, setContentExpanded] = useState(true);
  
  const menuItems = [
    {
      id: 'dashboard',
      label: '대시보드',
      icon: LayoutDashboard,
      badge: null,
      section: 'main'
    },
    {
      id: 'reservations',
      label: '예약 관리',
      icon: Calendar,
      badge: stats?.pending || 0,
      section: 'main'
    },
    {
      id: 'patients',
      label: '환자 관리',
      icon: Users,
      badge: null,
      section: 'main'
    },
    {
      id: 'calendar',
      label: '캘린더',
      icon: CalendarDays,
      badge: null,
      section: 'main'
    },
    {
      id: 'reports',
      label: '리포트',
      icon: BarChart3,
      badge: null,
      section: 'main'
    },
    // 프론트엔드 관리 섹션
    {
      id: 'content',
      label: '콘텐츠 관리',
      icon: FileText,
      badge: null,
      section: 'frontend',
      hasSubMenu: true,
      subItems: [
        {
          id: 'content-basic',
          label: '기본 콘텐츠',
          icon: FileText
        },
        {
          id: 'board-management',
          label: '게시판 관리',
          icon: Newspaper
        }
      ]
    },
    {
      id: 'images',
      label: '이미지 관리',
      icon: Image,
      badge: null,
      section: 'frontend'
    },
    {
      id: 'pages',
      label: '페이지 관리',
      icon: Globe,
      badge: null,
      section: 'frontend'
    },
    {
      id: 'notifications',
      label: '알림 관리',
      icon: Mail,
      badge: null,
      section: 'frontend'
    },
    // 설정 섹션
    {
      id: 'clinic-info',
      label: '병원 정보',
      icon: MapPin,
      badge: null,
      section: 'settings'
    },
    {
      id: 'business-hours',
      label: '진료 시간',
      icon: Clock,
      badge: null,
      section: 'settings'
    },
    {
      id: 'contact',
      label: '연락처 관리',
      icon: Phone,
      badge: null,
      section: 'settings'
    },
    {
      id: 'security',
      label: '보안 설정',
      icon: Shield,
      badge: null,
      section: 'settings'
    },
    {
      id: 'system',
      label: '시스템 설정',
      icon: Settings,
      badge: null,
      section: 'settings'
    }
  ];

  const sections = {
    main: '주요 기능',
    frontend: '프론트엔드 관리',
    settings: '설정'
  };

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">관리자</h2>
              <p className="text-sm text-gray-500">현대영상의학과</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 메뉴 */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
            <div key={sectionKey}>
              {!collapsed && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {sectionLabel}
                </div>
              )}
              
              {menuItems
                .filter(item => item.section === sectionKey)
                .map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const hasSubItems = item.hasSubMenu && item.subItems;
                  
                  return (
                    <div key={item.id}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start mb-1",
                          collapsed ? "px-2" : "px-3",
                          isActive && "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                        onClick={() => {
                          console.log('🎯 사이드바 메뉴 클릭됨:', item.id);
                          console.log('🎯 onTabChange 함수 타입:', typeof onTabChange);
                          console.log('🎯 onTabChange 함수 이름:', onTabChange.name);
                          console.log('🎯 onTabChange 함수 toString:', onTabChange.toString().substring(0, 100));
                          
                          if (hasSubItems && !collapsed) {
                            if (item.id === 'content') {
                              setContentExpanded(!contentExpanded);
                            }
                          } else {
                            console.log('🎯 onTabChange 호출 시작:', item.id);
                            try {
                              const result = onTabChange(item.id);
                              console.log('🎯 onTabChange 호출 결과:', result);
                            } catch (error) {
                              console.error('🎯 onTabChange 호출 오류:', error);
                            }
                            console.log('🎯 onTabChange 호출 완료:', item.id);
                          }
                        }}
                      >
                        <Icon className={cn(
                          "h-4 w-4 flex-shrink-0",
                          collapsed ? "" : "mr-3"
                        )} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <Badge 
                                variant="secondary" 
                                className="ml-auto bg-red-100 text-red-800 mr-2"
                              >
                                {item.badge}
                              </Badge>
                            )}
                            {hasSubItems && (
                              <div className="ml-auto">
                                {item.id === 'content' && contentExpanded ? (
                                  <ChevronUp className="h-3 w-3" />
                                ) : (
                                  <ChevronDown className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </Button>
                      
                      {/* 서브 메뉴 */}
                      {hasSubItems && !collapsed && item.id === 'content' && contentExpanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems?.map(subItem => {
                            const SubIcon = subItem.icon;
                            const isSubActive = activeTab === subItem.id;
                            
                            return (
                              <Button
                                key={subItem.id}
                                variant={isSubActive ? "default" : "ghost"}
                                size="sm"
                                className={cn(
                                  "w-full justify-start pl-4 text-sm",
                                  isSubActive && "bg-blue-500 text-white hover:bg-blue-600"
                                )}
                                onClick={() => onTabChange(subItem.id)}
                              >
                                <SubIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                                <span className="flex-1 text-left">{subItem.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              
              {/* 섹션 구분선 */}
              {!collapsed && sectionKey !== 'settings' && (
                <div className="my-4 border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "px-2" : "px-3"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn(
            "h-4 w-4 flex-shrink-0",
            collapsed ? "" : "mr-3"
          )} />
          {!collapsed && <span>로그아웃</span>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;