import React, { useState, useEffect } from 'react';
import { 
  Student, 
  AttendanceRecord, 
  AttendanceStatus, 
  UserRole, 
  AutoAttendanceConfig, 
  SchoolSettings,
  AbsenceJustification,
  JustificationReasonType
} from '../types';
import { DEFAULT_AUTO_ATTENDANCE_CONFIG, INITIAL_ABSENCE_JUSTIFICATIONS } from '../data/initialData';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Smartphone,
  Info,
  Settings,
  Bell,
  Sliders,
  RotateCcw,
  Users,
  MessageCircle,
  FileText,
  Upload,
  Paperclip,
  CheckCheck,
  X,
  Eye,
  Filter,
  Crown,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  records: AttendanceRecord[];
  onUpdateStatus: (studentId: string, status: AttendanceStatus, notes?: string) => void;
  userRole: UserRole;
  schoolSettings?: SchoolSettings;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  records,
  onUpdateStatus,
  userRole,
  schoolSettings,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-08');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  
  // Active Navigation Tab inside Attendance Tracker
  const [activeTab, setActiveTab] = useState<'roster' | 'justifications' | 'new_justification'>('roster');

  // WhatsApp & SMS Notification Modal State
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [selectedStudentForNotice, setSelectedStudentForNotice] = useState<Student | null>(null);
  const [customNoticeText, setCustomNoticeText] = useState('');
  const [noticeSentRecords, setNoticeSentRecords] = useState<Record<string, { viaWhatsApp?: boolean; viaSms?: boolean; sentAt: string }>>(() => {
    const saved = localStorage.getItem('tilmidi_attendance_notifications_dz_2026');
    return saved ? JSON.parse(saved) : {};
  });

  // Electronic Justifications State with LocalStorage persistence
  const [justifications, setJustifications] = useState<AbsenceJustification[]>(() => {
    const saved = localStorage.getItem('tilmidi_absence_justifications_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_ABSENCE_JUSTIFICATIONS;
  });

  // New Justification Form State (for parents or teachers on behalf of parents)
  const [selectedStudentForJustification, setSelectedStudentForJustification] = useState(students[0]?.id || '');
  const [justificationReason, setJustificationReason] = useState<JustificationReasonType>('medical_certificate');
  const [justificationDetails, setJustificationDetails] = useState('');
  const [justificationDocName, setJustificationDocName] = useState('شهادة_طبية_معتمدة.pdf');
  const [previewDocModal, setPreviewDocModal] = useState<AbsenceJustification | null>(null);

  // Auto-Attendance Configuration with LocalStorage persistence
  const [autoConfig, setAutoConfig] = useState<AutoAttendanceConfig>(() => {
    const saved = localStorage.getItem('tilmidi_auto_attendance_config_dz_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_AUTO_ATTENDANCE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('tilmidi_auto_attendance_config_dz_2026', JSON.stringify(autoConfig));
  }, [autoConfig]);

  useEffect(() => {
    localStorage.setItem('tilmidi_absence_justifications_dz_2026', JSON.stringify(justifications));
  }, [justifications]);

  useEffect(() => {
    localStorage.setItem('tilmidi_attendance_notifications_dz_2026', JSON.stringify(noticeSentRecords));
  }, [noticeSentRecords]);

  const schoolName = schoolSettings?.schoolName || 'متوسطة الأمير عبد القادر';

  const getRecordForStudent = (studentId: string): AttendanceRecord | undefined => {
    return records.find(
      (r) => r.studentId === studentId && r.date === selectedDate && r.timeSlot === timeSlot
    );
  };

  const handleStatusChange = (student: Student, newStatus: AttendanceStatus) => {
    onUpdateStatus(student.id, newStatus);
    
    if (newStatus === 'absent') {
      setLastNotification(`تم تسجيل غياب التلميذ (${student.name}). يمكنك الآن إرسال إشعار واتساب فوري لولي الأمر بنقرة زر.`);
      // Pre-open notification modal or prompt
    } else if (newStatus === 'late') {
      setLastNotification(`تم إشعار ولي أمر التلميذ (${student.name}) بتسجيل تأخر عن الحصة.`);
    } else if (newStatus === 'present') {
      setLastNotification(`تم تأكيد حضور التلميذ (${student.name}) بنجاح.`);
    }

    setTimeout(() => {
      setLastNotification(null);
    }, 5000);
  };

  // Build clean international phone number for WhatsApp
  const formatPhoneForWhatsApp = (rawPhone: string): string => {
    let clean = rawPhone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '213' + clean.slice(1);
    } else if (!clean.startsWith('213')) {
      clean = '213' + clean;
    }
    return clean;
  };

  // Build official Algerian educational absence notice message
  const buildOfficialAbsenceMessage = (student: Student): string => {
    return `الجمهورية الجزائرية الديمقراطية الشعبية
وزارة التربية الوطنية · ${schoolName}

السيد(ة) ولي أمر التلميذ(ة): ${student.name}
المستوى: السنة الرابعة متوسط (فوج 4م2)
رقم التعريف المدرسي: ${student.registrationNumber}

نحيطكم علماً بأنه قد تم تسجيل *غياب غير مبرر* لنجلكم(تكم) عن حصة الرياضيات.
📅 التاريخ: ${selectedDate}
⏰ الفترة الزمنية: ${timeSlot}

⚠️ يُرجى التكرم بتقديم تبرير قانوني (شهادة طبية معتمدة أو مبرر خطي) عبر منصة «تلميذي» في أجل لا يتعدى 48 ساعة من تاريخ هذا الإشعار، تفادياً للإجراءات الإدارية المعمول بها.

النقابة الوطنية لعمال التربية (SNTE) بالتعاون مع إدارة المؤسسة.`;
  };

  // Open WhatsApp Modal for a student
  const handleOpenWhatsAppModal = (student: Student) => {
    setSelectedStudentForNotice(student);
    setCustomNoticeText(buildOfficialAbsenceMessage(student));
    setWhatsAppModalOpen(true);
  };

  // Execute WhatsApp Web / App Dispatch
  const handleSendWhatsApp = (student: Student) => {
    const formattedPhone = formatPhoneForWhatsApp(student.guardianPhone);
    const message = customNoticeText || buildOfficialAbsenceMessage(student);
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encoded}`;

    // Mark as notified in local tracking
    setNoticeSentRecords((prev) => ({
      ...prev,
      [`${student.id}_${selectedDate}_${timeSlot}`]: {
        viaWhatsApp: true,
        sentAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    setLastNotification(`تم فتح تطبيق واتساب وتجهيز الإشعار الرسمي لولي أمر التلميذ (${student.name}) على الرقم ${student.guardianPhone}.`);
    setWhatsAppModalOpen(false);

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Send Direct simulated cloud SMS
  const handleSendSms = (student: Student) => {
    setNoticeSentRecords((prev) => ({
      ...prev,
      [`${student.id}_${selectedDate}_${timeSlot}`]: {
        ...prev[`${student.id}_${selectedDate}_${timeSlot}`],
        viaSms: true,
        sentAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    setLastNotification(`تم إرسال رسالة SMS رسمية عبر بوابة المؤسسة السحابية لولي أمر التلميذ (${student.name}) بنجاح.`);
    setWhatsAppModalOpen(false);
  };

  // Bulk WhatsApp for all absent students
  const handleBulkWhatsAppAbsentees = () => {
    const absentees = students.filter((s) => getRecordForStudent(s.id)?.status === 'absent');
    if (absentees.length === 0) {
      setLastNotification('لا يوجد أي تلميذ غائب في الحصة الحالية لإرسال إشعارات له.');
      return;
    }

    // Mark all as notified and open first
    const updated = { ...noticeSentRecords };
    absentees.forEach((st) => {
      updated[`${st.id}_${selectedDate}_${timeSlot}`] = {
        viaWhatsApp: true,
        sentAt: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      };
    });
    setNoticeSentRecords(updated);

    // Open first one and show alert
    const first = absentees[0];
    const formattedPhone = formatPhoneForWhatsApp(first.guardianPhone);
    const msg = encodeURIComponent(buildOfficialAbsenceMessage(first));
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${msg}`, '_blank', 'noopener,noreferrer');

    setLastNotification(`تم تجهيز وإرسال إشعارات واتساب لجميع التلاميذ الغائبين (${absentees.length} تلاميذ) بنجاح.`);
  };

  // Submit new electronic justification (by parent)
  const handleSubmitNewJustification = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentForJustification) || students[0];
    if (!student) return;

    const reasonLabels: Record<JustificationReasonType, string> = {
      medical_certificate: 'شهادة طبية معتمدة من طبيب محلف',
      family_emergency: 'ظرف عائلي طارئ وقاهر',
      hospital_visit: 'موعد فحص استشفائي متخصص',
      prior_notice: 'إشعار مسبق بالغياب لمانع شرعي',
      other: 'مبرر إداري / أسباب أخرى',
    };

    const newJustification: AbsenceJustification = {
      id: `just-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      date: selectedDate,
      timeSlot: timeSlot,
      subject: 'الرياضيات',
      reasonType: justificationReason,
      reasonLabel: reasonLabels[justificationReason],
      details: justificationDetails || 'نقدم هذا التبرير القانوني المرفق بشهادة رسمية لاعتماده لدى إدارة المؤسسة.',
      attachedDocumentName: justificationDocName,
      attachedDocumentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      status: 'pending',
      submittedAt: new Date().toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' }),
    };

    setJustifications((prev) => [newJustification, ...prev]);
    setJustificationDetails('');
    setActiveTab('justifications');
    setLastNotification(`تم إيداع طلب تبرير الغياب للتلميذ (${student.name}) إلكترونياً بنجاح، وهو قيد المراجعة لدى الأستاذ وإدارة المؤسسة.`);
  };

  // Teacher accepts justification -> updates record to 'excused'
  const handleAcceptJustification = (just: AbsenceJustification) => {
    // 1. Update Attendance Status to 'excused'
    onUpdateStatus(just.studentId, 'excused', `تم قبول التبرير الإلكتروني: ${just.reasonLabel}`);

    // 2. Mark justification as accepted
    setJustifications((prev) =>
      prev.map((item) =>
        item.id === just.id
          ? {
              ...item,
              status: 'accepted',
              reviewedAt: new Date().toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' }),
              reviewerNotes: 'تم التحقق من الوثيقة المرفقة واعتماد الغياب مبرراً نظامياً.',
            }
          : item
      )
    );

    setLastNotification(`تم قبول تبرير التلميذ (${just.studentName}) بنجاح، وتم تعديل حالته إلى (غياب مبرر ✓) في سجل الحضور.`);
  };

  // Teacher rejects justification
  const handleRejectJustification = (just: AbsenceJustification) => {
    const reason = prompt('يرجى تحديد سبب رفض التبرير (سيصل إشعار لولي الأمر):', 'الوثيقة الطبية غير مختومة أو تم إيداعها بعد انقضاء أجل 48 ساعة.');
    if (reason === null) return;

    setJustifications((prev) =>
      prev.map((item) =>
        item.id === just.id
          ? {
              ...item,
              status: 'rejected',
              reviewedAt: new Date().toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' }),
              reviewerNotes: reason || 'تم رفض التبرير لعدم استيفاء الشروط القانونية.',
            }
          : item
      )
    );

    setLastNotification(`تم رفض تبرير التلميذ (${just.studentName}) وإرسال الملاحظة لولي الأمر.`);
  };

  // Instant apply default auto-attendance for the active day
  const handleApplyAutoAttendanceForDate = () => {
    let appliedCount = 0;
    students.forEach((student) => {
      const existing = getRecordForStudent(student.id);
      if (!existing || existing.status !== 'absent') {
        onUpdateStatus(student.id, autoConfig.defaultStatus, 'حضور افتراضي مجدول آلياً');
        appliedCount++;
      }
    });

    const updatedHistory = Array.from(new Set([...(autoConfig.executedDatesHistory || []), selectedDate]));
    setAutoConfig((prev) => ({
      ...prev,
      lastExecutedDate: selectedDate,
      executedDatesHistory: updatedHistory,
    }));

    if (autoConfig.autoNotifyParents) {
      setLastNotification(`تم تسجيل الحضور الافتراضي لجميع تلامذة الفوج (${appliedCount} تلميذاً)، وإرسال تنبيه آلي مؤكد للأولياء عبر فضاء الأولياء بنجاح.`);
    } else {
      setLastNotification(`تم تطبيق الحضور الافتراضي بنجاح لتلامذة الفوج (${appliedCount} تلميذاً) لتاريخ ${selectedDate}.`);
    }

    setTimeout(() => {
      setLastNotification(null);
    }, 5500);
  };

  // Calculations
  const total = students.length;
  const presentCount = students.filter((s) => {
    const rec = getRecordForStudent(s.id);
    return rec ? rec.status === 'present' : true;
  }).length;
  const absentCount = students.filter((s) => getRecordForStudent(s.id)?.status === 'absent').length;
  const lateCount = students.filter((s) => getRecordForStudent(s.id)?.status === 'late').length;
  const pendingJustificationsCount = justifications.filter((j) => j.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification Toast */}
      {lastNotification && (
        <div className="dz-badge-gold px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-md transition-all border border-amber-400/60 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-amber-900 shrink-0" />
            <span className="font-black text-slate-950">{lastNotification}</span>
          </div>
          <button 
            onClick={() => setLastNotification(null)}
            className="text-xs font-black text-amber-900 hover:text-slate-950 underline px-2 py-1"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Main Control Bar in Royal Algerian Palette */}
      <div className="dz-card-royal p-6 space-y-5 bg-white border-2 border-amber-400/40 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                رصد الحضور والغياب الفوري والإشعارات
              </h2>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                إشعار واتساب فوري 🟢
              </span>
              {pendingJustificationsCount > 0 && (
                <span className="text-xs font-black text-red-800 bg-red-100 border border-red-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>{pendingJustificationsCount} طلبات تبرير واردة ⏳</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 font-bold">
              إرسال إشعارات واتساب ورسائل للأولياء عند رصد غياب غير مبرر مع نظام استقبال وتدقيق تبريرات الغياب إلكترونياً
            </p>
          </div>

          {/* Action buttons toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp bulk alert button */}
            {absentCount > 0 && (
              <button
                onClick={handleBulkWhatsAppAbsentees}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-102 cursor-pointer border border-emerald-500"
                title="إرسال إشعارات واتساب لجميع الأولياء المسجلين كغائبين"
              >
                <MessageCircle className="w-4 h-4 text-white fill-white" />
                <span>إشعار واتساب لجميع الغائبين ({absentCount})</span>
              </button>
            )}

            {/* Parent Electronic Justification Request Trigger */}
            <button
              onClick={() => setActiveTab('new_justification')}
              className="px-4 py-2 rounded-xl dz-btn-gold text-slate-950 font-black text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-102 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-950" />
              <span>تقديم تبرير غياب إلكتروني</span>
              <Crown className="w-3.5 h-3.5 text-amber-700" />
            </button>

            {/* Auto Attendance Schedule Settings Modal */}
            <button
              onClick={() => setConfigModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-black text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-800" />
              <span>جدولة الحضور الافتراضي</span>
            </button>
          </div>
        </div>

        {/* View Navigation Tabs: Roster vs Justifications */}
        <div className="flex items-center gap-2 border-b border-slate-200 pt-2 text-xs font-black">
          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'roster'
                ? 'border-emerald-700 text-emerald-900 font-black text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل الفوج ورصد الغياب</span>
          </button>

          <button
            onClick={() => setActiveTab('justifications')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 relative ${
              activeTab === 'justifications'
                ? 'border-amber-600 text-amber-950 font-black text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>طلبات التبرير الإلكترونية الواردة</span>
            {pendingJustificationsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {pendingJustificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('new_justification')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'new_justification'
                ? 'border-red-600 text-red-950 font-black text-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 text-red-600" />
            <span>إيداع تبرير جديد (فضاء الأولياء)</span>
          </button>
        </div>

        {/* Date and Time Slot Filter Controls */}
        {activeTab === 'roster' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                <span className="text-slate-500">التاريخ:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-0 focus:outline-hidden text-slate-900 font-black"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-800" />
                <span className="text-slate-500">الحصة:</span>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="bg-transparent border-0 focus:outline-hidden text-slate-900 font-black cursor-pointer"
                >
                  <option value="08:00 - 10:00">الفترة الصباحية الأولى (08:00 - 10:00)</option>
                  <option value="10:00 - 12:00">الفترة الصباحية الثانية (10:00 - 12:00)</option>
                  <option value="13:30 - 15:30">الفترة المسائية الأولى (13:30 - 15:30)</option>
                  <option value="15:30 - 17:30">الفترة المسائية الثانية (15:30 - 17:30)</option>
                </select>
              </div>
            </div>

            {/* Quick action to apply auto-attendance */}
            <button
              onClick={handleApplyAutoAttendanceForDate}
              className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>تطبيق الحضور الافتراضي لجميع الفوج اليوم</span>
            </button>
          </div>
        )}

        {/* Stats Row in Royal Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-600 font-bold block">إجمالي تلامذة الفوج</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">{total}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-black block">الحاضرون الآن</span>
            <span className="text-2xl font-black text-emerald-800 tabular-nums">{presentCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200">
            <span className="text-xs text-red-800 font-black block">الغيابات المسجلة</span>
            <span className="text-2xl font-black text-red-700 tabular-nums">{absentCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300">
            <span className="text-xs text-amber-800 font-black block">المتأخرون / تبريرات</span>
            <span className="text-2xl font-black text-amber-800 tabular-nums">{lateCount}</span>
          </div>
        </div>
      </div>

      {/* PRIVACY & SECURITY NOTE WITH ALGERIAN UNION SEAL */}
      <div className="dz-royal-header text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-2 border-amber-400/40 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="font-bold leading-relaxed">
            <strong>نظام التنبيهات القانوني المعتمد:</strong> يتم إرسال إشعارات الواتساب والرسائل النصية الرسمية فور رصد أي غياب غير مبرر، لحماية حق التلميذ وتفادي التأخر عن موعد الامتحان الرسمي لشهادة التعليم المتوسط (BEM 2026).
          </span>
        </div>
        <span className="dz-badge-gold text-slate-950 px-3 py-1 rounded-xl text-[11px] shrink-0 font-black self-start sm:self-auto border border-amber-400">
          إشعار محمي وموثق
        </span>
      </div>

      {/* VIEW 1: STUDENT ATTENDANCE ROSTER */}
      {activeTab === 'roster' && (
        <div className="dz-card-royal bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                قائمة الفوج التربوي: 4م2 (BEM) · مادة الرياضيات · {schoolName}
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                التاريخ: {selectedDate} | الحصة: {timeSlot}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300 font-extrabold">
                ● الإشعار الفوري بالواتساب مفعل للأولياء
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {students.map((student) => {
              const currentRecord = getRecordForStudent(student.id);
              const status: AttendanceStatus = currentRecord ? currentRecord.status : autoConfig.defaultStatus;
              const noticeKey = `${student.id}_${selectedDate}_${timeSlot}`;
              const noticeStatus = noticeSentRecords[noticeKey];

              return (
                <div 
                  key={student.id}
                  className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center font-black text-xs text-slate-800">
                      {student.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-sm">{student.name}</h4>
                        <span className="text-[11px] text-slate-500 font-mono font-bold">
                          {student.registrationNumber}
                        </span>
                        {status === 'absent' && (
                          <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                            غياب غير مبرر
                          </span>
                        )}
                        {status === 'excused' && (
                          <span className="text-[10px] font-black text-sky-800 bg-sky-50 border border-sky-300 px-2 py-0.5 rounded">
                            غياب مبرر قانوناً ✓
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                        <span>ولي الأمر: <strong className="text-slate-800 font-bold">{student.guardianName}</strong></span>
                        <span>·</span>
                        <span className="font-mono font-bold text-slate-700 dir-ltr">{student.guardianPhone}</span>
                        {noticeStatus?.viaWhatsApp && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded font-extrabold flex items-center gap-1">
                            <CheckCheck className="w-3 h-3 text-emerald-700" />
                            <span>تم إشعار ولي الأمر بالواتساب ({noticeStatus.sentAt})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & WhatsApp dispatch area */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Toggle Buttons */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-black">
                      <button
                        onClick={() => handleStatusChange(student, 'present')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                          status === 'present'
                            ? 'bg-emerald-700 text-white shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>حاضر</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student, 'absent')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                          status === 'absent'
                            ? 'bg-red-700 text-white shadow-xs font-black'
                            : 'text-slate-600 hover:text-red-700'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>غائب</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student, 'late')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                          status === 'late'
                            ? 'bg-amber-600 text-white shadow-xs font-black'
                            : 'text-slate-600 hover:text-amber-700'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>متأخر</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student, 'excused')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                          status === 'excused'
                            ? 'bg-sky-700 text-white shadow-xs font-black'
                            : 'text-slate-600 hover:text-sky-700'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>مبرر</span>
                      </button>
                    </div>

                    {/* Direct WhatsApp / SMS Notification Buttons when Absent or Late */}
                    {status === 'absent' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenWhatsAppModal(student)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-2xs transition-all hover:scale-102 cursor-pointer border border-emerald-500"
                          title="إرسال إشعار غياب فوري لولي الأمر عبر تطبيق واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                          <span>إرسال واتساب</span>
                        </button>

                        <button
                          onClick={() => handleSendSms(student)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all"
                          title="إرسال رسالة SMS رسمية"
                        >
                          <span>SMS</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ELECTRONIC JUSTIFICATIONS INBOX */}
      {activeTab === 'justifications' && (
        <div className="space-y-4">
          <div className="dz-card-royal p-5 bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">
                طلبات تبرير الغياب الإلكترونية الواردة من الأولياء
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                تدقيق التبريرات الطبية والقانونية المقدمة وقبولها أو رفضها مع تحديث سجل الحضور آلياً
              </p>
            </div>

            <button
              onClick={() => setActiveTab('new_justification')}
              className="px-4 py-2 rounded-xl dz-btn-gold text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4 text-amber-950" />
              <span>تقديم طلب تبرير جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {justifications.map((just) => (
              <div 
                key={just.id}
                className="dz-card-royal p-5 bg-white border-2 border-slate-200 hover:border-amber-400 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-base">{just.studentName}</span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        تاريخ الغياب: {just.date} ({just.timeSlot})
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {just.subject}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-bold flex items-center gap-2">
                      <span>ولي الأمر: {just.guardianName}</span>
                      <span>·</span>
                      <span className="font-mono text-slate-700">{just.guardianPhone}</span>
                      <span>·</span>
                      <span className="text-slate-400 font-normal">أودع بتاريخ: {just.submittedAt}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {just.status === 'pending' && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>قيد تدقيق الإدارة والأستاذ</span>
                      </span>
                    )}
                    {just.status === 'accepted' && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>مبرر ومقبول قانوناً ✓</span>
                      </span>
                    )}
                    {just.status === 'rejected' && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-300 flex items-center gap-1 shadow-2xs">
                        <X className="w-3.5 h-3.5 text-red-700" />
                        <span>مبرر مرفوض ✕</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Justification Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700">نوع المبرر:</span>
                    <span className="text-xs font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      {just.reasonLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
                    «{just.details}»
                  </p>
                </div>

                {/* Attached Document & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  {/* Document preview button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDocModal(just)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                      <span>معاينة الوثيقة المرفقة: {just.attachedDocumentName || 'شهادة_طبية.pdf'}</span>
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  {/* Teacher Decision Actions */}
                  {just.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptJustification(just)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all hover:scale-102 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>قبول التبرير واعتباره مبرراً</span>
                      </button>

                      <button
                        onClick={() => handleRejectJustification(just)}
                        className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-black transition-colors cursor-pointer"
                      >
                        <span>رفض التبرير</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-bold">
                      تمت المراجعة: {just.reviewedAt} {just.reviewerNotes && `· ملاحظة: ${just.reviewerNotes}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SUBMIT NEW ELECTRONIC JUSTIFICATION (PARENT PORTAL) */}
      {activeTab === 'new_justification' && (
        <div className="dz-card-royal p-6 sm:p-8 bg-white border-2 border-amber-400/50 rounded-3xl shadow-md space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl dz-btn-gold text-slate-950 flex items-center justify-center font-black shadow-xs">
                <FileText className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  إيداع طلب تبرير غياب إلكتروني (فضاء الأولياء)
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  إرسال الشهادة الطبية أو المبرر القانوني مباشرة للأستاذ وإدارة المؤسسة
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('roster')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              العودة للقائمة ✕
            </button>
          </div>

          <form onSubmit={handleSubmitNewJustification} className="space-y-5 text-xs font-bold text-slate-800">
            {/* Student Selector */}
            <div className="space-y-1.5">
              <label className="block text-slate-700">التلميذ المعني بالغياب:</label>
              <select
                value={selectedStudentForJustification}
                onChange={(e) => setSelectedStudentForJustification(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-black focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — رقم التعريف: {st.registrationNumber} (ولي الأمر: {st.guardianName})
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700">تاريخ الغياب:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-black focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700">الحصة المدرسية:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-black focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                  <option value="08:00 - 10:00">الفترة الصباحية الأولى (08:00 - 10:00)</option>
                  <option value="10:00 - 12:00">الفترة الصباحية الثانية (10:00 - 12:00)</option>
                  <option value="13:30 - 15:30">الفترة المسائية الأولى (13:30 - 15:30)</option>
                  <option value="15:30 - 17:30">الفترة المسائية الثانية (15:30 - 17:30)</option>
                </select>
              </div>
            </div>

            {/* Reason Type */}
            <div className="space-y-1.5">
              <label className="block text-slate-700">نوع المبرر القانوني:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'medical_certificate', label: 'شهادة طبية معتمدة من طبيب محلف', tag: 'صحي' },
                  { id: 'family_emergency', label: 'ظرف عائلي قاهر وطارئ', tag: 'عائلي' },
                  { id: 'hospital_visit', label: 'موعد فحص استشفائي متخصص', tag: 'طبي' },
                  { id: 'prior_notice', label: 'إشعار مسبق بالغياب لمانع شرعي', tag: 'إداري' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setJustificationReason(item.id as JustificationReasonType)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      justificationReason === item.id
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-black text-slate-900">{item.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Justification Details Text */}
            <div className="space-y-1.5">
              <label className="block text-slate-700">شرح وتفاصيل التبرير المقدم للأستاذ والإدارة:</label>
              <textarea
                rows={3}
                value={justificationDetails}
                onChange={(e) => setJustificationDetails(e.target.value)}
                placeholder="اكتب هنا توضيحاً موجزاً عن سبب الغياب ومدة الراحة الطبية المقررة..."
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                required
              />
            </div>

            {/* Document Upload Simulation */}
            <div className="space-y-1.5">
              <label className="block text-slate-700">إرفاق الشهادة الطبية أو الوثيقة الثبوتية (PDF أو صورة):</label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-6 h-6 text-emerald-800 shrink-0" />
                  <div>
                    <span className="font-black text-slate-900 block">{justificationDocName}</span>
                    <span className="text-[11px] text-slate-500 block">وثيقة رسمية مختومة بختم الطبيب المعالج والعيادة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setJustificationDocName('شهادة_طبية_مستشفى_جامعي_نوفمبر2026.pdf')}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100"
                  >
                    تغيير الوثيقة
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl dz-btn-gold text-slate-950 font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>إيداع التبرير رسمياً لدى الأستاذ والإدارة</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WHATSAPP NOTICE PREVIEW & DISPATCH MODAL */}
      {whatsAppModalOpen && selectedStudentForNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-emerald-500 space-y-5 animate-in fade-in zoom-in-95 duration-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    إرسال إشعار غياب فوري عبر واتساب
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">
                    إلى ولي أمر التلميذ: {selectedStudentForNotice.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setWhatsAppModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block font-semibold">رقم هاتف ولي الأمر:</span>
                <span className="font-mono font-black text-slate-900 text-sm dir-ltr">
                  {selectedStudentForNotice.guardianPhone}
                </span>
              </div>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-black border border-emerald-300">
                مفتاح الجزائر (+213)
              </span>
            </div>

            {/* Message Body Textarea */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-black text-slate-800">
                نص الإشعار الوزاري المعتمد (قابـل للتعديل):
              </label>
              <textarea
                rows={6}
                value={customNoticeText}
                onChange={(e) => setCustomNoticeText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:bg-white leading-relaxed"
              />
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSendSms(selectedStudentForNotice)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors"
              >
                إرسال كرسالة SMS
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhatsAppModalOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(selectedStudentForNotice)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>فتح واتساب وإرسال الإشعار</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MEDICAL CERTIFICATE / DOCUMENT PREVIEW MODAL */}
      {previewDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-amber-400 space-y-5 animate-in fade-in" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">
                  معاينة الوثيقة الثبوتية: {previewDocModal.attachedDocumentName}
                </h3>
              </div>
              <button onClick={() => setPreviewDocModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Realistic Algerian Medical Certificate Simulation Sheet */}
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl space-y-4 font-serif text-right text-slate-900 shadow-inner">
              <div className="border-b border-slate-300 pb-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black block text-sm text-emerald-950">الجمهورية الجزائرية الديمقراطية الشعبية</span>
                  <span className="text-slate-600 block">وزارة الصحة · المؤسسة العمومية للصحة الجوارية</span>
                  <span className="text-slate-600 block">عيادة متعددة الخدمات — مصلحة الفحوصات والاستعجالات</span>
                </div>
                <div className="w-14 h-14 rounded-full border border-slate-400 flex items-center justify-center text-[10px] text-slate-500 font-sans font-bold">
                  ختم العيادة
                </div>
              </div>

              <div className="text-center py-2">
                <h4 className="text-lg font-black underline text-slate-950">شهادة طبية للتبرير المدرسي</h4>
                <span className="text-[11px] font-sans text-slate-500">رقم القيد الطبي: 2026/MD/884</span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed font-sans font-semibold">
                <p>
                  يشهد الطبيب الفاحص الموقع أدناه، بأنه قام بفحص التلميذ(ة): <strong className="text-emerald-900 font-black">{previewDocModal.studentName}</strong>.
                </p>
                <p>
                  المتمدرس بـ: <strong className="text-slate-900">{schoolName}</strong> (الفوج: 4م2 - BEM).
                </p>
                <p>
                  وأن حالته الصحية تستوجب راحة تامة وعلاجاً في المنزل ابتداءً من تاريخ: <strong className="text-red-700 font-mono">{previewDocModal.date}</strong> لمدة 48 ساعة.
                </p>
                <p className="text-[11px] text-slate-500 pt-2">
                  سُلمت هذه الشهادة لولي الأمر للإدلاء بها لدى إدارة المؤسسة التعليمية لاستيفاء الغياب قانوناً.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs border-t border-slate-200">
                <span className="text-slate-500">حرر بتاريخ: {previewDocModal.date}</span>
                <div className="text-center font-sans">
                  <span className="font-black text-slate-900 block">الطبيب المعالج</span>
                  <span className="text-[10px] text-emerald-800 font-bold block">د. بن عيسى عمار (طب عام)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-black text-xs hover:bg-slate-900"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUTO ATTENDANCE SCHEDULING MODAL */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 my-8" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl dz-btn-gold text-slate-950 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5 text-amber-950" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    جدولة الحضور الافتراضي والتنبيه الآلي
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    ضبط قاعدة الحضور التلقائي للأيام التي لا يتم فيها رصد الغياب يدوياً
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConfigModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs font-bold">
              {/* Enable / Disable Master Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-sm text-slate-900 block">
                    تفعيل الحضور الافتراضي المجدول
                  </span>
                  <span className="text-[11px] text-slate-500 block font-normal">
                    اعتبار جميع تلامذة الفوج حاضرين تلقائياً في الأيام المحددة إن لم يرصد غياب يدوي
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfig.enabled}
                    onChange={(e) => setAutoConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Auto Notify Parents Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-sm text-slate-900 block">
                    إرسال تنبيه آلي للأولياء
                  </span>
                  <span className="text-[11px] text-slate-500 block font-normal">
                    إشعار أولياء التلاميذ آلياً بتسجيل حضور أبنائهم عبر فضاء الأولياء والرسائل
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfig.autoNotifyParents}
                    onChange={(e) => setAutoConfig((prev) => ({ ...prev, autoNotifyParents: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfigModalOpen(false)}
                className="px-5 py-2 rounded-xl dz-btn-gold text-slate-950 font-black text-xs shadow-xs"
              >
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
