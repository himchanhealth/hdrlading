-- 관리자 계정 등록 및 권한 설정 SQL
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 관리자 역할 생성 (이미 있을 수 있음)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
END
$$;

-- 2. 관리자 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. 관리자 사용자 추가
INSERT INTO admin_users (email, role) 
VALUES ('admin@himchanhealth.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 4. RLS 정책 업데이트 - 관리자 이메일 기반 권한
DROP POLICY IF EXISTS "Service role can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Service role can update reservations" ON reservations;
DROP POLICY IF EXISTS "Service role can delete reservations" ON reservations;

-- 새로운 관리자 기반 정책
CREATE POLICY "Admin can view all reservations" ON reservations
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email' 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update reservations" ON reservations
    FOR UPDATE USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email' 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admin can delete reservations" ON reservations
    FOR DELETE USING (
        auth.role() = 'service_role' OR 
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email' 
            AND role = 'admin'
        )
    );

-- 5. admin_users 테이블 RLS 설정
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view themselves" ON admin_users
    FOR SELECT USING (
        auth.role() = 'service_role' OR 
        email = auth.jwt() ->> 'email'
    );

-- 6. 관리자 확인 함수 생성
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE email = user_email 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. 예약 통계 뷰 생성 (관리자용)
CREATE OR REPLACE VIEW reservation_stats AS
SELECT 
    DATE(created_at) as date,
    status,
    COUNT(*) as count,
    exam_type
FROM reservations 
GROUP BY DATE(created_at), status, exam_type
ORDER BY DATE(created_at) DESC;

-- 8. 관리자 계정 확인 쿼리
SELECT 'Admin user registered:' as message, email, role, created_at 
FROM admin_users 
WHERE email = 'admin@himchanhealth.com';