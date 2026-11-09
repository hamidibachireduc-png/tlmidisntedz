import React, { useMemo } from 'react';
import { Student, UserRole, HomeworkAssignment, GradeEntry, SchoolSettings, CalendarEvent, AttendanceRecord } from '../types';
import { PerformanceAnalytics } from './PerformanceAnalytics';
import { 
  Users, 
  CalendarCheck2, 
  CalendarDays, 
  BookOpen, 
  Award, 
  MessageSquare, 
  HeartHandshake, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Newspaper, 
  School, 
  GraduationCap, 
  FileSpreadsheet, 
  Flag, 
  HardDriveDownload, 
  Video,
  Zap,
  HelpCircle,
  BrainCircuit,
  Sparkles,
  FileText,
  Type,
  Crown
} from 'lucide-react';

interface DashboardOverviewProps {
  students: Student[];
  assignments: HomeworkAssignment[];
  grades: GradeEntry[];
  userRole: UserRole;
  onNavigateTab: (tab: string) => void;
  schoolSettings: SchoolSettings;
  onOpenSchoolSettings: () => void;
  calendarEvents?: CalendarEvent[];
  attendanceRecords?: AttendanceRecord[];
  onOpenFontCustomizer?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  students,
  assignments,
  grades,
  userRole,
  onNavigateTab,
  schoolSettings,
  onOpenSchoolSettings,
  calendarEvents = [],
  attendanceRecords = [],
  onOpenFontCustomizer,
}) => {
  const totalStudents = students.length;
  const pendingHomework = assignments.filter((a) => a.status === 'pending').length;
  const sampleStudent = students.length > 0 ? students[0] : null;

  // Calculate class average safely with zero division protection
  const classAvg = useMemo(() => {
    if (students.length === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (s.currentAverage || 0), 0);
    return parseFloat((sum / students.length).toFixed(2));
  }, [students]);

  return (
    <div className="space-y-8 relative">
      {/* Institution Customization Bar in Royal Algerian Style */}
      <div className="dz-card-royal p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div 
            onClick={onOpenSchoolSettings}
            className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-amber-400/50 bg-white p-1 shrink-0 shadow-2xs cursor-pointer hover:border-emerald-600 transition-all flex items-center justify-center"
            title="انقر لتغيير لوغو واسم المؤسسة"
          >
            <img
              src={schoolSettings.logoUrl}
              alt={schoolSettings.schoolName}
              className="w-full h-full object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-900 text-sm">
                {schoolSettings.schoolName}
              </h3>
              <span className="text-xs text-amber-500 font-bold">●</span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {schoolSettings.schoolType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {schoolSettings.regionalDirectorate || 'مديرية التربية لولاية الجزائر (وسط)'} · {schoolSettings.ministryHeading || 'وزارة التربية الوطنية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenFontCustomizer && (
            <button
              onClick={onOpenFontCustomizer}
              className="dz-badge-gold px-3.5 py-2 text-xs font-black flex items-center gap-1.5 rounded-xl cursor-pointer hover:brightness-105 transition-all shadow-2xs"
              title="تعديل نموذج الخط الاحترافي المعتمد"
            >
              <Type className="w-3.5 h-3.5 text-amber-900" />
              <span>تعديل نموذج الخط الاحترافي</span>
              <Crown className="w-3.5 h-3.5 text-amber-700" />
            </button>
          )}

          <button
            onClick={onOpenSchoolSettings}
            className="px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
          >
            <School className="w-3.5 h-3.5 text-emerald-700" />
            <span>شعار المؤسسة</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Card in Royal Algerian Aesthetic (أخضر زمردي - ذهبي ملكي - أحمر ياقوتي) */}
      <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-gradient-to-br from-[#043e2e] via-[#008751] to-[#854d0e] text-white shadow-xl min-h-[320px] flex items-center border-2 border-amber-400/50">
        {/* Subtle background abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-amber-200 font-black border border-amber-400/40 backdrop-blur-xs">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              النقابة الوطنية لعمال التربية (SNTE)
            </span>
            <span className="text-white/40">·</span>
            <span className="font-extrabold text-white">
              {schoolSettings.schoolName}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-amber-300 font-bold">دورة 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            مرحباً بك في منصة «تلميذي» للتواصل والتقويم البيداغوجي
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl font-medium">
            نظام تربوي متكامل بنسق ملكي وطني معتمد: رصد فوري للغياب، كويزات تقييمية مستوحاة من بنك امتحانات وفروض onec.edu.dz، ودروس دعم مباشرة عبر Google Meet.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('onec_bank')}
              className="px-5 py-2.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-black text-xs transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-500"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>📚 بنك امتحانات onec.edu.dz (PDF)</span>
            </button>

            <button
              onClick={() => onNavigateTab('quizzes')}
              className="px-5 py-2.5 rounded-full dz-btn-gold text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-amber-950" />
              <span>بنك الكويزات التفاعلية</span>
            </button>

            {onOpenFontCustomizer && (
              <button
                onClick={onOpenFontCustomizer}
                className="px-4 py-2.5 rounded-full dz-badge-gold text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 cursor-pointer"
                title="تعديل نموذج الخط الاحترافي"
              >
                <Type className="w-4 h-4 text-amber-900" />
                <span>نموذج الخط الاحترافي</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('distance_tutoring')}
              className="px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/20 backdrop-blur-xs"
            >
              <Video className="w-4 h-4 text-amber-300" />
              <span>دروس الدعم عن بعد (Meet)</span>
            </button>

            <button
              onClick={() => onNavigateTab('calendar')}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/15 backdrop-blur-xs"
            >
              <CalendarDays className="w-4 h-4 text-emerald-200" />
              <span>الرزنامة المدرسية 2026</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip in Royal Algerian Style (Green, Gold & Red) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="dz-card-royal p-5 cursor-pointer transition-all bg-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">مواظبة الفوج</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono tabular-nums">
            94.5%
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-bold">
            مواظبة ممتازة هذا الأسبوع
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('quizzes')}
          className="dz-card-royal p-5 cursor-pointer transition-all bg-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">كويزات onec</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono tabular-nums">
            100%
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-bold">
            تصحيح آلي فوري وشرح نموذجي
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('grades')}
          className="dz-card-royal p-5 cursor-pointer transition-all bg-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">المعدل العام الفصلي</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            {classAvg > 0 ? classAvg : (sampleStudent?.currentAverage ?? '16.85')}
            <span className="text-xs font-normal text-slate-400">/20</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-bold">
            {classAvg >= 16 ? 'رتبة امتياز في الفوج' : classAvg >= 10 ? 'فوق المعدل البيداغوجي' : 'تحت المتابعة البيداغوجية'}
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('homework')}
          className="dz-card-royal p-5 cursor-pointer transition-all bg-white"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-700">الواجبات المفتوحة</span>
            <BookOpen className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 font-mono tabular-nums">
            {pendingHomework}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            موعد التسليم الأقرب: 10 نوفمبر
          </p>
        </div>
      </div>

      {/* Recharts Performance Analytics Component */}
      <PerformanceAnalytics
        students={students}
        grades={grades}
        attendanceRecords={attendanceRecords}
        userRole={userRole}
        onNavigateTab={onNavigateTab}
      />

      {/* Feature Highlights Bento Grid in Royal Algerian Palette (Red, Green & Gold) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: onec.edu.dz Engine & Quizzes (Red & Gold) */}
        <div 
          onClick={() => onNavigateTab('onec_bank')}
          className="dz-card-royal p-6 cursor-pointer hover:border-red-500/50 transition-all bg-white flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold border border-red-200">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              بنك امتحانات وفروض onec.edu.dz (PDF)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              أكبر مكتبة رقمية لمواضيع وحوليات شهادة التعليم المتوسط (BEM) والبكالوريا (BAC) مع التصحيح الوزاري المعتمد وسلم التنقيط.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
            <span>تصفح بنك الامتحانات والفروض</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Interactive Pedagogical Calendar (Emerald & Gold) */}
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="dz-card-royal p-6 cursor-pointer hover:border-emerald-500/50 transition-all bg-white flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              التقويم البيداغوجي والرزنامة 2026
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              عرض شهري تفاعلي شامل لرزنامة العطل الرسمية المدرسية، مواعيد الفروض المحروسة، اختبارات الفصول، وامتحانات BEM و BAC مع إمكانية إضافة ملاحظات الأستاذ.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <span>فتح التقويم الشهري التفاعلي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Distance Tutoring with Google Meet (Royal Gold & Emerald) */}
        <div 
          onClick={() => onNavigateTab('distance_tutoring')}
          className="dz-card-royal p-6 cursor-pointer hover:border-amber-500/50 transition-all bg-white flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200">
              <Video className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              دروس الدعم عن بعد (Google Meet)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              حصص دعم تفاعلية بالسبورة الرقمية عبر تقنية Google Meet تحت إشراف أساتذة معتمدين من النقابة الوطنية لعمال التربية (SNTE).
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
            <span>الانضمام إلى دروس Google Meet</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Classroom Snapshot and Educational Union Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Classroom Snapshot */}
        <div className="lg:col-span-2 dz-card-royal p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-sm">
                تلاميذ الفوج (السنة الرابعة متوسط 4م2 - تحضير BEM) · {schoolSettings.schoolName}
              </h3>
              <p className="text-xs text-slate-500 font-medium">حالة المتابعة والتقويم البيداغوجي المستمر</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
            >
              عرض الكل
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {students.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                لا توجد بيانات تلاميذ حالياً في الفوج. يمكنك استيراد قائمة التلاميذ أو استعادة البيانات النموذجية من قسم إدارة البيانات.
              </div>
            ) : (
              students.slice(0, 4).map((student) => (
                <div key={student.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 font-bold text-emerald-800 flex items-center justify-center border border-emerald-200">
                      {(student.name || 'ت').slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <span className="text-[11px] text-slate-400">ولي الأمر: {student.guardianName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-amber-700 tabular-nums text-sm">
                      {student.currentAverage ?? 0} / 20
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      مواظب
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Educational Union Solidarity Box */}
        <div 
          className="p-6 rounded-3xl text-white flex flex-col justify-between space-y-4 border-2 border-amber-400/50 shadow-lg relative overflow-hidden"
          style={{
            backgroundColor: '#064e3b',
            backgroundImage: 'linear-gradient(135deg, #033224 0%, #008751 50%, #854d0e 100%)',
          }}
        >
          <div className="space-y-3 relative z-10">
            <span className="text-xs text-amber-300 font-black uppercase tracking-wider block">
              رسالة النقابة الوطنية لعمال التربية (SNTE)
            </span>
            <h4 className="font-black text-base leading-snug">
              المدرسة الجزائرية العمومية وتكافؤ الفرص حق دستوري لكل تلميذ
            </h4>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              تنظم النقابة سلسلة مراجعات الدعم والتقوية المجانية تحضيراً لامتحان شهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC)، لمرافقة أبناء الشعب والتصدي للتسرب المدرسي.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('syndicate')}
              className="w-full py-2.5 rounded-full dz-btn-gold text-slate-950 font-black text-xs transition-all shadow-md"
            >
              استكشاف برامج الدعم المجاني
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
