import React, { useState, useRef, useMemo } from 'react';
import { 
  Student, 
  AttendanceRecord, 
  HomeworkAssignment, 
  GradeEntry, 
  ChatMessage, 
  NewsEventItem, 
  SchoolSettings, 
  CalendarEvent,
  UserRole
} from '../types';
import {
  Download,
  Upload,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Copy,
  Check,
  HardDriveDownload,
  HardDriveUpload,
  Database,
  Users,
  CalendarCheck2,
  Award,
  BookOpen,
  MessageSquare,
  School,
  FileText,
  Info,
  CalendarDays
} from 'lucide-react';

interface DataBackupManagerProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  assignments: HomeworkAssignment[];
  grades: GradeEntry[];
  messages: ChatMessage[];
  newsEvents: NewsEventItem[];
  schoolSettings: SchoolSettings;
  calendarEvents: CalendarEvent[];
  userRole: UserRole;
  // Handlers for state restoration / updates
  onRestoreAllData: (data: {
    students?: Student[];
    attendanceRecords?: AttendanceRecord[];
    assignments?: HomeworkAssignment[];
    grades?: GradeEntry[];
    messages?: ChatMessage[];
    newsEvents?: NewsEventItem[];
    schoolSettings?: SchoolSettings;
    calendarEvents?: CalendarEvent[];
  }) => void;
  onClearAttendance: () => void;
  onClearGrades: () => void;
  onClearAssignments: () => void;
  onClearMessages: () => void;
  onClearCalendarNotes: () => void;
  onResetToDefaults: () => void;
  onFullWipe: () => void;
  onImportStudents: (newStudents: Student[]) => void;
}

