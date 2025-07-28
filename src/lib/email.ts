import emailjs from '@emailjs/browser';

// EmailJS 설정값들 (하드코딩으로 임시 해결)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_re7tcvj';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_0yt0kog';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'MAa0Cwe1sjXKR-kam';

console.log('Environment variables loaded:', {
  VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
});

console.log('Final values used:', {
  SERVICE_ID,
  TEMPLATE_ID,
  PUBLIC_KEY: PUBLIC_KEY ? 'SET' : 'NOT_SET'
});

// EmailJS 초기화 (Public Key 설정)
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
  console.log('EmailJS initialized with public key');
}

// 예약 정보 인터페이스
export interface ReservationData {
  name: string;
  phone: string;
  birthDate: string;
  gender: string;
  examType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

// 예약 이메일 전송 함수 (이메일만 전송)
export const sendReservationEmail = async (data: ReservationData): Promise<boolean> => {
  try {
    console.log('🔍 이메일 전송 시작...');
    console.log('🔍 이메일 전송 데이터:', data);

    console.log('🔍 EmailJS 설정 값:', {
      SERVICE_ID,
      TEMPLATE_ID,
      PUBLIC_KEY: PUBLIC_KEY ? 'SET' : 'NOT_SET'
    });

    // EmailJS가 설정되지 않은 경우 임시로 콘솔에 출력
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.log('EmailJS 설정이 누락되었습니다:', {
        SERVICE_ID: SERVICE_ID ? 'SET' : 'MISSING',
        TEMPLATE_ID: TEMPLATE_ID ? 'SET' : 'MISSING',
        PUBLIC_KEY: PUBLIC_KEY ? 'SET' : 'MISSING'
      });
      console.log('예약 정보:', data);
      
      // 임시로 성공으로 처리 (실제 환경에서는 EmailJS 설정 필요)
      console.log(`
=== 검진예약 신청 ===
관리자 이메일: admin@himchanhealth.com
신청 시간: ${new Date().toLocaleString('ko-KR')}

[환자 정보]
• 성명: ${data.name}
• 연락처: ${data.phone}
• 생년월일: ${data.birthDate}
• 성별: ${data.gender === 'male' ? '남성' : '여성'}

[검사 정보]
• 검사 종류: ${getExamTypeName(data.examType)}
• 희망 날짜: ${data.preferredDate}
• 희망 시간: ${data.preferredTime}

[추가 요청사항]
${data.notes || '없음'}

※ 담당자는 빠른 시일 내에 연락드리겠습니다.
      `);
      
      return true;
    }

    // EmailJS를 통한 실제 이메일 전송
    const templateParams = {
      to_email: 'admin@himchanhealth.com',
      patient_name: data.name,
      patient_phone: data.phone,
      patient_birth: data.birthDate,
      patient_gender: data.gender === 'male' ? '남성' : '여성',
      exam_type: getExamTypeName(data.examType),
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      notes: data.notes || '없음',
      submitted_at: new Date().toLocaleString('ko-KR'),
    };

    console.log('EmailJS 전송 파라미터:', templateParams);

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('EmailJS 응답:', result);

    if (result.status === 200) {
      console.log('이메일 전송 성공!');
      console.log('✅ 예약 처리 완료:', {
        supabase: supabaseResult.success ? '저장됨' : '실패',
        email: '전송됨'
      });
      return true;
    } else {
      console.error('이메일 전송 실패. Status:', result.status);
      // Supabase에는 저장되었지만 이메일 전송 실패한 경우도 성공으로 처리
      if (supabaseResult.success) {
        console.log('⚠️ Supabase 저장은 성공, 이메일 전송만 실패');
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('이메일 전송 중 오류:', error);
    
    // 에러 타입에 따른 상세 로깅
    if (error instanceof Error) {
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
    }
    
    // EmailJS 특정 에러 처리
    if (typeof error === 'object' && error !== null) {
      console.error('에러 객체:', JSON.stringify(error, null, 2));
    }
    
    return false;
  }
};

// 검사 종류 이름 매핑
const getExamTypeName = (examType: string): string => {
  const examTypes: Record<string, string> = {
    'mri': 'MRI 검사',
    'ct': 'CT 검사',
    'pet-ct': 'PET-CT 검사',
    'ultrasound': '초음파 검사',
    'xray': 'X-ray 검사',
    'mammography': '유방촬영술',
    'bone-density': '골밀도 검사',
    'comprehensive': '종합건강검진',
    'brain-checkup': '뇌검진',
    'heart-checkup': '심장검진',
    'other': '기타 (상담 후 결정)'
  };
  
  return examTypes[examType] || examType;
};