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
  Video
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

  // Upcoming major calendar events
  const upcomingEvents = calendarEvents.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Institution Customization Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div 
            onClick={onOpenSchoolSettings}
            className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-300 bg-white p-1 shrink-0 shadow-2xs cursor-pointer hover:border-emerald-600 transition-all flex items-center justify-center"
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
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                {schoolSettings.schoolName}
              </h3>
              <span className="text-xs text-slate-400 font-semibold">·</span>
              <span className="text-xs font-bold text-emerald-800">
                {schoolSettings.schoolType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {schoolSettings.regionalDirectorate || 'مديرية التربية لولاية الجزائر (وسط)'} · {schoolSettings.ministryHeading || 'وزارة التربية الوطنية'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSchoolSettings}
            className="px-3.5 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <School className="w-3.5 h-3.5 text-red-700" />
            <span>تخصيص لوغو وهوية المدرسة</span>
          </button>
        </div>
      </div>

      {/* Hero Welcome Card - Algerian National & Royal Gold Palette */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-slate-950 min-h-[340px] flex items-center border border-amber-500/30">
        <img
          src="/src/assets/images/syndicate_hero_banner_1794131595580.jpg"
          alt="التعليم والتضامن النقابي"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/90 via-slate-950/80 to-emerald-950/60"></div>

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4 text-white">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              النقابة الوطنية لعمال التربية (SNTE)
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-bold text-emerald-200">
              {schoolSettings.schoolName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-heading">
            مرحباً بك في منصة «تلميذي» للتواصل المدرسي والتأطير التربوي (إصلاحات 2026)
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            المنصة الذكية لرصد الغياب الفوري، متابعة الرزنامة المدرسية ومواعيد الامتحانات (BEM / BAC)، وحساب معدلات الفصول وفق مناشير وزارة التربية الوطنية مع حفظ خصوصية الأستاذ.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('calendar')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <CalendarDays className="w-4 h-4 text-amber-300" />
              <span>التقويم البيداغوجي والرزنامة</span>
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/20 backdrop-blur-xs"
            >
              <CalendarCheck2 className="w-4 h-4 text-emerald-300" />
              <span>رصد الحضور الفوري</span>
            </button>
            <button
              onClick={() => onNavigateTab('grades')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>كشف النقط والرسم البياني</span>
            </button>
            <button
              onClick={() => onNavigateTab('distance_tutoring')}
              className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-all flex items-center gap-2 border border-red-500 shadow-xs"
            >
              <Video className="w-4 h-4 text-amber-300" />
              <span>دروس الدعم عن بعد (Google Meet)</span>
            </button>
            <button
              onClick={() => onNavigateTab('data_backup')}
              className="px-4 py-2.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center gap-2 border border-amber-400/50 backdrop-blur-xs"
            >
              <HardDriveDownload className="w-4 h-4 text-amber-200" />
              <span>تصدير واستيراد وتفريغ البيانات</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-emerald-100 hover:border-emerald-500 shadow-xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">مواظبة الفوج</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            94.5%
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-bold">
            مواظبة ممتازة هذا الأسبوع
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('calendar')}
          className="bg-white p-5 rounded-2xl border border-amber-100 hover:border-amber-500 shadow-xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الرزنامة المدرسية</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            15 نوفمبر
          </div>
          <p className="text-[11px] text-amber-800 mt-1 font-bold">
            انطلاق الفروض المحروسة
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('grades')}
          className="bg-white p-5 rounded-2xl border border-red-100 hover:border-red-500 shadow-xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">المعدل العام الفصلي</span>
            <Award className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {classAvg > 0 ? classAvg : (sampleStudent?.currentAverage ?? '16.85')}
            <span className="text-xs font-normal text-slate-400">/20</span>
          </div>
          <p className="text-[11px] text-red-700 mt-1 font-bold">
            {classAvg >= 16 ? 'رتبة امتياز في الفوج' : classAvg >= 10 ? 'فوق المعدل البيداغوجي' : 'تحت المتابعة البيداغوجية'}
          </p>
        </div>

        <div 
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الواجبات المفتوحة</span>
            <BookOpen className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {pendingHomework}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
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

      {/* Feature Highlights Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Interactive Pedagogical Calendar */}
        <div 
          onClick={() => onNavigateTab('calendar')}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              التقويم البيداغوجي والرزنامة المدرسية
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              عرض شهري تفاعلي شامل لرزنامة العطل الرسمية المدرسية، مواعيد الفروض المحروسة، اختبارات الفصول، وامتحانات BEM و BAC مع إمكانية إضافة ملاحظات الأستاذ وتصدير الرزنامة للطباعة.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <span>فتح التقويم الشهري التفاعلي</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Attendance & Safe Messaging */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
              <CalendarCheck2 className="w-5 h-5 text-red-700" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              رصد الحضور والمراسلات الآمنة
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تسجيل الحضور الفوري وإشعار أولياء التلاميذ تلقائياً عبر فضاء الأولياء دون إظهار رقم الهاتف الشخصي للأستاذ، مع رسائل صوتية مشفرة.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
            <span>فتح سجل الغياب والحضور</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Syndicate Solidarity & Exam Bank */}
        <div 
          onClick={() => onNavigateTab('syndicate')}
          className="bg-gradient-to-br from-amber-50/60 to-orange-50/60 rounded-3xl border border-amber-300/80 p-6 shadow-xs hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-slate-950" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base font-heading">
              فضاء النقابة والدعم التضامني
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              دروس تقوية ودعم مدرسي مجانية بإشراف أساتذة النقابة المتطوعين، وبنك حوليات شهادتي التعليم المتوسط (BEM) والبكالوريا (BAC) المفتوحة لجميع التلاميذ.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
            <span>استكشاف برامج الدعم والامتحانات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Classroom Quick Preview & Educational Union Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Classroom Snapshot */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm font-heading">
                تلاميذ الفوج (السنة الرابعة متوسط 4م2 - تحضير BEM) · {schoolSettings.schoolName}
              </h3>
              <p className="text-xs text-slate-500">حالة المتابعة والتقويم البيداغوجي المستمر</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
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
                    <div className="w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center">
                      {(student.name || 'ت').slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{student.name}</span>
                      <span className="text-[11px] text-slate-400">ولي الأمر: {student.guardianName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-800 tabular-nums text-sm">
                      {student.currentAverage ?? 0} / 20
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      مواظب
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Educational Union Solidarity Box */}
        <div className="bg-gradient-to-br from-red-900 via-red-950 to-slate-950 text-white rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 border border-amber-500/30">
          <div className="space-y-3">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
              رسالة النقابة الوطنية لعمال التربية (SNTE)
            </span>
            <h4 className="font-black text-base leading-snug font-heading">
              المدرسة الجزائرية العمومية وتكافؤ الفرص حق دستوري لكل تلميذ
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              تنظم النقابة سلسلة مراجعات الدعم والتقوية المجانية تحضيراً لامتحان شهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC)، لمرافقة أبناء الشعب والتصدي للتسرب المدرسي.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('syndicate')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:from-amber-600 hover:to-amber-700 transition-all shadow-xs"
            >
              استكشاف برامج الدعم المجاني
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
