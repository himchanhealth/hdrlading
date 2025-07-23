import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, AlertCircle, CheckCircle, MapPin, Phone, User, Building, Clock } from 'lucide-react';

interface ClinicData {
  // 기본 정보
  name: string;
  englishName: string;
  representative: string;
  businessNumber: string;
  
  // 연락처 정보
  phone: string;
  fax: string;
  email: string;
  website: string;
  
  // 주소 정보
  zipCode: string;
  address: string;
  detailAddress: string;
  
  // 진료 정보
  departments: string;
  specialties: string;
  equipment: string;
  
  // 진료 시간
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  holidayHours: string;
  lunchBreak: string;
  
  // 추가 정보
  parking: string;
  publicTransport: string;
  notes: string;
}

const ClinicInfo = () => {
  const [clinicData, setClinicData] = useState<ClinicData>({
    name: '현대영상의학과의원',
    englishName: 'Hyundai Radiology Clinic',
    representative: '문무창',
    businessNumber: '418-96-00878',
    
    phone: '063-272-3323',
    fax: '',
    email: 'admin@himchanhealth.com',
    website: 'https://himchanhealth.com',
    
    zipCode: '54896',
    address: '전북 전주시 덕진구 백제대로 631',
    detailAddress: '1층',
    
    departments: '영상의학과',
    specialties: 'MRI, CT, 초음파, X-ray, 유방촬영술, 골밀도 검사',
    equipment: 'MRI 1.5T, CT 64채널, 디지털 X-ray, 초음파 진단기',
    
    weekdayHours: '09:00 - 18:00',
    saturdayHours: '09:00 - 13:00',
    sundayHours: '휴진',
    holidayHours: '휴진',
    lunchBreak: '12:30 - 13:30',
    
    parking: '병원 전용 주차장 20대 (무료)',
    publicTransport: '시내버스 정류장 도보 2분',
    notes: '예약제 운영으로 대기시간 단축'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: keyof ClinicData, value: string) => {
    setClinicData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 로컬 스토리지에 저장 (실제 환경에서는 API 호출)
      localStorage.setItem('clinicData', JSON.stringify(clinicData));
      
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        
        setTimeout(() => setSaved(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('저장 중 오류:', error);
      setSaving(false);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('clinicData');
    if (savedData) {
      try {
        setClinicData(JSON.parse(savedData));
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">병원 정보 관리</h2>
          <p className="text-gray-600 mt-1">병원의 상세 정보를 관리합니다.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              저장 중...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              변경사항 저장
            </>
          )}
        </Button>
      </div>

      {saved && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            변경사항이 성공적으로 저장되었습니다.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="contact">연락처</TabsTrigger>
          <TabsTrigger value="address">주소</TabsTrigger>
          <TabsTrigger value="medical">진료 정보</TabsTrigger>
          <TabsTrigger value="hours">진료 시간</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                기본 정보
              </CardTitle>
              <CardDescription>
                병원의 기본적인 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">병원명</Label>
                  <Input
                    id="name"
                    value={clinicData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="englishName">영문명</Label>
                  <Input
                    id="englishName"
                    value={clinicData.englishName}
                    onChange={(e) => handleInputChange('englishName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="representative">대표자</Label>
                  <Input
                    id="representative"
                    value={clinicData.representative}
                    onChange={(e) => handleInputChange('representative', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessNumber">사업자등록번호</Label>
                  <Input
                    id="businessNumber"
                    value={clinicData.businessNumber}
                    onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                연락처 정보
              </CardTitle>
              <CardDescription>
                병원의 연락처 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">대표 전화</Label>
                  <Input
                    id="phone"
                    value={clinicData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">팩스</Label>
                  <Input
                    id="fax"
                    value={clinicData.fax}
                    onChange={(e) => handleInputChange('fax', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    value={clinicData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                주소 정보
              </CardTitle>
              <CardDescription>
                병원의 주소와 위치 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">우편번호</Label>
                  <Input
                    id="zipCode"
                    value={clinicData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">기본 주소</Label>
                  <Input
                    id="address"
                    value={clinicData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="detailAddress">상세 주소</Label>
                <Input
                  id="detailAddress"
                  value={clinicData.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parking">주차 안내</Label>
                <Input
                  id="parking"
                  value={clinicData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publicTransport">대중교통</Label>
                <Input
                  id="publicTransport"
                  value={clinicData.publicTransport}
                  onChange={(e) => handleInputChange('publicTransport', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                진료 정보
              </CardTitle>
              <CardDescription>
                진료과, 전문분야, 장비 등의 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departments">진료과</Label>
                <Input
                  id="departments"
                  value={clinicData.departments}
                  onChange={(e) => handleInputChange('departments', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties">전문 분야</Label>
                <Textarea
                  id="specialties"
                  value={clinicData.specialties}
                  onChange={(e) => handleInputChange('specialties', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment">보유 장비</Label>
                <Textarea
                  id="equipment"
                  value={clinicData.equipment}
                  onChange={(e) => handleInputChange('equipment', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">기타 안내사항</Label>
                <Textarea
                  id="notes"
                  value={clinicData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                진료 시간
              </CardTitle>
              <CardDescription>
                요일별 진료 시간을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekdayHours">평일 (월~금)</Label>
                  <Input
                    id="weekdayHours"
                    value={clinicData.weekdayHours}
                    onChange={(e) => handleInputChange('weekdayHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saturdayHours">토요일</Label>
                  <Input
                    id="saturdayHours"
                    value={clinicData.saturdayHours}
                    onChange={(e) => handleInputChange('saturdayHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sundayHours">일요일</Label>
                  <Input
                    id="sundayHours"
                    value={clinicData.sundayHours}
                    onChange={(e) => handleInputChange('sundayHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holidayHours">공휴일</Label>
                  <Input
                    id="holidayHours"
                    value={clinicData.holidayHours}
                    onChange={(e) => handleInputChange('holidayHours', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lunchBreak">점심시간</Label>
                <Input
                  id="lunchBreak"
                  value={clinicData.lunchBreak}
                  onChange={(e) => handleInputChange('lunchBreak', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClinicInfo;