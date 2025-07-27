import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Calendar, 
  FileText, 
  User,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  UserPlus,
  Mail,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { subscribeToReservations, ReservationData } from '@/lib/supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Patient {
  id: string; // 전화번호를 ID로 사용
  name: string;
  phone: string;
  birth_date: string;
  gender: 'male' | 'female' | '';
  email?: string;
  total_visits: number;
  last_visit?: string;
  first_visit: string;
  recent_exam_types: string[];
  reservation_history: ReservationData[];
  status: 'active' | 'inactive'; // 최근 6개월 내 예약 여부
}

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new_this_month: 0
  });

  // 예약 데이터에서 환자 정보 추출
  const processReservationsToPatients = (reservations: ReservationData[]): Patient[] => {
    const patientMap = new Map<string, Patient>();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    reservations.forEach(reservation => {
      const phone = reservation.patient_phone;
      const reservationDate = new Date(reservation.created_at);
      
      if (patientMap.has(phone)) {
        const patient = patientMap.get(phone)!;
        patient.total_visits++;
        patient.reservation_history.push(reservation);
        
        // 최근 방문일 업데이트
        if (!patient.last_visit || reservationDate > new Date(patient.last_visit)) {
          patient.last_visit = reservation.created_at;
        }
        
        // 검사 종류 추가
        if (!patient.recent_exam_types.includes(reservation.exam_type)) {
          patient.recent_exam_types.push(reservation.exam_type);
        }
        
        // 활성 상태 업데이트
        if (reservationDate > sixMonthsAgo) {
          patient.status = 'active';
        }
      } else {
        // 새 환자 생성
        const patient: Patient = {
          id: phone,
          name: reservation.patient_name,
          phone: reservation.patient_phone,
          birth_date: reservation.patient_birth_date || '',
          gender: reservation.patient_gender || '',
          total_visits: 1,
          first_visit: reservation.created_at,
          last_visit: reservation.created_at,
          recent_exam_types: [reservation.exam_type],
          reservation_history: [reservation],
          status: reservationDate > sixMonthsAgo ? 'active' : 'inactive'
        };
        
        patientMap.set(phone, patient);
      }
    });

    return Array.from(patientMap.values()).sort((a, b) => 
      new Date(b.last_visit || b.first_visit).getTime() - new Date(a.last_visit || a.first_visit).getTime()
    );
  };

  // 실시간 예약 데이터 구독
  useEffect(() => {
    console.log('👥 환자 관리: 실시간 구독 시작...');
    const unsubscribe = subscribeToReservations((reservations) => {
      console.log('👥 예약 데이터로부터 환자 정보 추출 중...');
      const processedPatients = processReservationsToPatients(reservations);
      setPatients(processedPatients);
      
      // 통계 계산
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const stats = {
        total: processedPatients.length,
        active: processedPatients.filter(p => p.status === 'active').length,
        inactive: processedPatients.filter(p => p.status === 'inactive').length,
        new_this_month: processedPatients.filter(p => 
          new Date(p.first_visit) > oneMonthAgo
        ).length
      };
      
      setStats(stats);
      setLoading(false);
      console.log('👥 환자 데이터 처리 완료:', processedPatients.length, '명');
    });

    return () => {
      console.log('👥 환자 관리: 구독 해제...');
      unsubscribe();
    };
  }, []);

  // 필터링된 환자 목록
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || patient.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 검사 타입 한글 변환
  const getExamTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'mri': 'MRI',
      'ct': 'CT',
      'pet-ct': 'PET-CT',
      'ultrasound': '초음파',
      'xray': 'X-ray',
      'mammography': '유방촬영',
      'bone-density': '골밀도',
      'comprehensive': '종합검진',
      'brain-checkup': '뇌검진',
      'heart-checkup': '심장검진',
      'other': '기타'
    };
    return typeMap[type] || type;
  };

  // 성별 한글 변환
  const getGenderLabel = (gender: string) => {
    return gender === 'male' ? '남성' : gender === 'female' ? '여성' : '미입력';
  };

  // 환자 상세 보기
  const handlePatientDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 환자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              등록된 환자 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 환자</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              최근 6개월 내 방문
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">비활성 환자</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">
              6개월 이상 미방문
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 환자</CardTitle>
            <UserPlus className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new_this_month}</div>
            <p className="text-xs text-muted-foreground">
              이번 달 신규
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            환자 관리
          </CardTitle>
          <CardDescription>
            등록된 환자들의 정보를 관리하고 예약 내역을 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="환자명 또는 전화번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활성 환자</SelectItem>
                <SelectItem value="inactive">비활성 환자</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 환자 목록 테이블 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>환자명</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>성별/나이</TableHead>
                  <TableHead>방문횟수</TableHead>
                  <TableHead>최근방문</TableHead>
                  <TableHead>주요검사</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      환자 데이터를 불러오는 중...
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {searchTerm ? '검색 결과가 없습니다.' : '등록된 환자가 없습니다.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow 
                      key={patient.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handlePatientDetail(patient)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {patient.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {patient.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getGenderLabel(patient.gender)}
                        {patient.birth_date && (
                          <div className="text-xs text-muted-foreground">
                            {patient.birth_date}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {patient.total_visits}회
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {patient.last_visit ? (
                          <div className="text-sm">
                            {format(new Date(patient.last_visit), 'yyyy.MM.dd', { locale: ko })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {patient.recent_exam_types.slice(0, 2).map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {getExamTypeLabel(type)}
                            </Badge>
                          ))}
                          {patient.recent_exam_types.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{patient.recent_exam_types.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={patient.status === 'active' ? 'default' : 'secondary'}
                          className={patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                        >
                          {patient.status === 'active' ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // 행 클릭 이벤트와 충돌 방지
                            handlePatientDetail(patient);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 환자 상세 정보 모달 */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedPatient?.name} 환자 정보
            </DialogTitle>
            <DialogDescription>
              환자의 상세 정보와 예약 내역을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기본 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">환자명</Label>
                      <p className="text-sm mt-1">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">연락처</Label>
                      <p className="text-sm mt-1">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">성별</Label>
                      <p className="text-sm mt-1">{getGenderLabel(selectedPatient.gender)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">생년월일</Label>
                      <p className="text-sm mt-1">{selectedPatient.birth_date || '미입력'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 방문 통계 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">방문 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedPatient.total_visits}</div>
                      <p className="text-sm text-muted-foreground">총 방문횟수</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {format(new Date(selectedPatient.first_visit), 'yyyy.MM.dd', { locale: ko })}
                      </div>
                      <p className="text-sm text-muted-foreground">첫 방문일</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {selectedPatient.last_visit ? 
                          format(new Date(selectedPatient.last_visit), 'yyyy.MM.dd', { locale: ko }) : 
                          '없음'
                        }
                      </div>
                      <p className="text-sm text-muted-foreground">최근 방문일</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 예약 내역 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">예약 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedPatient.reservation_history
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((reservation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{getExamTypeLabel(reservation.exam_type)}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(reservation.created_at), 'yyyy.MM.dd HH:mm', { locale: ko })}
                            </div>
                            {reservation.preferred_date && (
                              <div className="text-sm text-muted-foreground">
                                희망일: {format(new Date(reservation.preferred_date), 'yyyy.MM.dd', { locale: ko })} {reservation.preferred_time}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'cancelled' ? 'destructive' : 'secondary'
                          }
                        >
                          {reservation.status === 'confirmed' ? '확정' :
                           reservation.status === 'cancelled' ? '취소' : '대기'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientManagement;