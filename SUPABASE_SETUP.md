# Supabase 데이터베이스 설정 가이드

## 1. Supabase 테이블 생성

### 단계 1: Supabase 대시보드 접속
1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: `himchanhealth's Project`

### 단계 2: SQL Editor에서 테이블 생성
1. 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase_table_setup.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭

### 단계 3: 테이블 확인
1. 왼쪽 메뉴에서 **Table Editor** 클릭
2. `reservations` 테이블이 생성되었는지 확인

## 2. 테이블 구조

### `reservations` 테이블
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| `id` | BIGSERIAL | 기본키 (자동 증가) |
| `patient_name` | VARCHAR(100) | 환자 이름 |
| `patient_phone` | VARCHAR(20) | 환자 연락처 |
| `patient_birth_date` | DATE | 환자 생년월일 |
| `patient_gender` | VARCHAR(10) | 환자 성별 (male/female) |
| `exam_type` | VARCHAR(50) | 검사 종류 |
| `preferred_date` | DATE | 희망 검사 날짜 |
| `preferred_time` | TIME | 희망 검사 시간 |
| `notes` | TEXT | 추가 요청사항 |
| `status` | VARCHAR(20) | 예약 상태 (pending/confirmed/cancelled) |
| `created_at` | TIMESTAMP | 생성 시간 |
| `updated_at` | TIMESTAMP | 수정 시간 |

## 3. 보안 설정 (RLS)

### Row Level Security 정책
- **INSERT**: 모든 사용자가 예약 데이터 추가 가능
- **SELECT/UPDATE/DELETE**: 서비스 역할만 가능 (관리자용)

## 4. 예약 데이터 확인

### SQL 쿼리로 예약 확인
```sql
-- 모든 예약 조회 (최신순)
SELECT * FROM reservations ORDER BY created_at DESC;

-- 대기 중인 예약만 조회
SELECT * FROM reservations WHERE status = 'pending' ORDER BY created_at DESC;

-- 특정 날짜 예약 조회
SELECT * FROM reservations WHERE preferred_date = '2024-01-01';
```

## 5. 관리자 대시보드 (선택사항)

향후 예약 관리를 위한 관리자 페이지를 만들 수 있습니다:
- 예약 목록 조회
- 예약 상태 변경 (확정/취소)
- 환자 연락처 관리
- 통계 및 리포트

## 6. 환경 변수 설정 확인

`.env.local` 파일에 다음 항목들이 설정되어 있는지 확인:
```env
SUPABASE_URL=https://gttwyjidrqjopxmxfphz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 7. 테스트

1. `http://localhost:5000` 접속
2. 예약 신청 테스트
3. Supabase Dashboard > Table Editor > reservations에서 데이터 확인