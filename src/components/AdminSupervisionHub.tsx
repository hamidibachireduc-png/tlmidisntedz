import React, { useState } from 'react';
import { 
  AppUser, 
  Student, 
  UserRole, 
  FeeReceipt, 
  StudentFeeSummary, 
  GoogleMeetTutoringSession, 
  NewsEventItem, 
  SchoolSettings,
  Subject
} from '../types';
import { 
  Crown, 
  Users, 
  GraduationCap, 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Building2, 
  UserPlus, 
  Lock, 
  Phone, 
  Mail, 
  Check, 
  X,
  FileText,
  BarChart3,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Video,
  Newspaper,
  Settings,
  Eye,
  ExternalLink,
  Clock,
  BookOpen,
  Save,
  MessageSquare,
  KeyRound,
  CreditCard,
  UserCheck
} from 'lucide-react';

interface AdminSupervisionHubProps {
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onUpdateUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
  students: Student[];
  onAddStudent: (student: Student, fee?: number) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  studentFees: StudentFeeSummary[];
  onUpdateStudentFee: (fee: StudentFeeSummary) => void;
  feeReceipts: FeeReceipt[];
  onDeleteReceipt: (receiptId: string) => void;
  meetSessions: GoogleMeetTutoringSession[];
  onAddMeetSession: (session: GoogleMeetTutoringSession) => void;
  onUpdateMeetSession: (session: GoogleMeetTutoringSession) => void;
  onDeleteMeetSession: (sessionId: string) => void;
  newsEvents: NewsEventItem[];
  onAddNewsEvent: (item: NewsEventItem) => void;
  onUpdateNewsEvent: (item: NewsEventItem) => void;
  onDeleteNewsEvent: (itemId: string) => void;
  schoolSettings: SchoolSettings;
  onUpdateSchoolSettings: (settings: SchoolSettings) => void;
  onNavigateTab: (tab: string) => void;
}

