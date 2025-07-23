# 관리자 계정 설정 가이드

## 방법 1: Supabase Dashboard UI 사용 (추천)

### 단계 1: Supabase Dashboard 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `himchanhealth's Project`

### 단계 2: 사용자 생성
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Users** 탭 클릭
3. **Add user** 버튼 클릭
4. 다음 정보 입력:
   - **Email**: `admin@himchanhealth.com`
   - **Password**: `admin123!@#` (원하는 비밀번호로 변경 가능)
   - **Auto Confirm User**: 체크 ✓
5. **Create user** 버튼 클릭

### 단계 3: 관리자 권한 설정
1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 다음 SQL 실행:
```sql
-- admin_users 테이블에 관리자 추가
INSERT INTO admin_users (email, role) 
VALUES ('admin@himchanhealth.com', 'admin')
ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW();

-- 확인
SELECT * FROM admin_users WHERE email = 'admin@himchanhealth.com';
```

---

## 방법 2: SQL로 직접 생성

### Supabase Dashboard > SQL Editor에서 실행
`supabase_auth_setup.sql` 파일의 내용을 복사하여 실행

---

## 로그인 정보

**관리자 계정:**
- 이메일: `admin@himchanhealth.com`
- 비밀번호: `admin123!@#`

**로그인 URL:**
- http://localhost:5000/admin/login

---

## 비밀번호 변경 방법

1. Supabase Dashboard > Authentication > Users
2. `admin@himchanhealth.com` 사용자 클릭
3. **Reset Password** 또는 **Update User** 사용
4. 새 비밀번호 설정

---

## 문제 해결

### 로그인 실패 시
1. **Email not confirmed**: Authentication > Users에서 사용자의 Email Confirmed 상태 확인
2. **Invalid credentials**: 비밀번호 재설정 시도
3. **Admin 권한 없음**: admin_users 테이블에 사용자가 있는지 확인

### 확인 쿼리
```sql
-- Auth 사용자 확인
SELECT email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'admin@himchanhealth.com';

-- Admin 권한 확인
SELECT email, role, created_at 
FROM admin_users 
WHERE email = 'admin@himchanhealth.com';
```

---

## 보안 권장사항

1. **비밀번호 변경**: 초기 비밀번호 `admin123!@#`를 강력한 비밀번호로 변경
2. **2단계 인증**: Supabase에서 MFA 설정 고려
3. **IP 제한**: 필요 시 특정 IP에서만 접근 허용
4. **정기 비밀번호 변경**: 3-6개월마다 비밀번호 변경