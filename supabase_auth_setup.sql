-- Supabase Auth 관리자 계정 생성 SQL
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 관리자 사용자 생성 (Supabase Auth)
-- 비밀번호: admin123!@# (변경 가능)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@himchanhealth.com',
    crypt('12341234#', gen_salt('bf')), -- 비밀번호 해시화
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"name":"관리자","role":"admin"}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
) ON CONFLICT (email) DO NOTHING;

-- 2. auth.identities 테이블에도 추가
INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    email
) 
SELECT 
    'admin@himchanhealth.com',
    u.id,
    jsonb_build_object(
        'sub', u.id,
        'email', u.email,
        'email_verified', true,
        'provider', 'email'
    ),
    'email',
    NOW(),
    NOW(),
    NOW(),
    'admin@himchanhealth.com'
FROM auth.users u 
WHERE u.email = 'admin@himchanhealth.com'
AND NOT EXISTS (
    SELECT 1 FROM auth.identities 
    WHERE email = 'admin@himchanhealth.com'
);

-- 3. 관리자 사용자 테이블에 추가 (이미 있을 수 있음)
INSERT INTO admin_users (email, role) 
VALUES ('admin@himchanhealth.com', 'admin')
ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW();

-- 4. 계정 생성 확인
SELECT 
    'Auth 계정 생성됨' as message,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'admin@himchanhealth.com';

SELECT 
    'Admin 권한 확인됨' as message,
    email,
    role,
    created_at
FROM admin_users 
WHERE email = 'admin@himchanhealth.com';