export const AdminSupervisionHub: React.FC<AdminSupervisionHubProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  studentFees,
  onUpdateStudentFee,
  feeReceipts,
  onDeleteReceipt,
  meetSessions,
  onAddMeetSession,
  onUpdateMeetSession,
  onDeleteMeetSession,
  newsEvents,
  onAddNewsEvent,
  onUpdateNewsEvent,
  onDeleteNewsEvent,
  schoolSettings,
  onUpdateSchoolSettings,
  onNavigateTab,
}) => {
  // Navigation Tabs for Admin
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'students' | 'sessions' | 'finance' | 'news' | 'settings'
  >('overview');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // ----------------------------------------------------
  // MODALS STATE
  // ----------------------------------------------------
  // 1. User Modal (Create / Edit)
  const [userModal, setUserModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    user: AppUser | null;
  }>({ isOpen: false, mode: 'create', user: null });

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'parent' | 'secretary'>('teacher');
  const [userTitle, setUserTitle] = useState('');
  const [userPassword, setUserPassword] = useState('123456');
  const [userStatus, setUserStatus] = useState<'active' | 'suspended'>('active');

  // 2. Student Modal (Create / Edit)
  const [studentModal, setStudentModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    student: Student | null;
  }>({ isOpen: false, mode: 'create', student: null });

  const [studentName, setStudentName] = useState('');
  const [studentRegNum, setStudentRegNum] = useState('');
  const [studentClass, setStudentClass] = useState('السنة الرابعة متوسط (4م2)');
  const [studentGuardianName, setStudentGuardianName] = useState('');
  const [studentGuardianPhone, setStudentGuardianPhone] = useState('');
  const [studentMonthlyFee, setStudentMonthlyFee] = useState<number>(3000);

  // 3. Meet Session Modal (Create / Edit)
  const [sessionModal, setSessionModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    session: GoogleMeetTutoringSession | null;
  }>({ isOpen: false, mode: 'create', session: null });

  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionSubject, setSessionSubject] = useState<Subject>('الرياضيات');
  const [sessionLevel, setSessionLevel] = useState('السنة الرابعة متوسط (شهادة BEM)');
  const [sessionTeacherName, setSessionTeacherName] = useState('الأستاذ المؤطر');
  const [sessionDate, setSessionDate] = useState('2026-11-15');
  const [sessionTime, setSessionTime] = useState('18:00');
  const [sessionDuration, setSessionDuration] = useState(60);
  const [sessionMeetUrl, setSessionMeetUrl] = useState('https://meet.google.com/tilmidi-support');
  const [sessionDescription, setSessionDescription] = useState('');

  // 4. Student Fee Edit Modal
  const [feeModal, setFeeModal] = useState<{
    isOpen: boolean;
    fee: StudentFeeSummary | null;
  }>({ isOpen: false, fee: null });

  const [feeMonthly, setFeeMonthly] = useState<number>(3000);
  const [feePaid, setFeePaid] = useState<number>(3000);
  const [feeRemaining, setFeeRemaining] = useState<number>(0);
  const [feeStatus, setFeeStatus] = useState<'paid' | 'partial' | 'unpaid' | 'overdue'>('paid');
  const [feeMonth, setFeeMonth] = useState('نوفمبر 2026');

  // 5. News / Announcement Modal (Create / Edit)
  const [newsModal, setNewsModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    item: NewsEventItem | null;
  }>({ isOpen: false, mode: 'create', item: null });

  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<'أخبار النقابة والوزارة' | 'الفعاليات المدرسية' | 'إصلاحات المنظومة 2026' | 'مراجعات BEM و BAC'>('مراجعات BEM و BAC');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('إدارة مركز التفوق');

  // 6. Settings Form State
  const [schoolNameForm, setSchoolNameForm] = useState(schoolSettings.schoolName);
  const [regionalDirectorateForm, setRegionalDirectorateForm] = useState(schoolSettings.regionalDirectorate);
  const [mottoForm, setMottoForm] = useState(schoolSettings.motto);
  const [schoolTypeForm, setSchoolTypeForm] = useState(schoolSettings.schoolType);

  // Financial KPIs
  const totalMonthlyTarget = studentFees.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalCollectedRevenue = studentFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalRemainingDues = studentFees.reduce((acc, curr) => acc + curr.remainingAmount, 0);
  const collectionPercentage = totalMonthlyTarget > 0 ? Math.round((totalCollectedRevenue / totalMonthlyTarget) * 100) : 0;

  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const totalParents = users.filter((u) => u.role === 'parent').length;
  const totalSecretaries = users.filter((u) => u.role === 'secretary').length;

  // ----------------------------------------------------
  // HANDLERS FOR USER MODAL
  // ----------------------------------------------------
  const openCreateUserModal = () => {
    setUserModal({ isOpen: true, mode: 'create', user: null });
    setUserName('');
    setUserEmail('');
    setUserPhone('0550-000000');
    setUserRole('teacher');
    setUserTitle('أستاذ مؤطر لدروس الدعم');
    setUserPassword('teach123');
    setUserStatus('active');
  };

  const openEditUserModal = (user: AppUser) => {
    setUserModal({ isOpen: true, mode: 'edit', user });
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhone(user.phone);
    setUserRole(user.role);
    setUserTitle(user.title);
    setUserPassword(user.password || '123456');
    setUserStatus(user.status);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    if (userModal.mode === 'create') {
      const newUser: AppUser = {
        id: `user-${Date.now()}`,
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        phone: userPhone.trim() || '0550-000000',
        role: userRole,
        title: userTitle.trim() || (userRole === 'admin' ? 'إداري' : userRole === 'teacher' ? 'أستاذ مؤطر' : userRole === 'parent' ? 'ولي أمر' : 'سكرتارية'),
        status: userStatus,
        createdAt: new Date().toISOString().split('T')[0],
        password: userPassword.trim() || '123456',
      };
      onAddUser(newUser);
      showNotification(`تم إنشاء حساب (${newUser.name}) بنجاح`);
    } else if (userModal.mode === 'edit' && userModal.user) {
      const updatedUser: AppUser = {
        ...userModal.user,
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        phone: userPhone.trim(),
        role: userRole,
        title: userTitle.trim(),
        status: userStatus,
        password: userPassword.trim(),
      };
      onUpdateUser(updatedUser);
      showNotification(`تم تحديث بيانات حساب (${updatedUser.name}) بنجاح`);
    }
    setUserModal({ isOpen: false, mode: 'create', user: null });
  };

  // ----------------------------------------------------
  // HANDLERS FOR STUDENT MODAL
  // ----------------------------------------------------
  const openCreateStudentModal = () => {
    setStudentModal({ isOpen: true, mode: 'create', student: null });
    setStudentName('');
    setStudentRegNum(`2026-DZ-${Math.floor(1000 + Math.random() * 9000)}`);
    setStudentClass('السنة الرابعة متوسط (4م2)');
    setStudentGuardianName('');
    setStudentGuardianPhone('0661-000000');
    setStudentMonthlyFee(3000);
  };

  const openEditStudentModal = (student: Student) => {
    setStudentModal({ isOpen: true, mode: 'edit', student });
    setStudentName(student.name);
    setStudentRegNum(student.registrationNumber);
    setStudentClass(student.classRoom);
    setStudentGuardianName(student.guardianName);
    setStudentGuardianPhone(student.guardianPhone);
    const fee = studentFees.find((f) => f.studentId === student.id);
    setStudentMonthlyFee(fee ? fee.monthlyFee : 3000);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    if (studentModal.mode === 'create') {
      const newStudent: Student = {
        id: `std-${Date.now()}`,
        name: studentName.trim(),
        registrationNumber: studentRegNum.trim(),
        classRoom: studentClass,
        guardianName: studentGuardianName.trim() || 'ولي أمر التلميذ',
        guardianPhone: studentGuardianPhone.trim() || '0661-000000',
        attendanceStats: { present: 0, absent: 0, late: 0, excused: 0 },
        currentAverage: 14.5,
      };
      onAddStudent(newStudent, studentMonthlyFee);
      showNotification(`تم تسجيل التلميذ (${newStudent.name}) وإضافته للأفواج والرسوم بنجاح`);
    } else if (studentModal.mode === 'edit' && studentModal.student) {
      const updatedStudent: Student = {
        ...studentModal.student,
        name: studentName.trim(),
        registrationNumber: studentRegNum.trim(),
        classRoom: studentClass,
        guardianName: studentGuardianName.trim(),
        guardianPhone: studentGuardianPhone.trim(),
      };
      onUpdateStudent(updatedStudent);
      // Update fee as well
      const existingFee = studentFees.find((f) => f.studentId === updatedStudent.id);
      if (existingFee) {
        onUpdateStudentFee({
          ...existingFee,
          studentName: updatedStudent.name,
          classRoom: updatedStudent.classRoom,
          guardianName: updatedStudent.guardianName,
          guardianPhone: updatedStudent.guardianPhone,
          monthlyFee: studentMonthlyFee,
          remainingAmount: Math.max(0, studentMonthlyFee - existingFee.paidAmount),
        });
      }
      showNotification(`تم تعديل بيانات التلميذ (${updatedStudent.name}) بنجاح`);
    }
    setStudentModal({ isOpen: false, mode: 'create', student: null });
  };

  // ----------------------------------------------------
  // HANDLERS FOR MEET SESSION MODAL
  // ----------------------------------------------------
  const openCreateSessionModal = () => {
    setSessionModal({ isOpen: true, mode: 'create', session: null });
    setSessionTitle('');
    setSessionSubject('الرياضيات');
    setSessionLevel('السنة الرابعة متوسط (شهادة BEM)');
    setSessionTeacherName('الأستاذ كمال دراجي');
    setSessionDate(new Date().toISOString().split('T')[0]);
    setSessionTime('18:00');
    setSessionDuration(60);
    setSessionMeetUrl('https://meet.google.com/tilmidi-math-support');
    setSessionDescription('مراجعة نموذجية مركزة مع حل وضعيات إدماجية');
  };

  const openEditSessionModal = (session: GoogleMeetTutoringSession) => {
    setSessionModal({ isOpen: true, mode: 'edit', session });
    setSessionTitle(session.title);
    setSessionSubject(session.subject);
    setSessionLevel(session.level);
    setSessionTeacherName(session.teacherName);
    setSessionDate(session.date);
    setSessionTime(session.startTime);
    setSessionDuration(session.durationMinutes);
    setSessionMeetUrl(session.meetUrl);
    setSessionDescription(session.description);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;

    if (sessionModal.mode === 'create') {
      const newSession: GoogleMeetTutoringSession = {
        id: `meet-${Date.now()}`,
        title: sessionTitle.trim(),
        subject: sessionSubject,
        level: sessionLevel,
        teacherId: 'teach-1',
        teacherName: sessionTeacherName,
        teacherTitle: 'أستاذ مؤطر لدروس الدعم',
        meetUrl: sessionMeetUrl.trim() || 'https://meet.google.com/tilmidi-support',
        meetCode: 'tilmidi-live',
        date: sessionDate,
        startTime: sessionTime,
        durationMinutes: sessionDuration,
        status: 'upcoming',
        description: sessionDescription.trim(),
        targetTopics: ['مراجعة شاملة', 'حل تمارين نموذجية'],
        registeredStudentsCount: 0,
        maxParticipants: 35,
      };
      onAddMeetSession(newSession);
      showNotification(`تمت إضافة حصة الدعم (${newSession.title}) بنجاح`);
    } else if (sessionModal.mode === 'edit' && sessionModal.session) {
      const updatedSession: GoogleMeetTutoringSession = {
        ...sessionModal.session,
        title: sessionTitle.trim(),
        subject: sessionSubject,
        level: sessionLevel,
        teacherName: sessionTeacherName,
        date: sessionDate,
        startTime: sessionTime,
        durationMinutes: sessionDuration,
        meetUrl: sessionMeetUrl.trim(),
        description: sessionDescription.trim(),
      };
      onUpdateMeetSession(updatedSession);
      showNotification(`تم تعديل حصة الدعم (${updatedSession.title}) بنجاح`);
    }
    setSessionModal({ isOpen: false, mode: 'create', session: null });
  };

  // ----------------------------------------------------
  // HANDLERS FOR FEE EDIT MODAL
  // ----------------------------------------------------
  const openEditFeeModal = (fee: StudentFeeSummary) => {
    setFeeModal({ isOpen: true, fee });
    setFeeMonthly(fee.monthlyFee);
    setFeePaid(fee.paidAmount);
    setFeeRemaining(fee.remainingAmount);
    setFeeStatus(fee.status);
    setFeeMonth(fee.month);
  };

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeModal.fee) return;

    const remaining = Math.max(0, feeMonthly - feePaid);
    let computedStatus: 'paid' | 'partial' | 'unpaid' | 'overdue' = feeStatus;
    if (feePaid >= feeMonthly) computedStatus = 'paid';
    else if (feePaid > 0) computedStatus = 'partial';
    else computedStatus = 'unpaid';

    const updated: StudentFeeSummary = {
      ...feeModal.fee,
      monthlyFee: feeMonthly,
      paidAmount: feePaid,
      remainingAmount: remaining,
      status: computedStatus,
      month: feeMonth,
    };
    onUpdateStudentFee(updated);
    showNotification(`تم تعديل الاشتراك المالي للتلميذ (${updated.studentName})`);
    setFeeModal({ isOpen: false, fee: null });
  };

  // ----------------------------------------------------
  // HANDLERS FOR NEWS / ANNOUNCEMENT MODAL
  // ----------------------------------------------------
  const openCreateNewsModal = () => {
    setNewsModal({ isOpen: true, mode: 'create', item: null });
    setNewsTitle('');
    setNewsCategory('مراجعات BEM و BAC');
    setNewsSummary('');
    setNewsContent('');
    setNewsAuthor('إدارة مركز التفوق');
  };

  const openEditNewsModal = (item: NewsEventItem) => {
    setNewsModal({ isOpen: true, mode: 'edit', item });
    setNewsTitle(item.title);
    setNewsCategory(item.category);
    setNewsSummary(item.summary);
    setNewsContent(item.content);
    setNewsAuthor(item.author);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;

    if (newsModal.mode === 'create') {
      const newItem: NewsEventItem = {
        id: `news-${Date.now()}`,
        type: 'news',
        title: newsTitle.trim(),
        category: newsCategory,
        summary: newsSummary.trim(),
        content: newsContent.trim() || newsSummary.trim(),
        publishedDate: new Date().toISOString().split('T')[0],
        author: newsAuthor.trim() || 'إدارة المركز',
        likesCount: 0,
        comments: [],
      };
      onAddNewsEvent(newItem);
      showNotification(`تم نشر الإعلان (${newItem.title}) بنجاح`);
    } else if (newsModal.mode === 'edit' && newsModal.item) {
      const updatedItem: NewsEventItem = {
        ...newsModal.item,
        title: newsTitle.trim(),
        category: newsCategory,
        summary: newsSummary.trim(),
        content: newsContent.trim(),
        author: newsAuthor.trim(),
      };
      onUpdateNewsEvent(updatedItem);
      showNotification(`تم تعديل الإعلان (${updatedItem.title}) بنجاح`);
    }
    setNewsModal({ isOpen: false, mode: 'create', item: null });
  };

  // ----------------------------------------------------
  // HANDLER FOR SETTINGS FORM
  // ----------------------------------------------------
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SchoolSettings = {
      ...schoolSettings,
      schoolName: schoolNameForm.trim(),
      regionalDirectorate: regionalDirectorateForm.trim(),
      motto: mottoForm.trim(),
      schoolType: schoolTypeForm,
    };
    onUpdateSchoolSettings(updatedSettings);
    showNotification('تم حفظ وتحديث إعدادات وهوية المركز بنجاح!');
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = 
      !searchQuery.trim() ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchClass = classFilter === 'all' || s.classRoom.includes(classFilter);
    const matchSearch = 
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registrationNumber.includes(searchQuery) ||
      s.guardianName.includes(searchQuery) ||
      s.guardianPhone.includes(searchQuery);
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-900 text-white border-2 border-emerald-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="text-xs font-black">{successToast}</span>
        </div>
      )}

      {/* Royal Algerian Banner for Center Owner / Admin */}
      <div 
        className="dz-royal-banner p-6 sm:p-7 text-white relative overflow-hidden shadow-2xl rounded-3xl"
        style={{
          backgroundColor: '#033224',
          backgroundImage: 'linear-gradient(135deg, #02261a 0%, #064e3b 45%, #008751 75%, #78350f 100%)',
          color: '#ffffff'
        }}
      >
        <div className="dz-national-ribbon absolute top-0 left-0 right-0"></div>
        <div className="relative z-10 max-w-4xl space-y-3.5 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-black/60 text-amber-300 font-black text-[11px] border border-amber-400 shadow-md flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>لوحة التحكم الشاملة للمالك والمدير العام (Full Administrative Control)</span>
            </span>
            <span className="text-amber-400 font-bold">●</span>
            <span className="text-white font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/80">
              صلاحية التعديل والإضافة والحذف لجميع أركان التطبيق
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            لوحة الإشراف المتكاملة: إدارة الحسابات، التلاميذ، الحصص والمالية
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl font-bold drop-shadow-sm">
            بصفتك مدير السنتر، تمنحك هذه اللوحة تحكماً كاملاً: إضافة وتعديل وحذف حسابات المعلمين والأولياء والسكرتارية، تسجيل وتعديل قوائم التلاميذ، جدولة وإلغاء حصص الدعم (Google Meet)، وتدقيق الرسوم والإيصالات وإعدادات السنتر.
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={openCreateUserModal}
              className="dz-btn-gold px-3.5 py-2 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>إضافة حساب مستخدم</span>
            </button>

            <button
              onClick={openCreateStudentModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all border border-emerald-400"
            >
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>تسجيل تلميذ جديد</span>
            </button>

            <button
              onClick={openCreateSessionModal}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all border border-blue-400"
            >
              <Video className="w-4 h-4 text-white" />
              <span>إضافة حصة Google Meet</span>
            </button>

            <button
              onClick={openCreateNewsModal}
              className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all border border-amber-400"
            >
              <Newspaper className="w-4 h-4 text-white" />
              <span>نشر إعلان رسمي</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>المؤشرات العامة</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>حسابات المستخدمين ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>قوائم التلاميذ ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>حصص الدعم ({meetSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>الاشتراكات والرسوم</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'news'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>الإعلانات والأخبار ({newsEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات السنتر</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* SUB-TAB 1: OVERVIEW & KPIS */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">التلاميذ المسجلين</span>
                <div className="text-2xl font-black text-slate-900">{students.length} تلميذ</div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>4 أفواج دراسية نشطة</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">حسابات المنظومة</span>
                <div className="text-2xl font-black text-slate-900">{users.length} حساب</div>
                <div className="text-[11px] text-amber-700 font-bold">
                  {totalTeachers} أساتذة · {totalParents} أولياء · {totalSecretaries} سكرتارية
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">المداخيل المحصلة (نوفمبر)</span>
                <div className="text-2xl font-black text-emerald-800 font-mono">
                  {totalCollectedRevenue.toLocaleString('ar-DZ')} دج
                </div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  نسبة التحصيل: {collectionPercentage}%
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500">حصص Google Meet</span>
                <div className="text-2xl font-black text-blue-700 font-mono">
                  {meetSessions.length} حصة
                </div>
                <div className="text-[11px] text-blue-600 font-bold">
                  دعم مباشر عن بعد
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Management Racks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div 
              onClick={() => setActiveTab('users')}
              className="dz-card p-6 bg-white hover:border-amber-400 cursor-pointer transition-all space-y-3 border border-slate-200 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">إدارة حسابات المستخدمين والصلاحيات</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                إنشاء، تعديل، تجميد أو حذف حسابات الأساتذة والأولياء والإداريين مع التحكم بكلمات المرور.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('students')}
              className="dz-card p-6 bg-white hover:border-emerald-500 cursor-pointer transition-all space-y-3 border border-slate-200 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">إدارة قوائم التلاميذ وتوزيع الأفواج</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                إضافة تلاميذ جدد وتعديل بيانات الاتصال بأولياء الأمور وحذف السجلات وتوزيعهم على الأفواج.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('finance')}
              className="dz-card p-6 bg-white hover:border-rose-400 cursor-pointer transition-all space-y-3 border border-slate-200 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">متابعة الاشتراكات المالية والإيصالات</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                تعديل حالة السداد والمبالغ المدفوعة والمتبقية ومراقبة الإيصالات الصادرة وأرشفتها.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 2: USERS & PERMISSIONS MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          <div className="dz-card p-5 bg-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، البريد أو الهاتف..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">جميع الأدوار ({users.length})</option>
                <option value="admin">المديرون ({users.filter(u => u.role === 'admin').length})</option>
                <option value="teacher">الأساتذة ({totalTeachers})</option>
                <option value="parent">أولياء الأمور ({totalParents})</option>
                <option value="secretary">السكرتارية والحسابات ({totalSecretaries})</option>
              </select>

              <button
                onClick={openCreateUserModal}
                className="dz-btn-gold px-4 py-2 rounded-xl text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102 transition-all mr-auto md:mr-0"
              >
                <Plus className="w-4 h-4 text-slate-950" />
                <span>إضافة مستخدم جديد</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="dz-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="py-3.5 px-4">المستخدم</th>
                    <th className="py-3.5 px-4">الدور الوظيفي</th>
                    <th className="py-3.5 px-4">الاتصال</th>
                    <th className="py-3.5 px-4">كلمة المرور</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4 text-center">إجراءات المدير (تعديل / تجميد / حذف)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const roleBadge = {
                      admin: { label: 'المالك / المدير', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
                      teacher: { label: 'الأستاذ المؤطر', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                      parent: { label: 'ولي الأمر', bg: 'bg-blue-100 text-blue-900 border-blue-300' },
                      secretary: { label: 'السكرتارية والحسابات', bg: 'bg-rose-100 text-rose-900 border-rose-300' },
                    }[user.role] || { label: user.role, bg: 'bg-slate-100 text-slate-800 border-slate-300' };

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 font-black text-slate-700 flex items-center justify-center shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-slate-900">{user.name}</div>
                              <div className="text-[11px] text-slate-500 font-medium">{user.title}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-black border ${roleBadge.bg}`}>
                            {roleBadge.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="font-mono text-slate-700 flex items-center gap-1.5" dir="ltr">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                            {user.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600 font-bold" dir="ltr">
                          {user.password || '••••••'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.status === 'active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                            <span>{user.status === 'active' ? 'نشط ومصرح له' : 'مجمّد'}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={() => openEditUserModal(user)}
                              className="p-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                              title="تعديل بيانات الحساب والصلاحيات"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Toggle Active / Suspended */}
                            <button
                              onClick={() => {
                                const updated: AppUser = {
                                  ...user,
                                  status: user.status === 'active' ? 'suspended' : 'active',
                                };
                                onUpdateUser(updated);
                                showNotification(`تم ${updated.status === 'active' ? 'تنشيط' : 'تجميد'} حساب (${user.name})`);
                              }}
                              className={`px-2 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                                user.status === 'active'
                                  ? 'hover:bg-slate-100 text-slate-700 border-slate-300'
                                  : 'hover:bg-emerald-50 text-emerald-700 border-emerald-300 bg-emerald-50'
                              }`}
                              title={user.status === 'active' ? 'تجميد الحساب' : 'إعادة تنشيط الحساب'}
                            >
                              {user.status === 'active' ? 'تجميد' : 'تنشيط'}
                            </button>

                            {/* Delete User */}
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف حساب (${user.name}) نهائياً؟`)) {
                                    onDeleteUser(user.id);
                                    showNotification(`تم حذف حساب (${user.name})`);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
                                title="حذف الحساب"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 3: STUDENTS ROSTER MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-5">
          <div className="dz-card p-5 bg-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم التلميذ، رقم التعريف، أو هاتف الولي..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">جميع الأفواج الدراسية</option>
                <option value="4م2">فوج 4م2 (BEM)</option>
                <option value="4م1">فوج 4م1 (BEM)</option>
                <option value="3ع1">فوج 3ع1 (BAC علوم)</option>
                <option value="3آداب">فوج 3آداب (BAC آداب وفلسفة)</option>
              </select>

              <button
                onClick={openCreateStudentModal}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102 transition-all mr-auto md:mr-0 border border-emerald-600"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل تلميذ جديد</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="dz-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="py-3.5 px-4">التلميذ ورقم التعريف</th>
                    <th className="py-3.5 px-4">الفوج الدراسي</th>
                    <th className="py-3.5 px-4">ولي الأمر وهاتفه</th>
                    <th className="py-3.5 px-4">معدل التقييم</th>
                    <th className="py-3.5 px-4">الغيابات المسجلة</th>
                    <th className="py-3.5 px-4 text-center">إجراءات المدير (تعديل / حذف)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">{std.name}</div>
                        <div className="text-[11px] font-mono text-slate-500" dir="ltr">
                          {std.registrationNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {std.classRoom}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-bold text-slate-800">{std.guardianName}</div>
                        <div className="font-mono text-slate-500 text-[11px]" dir="ltr">
                          {std.guardianPhone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {std.currentAverage ? `${std.currentAverage} / 20` : '15.00 / 20'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          std.attendanceStats.absent > 0 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {std.attendanceStats.absent} غيابات
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditStudentModal(std)}
                            className="p-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                            title="تعديل بيانات التلميذ وولي الأمر"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف التلميذ (${std.name}) وحذف سجلاته نهائياً من المركز؟`)) {
                                onDeleteStudent(std.id);
                                showNotification(`تم حذف التلميذ (${std.name})`);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
                            title="حذف التلميذ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 4: GOOGLE MEET TUTORING SESSIONS */}
      {/* ==================================================== */}
      {activeTab === 'sessions' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">جدول حصص الدعم المباشرة (Google Meet)</h3>
              <p className="text-xs text-slate-500">إدارة الروابط والمواد ومواعيد البث للأساتذة والتلاميذ</p>
            </div>
            <button
              onClick={openCreateSessionModal}
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102 transition-all border border-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حصة دعم جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meetSessions.map((session) => (
              <div 
                key={session.id}
                className="dz-card p-5 bg-white border border-slate-200 flex flex-col justify-between hover:border-blue-400 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                      <Video className="w-3 h-3 text-blue-600" />
                      <span>{session.subject}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {session.startTime} ({session.durationMinutes} دقيقة)
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    {session.title}
                  </h4>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span>{session.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>الأستاذ: {session.teacherName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>التاريخ: {session.date}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {session.description || 'حصة دعم تفاعلية تتضمن شروحات ومناقشة التمارين.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={session.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>فتح Google Meet</span>
                  </a>

                  <button
                    onClick={() => openEditSessionModal(session)}
                    className="p-2 rounded-xl border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                    title="تعديل الحصة"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف حصة (${session.title})؟`)) {
                        onDeleteMeetSession(session.id);
                        showNotification(`تم حذف حصة (${session.title})`);
                      }
                    }}
                    className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-all cursor-pointer"
                    title="حذف الحصة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 5: STUDENT FEES & FINANCIAL BILLING */}
      {/* ==================================================== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="dz-card p-6 bg-white border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">إدارة الاشتراكات والتحصيل المالي (نوفمبر 2026)</h3>
                <p className="text-xs text-slate-500 mt-0.5">تعديل المبالغ وحالات السداد ومتابعة إيصالات الدفع</p>
              </div>

              <button
                onClick={() => onNavigateTab('financial_secretary')}
                className="dz-btn-gold px-4 py-2 rounded-xl text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                <span>بوابة السكرتارية وإصدار الإيصالات</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>نسبة التحصيل الإجمالية لشهر نوفمبر:</span>
                <span className="font-mono text-emerald-800 font-black text-sm">{collectionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${collectionPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>المحصل: {totalCollectedRevenue.toLocaleString('ar-DZ')} دج</span>
                <span>المستهدف: {totalMonthlyTarget.toLocaleString('ar-DZ')} دج</span>
              </div>
            </div>

            {/* Fees Table */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="py-3 px-3">التلميذ والفوج</th>
                    <th className="py-3 px-3">الرسم الشهري</th>
                    <th className="py-3 px-3">المدفوع</th>
                    <th className="py-3 px-3">المتبقي</th>
                    <th className="py-3 px-3">حالة السداد</th>
                    <th className="py-3 px-3 text-center">تعديل الرسم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentFees.map((fee) => (
                    <tr key={fee.studentId} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900">{fee.studentName}</div>
                        <div className="text-[11px] text-slate-500">{fee.classRoom}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">{fee.monthlyFee.toLocaleString('ar-DZ')} دج</td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">{fee.paidAmount.toLocaleString('ar-DZ')} دج</td>
                      <td className="py-3 px-3 font-mono text-red-600 font-bold">{fee.remainingAmount.toLocaleString('ar-DZ')} دج</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          fee.status === 'paid' ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' :
                          fee.status === 'partial' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                          'bg-red-50 text-red-800 border border-red-300'
                        }`}>
                          {fee.status === 'paid' ? 'خالص بالكامل' : fee.status === 'partial' ? 'سداد جزئي' : 'غير مدفوع'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => openEditFeeModal(fee)}
                          className="p-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
                          title="تعديل الاشتراك والمبالغ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Issued Receipts Archive & Delete Action */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 mb-3">سجل إيصالات الدفع الإلكترونية الصادرة ({feeReceipts.length}):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {feeReceipts.map((rec) => (
                  <div key={rec.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-black text-emerald-800">{rec.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        رقم الإيصال: {rec.receiptNumber} · {rec.amount.toLocaleString('ar-DZ')} دج
                      </div>
                      <div className="text-[10px] text-slate-400">{rec.paymentDate}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف الإيصال (${rec.receiptNumber})؟`)) {
                          onDeleteReceipt(rec.id);
                          showNotification(`تم حذف الإيصال (${rec.receiptNumber})`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="حذف الإيصال"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 6: NEWS & ANNOUNCEMENTS */}
      {/* ==================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">إعلانات وأخبار المركز الرسمية</h3>
              <p className="text-xs text-slate-500">نشر التنبيهات والفعاليات للأولياء والأساتذة والتلاميذ</p>
            </div>
            <button
              onClick={openCreateNewsModal}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 shadow-xs cursor-pointer hover:scale-102 transition-all border border-amber-500"
            >
              <Plus className="w-4 h-4" />
              <span>نشر إعلان جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {newsEvents.map((item) => (
              <div key={item.id} className="dz-card p-5 bg-white border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{item.publishedDate}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">الكاتب: <strong className="text-slate-800">{item.author}</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditNewsModal(item)}
                      className="p-1.5 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                      title="تعديل الإعلان"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف إعلان (${item.title})؟`)) {
                          onDeleteNewsEvent(item.id);
                          showNotification(`تم حذف الإعلان (${item.title})`);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                      title="حذف الإعلان"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SUB-TAB 7: CENTER GLOBAL SETTINGS & IDENTITY */}
      {/* ==================================================== */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="dz-card p-6 bg-white border border-slate-200 space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900">إعدادات وهوية المركز التعليمي الرسمية</h3>
              <p className="text-xs text-slate-500">تعديل بيانات المؤسسة، الترويسة الوزارية، ونصوص الإشعارات</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">اسم المركز التعليمي:</label>
                <input
                  type="text"
                  value={schoolNameForm}
                  onChange={(e) => setSchoolNameForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">المديرية التربوية الولائية:</label>
                <input
                  type="text"
                  value={regionalDirectorateForm}
                  onChange={(e) => setRegionalDirectorateForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">شعار ورؤية المركز (Motto):</label>
                <input
                  type="text"
                  value={mottoForm}
                  onChange={(e) => setMottoForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">تصنيف ونوع المؤسسة:</label>
                <select
                  value={schoolTypeForm}
                  onChange={(e) => setSchoolTypeForm(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                >
                  <option value="مجمع مدرسي">مجمع مدرسي لدروس الدعم والتقوية</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="ثانوية">ثانوية</option>
                  <option value="مدرسة ابتدائية">مدرسة ابتدائية</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="dz-btn-gold px-6 py-2.5 rounded-xl text-slate-950 font-black shadow-md flex items-center gap-2 cursor-pointer hover:scale-102 transition-all"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>حفظ وتطبيق إعدادات السنتر</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. MODAL: USER CREATE / EDIT */}
      {/* ==================================================== */}
      {userModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-amber-400 overflow-hidden" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <UserPlus className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {userModal.mode === 'create' ? 'إنشاء حساب مستخدم جديد' : 'تعديل بيانات الحساب والصلاحيات'}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">التحكم في بيانات الدخول وكلمة المرور والحالة</p>
                </div>
              </div>
              <button
                onClick={() => setUserModal({ isOpen: false, mode: 'create', user: null })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">الاسم واللقب:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: الأستاذ كمال دراجي"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الدور الوظيفي والصلاحية:</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                >
                  <option value="teacher">👨‍🏫 أستاذ (Teacher) - جدول حصص، رصد حضور وكويزات</option>
                  <option value="parent">👨‍👩‍👧 ولي أمر (Parent) - متابعة الأبناء وإشعارات الغياب الفورية</option>
                  <option value="secretary">💼 سكرتارية وحسابات (Secretary) - تحصيل الرسوم وإصدار الإيصالات</option>
                  <option value="admin">👑 مالك / مدير (Admin) - إشراف كامل وإدارة الحسابات</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">البريد الإلكتروني المهني (اسم المستخدم للدخول):</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="user@center-tilmidi.dz"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">رقم الهاتف:</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="0661-000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">المسمى الوظيفي المخصص:</label>
                <input
                  type="text"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  placeholder="مثال: أستاذ مادة الرياضيات / ولي أمر التلميذ أمين"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">كلمة المرور الرسمية لحماية الحساب:</label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">حالة الحساب:</label>
                <select
                  value={userStatus}
                  onChange={(e) => setUserStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                >
                  <option value="active">نشط ومصرح له بالدخول</option>
                  <option value="suspended">مجمّد مؤقتاً</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserModal({ isOpen: false, mode: 'create', user: null })}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="dz-btn-gold px-5 py-2 rounded-xl text-slate-950 font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>{userModal.mode === 'create' ? 'تأكيد إنشاء الحساب' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MODAL: STUDENT CREATE / EDIT */}
      {/* ==================================================== */}
      {studentModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-emerald-500 overflow-hidden" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black">
                  <GraduationCap className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {studentModal.mode === 'create' ? 'تسجيل تلميذ جديد بالمركز' : 'تعديل بيانات التلميذ'}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">بيانات الهوية المدرسية والفوج وولي الأمر والاشتراك</p>
                </div>
              </div>
              <button
                onClick={() => setStudentModal({ isOpen: false, mode: 'create', student: null })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">اسم ولقب التلميذ:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="مثال: ياسمين بلقاسم"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">رقم التعريف المدرسي / الوطني (R.N.E):</label>
                <input
                  type="text"
                  value={studentRegNum}
                  onChange={(e) => setStudentRegNum(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الفوج الدراسي المسجل به:</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs bg-white"
                >
                  <option value="السنة الرابعة متوسط (4م2)">السنة الرابعة متوسط (4م2 - BEM)</option>
                  <option value="السنة الرابعة متوسط (4م1)">السنة الرابعة متوسط (4م1 - BEM)</option>
                  <option value="السنة الثالثة ثانوي (3ع1)">السنة الثالثة ثانوي (3ع1 - BAC علوم تجريبية)</option>
                  <option value="السنة الثالثة ثانوي (3آداب)">السنة الثالثة ثانوي (3آداب - BAC آداب وفلسفة)</option>
                  <option value="السنة الأولى ثانوي (1جذع م ع)">السنة الأولى ثانوي (جذع مشترك علوم)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">اسم ولي الأمر الكامل:</label>
                <input
                  type="text"
                  value={studentGuardianName}
                  onChange={(e) => setStudentGuardianName(e.target.value)}
                  placeholder="مثال: عمر بلقاسم"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">رقم هاتف الولي (لتنبيهات الواتساب الفورية):</label>
                <input
                  type="tel"
                  value={studentGuardianPhone}
                  onChange={(e) => setStudentGuardianPhone(e.target.value)}
                  placeholder="0661-000000"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الاشتراك الشهري المقترح (دج):</label>
                <input
                  type="number"
                  value={studentMonthlyFee}
                  onChange={(e) => setStudentMonthlyFee(Number(e.target.value))}
                  step="500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStudentModal({ isOpen: false, mode: 'create', student: null })}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{studentModal.mode === 'create' ? 'تأكيد تسجيل التلميذ' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. MODAL: GOOGLE MEET SESSION CREATE / EDIT */}
      {/* ==================================================== */}
      {sessionModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-blue-500 overflow-hidden" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-400 text-slate-950 flex items-center justify-center font-black">
                  <Video className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {sessionModal.mode === 'create' ? 'إضافة حصة دعم جديدة (Google Meet)' : 'تعديل بيانات الحصة'}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">جدولة البث المباشر وتعيين رابط الاجتماع</p>
                </div>
              </div>
              <button
                onClick={() => setSessionModal({ isOpen: false, mode: 'create', session: null })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSaveSession} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">عنوان حصة الدعم:</label>
                <input
                  type="text"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="مثال: مراجعة الدالة الخطية وحل وضعيات إدماجية"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">المادة الدراسية:</label>
                  <select
                    value={sessionSubject}
                    onChange={(e) => setSessionSubject(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                  >
                    <option value="الرياضيات">الرياضيات</option>
                    <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية</option>
                    <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
                    <option value="اللغة العربية">اللغة العربية</option>
                    <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="الفلسفة">الفلسفة</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">المستوى الدراسي:</label>
                  <input
                    type="text"
                    value={sessionLevel}
                    onChange={(e) => setSessionLevel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">اسم الأستاذ المؤطر:</label>
                <input
                  type="text"
                  value={sessionTeacherName}
                  onChange={(e) => setSessionTeacherName(e.target.value)}
                  placeholder="مثال: الأستاذ كمال دراجي"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">التاريخ:</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">وقت البث:</label>
                  <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">المدة (دقيقة):</label>
                  <input
                    type="number"
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                    step="15"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">رابط الحصة (Google Meet Link):</label>
                <input
                  type="url"
                  value={sessionMeetUrl}
                  onChange={(e) => setSessionMeetUrl(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">وصف الحصة ومحاور المراجعة:</label>
                <textarea
                  value={sessionDescription}
                  onChange={(e) => setSessionDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSessionModal({ isOpen: false, mode: 'create', session: null })}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-black shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{sessionModal.mode === 'create' ? 'تأكيد إضافة الحصة' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. MODAL: EDIT STUDENT FEE */}
      {/* ==================================================== */}
      {feeModal.isOpen && feeModal.fee && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-amber-400 overflow-hidden" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Wallet className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">تعديل اشتراك التلميذ</h3>
                  <p className="text-xs text-emerald-100">{feeModal.fee.studentName}</p>
                </div>
              </div>
              <button
                onClick={() => setFeeModal({ isOpen: false, fee: null })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSaveFee} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">الرسم الشهري المطلوب (دج):</label>
                <input
                  type="number"
                  value={feeMonthly}
                  onChange={(e) => setFeeMonthly(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">المبلغ المسدد بالفعل (دج):</label>
                <input
                  type="number"
                  value={feePaid}
                  onChange={(e) => setFeePaid(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-left text-emerald-700"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الشهر:</label>
                <input
                  type="text"
                  value={feeMonth}
                  onChange={(e) => setFeeMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFeeModal({ isOpen: false, fee: null })}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="dz-btn-gold px-5 py-2 rounded-xl text-slate-950 font-black shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>حفظ التعديلات المالية</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. MODAL: NEWS & ANNOUNCEMENT CREATE / EDIT */}
      {/* ==================================================== */}
      {newsModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-amber-500 overflow-hidden" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Newspaper className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {newsModal.mode === 'create' ? 'نشر إعلان رسمي جديد' : 'تعديل الإعلان'}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">إشعار موجه للأولياء والتلاميذ والأساتذة</p>
                </div>
              </div>
              <button
                onClick={() => setNewsModal({ isOpen: false, mode: 'create', item: null })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-700">عنوان الإعلان:</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="مثال: انطلاق التسجيلات في مراجعات العطلة الشتوية"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">فئة الإعلان:</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs bg-white"
                >
                  <option value="مراجعات BEM و BAC">مراجعات BEM و BAC</option>
                  <option value="الفعاليات المدرسية">الفعاليات المدرسية</option>
                  <option value="أخبار النقابة والوزارة">أخبار النقابة والوزارة</option>
                  <option value="إصلاحات المنظومة 2026">إصلاحات المنظومة 2026</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الموجز القصير:</label>
                <textarea
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  rows={2}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الناشر / الكاتب:</label>
                <input
                  type="text"
                  value={newsAuthor}
                  onChange={(e) => setNewsAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewsModal({ isOpen: false, mode: 'create', item: null })}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="dz-btn-gold px-5 py-2 rounded-xl text-slate-950 font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>{newsModal.mode === 'create' ? 'تأكيد النشر' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
