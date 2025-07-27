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

-- 직원 테이블 생성 SQL
CREATE TABLE IF NOT EXISTS staff (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  specialization VARCHAR(200),
  bio TEXT,
  profile_image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 직원 테이블 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_name ON staff(name);

-- 직원 테이블 RLS 활성화
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- 직원 테이블 정책 생성 (관리자만 접근 가능)
CREATE POLICY "Service role can view all staff" ON staff
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert staff" ON staff
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update staff" ON staff
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete staff" ON staff
    FOR DELETE USING (auth.role() = 'service_role');

-- 직원 데이터 예시 삽입
INSERT INTO staff (name, position, department, phone, email, hire_date, specialization, bio) VALUES
('김영상', '과장', '영상의학과', '010-1234-5678', 'kim@hospital.com', '2020-03-01', 'MRI, CT 판독', '영상의학과 전문의로 10년 경력을 보유하고 있습니다.'),
('이방사', '부장', '방사선과', '010-2345-6789', 'lee@hospital.com', '2018-01-15', '방사선 치료', '방사선 치료 전문가입니다.'),
('박간호', '팀장', '간호부', '010-3456-7890', 'park@hospital.com', '2019-06-01', '환자 케어', '환자 간호에 특화된 경험을 가지고 있습니다.'),
('정검사', '기사', '검사실', '010-4567-8901', 'jung@hospital.com', '2021-09-01', '혈액검사, 소변검사', '각종 검사 업무를 담당합니다.'),
('최접수', '직원', '접수', '010-5678-9012', 'choi@hospital.com', '2022-02-01', '고객 응대', '친절한 접수 업무를 담당합니다.');

-- 직원 데이터 조회
-- SELECT * FROM staff ORDER BY created_at DESC;