# Vercel 배포 가이드

## 1. Vercel 계정 준비
1. [Vercel](https://vercel.com)에 GitHub 계정으로 로그인
2. GitHub 저장소 접근 권한 허용

## 2. 자동 배포 설정

### 방법 1: Vercel 웹 대시보드 사용 (권장)
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 `himchanhealth/hdrlading` 선택
3. 다음 설정 적용:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 방법 2: Vercel CLI 사용
```bash
# 프로젝트 디렉토리에서 실행
vercel

# 질문에 답변:
# ? Set up and deploy "~/hyundai-radiology-landing2"? [Y/n] y
# ? Which scope do you want to deploy to? [Your-Username]
# ? Link to existing project? [y/N] n
# ? What's your project's name? hyundai-radiology-landing
# ? In which directory is your code located? ./
```

## 3. 환경 변수 설정

Vercel 대시보드 > 프로젝트 > Settings > Environment Variables에서 다음 환경 변수들을 설정하세요:

### 필수 환경 변수
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 선택적 환경 변수 (기능 사용 시 필요)
```
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_SMS_SERVICE_ID=your_sms_service_id
VITE_SMS_TEMPLATE_ID=your_sms_template_id
VITE_SMS_USER_ID=your_sms_user_id
```

## 4. 도메인 설정 (선택사항)
1. Vercel 대시보드 > 프로젝트 > Settings > Domains
2. 커스텀 도메인 추가 또는 Vercel 제공 도메인 사용

## 5. 자동 배포 확인
- GitHub에 푸시할 때마다 자동으로 Vercel에 배포됩니다
- 배포 상태는 Vercel 대시보드에서 확인 가능
- 배포 로그를 통해 빌드 과정 모니터링 가능

## 6. 배포 URL
배포가 완료되면 다음과 같은 URL들을 얻을 수 있습니다:
- Production: `https://your-project-name.vercel.app`
- Preview: 각 PR마다 고유한 미리보기 URL 생성

## 7. 문제 해결

### 빌드 실패 시
1. Vercel 대시보드에서 빌드 로그 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. 로컬에서 `npm run build` 테스트

### SPA 라우팅 문제
- `vercel.json`에 이미 SPA 라우팅 설정이 포함되어 있습니다
- 모든 경로가 `index.html`로 리다이렉트됩니다

### 환경 변수 문제
- 모든 환경 변수는 `VITE_` 접두사가 필요합니다
- Vercel 대시보드에서 환경 변수 확인 및 재배포

## 8. 성능 최적화
- Vercel은 자동으로 CDN, 이미지 최적화, 압축을 제공합니다
- 빌드 시간 단축을 위해 불필요한 의존성 제거 권장

## 자동 배포 플로우
```
GitHub Push → Vercel Webhook → 자동 빌드 → 자동 배포 → 라이브 URL 업데이트
```