import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Pin, 
  PinOff,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getAllBoardPosts, deleteBoardPost, updateBoardPost, BoardPostData } from '@/lib/supabase';
import BoardPostModal from './BoardPostModal';

const BoardManagement = () => {
  const [posts, setPosts] = useState<BoardPostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BoardPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BoardPostData | null>(null);

  const categories = [
    { value: 'all', label: '전체' },
    { value: '공지사항', label: '공지사항' },
    { value: '검사안내', label: '검사안내' },
    { value: '일정공지', label: '일정공지' },
    { value: '시설안내', label: '시설안내' },
    { value: '장비소식', label: '장비소식' }
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory, selectedStatus]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllBoardPosts();
      setPosts(data);
    } catch (error) {
      console.error('게시글 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 상태 필터
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'published') {
        filtered = filtered.filter(post => post.is_published);
      } else if (selectedStatus === 'draft') {
        filtered = filtered.filter(post => !post.is_published);
      } else if (selectedStatus === 'pinned') {
        filtered = filtered.filter(post => post.is_pinned);
      }
    }

    setFilteredPosts(filtered);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return;

    try {
      const success = await deleteBoardPost(id);
      if (success) {
        await loadPosts();
        alert('게시글이 삭제되었습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      alert('게시글 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleTogglePin = async (post: BoardPostData) => {
    try {
      const success = await updateBoardPost(post.id!, { is_pinned: !post.is_pinned });
      if (success) {
        await loadPosts();
      } else {
        alert('고정 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('고정 상태 변경 오류:', error);
      alert('고정 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleTogglePublish = async (post: BoardPostData) => {
    try {
      const success = await updateBoardPost(post.id!, { is_published: !post.is_published });
      if (success) {
        await loadPosts();
      } else {
        alert('공개 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('공개 상태 변경 오류:', error);
      alert('공개 상태 변경 중 오류가 발생했습니다.');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">게시글을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">게시판 관리</h2>
          <p className="text-gray-600 mt-1">프론트페이지 게시판을 관리할 수 있습니다.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingPost(null);
            setIsPostModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          새 게시글 작성
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="제목 또는 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 카테고리 필터 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* 상태 필터 */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="published">공개됨</option>
              <option value="draft">비공개</option>
              <option value="pinned">고정글</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 게시글 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            게시글 목록 ({filteredPosts.length}개)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>표시할 게시글이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    {/* 게시글 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_pinned && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Pin className="w-3 h-3 mr-1" />
                            고정
                          </Badge>
                        )}
                        <Badge 
                          variant="secondary"
                          className={`${getCategoryColor(post.category)}`}
                        >
                          {post.category}
                        </Badge>
                        <Badge 
                          variant={post.is_published ? 'default' : 'secondary'}
                          className={post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {post.is_published ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              공개
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              비공개
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at || '')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          조회 {post.view_count}
                        </div>
                        <span>작성자: {post.author}</span>
                      </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePin(post)}
                        className="flex items-center gap-1"
                      >
                        {post.is_pinned ? (
                          <>
                            <PinOff className="w-3 h-3" />
                            고정해제
                          </>
                        ) : (
                          <>
                            <Pin className="w-3 h-3" />
                            고정
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(post)}
                        className={`flex items-center gap-1 ${
                          post.is_published ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {post.is_published ? (
                          <>
                            <XCircle className="w-3 h-3" />
                            비공개
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            공개
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPost(post);
                          setIsPostModalOpen(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        수정
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePost(post.id!)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 게시글 작성/수정 모달 */}
      <BoardPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        editingPost={editingPost}
        onSave={loadPosts}
      />
    </div>
  );
};

export default BoardManagement;