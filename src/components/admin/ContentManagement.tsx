import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, AlertCircle, CheckCircle, Image, FileText, MapPin, Phone, Clock } from 'lucide-react';

interface SiteContent {
  hospitalName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  address: string;
  phone: string;
  businessHours: string;
  logoUrl: string;
  heroImageUrl: string;
}

const ContentManagement = () => {
  const [content, setContent] = useState<SiteContent>({
    hospitalName: '현대영상의학과의원',
    heroTitle: '정확한 진단, 신뢰할 수 있는 검진',
    heroSubtitle: '최첨단 장비와 40년 경력의 영상의학과 전문의가 여러분의 건강을 지켜드립니다',
    aboutTitle: '전문적인 영상의학 진료',
    aboutDescription: '현대영상의학과의원은 MRI, CT, 초음파 등 첨단 영상진단 장비를 통해 정확한 진단을 제공합니다.',
    address: '전북 전주시 덕진구 백제대로 631',
    phone: '063-272-3323',
    businessHours: '평일: 09:00-18:00, 토요일: 09:00-13:00',
    logoUrl: 'https://cdn.imweb.me/upload/S202505065183c8257f7bc/a43561227cfbc.png',
    heroImageUrl: '/hero-image.jpg'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field: keyof SiteContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 로컬 스토리지에 저장 (실제 환경에서는 API 호출)
      localStorage.setItem('siteContent', JSON.stringify(content));
      
      // 2초 후 성공 표시
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        
        // 3초 후 성공 표시 제거
        setTimeout(() => setSaved(false), 3000);
      }, 1000);
    } catch (error) {
      console.error('저장 중 오류:', error);
      setSaving(false);
    }
  };

  useEffect(() => {
    // 저장된 콘텐츠 불러오기
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('콘텐츠 불러오기 오류:', error);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">콘텐츠 관리</h2>
          <p className="text-gray-600 mt-1">웹사이트 콘텐츠를 수정할 수 있습니다.</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="hero">메인 화면</TabsTrigger>
          <TabsTrigger value="about">소개 섹션</TabsTrigger>
          <TabsTrigger value="images">이미지</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                병원 기본 정보
              </CardTitle>
              <CardDescription>
                병원의 기본 정보를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">병원명</Label>
                  <Input
                    id="hospitalName"
                    value={content.hospitalName}
                    onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                    placeholder="병원명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">대표 전화</Label>
                  <Input
                    id="phone"
                    value={content.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="전화번호를 입력하세요"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={content.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="병원 주소를 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessHours">진료 시간</Label>
                <Input
                  id="businessHours"
                  value={content.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  placeholder="진료 시간을 입력하세요"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                메인 화면 콘텐츠
              </CardTitle>
              <CardDescription>
                홈페이지 메인 화면의 텍스트를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">메인 제목</Label>
                <Input
                  id="heroTitle"
                  value={content.heroTitle}
                  onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                  placeholder="메인 제목을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">메인 부제목</Label>
                <Textarea
                  id="heroSubtitle"
                  value={content.heroSubtitle}
                  onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                  placeholder="메인 부제목을 입력하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                소개 섹션
              </CardTitle>
              <CardDescription>
                병원 소개 섹션의 내용을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">소개 제목</Label>
                <Input
                  id="aboutTitle"
                  value={content.aboutTitle}
                  onChange={(e) => handleInputChange('aboutTitle', e.target.value)}
                  placeholder="소개 제목을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">소개 내용</Label>
                <Textarea
                  id="aboutDescription"
                  value={content.aboutDescription}
                  onChange={(e) => handleInputChange('aboutDescription', e.target.value)}
                  placeholder="소개 내용을 입력하세요"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                이미지 관리
              </CardTitle>
              <CardDescription>
                웹사이트에 사용되는 이미지를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">로고 이미지 URL</Label>
                <Input
                  id="logoUrl"
                  value={content.logoUrl}
                  onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  placeholder="로고 이미지 URL을 입력하세요"
                />
                {content.logoUrl && (
                  <div className="mt-2">
                    <img 
                      src={content.logoUrl} 
                      alt="로고 미리보기" 
                      className="h-16 w-auto border border-gray-200 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heroImageUrl">메인 이미지 URL</Label>
                <Input
                  id="heroImageUrl"
                  value={content.heroImageUrl}
                  onChange={(e) => handleInputChange('heroImageUrl', e.target.value)}
                  placeholder="메인 이미지 URL을 입력하세요"
                />
                {content.heroImageUrl && (
                  <div className="mt-2">
                    <img 
                      src={content.heroImageUrl} 
                      alt="메인 이미지 미리보기" 
                      className="h-32 w-auto border border-gray-200 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  이미지는 HTTPS URL을 사용하거나 /public 폴더에 업로드하여 사용하세요.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;