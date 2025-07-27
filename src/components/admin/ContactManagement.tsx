import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2,
  Users,
  Building
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Contact {
  id?: number;
  type: 'main' | 'emergency' | 'department' | 'fax';
  title: string;
  phone: string;
  email?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

interface BusinessHours {
  id?: number;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  break_start?: string;
  break_end?: string;
}

interface ClinicInfo {
  id?: number;
  name: string;
  address: string;
  postal_code: string;
  description?: string;
  website?: string;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>({
    name: '',
    address: '',
    postal_code: '',
    description: '',
    website: ''
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingHours, setEditingHours] = useState<BusinessHours | null>(null);
  const [isEditingClinic, setIsEditingClinic] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultBusinessHours = [
    { day_of_week: '월요일', open_time: '09:00', close_time: '18:00', is_closed: false, break_start: '12:00', break_end: '13:00' },
    { day_of_week: '화요일', open_time: '09:00', close_time: '18:00', is_closed: false, break_start: '12:00', break_end: '13:00' },
    { day_of_week: '수요일', open_time: '09:00', close_time: '18:00', is_closed: false, break_start: '12:00', break_end: '13:00' },
    { day_of_week: '목요일', open_time: '09:00', close_time: '18:00', is_closed: false, break_start: '12:00', break_end: '13:00' },
    { day_of_week: '금요일', open_time: '09:00', close_time: '18:00', is_closed: false, break_start: '12:00', break_end: '13:00' },
    { day_of_week: '토요일', open_time: '09:00', close_time: '13:00', is_closed: false },
    { day_of_week: '일요일', open_time: '', close_time: '', is_closed: true }
  ];

  const defaultContacts = [
    { type: 'main' as const, title: '대표전화', phone: '02-1234-5678', email: 'info@himchanhealth.com', description: '일반 상담 및 예약', is_active: true, display_order: 1 },
    { type: 'emergency' as const, title: '응급실', phone: '02-1234-5679', description: '24시간 응급상황 대응', is_active: true, display_order: 2 },
    { type: 'department' as const, title: '영상의학과', phone: '02-1234-5680', email: 'radiology@himchanhealth.com', description: '검사 예약 및 결과 상담', is_active: true, display_order: 3 },
    { type: 'fax' as const, title: '팩스', phone: '02-1234-5681', description: '서류 전송용', is_active: true, display_order: 4 }
  ];

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadContacts(),
        loadBusinessHours(),
        loadClinicInfo()
      ]);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      // 임시로 기본값 설정 (실제 구현에서는 Supabase에서 가져옴)
      setContacts(defaultContacts);
    } catch (error) {
      console.error('연락처 조회 오류:', error);
      setContacts(defaultContacts);
    }
  };

  const loadBusinessHours = async () => {
    try {
      // 임시로 기본값 설정 (실제 구현에서는 Supabase에서 가져옴)
      setBusinessHours(defaultBusinessHours);
    } catch (error) {
      console.error('영업시간 조회 오류:', error);
      setBusinessHours(defaultBusinessHours);
    }
  };

  const loadClinicInfo = async () => {
    try {
      // 임시로 기본값 설정 (실제 구현에서는 Supabase에서 가져옴)
      setClinicInfo({
        name: '현대영상의학과',
        address: '서울특별시 강남구 테헤란로 123 현대빌딩 5층',
        postal_code: '06234',
        description: '정확한 진단과 최신 장비로 건강을 지켜드리는 영상의학과입니다.',
        website: 'https://himchanhealth.com'
      });
    } catch (error) {
      console.error('병원 정보 조회 오류:', error);
    }
  };

  const handleSaveContact = async (contact: Contact) => {
    try {
      if (contact.id) {
        // 수정
        setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
      } else {
        // 새로 추가
        const newContact = { ...contact, id: Date.now() };
        setContacts(prev => [...prev, newContact]);
      }
      setEditingContact(null);
    } catch (error) {
      console.error('연락처 저장 오류:', error);
      alert('연락처 저장에 실패했습니다.');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('이 연락처를 삭제하시겠습니까?')) return;
    
    try {
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('연락처 삭제 오류:', error);
      alert('연락처 삭제에 실패했습니다.');
    }
  };

  const handleSaveBusinessHours = async (hours: BusinessHours) => {
    try {
      setBusinessHours(prev => prev.map(h => 
        h.day_of_week === hours.day_of_week ? hours : h
      ));
      setEditingHours(null);
    } catch (error) {
      console.error('영업시간 저장 오류:', error);
      alert('영업시간 저장에 실패했습니다.');
    }
  };

  const handleSaveClinicInfo = async () => {
    try {
      // 실제 구현에서는 Supabase에 저장
      setIsEditingClinic(false);
      alert('병원 정보가 저장되었습니다.');
    } catch (error) {
      console.error('병원 정보 저장 오류:', error);
      alert('병원 정보 저장에 실패했습니다.');
    }
  };

  const getContactTypeLabel = (type: string) => {
    const labels = {
      main: '대표전화',
      emergency: '응급실',
      department: '부서',
      fax: '팩스'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getContactTypeColor = (type: string) => {
    const colors = {
      main: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800',
      department: 'bg-green-100 text-green-800',
      fax: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">연락처 관리</h1>
      </div>

      {/* 병원 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                병원 정보
              </CardTitle>
              <CardDescription>기본 병원 정보를 관리합니다.</CardDescription>
            </div>
            <Button
              variant={isEditingClinic ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditingClinic(!isEditingClinic)}
            >
              {isEditingClinic ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  취소
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  수정
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">병원명</Label>
                <Input
                  id="clinic-name"
                  value={clinicInfo.name}
                  disabled={!isEditingClinic}
                  onChange={(e) => setClinicInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal-code">우편번호</Label>
                <Input
                  id="postal-code"
                  value={clinicInfo.postal_code}
                  disabled={!isEditingClinic}
                  onChange={(e) => setClinicInfo(prev => ({ ...prev, postal_code: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-address">주소</Label>
              <Input
                id="clinic-address"
                value={clinicInfo.address}
                disabled={!isEditingClinic}
                onChange={(e) => setClinicInfo(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-website">웹사이트</Label>
              <Input
                id="clinic-website"
                value={clinicInfo.website}
                disabled={!isEditingClinic}
                onChange={(e) => setClinicInfo(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinic-description">설명</Label>
              <Textarea
                id="clinic-description"
                value={clinicInfo.description}
                disabled={!isEditingClinic}
                onChange={(e) => setClinicInfo(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            {isEditingClinic && (
              <div className="flex gap-2">
                <Button onClick={handleSaveClinicInfo} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  저장
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 연락처 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                연락처 정보
              </CardTitle>
              <CardDescription>병원 연락처 정보를 관리합니다.</CardDescription>
            </div>
            <Button
              onClick={() => setEditingContact({
                type: 'main',
                title: '',
                phone: '',
                email: '',
                description: '',
                is_active: true,
                display_order: contacts.length + 1
              })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              연락처 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getContactTypeColor(contact.type)}>
                        {getContactTypeLabel(contact.type)}
                      </Badge>
                      <h3 className="font-semibold">{contact.title}</h3>
                      {!contact.is_active && (
                        <Badge variant="secondary">비활성</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                      {contact.description && (
                        <p className="text-gray-500">{contact.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingContact(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => contact.id && handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 진료시간 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            진료시간
          </CardTitle>
          <CardDescription>요일별 진료시간을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((hours) => (
              <div key={hours.day_of_week} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="font-medium w-16">{hours.day_of_week}</span>
                      {hours.is_closed ? (
                        <Badge variant="secondary">휴진</Badge>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <span>{hours.open_time} - {hours.close_time}</span>
                          {hours.break_start && hours.break_end && (
                            <span className="text-gray-500">
                              (점심시간: {hours.break_start} - {hours.break_end})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingHours(hours)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 연락처 편집 모달 */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingContact.id ? '연락처 수정' : '연락처 추가'}
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-type">타입</Label>
                <select
                  id="contact-type"
                  className="w-full p-2 border rounded-md"
                  value={editingContact.type}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, type: e.target.value as Contact['type'] }))}
                >
                  <option value="main">대표전화</option>
                  <option value="emergency">응급실</option>
                  <option value="department">부서</option>
                  <option value="fax">팩스</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-title">제목</Label>
                <Input
                  id="contact-title"
                  value={editingContact.title}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">전화번호</Label>
                <Input
                  id="contact-phone"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">이메일 (선택)</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={editingContact.email || ''}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-description">설명 (선택)</Label>
                <Textarea
                  id="contact-description"
                  value={editingContact.description || ''}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="contact-active"
                  checked={editingContact.is_active}
                  onChange={(e) => setEditingContact(prev => prev && ({ ...prev, is_active: e.target.checked }))}
                />
                <Label htmlFor="contact-active">활성화</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => handleSaveContact(editingContact)}
                className="flex-1"
              >
                저장
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingContact(null)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 진료시간 편집 모달 */}
      {editingHours && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingHours.day_of_week} 진료시간 수정
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hours-closed"
                  checked={editingHours.is_closed}
                  onChange={(e) => setEditingHours(prev => prev && ({ ...prev, is_closed: e.target.checked }))}
                />
                <Label htmlFor="hours-closed">휴진</Label>
              </div>
              {!editingHours.is_closed && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="open-time">시작시간</Label>
                      <Input
                        id="open-time"
                        type="time"
                        value={editingHours.open_time}
                        onChange={(e) => setEditingHours(prev => prev && ({ ...prev, open_time: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="close-time">종료시간</Label>
                      <Input
                        id="close-time"
                        type="time"
                        value={editingHours.close_time}
                        onChange={(e) => setEditingHours(prev => prev && ({ ...prev, close_time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="break-start">점심시작 (선택)</Label>
                      <Input
                        id="break-start"
                        type="time"
                        value={editingHours.break_start || ''}
                        onChange={(e) => setEditingHours(prev => prev && ({ ...prev, break_start: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="break-end">점심종료 (선택)</Label>
                      <Input
                        id="break-end"
                        type="time"
                        value={editingHours.break_end || ''}
                        onChange={(e) => setEditingHours(prev => prev && ({ ...prev, break_end: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => handleSaveBusinessHours(editingHours)}
                className="flex-1"
              >
                저장
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingHours(null)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;