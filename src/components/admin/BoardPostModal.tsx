import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Save, 
  X, 
  Eye, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Pin,
  Globe
} from 'lucide-react';
import { addBoardPost, updateBoardPost, BoardPostData } from '@/lib/supabase';

interface BoardPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost?: BoardPostData | null;
  onSave: () => void;
}

const BoardPostModal: React.FC<BoardPostModalProps> = ({
  isOpen,
  onClose,
  editingPost,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '공지사항',
    author: 'admin',
    is_published: true,
    is_pinned: false
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    '공지사항',
    '검사안내', 
    '일정공지',
    '시설안내',
    '장비소식'
  ];

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        author: editingPost.author,
        is_published: editingPost.is_published,
        is_pinned: editingPost.is_pinned
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: '공지사항',
        author: 'admin',
        is_published: true,
        is_pinned: false
      });
    }
    setError('');
    setShowPreview(false);
  }, [editingPost, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      let result;
      
      if (editingPost) {
        // 수정
        result = await updateBoardPost(editingPost.id!, formData);
      } else {
        // 새 게시글 작성
        result = await addBoardPost(formData);
      }

      if (result.success) {
        onSave();
        onClose();
      } else {
        setError(result.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 저장 오류:', error);
      setError('게시글 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '공지사항': 'bg-red-100 text-red-700',
      '검사안내': 'bg-blue-100 text-blue-700',
      '일정공지': 'bg-green-100 text-green-700',
      '시설안내': 'bg-purple-100 text-purple-700',
      '장비소식': 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {editingPost ? '게시글 수정' : '새 게시글 작성'}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? '편집' : '미리보기'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {showPreview ? (
            /* 미리보기 모드 */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  미리보기
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 게시글 헤더 */}
                  <div className="flex items-center gap-2 mb-4">
                    {formData.is_pinned && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Pin className="w-3 h-3 mr-1" />
                        고정
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                      {formData.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      formData.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      <Globe className="w-3 h-3 mr-1" />
                      {formData.is_published ? '공개' : '비공개'}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h1 className="text-2xl font-bold text-gray-900">
                    {formData.title || '제목을 입력해주세요'}
                  </h1>

                  {/* 메타 정보 */}
                  <div className="text-sm text-gray-500 border-b pb-4">
                    작성자: {formData.author} • 작성일: {new Date().toLocaleDateString('ko-KR')}
                  </div>

                  {/* 내용 */}
                  <div className="prose max-w-none">
                    {formData.content ? (
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {formData.content}
                      </div>
                    ) : (
                      <p className="text-gray-400 italic">내용을 입력해주세요</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 편집 모드 */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 메인 편집 영역 */}
              <div className="lg:col-span-2 space-y-4">
                {/* 제목 */}
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="게시글 제목을 입력하세요"
                  />
                </div>

                {/* 내용 */}
                <div className="space-y-2">
                  <Label htmlFor="content">내용 *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="게시글 내용을 입력하세요"
                    rows={15}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* 사이드바 - 설정 */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">게시글 설정</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 카테고리 */}
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 작성자 */}
                    <div className="space-y-2">
                      <Label htmlFor="author">작성자</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="작성자명"
                      />
                    </div>

                    {/* 공개 설정 */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_published">공개 게시</Label>
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                      />
                    </div>

                    {/* 고정 설정 */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_pinned">상단 고정</Label>
                      <Switch
                        id="is_pinned"
                        checked={formData.is_pinned}
                        onCheckedChange={(checked) => handleInputChange('is_pinned', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 상태 미리보기 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">게시 상태</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {formData.is_published ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm">
                          {formData.is_published ? '공개됨' : '비공개'}
                        </span>
                      </div>
                      {formData.is_pinned && (
                        <div className="flex items-center gap-2">
                          <Pin className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">상단 고정됨</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            취소
          </Button>
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
                <Save className="w-4 h-4" />
                {editingPost ? '수정 완료' : '게시글 작성'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardPostModal;