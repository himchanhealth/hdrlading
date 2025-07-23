import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { getBoardPosts, BoardPostData } from "@/lib/supabase";
import BoardDetailModal from "./BoardDetailModal";

const BoardSection = () => {
  const [boardPosts, setBoardPosts] = useState<BoardPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BoardPostData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadBoardPosts();
  }, []);

  const loadBoardPosts = async () => {
    try {
      setLoading(true);
      const data = await getBoardPosts(undefined, 3); // 최대 3개만 가져오기
      setBoardPosts(data);
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
      day: '2-digit'
    });
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

  const handlePostClick = (post: BoardPostData) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-korean text-2xl font-bold text-primary mb-2">
          병원 소식
        </h3>
        <p className="font-korean text-gray-600">
          병원의 최신 소식과 중요한 공지사항을 확인하세요
        </p>
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <CardTitle className="font-korean text-lg text-primary flex items-center gap-2">
                <Bell className="w-5 h-5" />
                최신 소식
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">게시글을 불러오는 중...</p>
                </div>
              ) : boardPosts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p className="text-sm">등록된 게시글이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {boardPosts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        index === 0 && post.is_pinned ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="space-y-2">
                        {/* 제목과 배지 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            {post.is_pinned && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                                공지
                              </Badge>
                            )}
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getCategoryColor(post.category)}`}
                            >
                              {post.category}
                            </Badge>
                            <h4 className="font-korean font-medium text-gray-900 text-sm line-clamp-1 flex-1">
                              {post.title}
                            </h4>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        </div>
                        
                        {/* 날짜 정보만 표시 */}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className="font-korean">{formatDate(post.created_at || '')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="p-4 bg-gray-50 border-t">
                <Button 
                  variant="outline" 
                  className="w-full font-korean text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  전체 게시글 보기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 게시글 상세 모달 */}
      <BoardDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        postId={selectedPost?.id || null}
        post={selectedPost}
      />
    </div>
  );
};

export default BoardSection;