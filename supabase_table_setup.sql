-- 예약 테이블 생성 SQL
-- Supabase Dashboard > SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  patient_name VARCHAR(100) NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  patient_birth_date DATE NOT NULL,
  patient_gender VARCHAR(10) NOT NULL CHECK (patient_gender IN ('male', 'female')),
  exam_type VARCHAR(50) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_preferred_date ON reservations(preferred_date);

-- Row Level Security (RLS) 활성화
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 정책 생성 (모든 사용자가 INSERT 가능, 관리자만 SELECT/UPDATE/DELETE 가능)
CREATE POLICY "Anyone can insert reservations" ON reservations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view all reservations" ON reservations
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update reservations" ON reservations
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete reservations" ON reservations
    FOR DELETE USING (auth.role() = 'service_role');

-- 예약 데이터 예시 조회
-- SELECT * FROM reservations ORDER BY created_at DESC;