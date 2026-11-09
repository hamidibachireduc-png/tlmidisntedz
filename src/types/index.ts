export type UserRole = 'teacher' | 'parent_student' | 'syndicate_admin';

export type EducationalLevel = 
  | 'السنة الرابعة متوسط (شهادة التعليم المتوسط BEM)'
  | 'السنة الثالثة ثانوي (شهادة البكالوريا BAC)'
  | 'السنة الأولى ثانوي (جذع مشترك علوم وتكنولوجيا)'
  | 'السنة الأولى ثانوي (جذع مشترك آداب)'
  | 'الطور الابتدائي (السنة 5 - امتحان تقييم المكتسبات)'
  | 'الطور المتوسط (1 إلى 3 متوسط)';

export type Subject = 
  | 'اللغة العربية'
  | 'الرياضيات'
  | 'العلوم الفيزيائية والتكنولوجيا'
  | 'علوم الطبيعة والحياة'
  | 'التاريخ والجغرافيا'
  | 'التربية الإسلامية'
  | 'التربية المدنية'
  | 'اللغة الفرنسية'
  | 'اللغة الإنجليزية'
  | 'اللغة الأمازيغية'
  | 'الإعلام الآلي'
  | 'الفلسفة'
  | 'التربية البدنية والرياضية';

export interface Student {
  id: string;
  name: string;
  registrationNumber: string; // رقم التعريف الوطني للتلميذ (R.N.E)
  classRoom: string; // مثال: 4 متوسط - 4م2
  guardianName: string;
  guardianPhone: string;
  avatarUrl?: string;
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  currentAverage: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  timeSlot: string;
  status: AttendanceStatus;
  subject: Subject;
  notifiedParent: boolean;
  notes?: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subject: Subject;
  classRoom: string;
  assignedDate: string;
  dueDate: string;
  instructions: string;
  attachmentName?: string;
  status: 'pending' | 'submitted' | 'graded';
  teacherName: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  subject: Subject;
  evaluationName: string; // الفرض المحروس / التقويم المستمر / الاختبار الفصلي
  term?: 'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث';
  assessmentScore?: number; // التقويم المستمر /20
  testScore?: number; // الفرض المحروس /20
  examScore?: number; // الاختبار الفصلي /20
  score: number; // معدل المادة الفصلي المحسوب: (تقويم + فرض + اختبار*2)/4 أو نقطة التقييم
  coefficient: number;
  date: string;
  teacherComment?: string;
}

export interface ChatMessage {
  id: string;
  senderRole: 'teacher' | 'parent';
  senderName: string;
  studentName: string;
  timestamp: string;
  type: 'text' | 'voice' | 'announcement';
  content: string;
  voiceDuration?: string;
  read: boolean;
}

export interface SyndicateResource {
  id: string;
  title: string;
  category: 'شهادة التعليم المتوسط BEM' | 'شهادة البكالوريا BAC' | 'تقييم المكتسبات' | 'فروض واختبارات فصلية' | 'مذكرات نقابية وتشريعات';
  level: string;
  subject: string;
  date: string;
  author: string;
  downloadCount: number;
  description: string;
}

export interface FreeTutoringSession {
  id: string;
  subject: Subject;
  level: string;
  teacherName: string;
  dayTime: string;
  location: string;
  registeredCount: number;
  maxSeats: number;
}

// News & Events Types
export interface NewsComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  content: string;
  timestamp: string;
}

export interface NewsEventItem {
  id: string;
  type: 'news' | 'event';
  title: string;
  category: 'أخبار النقابة والوزارة' | 'الفعاليات المدرسية' | 'إصلاحات المنظومة 2026' | 'مراجعات BEM و BAC';
  summary: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
  author: string;
  likesCount: number;
  isLiked?: boolean;
  comments: NewsComment[];
  // Event-specific details
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  attendeesCount?: number;
  isRsvp?: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  republicHeading: string; // الجمهورية الجزائرية الديمقراطية الشعبية
  ministryHeading: string; // وزارة التربية الوطنية
  regionalDirectorate: string; // مديرية التربية لولاية الجزائر (وسط)
  schoolType: 'متوسطة' | 'ثانوية' | 'مدرسة ابتدائية' | 'مجمع مدرسي';
  logoUrl: string;
  motto: string;
}

// Algerian School Calendar & Pedagogical Notes
export type CalendarEventType = 
  | 'exam' // امتحانات رسمية وفصلية (BEM, BAC, تقييم المكتسبات, اختبار فصلي)
  | 'holiday' // عطل مدرسية ورسمية (عطلة الخريف, الشتاء, الربيع, الأعياد الوطنية والدينية)
  | 'test' // فروض محروسة
  | 'meeting' // مجالس الأقسام, ندوات تربوية, أيام تكوينية
  | 'note'; // ملاحظة الأستاذ الخاصة

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string; // For multiday holidays
  type: CalendarEventType;
  description?: string;
  classRoom?: string; // e.g. "السنة الرابعة متوسط 4م2" or "جميع الأطوار"
  teacherName?: string;
  isOfficial?: boolean; // Algerian Ministry official holiday or exam
}

// Scheduled Auto-Attendance Configuration
export interface AutoAttendanceConfig {
  enabled: boolean;
  scheduledDays: number[]; // 0 = الأحد, 1 = الإثنين, 2 = الثلاثاء, 3 = الأربعاء, 4 = الخميس
  defaultStatus: AttendanceStatus; // e.g. 'present'
  timeSlot: string; // e.g. "08:00 - 10:00"
  subject: Subject;
  autoNotifyParents: boolean;
  customNotificationMessage: string;
  lastExecutedDate?: string;
  executedDatesHistory?: string[];
}

// Distance Learning with Google Meet & Teacher Tutoring Accounts
export interface TeacherProfile {
  id: string;
  name: string;
  subject: Subject;
  roleTitle: string; // e.g. "أستاذ رئيسي - منسق مراجعات BEM"
  syndicateMemberNumber: string; // رقم بطاقة النقابة SNTE
  avatarUrl?: string;
  phone?: string;
  email?: string;
  bio?: string;
  activeOnlineSessionsCount: number;
  totalTutoringHours: number;
}

export interface GoogleMeetTutoringSession {
  id: string;
  title: string;
  subject: Subject;
  level: string; // e.g. "السنة الرابعة متوسط (شهادة التعليم المتوسط BEM 2026)"
  teacherId: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar?: string;
  meetUrl: string; // e.g. "https://meet.google.com/tilmidi-bem-math"
  meetCode: string; // e.g. "tilmidi-bem-math"
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "18:00"
  durationMinutes: number; // e.g. 60
  status: 'live' | 'upcoming' | 'completed' | 'recorded';
  description: string;
  targetTopics: string[]; // محاور الدرس المركزة
  attachmentUrl?: string;
  attachmentName?: string;
  registeredStudentsCount: number;
  maxParticipants: number;
  isStudentEnrolled?: boolean;
}