export const DataBackupManager: React.FC<DataBackupManagerProps> = ({
  students,
  attendanceRecords,
  assignments,
  grades,
  messages,
  newsEvents,
  schoolSettings,
  calendarEvents,
  userRole,
  onRestoreAllData,
  onClearAttendance,
  onClearGrades,
  onClearAssignments,
  onClearMessages,
  onClearCalendarNotes,
  onResetToDefaults,
  onFullWipe,
  onImportStudents,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'export' | 'import' | 'clear' | 'overview'>('export');
  
  // Feedback states
  const [copiedJSON, setCopiedJSON] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Import preview state
  const [importPreviewData, setImportPreviewData] = useState<any | null>(null);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Clear confirmation modal state
  const [dangerModalConfig, setDangerModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'clear_attendance' | 'clear_grades' | 'clear_assignments' | 'clear_messages' | 'clear_calendar' | 'reset_defaults' | 'full_wipe';
    confirmWord: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'clear_attendance',
    confirmWord: '',
  });

  const [confirmInputText, setConfirmInputText] = useState('');

  // Calculate local storage size estimate
  const storageUsageKB = useMemo(() => {
    try {
      let totalBytes = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('tilmidi_')) {
          totalBytes += (localStorage[key].length + key.length) * 2;
        }
      }
      return (totalBytes / 1024).toFixed(1);
    } catch (e) {
      return '0.0';
    }
  }, [students, attendanceRecords, assignments, grades, messages, newsEvents, schoolSettings, calendarEvents]);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(msg);
      setErrorMessage(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 4500);
  };

  // Helper: Download text as file with UTF-8 BOM
  const triggerDownload = (content: string, filename: string, mimeType: string, withBOM = false) => {
    const payload = withBOM ? '\uFEFF' + content : content;
    const blob = new Blob([payload], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. Export Full JSON Backup
  const handleExportFullJSON = () => {
    const fullBackup = {
      app: 'تطبيق تلميذي - النقابة الوطنية لعمال التربية (SNTE)',
      version: '2026.1',
      system: 'المنظومة التربوية الجزائرية 2026',
      exportedAt: new Date().toISOString(),
      schoolSettings,
      students,
      attendanceRecords,
      assignments,
      grades,
      messages,
      newsEvents,
      calendarEvents,
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `tilmidi_backup_${schoolSettings.schoolName.replace(/\s+/g, '_')}_${dateStr}.json`;
    triggerDownload(JSON.stringify(fullBackup, null, 2), fileName, 'application/json;charset=utf-8;');
    showNotification('تم تصدير النسخة الاحتياطية الكاملة للمنصة بنجاح بصيغة JSON.');
  };

  // Copy JSON backup to clipboard
  const handleCopyJSONToClipboard = () => {
    const fullBackup = {
      app: 'تطبيق تلميذي - النقابة الوطنية لعمال التربية (SNTE)',
      version: '2026.1',
      system: 'المنظومة التربوية الجزائرية 2026',
      exportedAt: new Date().toISOString(),
      schoolSettings,
      students,
      attendanceRecords,
      assignments,
      grades,
      messages,
      newsEvents,
      calendarEvents,
    };

    navigator.clipboard.writeText(JSON.stringify(fullBackup, null, 2)).then(() => {
      setCopiedJSON(true);
      showNotification('تم نسخ بيانات النسخة الاحتياطية إلى الحافظة بنجاح.');
      setTimeout(() => setCopiedJSON(false), 2500);
    });
  };

  // 2. Export Grades to CSV (Ministry / Digital Platform compliant)
  const handleExportGradesCSV = () => {
    const headers = [
      'رقم التعريف المدرسي RNE',
      'اللقب والاسم',
      'الفوج التربوي',
      'المادة',
      'الفصل الدراسي',
      'طبيعة التقييم',
      'التقويم المستمر /20',
      'الفرض المحروس /20',
      'الاختبار الفصلي /20',
      'المعدل الفصلي للمادة /20',
      'المعامل',
      'تاريخ التقييم',
      'ملاحظة الأستاذ'
    ];

    const rows = grades.map((g) => {
      const student = students.find((s) => s.id === g.studentId);
      const rne = student?.registrationNumber || 'غير متوفر';
      const studentName = student?.name || g.studentName;
      const classRoom = student?.classRoom || '4 متوسط - 4م2';

      return [
        `"${rne}"`,
        `"${studentName}"`,
        `"${classRoom}"`,
        `"${g.subject}"`,
        `"${g.term || 'الفصل الأول'}"`,
        `"${g.evaluationName}"`,
        g.assessmentScore !== undefined ? g.assessmentScore : '-',
        g.testScore !== undefined ? g.testScore : '-',
        g.examScore !== undefined ? g.examScore : '-',
        g.score,
        g.coefficient,
        `"${g.date}"`,
        `"${g.teacherComment || ''}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `كشف_النقاط_المدرسي_الجزائري_${dateStr}.csv`;
    triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;', true);
    showNotification('تم تنزيل كشف النقاط بصيغة CSV المتوافقة مع إكسل والأرضية الرقمية.');
  };

  // 3. Export Attendance to CSV
  const handleExportAttendanceCSV = () => {
    const headers = [
      'رقم التعريف المدرسي RNE',
      'اللقب والاسم',
      'التاريخ',
      'الفترة الزمنية',
      'حالة الحضور',
      'المادة',
      'إشعار الولي عبر المنظومة',
      'الملاحظات والتبريرات'
    ];

    const statusTranslations: Record<string, string> = {
      present: 'حاضر',
      absent: 'غائب',
      late: 'متأخر',
      excused: 'غياب مبرر',
    };

    const rows = attendanceRecords.map((r) => {
      const student = students.find((s) => s.id === r.studentId);
      const rne = student?.registrationNumber || 'غير متوفر';

      return [
        `"${rne}"`,
        `"${r.studentName}"`,
        `"${r.date}"`,
        `"${r.timeSlot}"`,
        `"${statusTranslations[r.status] || r.status}"`,
        `"${r.subject}"`,
        r.notifiedParent ? '"نعم"' : '"لا"',
        `"${r.notes || ''}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `سجل_الغيابات_والمواظبة_${dateStr}.csv`;
    triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;', true);
    showNotification('تم تنزيل سجل المواظبة والغيابات بصيغة CSV بنجاح.');
  };

  // 4. Export Students Roster to CSV
  const handleExportStudentsCSV = () => {
    const headers = [
      'رقم التعريف المدرسي RNE',
      'اللقب والاسم',
      'الفوج التربوي',
      'اسم الولي الشرعي',
      'رقم هاتف الولي',
      'عدد الحضور',
      'عدد الغيابات',
      'عدد التأخرات',
      'الغيابات المبررة',
      'المعدل الحالي /20'
    ];

    const rows = students.map((s) => [
      `"${s.registrationNumber}"`,
      `"${s.name}"`,
      `"${s.classRoom}"`,
      `"${s.guardianName}"`,
      `"${s.guardianPhone}"`,
      s.attendanceStats.present,
      s.attendanceStats.absent,
      s.attendanceStats.late,
      s.attendanceStats.excused,
      s.currentAverage
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `قائمة_التلاميذ_الفوج_التربوي_${dateStr}.csv`;
    triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;', true);
    showNotification('تم تصدير قائمة التلاميذ وبيانات الأولياء بصيغة CSV بنجاح.');
  };

  // 5. Export Calendar & Official Dates
  const handleExportCalendarCSV = () => {
    const headers = [
      'التاريخ',
      'تاريخ النهاية',
      'العنوان والمناسبة',
      'طبيعة الحدث',
      'الفوج المعني',
      'ملاحظات وتفاصيل',
      'رسمي من الوزارة'
    ];

    const typeTranslations: Record<string, string> = {
      exam: 'امتحان رسمي / فصلي',
      holiday: 'عطلة مدرسية / عيد وطني',
      test: 'فرض محروس',
      meeting: 'مجلس أقسام / تنسيق تربوي',
      note: 'ملاحظة خاصة بالأستاذ',
    };

    const rows = calendarEvents.map((c) => [
      `"${c.date}"`,
      `"${c.endDate || ''}"`,
      `"${c.title}"`,
      `"${typeTranslations[c.type] || c.type}"`,
      `"${c.classRoom || 'جميع الأطوار'}"`,
      `"${c.description || ''}"`,
      c.isOfficial ? '"نعم"' : '"لا"'
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `التقويم_البيداغوجي_والرزنامة_الرسمية_${dateStr}.csv`;
    triggerDownload(csvContent, fileName, 'text/csv;charset=utf-8;', true);
    showNotification('تم تصدير الرزنامة البيداغوجية بصيغة CSV بنجاح.');
  };

  // Handle JSON File Selection for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation check
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('الملف لا يحتوي على كائن بيانات JSON صالح.');
        }

        setImportPreviewData(parsed);
        showNotification('تم تحليل الملف بنجاح. يرجى مراجعة محتوياته وتأكيد الاستيراد أدناه.');
      } catch (err: any) {
        setImportPreviewData(null);
        showNotification('خطأ في قراءة ملف JSON: تأكد من سلامة صيغة الملف.', true);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  // Apply JSON Import
  const handleConfirmImport = () => {
    if (!importPreviewData) return;

    try {
      if (importMode === 'replace') {
        onRestoreAllData({
          students: importPreviewData.students,
          attendanceRecords: importPreviewData.attendanceRecords,
          assignments: importPreviewData.assignments,
          grades: importPreviewData.grades,
          messages: importPreviewData.messages,
          newsEvents: importPreviewData.newsEvents,
          schoolSettings: importPreviewData.schoolSettings,
          calendarEvents: importPreviewData.calendarEvents,
        });
        showNotification('تم استبدال واسترجاع كافة بيانات المنصة بنجاح من النسخة الاحتياطية.');
      } else {
        // Merge mode
        const mergedStudents = importPreviewData.students ? [...students] : students;
        if (importPreviewData.students && Array.isArray(importPreviewData.students)) {
          importPreviewData.students.forEach((importedStd: Student) => {
            if (!mergedStudents.some((s) => s.id === importedStd.id || s.registrationNumber === importedStd.registrationNumber)) {
              mergedStudents.push(importedStd);
            }
          });
        }

        const mergedGrades = importPreviewData.grades ? [...grades] : grades;
        if (importPreviewData.grades && Array.isArray(importPreviewData.grades)) {
          importPreviewData.grades.forEach((g: GradeEntry) => {
            if (!mergedGrades.some((existing) => existing.id === g.id)) {
              mergedGrades.push(g);
            }
          });
        }

        const mergedAttendance = importPreviewData.attendanceRecords ? [...attendanceRecords] : attendanceRecords;
        if (importPreviewData.attendanceRecords && Array.isArray(importPreviewData.attendanceRecords)) {
          importPreviewData.attendanceRecords.forEach((att: AttendanceRecord) => {
            if (!mergedAttendance.some((existing) => existing.id === att.id)) {
              mergedAttendance.push(att);
            }
          });
        }

        const mergedCalendar = importPreviewData.calendarEvents ? [...calendarEvents] : calendarEvents;
        if (importPreviewData.calendarEvents && Array.isArray(importPreviewData.calendarEvents)) {
          importPreviewData.calendarEvents.forEach((ev: CalendarEvent) => {
            if (!mergedCalendar.some((existing) => existing.id === ev.id)) {
              mergedCalendar.push(ev);
            }
          });
        }

        onRestoreAllData({
          students: mergedStudents,
          grades: mergedGrades,
          attendanceRecords: mergedAttendance,
          calendarEvents: mergedCalendar,
          schoolSettings: importPreviewData.schoolSettings || schoolSettings,
        });

        showNotification('تم دمج السجلات الجديدة مع البيانات الحالية بنجاح دون حذف السجلات السابقة.');
      }

      setImportPreviewData(null);
      setImportFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      showNotification('حدث خطأ أثناء معالجة البيانات: ' + (err.message || 'بيانات غير متطابقة'), true);
    }
  };

  // CSV Students Import Handler
  const handleCSVStudentsImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          throw new Error('الملف فارغ أو لا يحتوي على صفوف بيانات كافية.');
        }

        const newStudents: Student[] = [];
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
          if (parts.length >= 2 && parts[1]) {
            const rne = parts[0] || `2026160100${Date.now().toString().slice(-4)}${i}`;
            const name = parts[1];
            const classRoom = parts[2] || 'السنة الرابعة متوسط - 4م2';
            const guardianName = parts[3] || 'ولي التلميذ';
            const guardianPhone = parts[4] || '0550-000000';
            const avg = parts[5] ? parseFloat(parts[5]) : 14.5;

            newStudents.push({
              id: `std-import-${Date.now()}-${i}`,
              name,
              registrationNumber: rne,
              classRoom,
              guardianName,
              guardianPhone,
              attendanceStats: { present: 40, absent: 0, late: 0, excused: 0 },
              currentAverage: isNaN(avg) ? 14.0 : avg,
            });
          }
        }

        if (newStudents.length === 0) {
          throw new Error('لم يتم العثور على سجلات تلاميذ صالحة في الملف.');
        }

        onImportStudents(newStudents);
        showNotification(`تم استيراد ${newStudents.length} تلميذ بنجاح وإضافتهم إلى الفوج التربوي.`);
        if (csvFileInputRef.current) csvFileInputRef.current.value = '';
      } catch (err: any) {
        showNotification('خطأ في استيراد ملف CSV: ' + err.message, true);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  // Download Sample CSV Template
  const handleDownloadSampleCSV = () => {
    const headers = ['رقم التعريف RNE', 'الاسم واللقب', 'الفوج التربوي', 'اسم الولي الشرعي', 'هاتف الولي', 'المعدل الأولي'];
    const sampleRows = [
      ['"20261601004523"', '"محمد لمين بلقاسم"', '"السنة الرابعة متوسط - 4م2"', '"السيد كمال بلقاسم"', '"0550-123456"', '16.85'],
      ['"20261601008912"', '"شيماء بوعمامة"', '"السنة الرابعة متوسط - 4م2"', '"السيدة حورية منصوري"', '"0661-987654"', '18.40'],
      ['"20261601003421"', '"عبد الرؤوف بن ناصر"', '"السنة الرابعة متوسط - 4م2"', '"السيد رشيد بن ناصر"', '"0770-445566"', '13.75']
    ];
    const content = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\r\n');
    triggerDownload(content, 'قالب_استيراد_التلاميذ_تلميذي_2026.csv', 'text/csv;charset=utf-8;', true);
    showNotification('تم تنزيل النموذج المرجعي لقائمة التلاميذ بصيغة CSV.');
  };

  // Trigger Danger Action Modal
  const openDangerModal = (
    actionType: 'clear_attendance' | 'clear_grades' | 'clear_assignments' | 'clear_messages' | 'clear_calendar' | 'reset_defaults' | 'full_wipe',
    title: string,
    description: string,
    confirmWord: string
  ) => {
    setDangerModalConfig({
      isOpen: true,
      title,
      description,
      actionType,
      confirmWord,
    });
    setConfirmInputText('');
  };

  // Execute Confirmed Danger Action
  const handleExecuteDangerAction = () => {
    const { actionType, confirmWord } = dangerModalConfig;

    if (confirmInputText.trim() !== confirmWord) {
      showNotification(`كلمة التأكيد غير مطابقة! يجب كتابة كلمة: "${confirmWord}" للمتابعة.`, true);
      return;
    }

    switch (actionType) {
      case 'clear_attendance':
        onClearAttendance();
        showNotification('تم تفريغ كافة سجلات الحضور والغيابات بنجاح.');
        break;
      case 'clear_grades':
        onClearGrades();
        showNotification('تم تفريغ دفتر النقاط والتقييمات الفصلي بنجاح.');
        break;
      case 'clear_assignments':
        onClearAssignments();
        showNotification('تم مسح جميع الواجبات والفروض المدرسية بنجاح.');
        break;
      case 'clear_messages':
        onClearMessages();
        showNotification('تم تفريغ سجل المحادثات والمراسلات الصوتية بنجاح.');
        break;
      case 'clear_calendar':
        onClearCalendarNotes();
        showNotification('تم مسح الملاحظات الشخصية من الرزنامة والاحتفاظ بالعطل الرسمية.');
        break;
      case 'reset_defaults':
        onResetToDefaults();
        showNotification('تمت استعادة البيانات النموذجية الأولية لوزارة التربية والنقابة بنجاح.');
        break;
      case 'full_wipe':
        onFullWipe();
        showNotification('تم تفريغ وتصفير كافة بيانات التطبيق بالكامل لبدء موسم دراسي جديد.');
        break;
    }

    setDangerModalConfig((prev) => ({ ...prev, isOpen: false }));
    setConfirmInputText('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header Banner: Royal Palette & Educational Hierarchy */}
      <div className="bg-gradient-to-r from-red-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Database className="w-4 h-4 text-amber-400" />
              <span>إدارة الأرشيف وقواعد البيانات المدرسية 2026</span>
              <span>·</span>
              <span className="text-emerald-300">متوافق مع الأرضية الرقمية للوزارة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              تصدير، استيراد، وتفريغ البيانات المدرسية
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              فضاء مركزي مؤمن يتيح للأستاذ والإدارة التعليمية أخذ نسخ احتياطية كاملة، تصدير كشوف النقاط والحضور بصيغ متوافقة مع برمجيات الإكسل والأرضية الرقمية، مع توفير خيارات دقيقة لتفريغ السجلات عند الانتقال بين الفصول أو بدء سنة دراسية جديدة.
            </p>
          </div>

          {/* Quick Storage Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
            <div className="text-[11px] text-amber-200 font-bold mb-1">حجم البيانات بالذاكرة المحلية</div>
            <div className="text-2xl font-black text-white font-mono">{storageUsageKB} KB</div>
            <div className="text-[10px] text-slate-300 mt-1 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>حفظ محلي فوري ومستمر</span>
            </div>
          </div>
        </div>

        {/* Global Notifications inside component */}
        {successMessage && (
          <div className="mt-4 bg-emerald-600/90 border border-emerald-400 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-bounce-short">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-300" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 bg-red-600/90 border border-red-400 text-white px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveSubTab('export')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'export'
              ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HardDriveDownload className="w-4 h-4" />
          <span>تصدير البيانات وحفظ النسخ الاحتياطية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('import')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'import'
              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-800/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HardDriveUpload className="w-4 h-4" />
          <span>استيراد واسترجاع البيانات (JSON / CSV)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('clear')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'clear'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>تفريغ السجلات وإعادة ضبط المصنع</span>
        </button>

        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'bg-slate-800 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>إحصائيات الجداول والسجلات</span>
        </button>
      </div>

      {/* TAB 1: EXPORT DATA */}
      {activeSubTab === 'export' && (
        <div className="space-y-6">
          {/* Master Full Backup Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-700/30 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-800 border border-red-200 rounded-full text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>النسخة الاحتياطية الرسمية الشاملة (JSON Master Backup)</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  تصدير قاعدة البيانات المدرسية بالكامل
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  يحتوي هذا الملف على جميع سجلات المؤسسة التعليمية: قوائم التلاميذ، كشوف النقاط والمعاملات، سجلات الحضور والغياب، دفتر الواجبات، المراسلات، والتقويم البيداغوجي. يمكنك حفظه على حاسوبك الشخصي أو قرص خارجي واستعادته في أي وقت بنقرة واحدة.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                  <span>● عدد التلاميذ: <strong className="text-slate-800 font-bold">{students.length}</strong></span>
                  <span>● التقييمات والنقاط: <strong className="text-slate-800 font-bold">{grades.length}</strong></span>
                  <span>● سجلات الغياب: <strong className="text-slate-800 font-bold">{attendanceRecords.length}</strong></span>
                  <span>● الواجبات: <strong className="text-slate-800 font-bold">{assignments.length}</strong></span>
                  <span>● أحداث الرزنامة: <strong className="text-slate-800 font-bold">{calendarEvents.length}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={handleExportFullJSON}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 border border-amber-400 transition-all hover:scale-102"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>تنزيل ملف النسخة الاحتياطية (JSON)</span>
                </button>

                <button
                  onClick={handleCopyJSONToClipboard}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
                >
                  {copiedJSON ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  <span>{copiedJSON ? 'تم النسخ للحافظة!' : 'نسخ كود JSON'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Granular CSV Exports Grid (Digital Platform & Excel Compliant) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Grades CSV */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">كشف النقاط والمعدلات (CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    متوافق مع الأرضية الرقمية لوزارة التربية الوطنية، يتضمن أرقام التعريف R.N.E ونقاط الفروض والاختبارات والمعاملات.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={handleExportGradesCSV}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>تنزيل كشف النقط (CSV)</span>
                </button>
              </div>
            </div>

            {/* Attendance CSV */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">سجل الغيابات والمواظبة (CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    جدول تفصيلي لحالات الغياب، التأخر، التبريرات، وإشعارات الأولياء جاهز للتسليم للإدارة التربوية.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={handleExportAttendanceCSV}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>تنزيل سجل الغياب (CSV)</span>
                </button>
              </div>
            </div>

            {/* Students Roster CSV */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">قائمة الفوج التربوي والأولياء (CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    قائمة كاملة بأسماء التلاميذ، أرقام تسجيلهم الوطنية، أرقام هواتف الأولياء، والمعدل العام.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={handleExportStudentsCSV}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>تصدير قائمة التلاميذ (CSV)</span>
                </button>
              </div>
            </div>

            {/* Pedagogical Calendar CSV */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-bold">
                  <CalendarDays className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">الرزنامة والتقويم البيداغوجي (CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    مواعيد العطل المدرسية الجزائرية، امتحانات BEM و BAC الرسمية، مجالس الأقسام وملاحظات الأستاذ.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={handleExportCalendarCSV}
                  className="w-full py-2.5 px-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>تنزيل الرزنامة (CSV)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMPORT DATA */}
      {activeSubTab === 'import' && (
        <div className="space-y-8">
          {/* Main JSON Backup Importer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold">
                <HardDriveUpload className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  استيراد واسترجاع نسخة احتياطية (ملف JSON)
                </h3>
                <p className="text-xs text-slate-500">
                  قم برفع ملف النسخة الاحتياطية السابقة لاسترجاع كافة معطيات الفوج والتقييمات
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-500/50 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-3xl p-8 text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-sm border border-emerald-200 flex items-center justify-center text-emerald-700">
                <FileJson className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-800 block">
                  {importFileName ? `الملف المحدد: ${importFileName}` : 'انقر هنا لاختيار ملف النسخة الاحتياطية (.json)'}
                </span>
                <span className="text-xs text-slate-500">
                  يقبل ملفات JSON الناتجة عن ميزة التصدير الرسمية في تطبيق تلميذي
                </span>
              </div>
            </div>

            {/* Preview & Action Options if file is loaded */}
            {importPreviewData && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-emerald-300 space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم التحقق من بنية الملف بنجاح</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    تاريخ النسخة: {importPreviewData.exportedAt ? new Date(importPreviewData.exportedAt).toLocaleDateString('ar-DZ') : 'غير محدد'}
                  </span>
                </div>

                {/* Counts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.students?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">التلاميذ</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.grades?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">النقاط والتقييمات</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.attendanceRecords?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">سجلات الغياب</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.assignments?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">الواجبات</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.calendarEvents?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">مواعيد الرزنامة</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-lg font-bold text-slate-800">{importPreviewData.messages?.length || 0}</div>
                    <div className="text-[10px] text-slate-500 font-bold">المراسلات</div>
                  </div>
                </div>

                {/* Import Mode Selector */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 shrink-0">طريقة الاستيراد:</div>
                  <div className="flex items-center gap-3 w-full">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-red-700 focus:ring-red-500"
                      />
                      <span>استبدال شامل (استرجاع النسخة بالكامل)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                        className="text-emerald-700 focus:ring-emerald-500"
                      />
                      <span>دمج ذكي (إضافة السجلات غير المكررة فقط)</span>
                    </label>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => {
                      setImportPreviewData(null);
                      setImportFileName('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>تأكيد استيراد البيانات وتطبيقها</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick CSV Students Importer */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    استيراد قائمة تلاميذ جدد من ملف CSV
                  </h3>
                  <p className="text-xs text-slate-500">
                    أضف فوجاً كاملاً من التلاميذ دفعة واحدة عبر ملف Excel / CSV
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadSampleCSV}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>تحميل النموذج المرجعي (Template)</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 block">
                  رفع ملف قائمة التلاميذ بصيغة CSV:
                </span>
                <span className="text-[11px] text-slate-500 block">
                  يتضمن الأعمدة: رقم التعريف، الاسم واللقب، الفوج، اسم الولي، رقم الهاتف، والمعدل الأولي.
                </span>
              </div>

              <div className="shrink-0">
                <input
                  ref={csvFileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCSVStudentsImport}
                  className="hidden"
                />
                <button
                  onClick={() => csvFileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>اختيار ملف CSV للتلاميذ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA CLEARING & RESET */}
      {activeSubTab === 'clear' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="block font-bold">منطقة العمليات الحساسة وتفريغ السجلات:</strong>
              <p className="leading-relaxed">
                تتيح لك هذه الأدوات تنظيف قاعدة البيانات أو إعادة ضبطها عند بداية كل فصل دراسي أو موسم جديد. جميع عمليات التفريغ محمية بنافذة تأكيد لمنع الحذف العرضي، ونوصي دائماً بأخذ نسخة احتياطية (JSON) قبل تنفيذ أي تفريغ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Clear Attendance */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <CalendarCheck2 className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">تفريغ سجل الغيابات والمواظبة</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مسح كافة سجلات الحضور والغيابات والتأخرات المسجلة للبدء برصد جديد للفصل القادم.
                </p>
                <div className="text-[11px] text-slate-600 font-bold pt-1">
                  السجلات الحالية: <span className="text-amber-700">{attendanceRecords.length} سجل</span>
                </div>
              </div>
              <button
                onClick={() => openDangerModal('clear_attendance', 'تفريغ سجل الغيابات والمواظبة', 'هل أنت متأكد من رغبتك في مسح كافة سجلات الحضور والغيابات؟ لا يمكن التراجع عن هذه العملية إلا إذا كنت تملك نسخة احتياطية.', 'تفريغ')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-amber-600 group-hover:text-white" />
                <span>تفريغ سجل الغيابات فقط</span>
              </button>
            </div>

            {/* Clear Grades */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">تفريغ كشف النقاط والتقييمات</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مسح نقاط الفروض المحروسة والتقويمات والاختبارات لإعداد كشوف فصل دراسي جديد.
                </p>
                <div className="text-[11px] text-slate-600 font-bold pt-1">
                  النقاط الحالية: <span className="text-red-700">{grades.length} تقييم</span>
                </div>
              </div>
              <button
                onClick={() => openDangerModal('clear_grades', 'تفريغ كشف النقاط والتقييمات', 'سيتم مسح جميع نقاط الفروض والاختبارات الفاصلة المسجلة لجميع التلاميذ.', 'تفريغ')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-red-700 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>تفريغ دفتر النقاط فقط</span>
              </button>
            </div>

            {/* Clear Homework */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">تفريغ دفتر الواجبات المنزلية</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مسح قائمة الواجبات والتطبيقات المنزلية السابقة مع الإبقاء على حسابات التلاميذ.
                </p>
                <div className="text-[11px] text-slate-600 font-bold pt-1">
                  المهام الحالية: <span className="text-emerald-700">{assignments.length} واجب</span>
                </div>
              </div>
              <button
                onClick={() => openDangerModal('clear_assignments', 'تفريغ دفتر الواجبات', 'سيتم مسح جميع الواجبات المنزلية المسندة سابقاً.', 'تفريغ')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-emerald-600" />
                <span>تفريغ الواجبات فقط</span>
              </button>
            </div>

            {/* Clear Messages */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">تفريغ المراسلات والتسجيلات الصوتية</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  تنظيف سجل الرسائل الآمنة والتسجيلات الصوتية المتبادلة بين الأساتذة والأولياء.
                </p>
                <div className="text-[11px] text-slate-600 font-bold pt-1">
                  الرسائل الحالية: <span className="text-blue-700">{messages.length} رسالة</span>
                </div>
              </div>
              <button
                onClick={() => openDangerModal('clear_messages', 'تفريغ المراسلات', 'سيتم مسح جميع الرسائل النصية والصوتية بين الأستاذ والأولياء.', 'تفريغ')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-blue-600" />
                <span>تفريغ المراسلات فقط</span>
              </button>
            </div>

            {/* Clear Custom Calendar Notes */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">تفريغ ملاحظات الرزنامة الخاصة</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  مسح الملاحظات الشخصية ومواعيد الفروض المضافة من الأستاذ، مع الإبقاء التلقائي على العطل والامتحانات الرسمية لوزارة التربية.
                </p>
                <div className="text-[11px] text-slate-600 font-bold pt-1">
                  أحداث الرزنامة: <span className="text-purple-700">{calendarEvents.length} حدث</span>
                </div>
              </div>
              <button
                onClick={() => openDangerModal('clear_calendar', 'تفريغ ملاحظات الرزنامة الشخصية', 'سيتم حذف الملاحظات الخاصة ومواعيد الفروض المضافة، مع الاحتفاظ بالعطل المدرسية والامتحانات الرسمية.', 'تفريغ')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-purple-700 hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span>تفريغ الملاحظات الخاصة</span>
              </button>
            </div>

            {/* Reset to Initial Algerian Demo Data */}
            <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-300 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <RefreshCw className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-extrabold text-emerald-950 text-sm">استعادة البيانات النموذجية الأولية</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  استعادة بيانات الفوج النموذجي (السنة الرابعة متوسط 4م2 - BEM 2026) مع الرزنامة الرسمية لوزارة التربية والنقابة.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold pt-1">
                  ● مثالي للتجربة والاستعراض التدريبي
                </div>
              </div>
              <button
                onClick={() => openDangerModal('reset_defaults', 'استعادة البيانات النموذجية الأولية', 'سيتم استبدال البيانات الحالية بالبيانات النموذجية الافتراضية لمنظومة التربية 2026.', 'استعادة')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>استعادة البيانات النموذجية</span>
              </button>
            </div>
          </div>

          {/* Full Wipe Section */}
          <div className="bg-red-50/70 border-2 border-red-300 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>تفريغ شامل لكافة البيانات (بداية سنة دراسية جديدة)</span>
              </div>
              <h3 className="text-lg font-black text-red-950">
                تصفير كامل لقاعدة البيانات المدرسية
              </h3>
              <p className="text-xs text-red-900/80 max-w-2xl leading-relaxed">
                يؤدي هذا الإجراء إلى مسح كافة سجلات التلاميذ، النقاط، الغيابات، والواجبات تماماً، لتهيئة التطبيق لبدء موسم دراسي جديد مع فوج وإدارة جديدة. تأكد من تحميل نسخة احتياطية أولاً.
              </p>
            </div>

            <button
              onClick={() => openDangerModal('full_wipe', 'التفريغ الشامل لقاعدة البيانات', 'تحذير شديد: سيتم مسح كافة البيانات والتلاميذ والنقاط والغيابات وتصفير التطبيق بالكامل!', 'تصفير')}
              className="px-6 py-3 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shrink-0 transition-transform hover:scale-102 border border-red-900"
            >
              <Trash2 className="w-4 h-4 text-amber-300" />
              <span>تفريغ شامل وتصفير التطبيق</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: OVERVIEW & STORAGE STATS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>إجمالي التلاميذ المسجلين</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">{students.length}</div>
              <div className="text-[11px] text-slate-500">فوج: {students[0]?.classRoom || 'غير محدد'}</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>سجلات النقاط والتقييمات</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">{grades.length}</div>
              <div className="text-[11px] text-emerald-600 font-bold">وفق معاملات وزارة التربية 2026</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>سجلات الحضور والغياب</span>
                <CalendarCheck2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">{attendanceRecords.length}</div>
              <div className="text-[11px] text-slate-500">حفظ فوري ومطابقة للأرضية الرقمية</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>مواعيد الرزنامة والعطل</span>
                <CalendarDays className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 font-mono">{calendarEvents.length}</div>
              <div className="text-[11px] text-red-700 font-bold">رزنامة وزارة التربية الرسمية 2026</div>
            </div>
          </div>

          {/* School Identity Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-700" />
              <span>هوية المؤسسة والترويسة المحفوظة بالملف</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">المؤسسة التعليمية:</span>
                <span className="font-bold text-slate-800 text-sm">{schoolSettings.schoolName} ({schoolSettings.schoolType})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">مديرية التربية الولائية:</span>
                <span className="font-bold text-slate-800 text-sm">{schoolSettings.regionalDirectorate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">الترويسة الرسمية للجمهورية:</span>
                <span className="font-bold text-slate-800">{schoolSettings.republicHeading}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">شعار المؤسسة:</span>
                <span className="font-bold text-amber-800">{schoolSettings.motto}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Destructive / Danger Actions */}
      {dangerModalConfig.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-red-600 animate-scale-in space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{dangerModalConfig.title}</h3>
                <span className="text-xs text-red-600 font-bold">إجراء حساس لا يمكن التراجع عنه</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {dangerModalConfig.description}
            </p>

            <div className="bg-red-50 p-3.5 rounded-xl border border-red-200 space-y-2">
              <label className="text-xs font-bold text-red-900 block">
                لتأكيد العملية، يرجى كتابة كلمة <span className="underline font-black text-red-700">"{dangerModalConfig.confirmWord}"</span> في الحقل أدناه:
              </label>
              <input
                type="text"
                value={confirmInputText}
                onChange={(e) => setConfirmInputText(e.target.value)}
                placeholder={`اكتب ${dangerModalConfig.confirmWord}`}
                className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-600 text-center"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDangerModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                إلغاء العملية
              </button>

              <button
                type="button"
                onClick={handleExecuteDangerAction}
                disabled={confirmInputText.trim() !== dangerModalConfig.confirmWord}
                className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Trash2 className="w-4 h-4 text-amber-300" />
                <span>تأكيد وتنفيذ التفريغ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
