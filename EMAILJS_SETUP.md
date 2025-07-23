# EmailJS 설정 가이드

예약 신청 시 admin@himchanhealth.com으로 이메일을 자동 전송하기 위한 EmailJS 설정 방법입니다.

## 1. EmailJS 계정 생성

1. https://www.emailjs.com/ 접속
2. 계정 생성 (무료 계정으로도 충분)
3. 로그인 후 대시보드 접속

## 2. 이메일 서비스 설정

1. **Email Services** 메뉴 클릭
2. **Add New Service** 클릭
3. Gmail, Outlook 등 사용할 이메일 서비스 선택
4. 이메일 계정 연결 (admin@himchanhealth.com 또는 연결 가능한 계정)
5. **Service ID** 복사 (예: service_abc123)

## 3. 이메일 템플릿 생성

1. **Email Templates** 메뉴 클릭
2. **Create New Template** 클릭
3. 다음 템플릿 내용 입력:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>검진예약 신청</title>
</head>
<body>
    <h2>새로운 검진예약 신청이 접수되었습니다</h2>
    
    <h3>환자 정보</h3>
    <ul>
        <li><strong>성명:</strong> {{patient_name}}</li>
        <li><strong>연락처:</strong> {{patient_phone}}</li>
        <li><strong>생년월일:</strong> {{patient_birth}}</li>
        <li><strong>성별:</strong> {{patient_gender}}</li>
    </ul>
    
    <h3>검사 정보</h3>
    <ul>
        <li><strong>검사 종류:</strong> {{exam_type}}</li>
        <li><strong>희망 날짜:</strong> {{preferred_date}}</li>
        <li><strong>희망 시간:</strong> {{preferred_time}}</li>
    </ul>
    
    <h3>추가 요청사항</h3>
    <p>{{notes}}</p>
    
    <hr>
    <p><small>신청 시간: {{submitted_at}}</small></p>
    <p><small>현대영상의학과의원 온라인 예약 시스템</small></p>
</body>
</html>
```

4. **To Email**을 `{{to_email}}`로 설정
5. **Subject**를 `[검진예약] {{patient_name}}님 예약신청`으로 설정
6. **Template ID** 복사 (예: template_xyz789)

## 4. 환경 변수 설정

프로젝트의 `.env.local` 파일에 다음 값들을 설정:

```env
# EmailJS에서 복사한 값들
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# 관리자 이메일
VITE_ADMIN_EMAIL=admin@himchanhealth.com
```

## 5. Public Key 확인

1. EmailJS 대시보드에서 **Account** → **General** 메뉴
2. **Public Key** 복사
3. `.env.local`의 `VITE_EMAILJS_PUBLIC_KEY`에 설정

## 6. 테스트

1. 개발 서버 재시작: `npm run dev`
2. 웹사이트에서 예약 신청 테스트
3. admin@himchanhealth.com으로 이메일 수신 확인

## 7. 요금제 안내

- **무료 계정**: 월 200회 이메일 전송
- **유료 계정**: 더 많은 전송량 및 고급 기능

## 문제 해결

1. **이메일이 오지 않는 경우:**
   - 스팸 폴더 확인
   - EmailJS 서비스 연결 상태 확인
   - 템플릿 변수명 일치 여부 확인

2. **전송 실패 시:**
   - 브라우저 개발자 도구 콘솔 확인
   - 환경 변수 설정 확인
   - EmailJS 계정 한도 확인

## 주의사항

- 환경 변수 파일(`.env.local`)은 Git에 커밋하지 마세요
- Public Key는 노출되어도 안전하지만, Service ID와 Template ID는 보안에 주의하세요
- 프로덕션 환경에서는 적절한 에러 핸들링과 로깅을 추가하세요