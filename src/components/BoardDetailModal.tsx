import React, { useEffect, useState } from 'react';
import { X, Calendar, Eye, User, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BoardPostData, getBoardPost, incrementViewCount } from '@/lib/supabase';

interface BoardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | null;
  post?: BoardPostData | null;
}

const BoardDetailModal: React.FC<BoardDetailModalProps> = ({
  isOpen,
  onClose,
  postId,
  post: initialPost
}) => {
  const [post, setPost] = useState<BoardPostData | null>(initialPost || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && postId && !initialPost) {
      loadPost();
    } else if (initialPost) {
      setPost(initialPost);
      // 조회수 증가
      if (postId) {
        incrementViewCount(postId);
      }
    }
  }, [isOpen, postId, initialPost]);

  const loadPost = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const postData = await getBoardPost(postId);
      setPost(postData);
      
      // 조회수 증가
      await incrementViewCount(postId);
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '공지사항': 'bg-red-100 text-red-700 border-red-200',
      '검사안내': 'bg-blue-100 text-blue-700 border-blue-200',
      '일정공지': 'bg-green-100 text-green-700 border-green-200',
      '시설안내': 'bg-purple-100 text-purple-700 border-purple-200',
      '장비소식': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">게시글을 불러오는 중...</p>
          </div>
        ) : post ? (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-blue-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  목록으로
                </Button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 게시글 정보 */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 mb-3">
                {post.is_pinned && (
                  <Badge className="bg-red-500 text-white">
                    공지
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(post.category)} border`}
                >
                  {post.category}
                </Badge>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4 font-korean">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-korean">{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span className="font-korean">{formatDate(post.created_at || '')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>조회 {post.view_count || 0}</span>
                </div>
              </div>
            </div>

            {/* 게시글 내용 */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="prose max-w-none">
                  <div className="text-gray-800 leading-relaxed font-korean whitespace-pre-wrap">
                    {formatContent(post.content)}
                  </div>
                </div>
              </div>
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {post.updated_at !== post.created_at && (
                    <span className="font-korean">
                      최종 수정: {formatDate(post.updated_at || '')}
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="font-korean"
                >
                  닫기
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              게시글을 찾을 수 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              요청하신 게시글이 삭제되었거나 존재하지 않습니다.
            </p>
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardDetailModal;