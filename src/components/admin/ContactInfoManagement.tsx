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
  Edit, 
  Save, 
  X, 
  Plus,
  Trash2
} from 'lucide-react';

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

const ContactInfoManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const defaultContacts = [
    { type: 'main' as const, title: '대표전화', phone: '02-1234-5678', email: 'info@himchanhealth.com', description: '일반 상담 및 예약', is_active: true, display_order: 1 },
    { type: 'emergency' as const, title: '응급실', phone: '02-1234-5679', description: '24시간 응급상황 대응', is_active: true, display_order: 2 },
    { type: 'department' as const, title: '영상의학과', phone: '02-1234-5680', email: 'radiology@himchanhealth.com', description: '검사 예약 및 결과 상담', is_active: true, display_order: 3 },
    { type: 'fax' as const, title: '팩스', phone: '02-1234-5681', description: '서류 전송용', is_active: true, display_order: 4 }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      // 임시로 기본값 설정 (실제 구현에서는 Supabase에서 가져옴)
      setContacts(defaultContacts);
    } catch (error) {
      console.error('연락처 조회 오류:', error);
      setContacts(defaultContacts);
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default ContactInfoManagement;