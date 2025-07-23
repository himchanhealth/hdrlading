// SMS 설정 인터페이스
interface SMSConfig {
  apiKey: string;
  apiSecret: string;
  senderNumber: string; // 발신번호 (사전 등록된 번호)
}

// SMS 메시지 템플릿 인터페이스
interface ReservationConfirmationData {
  patientName: string;
  examType: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicName: string;
  clinicPhone: string;
}

// SMS 서비스 클래스
class SMSService {
  private config: SMSConfig;

  constructor() {
    // 환경변수에서 설정값 가져오기
    this.config = {
      apiKey: import.meta.env.VITE_COOLSMS_API_KEY || '',
      apiSecret: import.meta.env.VITE_COOLSMS_API_SECRET || '',
      senderNumber: import.meta.env.VITE_COOLSMS_SENDER_NUMBER || '063-272-3323'
    };
  }

  // 예약 확정 SMS 메시지 생성
  private createConfirmationMessage(data: ReservationConfirmationData): string {
    return `[${data.clinicName}] 예약확정

안녕하세요 ${data.patientName}님,
검진 예약이 확정되었습니다.

📋 검진 내용: ${data.examType}
📅 예약 일시: ${data.appointmentDate} ${data.appointmentTime}
🏥 병원명: ${data.clinicName}
📞 문의전화: ${data.clinicPhone}

※ 검진 전 주의사항
- 검진 3시간 전부터 금식
- 편안한 복장으로 내원
- 신분증 지참 필수

예약변경: ${data.clinicPhone}
현대영상의학과`;
  }

  // SMS 전송 함수 (현재는 시뮬레이션)
  async sendReservationConfirmation(
    phoneNumber: string, 
    reservationData: ReservationConfirmationData
  ): Promise<boolean> {
    try {
      // 전화번호 유효성 검사
      if (!phoneNumber || phoneNumber.trim() === '') {
        console.warn('전화번호가 비어있습니다.');
        return false;
      }

      const message = this.createConfirmationMessage(reservationData);
      const cleanPhoneNumber = this.formatPhoneNumber(phoneNumber);
      
      // 전화번호 형식화 실패 시 중단
      if (cleanPhoneNumber === '전화번호 없음') {
        console.error('전화번호 형식화 실패:', phoneNumber);
        return false;
      }

      // API Key 설정 상태 확인
      const isRealMode = this.config.apiKey && this.config.apiKey !== 'your_coolsms_api_key';
      
      if (!isRealMode) {
        // 개발 모드: 시뮬레이션
        console.log('🚀 SMS 전송 시뮬레이션 시작 (개발 모드)');
        console.log('==========================================');
        console.log('⚠️  실제 SMS는 발송되지 않습니다!');
        console.log('💡 실제 SMS 발송을 원하면 .env.local 파일에 Cool SMS API 키를 설정하세요');
        console.log(`📞 수신번호: ${cleanPhoneNumber}`);
        console.log(`📱 발신번호: ${this.config.senderNumber}`);
        console.log('💬 메시지 내용:');
        console.log(message);
        console.log('==========================================');
        console.log('✅ SMS 전송 시뮬레이션 완료 (실제 발송 아님)');
      } else {
        // 실제 모드: 임시로 프론트엔드에서 직접 API 호출 시도
        console.log('🚀 실제 SMS 발송 시도 중...');
        console.log(`📞 수신번호: ${cleanPhoneNumber}`);
        console.log(`📱 발신번호: ${this.config.senderNumber}`);
        
        try {
          await this.sendSMSDirectly(cleanPhoneNumber, message);
          console.log('✅ SMS 발송 시도 완료');
        } catch (error) {
          console.error('❌ SMS 발송 실패:', error);
          if (error.message?.includes('CORS')) {
            console.log('💡 CORS 오류: 서버사이드 구현이 필요합니다');
          } else if (error.message?.includes('unauthorized')) {
            console.log('💡 인증 실패: API 키 또는 발신번호를 확인하세요');
          } else if (error.message?.includes('insufficient')) {
            console.log('💡 잔액 부족: Cool SMS 계정에 포인트를 충전하세요');
          }
        }
      }
      
      // 실제 환경에서는 여기서 서버 API 호출
      // const response = await this.callServerAPI(cleanPhoneNumber, message);
      
      return true;

    } catch (error) {
      console.error('❌ SMS 전송 실패:', error);
      return false;
    }
  }

  // 직접 SMS API 호출 (테스트용)
  private async sendSMSDirectly(phoneNumber: string, message: string): Promise<any> {
    const url = 'https://api.coolsms.co.kr/messages/v4/send';
    
    const payload = {
      message: {
        to: phoneNumber,
        from: this.config.senderNumber,
        text: message
      }
    };

    console.log('📡 SMS API 호출 시도:', {
      url,
      to: phoneNumber,
      from: this.config.senderNumber,
      apiKey: this.config.apiKey?.substring(0, 8) + '...',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `HMAC-SHA256 ApiKey=${this.config.apiKey}, Date=${new Date().toISOString()}, Salt=${Date.now()}, Signature=signature`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();
    
    console.log('📡 SMS API 응답:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    if (!response.ok) {
      throw new Error(`SMS API 오류 (${response.status}): ${responseData.message || response.statusText}`);
    }

    return responseData;
  }

  // 서버 API 호출 (미래 구현용)
  private async callServerAPI(phoneNumber: string, message: string): Promise<any> {
    // 서버사이드에서 실제 SMS API를 호출하는 엔드포인트
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phoneNumber,
        from: this.config.senderNumber,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`Server error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 전화번호 형식 정리
  private formatPhoneNumber(phoneNumber: string | null | undefined): string {
    // null/undefined 체크
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      console.warn('유효하지 않은 전화번호:', phoneNumber);
      return '전화번호 없음';
    }

    // 하이픈과 공백 제거
    let cleaned = phoneNumber.replace(/[-\s]/g, '');
    
    // 국가번호 처리
    if (cleaned.startsWith('+82')) {
      cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('82')) {
      cleaned = '0' + cleaned.substring(2);
    }
    
    // 0으로 시작하지 않으면 0 추가
    if (!cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }

    return cleaned;
  }

  // SMS 발송 가능 여부 확인
  isConfigured(): boolean {
    // 개발 환경에서는 항상 true (시뮬레이션 가능)
    return true;
  }

  // 테스트 메시지 전송
  async sendTestMessage(phoneNumber: string): Promise<boolean> {
    const testData: ReservationConfirmationData = {
      patientName: '홍길동',
      examType: 'MRI 검사',
      appointmentDate: '2024년 12월 25일',
      appointmentTime: '오전 10시',
      clinicName: '현대영상의학과',
      clinicPhone: '063-272-3323'
    };

    return await this.sendReservationConfirmation(phoneNumber, testData);
  }
}

// SMS 서비스 인스턴스 생성 및 export
export const smsService = new SMSService();

// 예약 확정 SMS 전송 함수 (간편 사용)
export async function sendReservationConfirmationSMS(
  phoneNumber: string,
  patientName: string,
  examType: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<boolean> {
  const reservationData: ReservationConfirmationData = {
    patientName,
    examType,
    appointmentDate,
    appointmentTime,
    clinicName: '현대영상의학과',
    clinicPhone: '063-272-3323'
  };

  return await smsService.sendReservationConfirmation(phoneNumber, reservationData);
}

// 타입 export
export type { ReservationConfirmationData, SMSConfig };