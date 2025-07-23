-- 의료진 및 게시판 테이블 생성 SQL
-- Supabase Dashboard > SQL Editor에서 실행

-- 의료진 테이블 생성
CREATE TABLE IF NOT EXISTS medical_staff (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  specialty VARCHAR(200) NOT NULL,
  experience VARCHAR(50),
  education TEXT,
  philosophy TEXT,
  photo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 게시판 테이블 생성
CREATE TABLE IF NOT EXISTS board_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'notice',
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  author VARCHAR(100) DEFAULT '현대영상의학과',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_medical_staff_display_order ON medical_staff(display_order);
CREATE INDEX IF NOT EXISTS idx_medical_staff_is_active ON medical_staff(is_active);
CREATE INDEX IF NOT EXISTS idx_board_posts_category ON board_posts(category);
CREATE INDEX IF NOT EXISTS idx_board_posts_is_published ON board_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_is_pinned ON board_posts(is_pinned DESC);

-- Row Level Security (RLS) 활성화
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;

-- 의료진 테이블 정책
CREATE POLICY "Anyone can view active medical staff" ON medical_staff
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage medical staff" ON medical_staff
    FOR ALL USING (auth.role() = 'service_role');

-- 게시판 테이블 정책
CREATE POLICY "Anyone can view published posts" ON board_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view post counts" ON board_posts
    FOR UPDATE USING (auth.role() = 'anon');

CREATE POLICY "Service role can manage posts" ON board_posts
    FOR ALL USING (auth.role() = 'service_role');

-- 샘플 데이터 삽입
INSERT INTO medical_staff (name, position, specialty, experience, education, philosophy, display_order) VALUES
('문무창', '원장', '영상의학과 전문의', '40년', '전북대학교 의과대학', '정확한 진단을 통해 환자의 건강한 삶을 지원합니다', 1);

INSERT INTO board_posts (title, content, category, is_pinned) VALUES
('현대영상의학과 홈페이지 오픈 안내', '안녕하세요. 현대영상의학과 홈페이지가 새롭게 단장되어 오픈하였습니다. 더욱 편리한 예약 서비스와 다양한 정보를 제공하겠습니다.', 'notice', true),
('건강검진 예약 안내', '정기 건강검진 예약을 받고 있습니다. 온라인 예약 시스템을 통해 편리하게 예약하실 수 있습니다.', 'notice', false),
('MRI 검사 주의사항', 'MRI 검사 전 금속 제거 및 검사 시 주의사항에 대해 안내드립니다.', 'info', false);

-- 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_medical_staff_updated_at BEFORE UPDATE ON medical_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_posts_updated_at BEFORE UPDATE ON board_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 조회 트리거 함수 (조회수 증가)
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE board_posts SET view_count = view_count + 1 WHERE id = NEW.id;
    RETURN NEW;
END;
$$ language 'plpgsql';