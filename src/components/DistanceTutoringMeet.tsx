import React, { useState, useMemo } from 'react';
import { 
  Subject, 
  UserRole, 
  SchoolSettings, 
  TeacherProfile, 
  GoogleMeetTutoringSession 
} from '../types';
import {
  Video,
  VideoOff,
  Users,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Radio,
  FileText,
  Download,
  Award,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Share2,
  BookOpen,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Laptop
} from 'lucide-react';

interface DistanceTutoringMeetProps {
  sessions: GoogleMeetTutoringSession[];
  teacherProfiles: TeacherProfile[];
  activeTeacherId: string;
  onSelectTeacher: (teacherId: string) => void;
  onAddSession: (newSession: GoogleMeetTutoringSession) => void;
  onToggleEnrollment: (sessionId: string) => void;
  userRole: UserRole;
  schoolSettings: SchoolSettings;
}

export const DistanceTutoringMeet: React.FC<DistanceTutoringMeetProps> = ({
  sessions,
  teacherProfiles,
  activeTeacherId,
  onSelectTeacher,
  onAddSession,
  onToggleEnrollment,
  userRole,
  schoolSettings,
}) => {
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'live' | 'upcoming' | 'recorded'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [copiedLinkSessionId, setCopiedLinkSessionId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // New Session Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('الرياضيات');
  const [newLevel, setNewLevel] = useState('السنة الرابعة متوسط (شهادة التعليم المتوسط BEM 2026)');
  const [newDate, setNewDate] = useState('2026-11-09');
  const [newStartTime, setNewStartTime] = useState('18:30');
  const [newDuration, setNewDuration] = useState('60');
  const [newMeetCode, setNewMeetCode] = useState(`snte-bem-${Math.random().toString(36).substring(2, 6)}`);
  const [newDescription, setNewDescription] = useState('');
  const [newTopics, setNewTopics] = useState('حل مسائل نموذجية لشهادة BEM\nمراجعة القوانين الأساسية وتطبيقاتها\nإجابة مباشرة على أسئلة واستفسارات التلاميذ');
  const [newAttachmentName, setNewAttachmentName] = useState('ملخص_الدرس_وتمارين_الدعم.pdf');
  const [notifyParentsImmediately, setNotifyParentsImmediately] = useState(true);

  // Get active teacher profile
  const activeTeacher = useMemo(() => {
    return teacherProfiles.find((t) => t.id === activeTeacherId) || teacherProfiles[0];
  }, [teacherProfiles, activeTeacherId]);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Copy Google Meet Link with Clipboard API
  const handleCopyMeetLink = (session: GoogleMeetTutoringSession) => {
    navigator.clipboard.writeText(session.meetUrl).then(() => {
      setCopiedLinkSessionId(session.id);
      showToast(`تم نسخ رابط Google Meet للحصة: ${session.meetUrl}`);
      setTimeout(() => {
        setCopiedLinkSessionId(null);
      }, 2500);
    });
  };

  // Generate randomized Google Meet room code
  const handleGenerateNewCode = () => {
    const randomCode = `snte-${newSubject.substring(0, 3)}-${Math.random().toString(36).substring(2, 6)}`;
    setNewMeetCode(randomCode);
  };

  // Submit new session
  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('يرجى إدخال عنوان درس الدعم عن بعد.');
      return;
    }

    const topicsArray = newTopics
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const generatedSession: GoogleMeetTutoringSession = {
      id: `meet-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      level: newLevel,
      teacherId: activeTeacher.id,
      teacherName: activeTeacher.name,
      teacherTitle: activeTeacher.roleTitle,
      meetUrl: `https://meet.google.com/${newMeetCode.trim()}`,
      meetCode: newMeetCode.trim(),
      date: newDate,
      startTime: newStartTime,
      durationMinutes: parseInt(newDuration, 10) || 60,
      status: 'upcoming',
      description: newDescription.trim() || 'حصة دعم تفاعلية مباشرة بتقنية Google Meet بإشراف الأستاذ المؤطر بالنقابة.',
      targetTopics: topicsArray.length > 0 ? topicsArray : ['مراجعة شاملة وحل تطبيقات نموذجية'],
      attachmentName: newAttachmentName.trim(),
      registeredStudentsCount: 1,
      maxParticipants: 100,
      isStudentEnrolled: true,
    };

    onAddSession(generatedSession);
    setCreateModalOpen(false);
    showToast(
      notifyParentsImmediately
        ? `تمت جدولة حصة Google Meet بنجاح، وتم إرسال تنبيه فوري برابط الحصة (${generatedSession.meetCode}) لجميع الأولياء والتلاميذ!`
        : `تمت جدولة حصة Google Meet بنجاح للأستاذ (${activeTeacher.name}).`
    );

    // Reset fields
    setNewTitle('');
    setNewDescription('');
  };

  // Filter sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesTab = 
        activeFilterTab === 'all' ? true : s.status === activeFilterTab;
      const matchesSubject = 
        selectedSubject === 'all' ? true : s.subject === selectedSubject;
      return matchesTab && matchesSubject;
    });
  }, [sessions, activeFilterTab, selectedSubject]);

  const liveCount = sessions.filter((s) => s.status === 'live').length;
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length;
  const recordedCount = sessions.filter((s) => s.status === 'recorded').length;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white border border-amber-400 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Top Banner: Royal Algerian Education & Google Meet Technology */}
      <div className="bg-gradient-to-r from-red-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>المنصة الرقمية للدروس التفاعلية عن بعد</span>
              <span>·</span>
              <span className="text-emerald-300 font-sans">بتقنية Google Meet الرسمية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              فضاء دروس الدعم والتقوية عن بعد (Google Meet)
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              منصة تضامنية مخصصة لتنظيم ومتابعة حصص الدعم المدرسي المباشرة تحضيراً لشهادتي التعليم المتوسط (BEM 2026) والبكالوريا (BAC 2026) بإشراف نخبة أساتذة النقابة الوطنية لعمال التربية (SNTE).
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-amber-200 pt-1">
              <span>● غرف Google Meet مؤمنة ومشفرة</span>
              <span>·</span>
              <span>● سبورة بيداغوجية تفاعلية</span>
              <span>·</span>
              <span>● إشعار آلي للأولياء بموعد البث</span>
            </div>
          </div>

          {/* Action Button: Schedule Meet as Teacher */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            {userRole === 'teacher' && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102 border border-amber-300"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>برمجة حصة Google Meet جديدة</span>
              </button>
            )}

            <div className="bg-white/10 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 text-center shrink-0 w-full sm:w-auto">
              <div className="text-[11px] text-amber-200 font-bold mb-1">الحصص المباشرة والنشطة</div>
              <div className="text-2xl font-black text-white font-mono flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping"></span>
                <span>{liveCount} حصص جارية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEACHER ACCOUNT SWITCHER STRIP (حسابات الأساتذة المؤطرين) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-700 to-emerald-800 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 font-heading">
                هيئة الأساتذة المؤطرين لدروس الدعم (حسابات الأساتذة)
              </h3>
              <p className="text-xs text-slate-500">
                اختر حساب الأستاذ لعرض دروسه وجدولته الخاصة بروابط Google Meet
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl self-start sm:self-auto">
            الحساب النشط حالياً: <strong className="text-red-700">{activeTeacher.name}</strong>
          </div>
        </div>

        {/* Teachers Horizontal Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {teacherProfiles.map((teacher) => {
            const isSelected = teacher.id === activeTeacherId;
            return (
              <div
                key={teacher.id}
                onClick={() => {
                  onSelectTeacher(teacher.id);
                  showToast(`تم التبديل بنجاح إلى حساب: ${teacher.name} (${teacher.subject})`);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-br from-red-50/80 to-amber-50/60 border-red-600 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                      isSelected
                        ? 'bg-red-700 text-white border border-amber-400'
                        : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    {teacher.name.replace('الأستاذ', '').replace('الأستاذة', '').trim().slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 block truncate">
                      {teacher.name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 block truncate">
                      {teacher.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {teacher.syndicateMemberNumber}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Teacher Card Details */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">{activeTeacher.name}</span>
              <span className="text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {activeTeacher.roleTitle}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl">{activeTeacher.bio}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-600">
            <div className="text-center">
              <span className="font-bold text-slate-900 block text-base font-mono">
                {activeTeacher.totalTutoringHours}
              </span>
              <span className="text-[10px] text-slate-500">ساعة دعم مقدمة</span>
            </div>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="text-center">
              <span className="font-bold text-emerald-700 block text-base font-mono">
                {sessions.filter((s) => s.teacherId === activeTeacher.id).length}
              </span>
              <span className="text-[10px] text-slate-500">حصص مبرمجة</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & CATEGORY NAVIGATION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'all'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            جميع الحصص ({sessions.length})
          </button>

          <button
            onClick={() => setActiveFilterTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeFilterTab === 'live'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block animate-ping"></span>
            <span>بث مباشر الآن ({liveCount})</span>
          </button>

          <button
            onClick={() => setActiveFilterTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'upcoming'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            الحصص القادمة ({upcomingCount})
          </button>

          <button
            onClick={() => setActiveFilterTab('recorded')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'recorded'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            الأرشيف والمسجلات ({recordedCount})
          </button>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-slate-500 font-semibold shrink-0">تصفية بالمادة:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-xs focus:outline-hidden cursor-pointer w-full sm:w-auto"
          >
            <option value="all">كافة المواد التعليمية</option>
            <option value="الرياضيات">الرياضيات</option>
            <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا</option>
            <option value="اللغة العربية">اللغة العربية</option>
            <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
          </select>
        </div>
      </div>

      {/* SESSIONS CARDS GRID */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <VideoOff className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">لا توجد حصص تطابق التصفية المحددة</h3>
          <p className="text-xs text-slate-500">
            يمكن للأستاذ إضافة حصة دعم جديدة عبر تقنية Google Meet بالضغط على زر "برمجة حصة جديدة".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const isLive = session.status === 'live';
            const isUpcoming = session.status === 'upcoming';
            const isRecorded = session.status === 'recorded';

            return (
              <div
                key={session.id}
                className={`bg-white rounded-3xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                  isLive
                    ? 'border-2 border-red-500 shadow-md ring-2 ring-red-500/20'
                    : isUpcoming
                    ? 'border-slate-200 hover:border-emerald-500'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                {/* Card Header Strip */}
                <div
                  className={`p-4 border-b flex items-center justify-between text-xs font-bold ${
                    isLive
                      ? 'bg-red-50 text-red-900 border-red-200'
                      : isUpcoming
                      ? 'bg-emerald-50/80 text-emerald-900 border-emerald-100'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
                        <Radio className="w-3 h-3 animate-ping" />
                        <span>بث مباشر الآن</span>
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="flex items-center gap-1 text-emerald-800 text-[11px] font-bold">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>حصة قادمة</span>
                      </span>
                    )}
                    {isRecorded && (
                      <span className="text-slate-600 text-[11px] font-bold">
                        ● مسجلة في الأرشيف
                      </span>
                    )}
                    <span className="text-slate-400 font-normal">|</span>
                    <span className="font-extrabold">{session.subject}</span>
                  </div>

                  <span className="font-mono text-[11px] text-slate-600">
                    {session.startTime} ({session.durationMinutes} دقيقة)
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug font-heading">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                      <span className="font-bold text-red-800">{session.teacherName}</span>
                      <span>·</span>
                      <span className="text-slate-500">{session.level}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {session.description}
                  </p>

                  {/* Lesson Topics Bullet Points */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      محاور المراجعة والتطبيقات:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {session.targetTopics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Google Meet Connection Details Box */}
                  <div className="bg-emerald-50/60 rounded-2xl p-3.5 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        رابط Google Meet الرسمي للحصة:
                      </span>
                      <span className="font-mono text-emerald-900 font-bold block truncate" dir="ltr">
                        {session.meetUrl}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        رمز الغرفة: <strong className="font-mono text-slate-800">{session.meetCode}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyMeetLink(session)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                      title="نسخ رابط Google Meet"
                    >
                      {copiedLinkSessionId === session.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>نسخ الرابط</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Attached PDF Resource */}
                  {session.attachmentName && (
                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                        <span className="truncate font-semibold">{session.attachmentName}</span>
                      </div>
                      <button 
                        onClick={() => showToast(`تم بدء تنزيل الملف المرفق: ${session.attachmentName}`)}
                        className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>تحميل PDF</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-2 w-full sm:w-auto">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      المسجلون: <strong className="text-slate-800">{session.registeredStudentsCount} تلميذاً</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Toggle Enrollment */}
                    <button
                      onClick={() => {
                        onToggleEnrollment(session.id);
                        showToast(
                          session.isStudentEnrolled
                            ? 'تم إلغاء حجز المقعد في الحصة.'
                            : 'تم تأكيد حجز مقعدك في حصة الدعم بنجاح!'
                        );
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        session.isStudentEnrolled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {session.isStudentEnrolled ? '✓ تم تأكيد الحضور' : 'حجز مقعد'}
                    </button>

                    {/* Launch / Join Google Meet Button */}
                    <a
                      href={session.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isLive
                          ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isLive ? 'الانضمام المباشر (Google Meet)' : 'دخول غرفة Meet'}</span>
                      <ExternalLink className="w-3 h-3 text-white/80" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW GOOGLE MEET SESSION MODAL (للأستاذ) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    برمجة حصة دعم مباشرة عبر Google Meet
                  </h3>
                  <span className="text-xs text-red-700 font-bold">
                    حساب الأستاذ المؤطر: {activeTeacher.name}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  عنوان درس الدعم والمراجعة: <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مراجعة شاملة لتمارين الهندسة المستوية لشهادة BEM 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Subject & Level Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">المادة التعليمية:</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as Subject)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="الرياضيات">الرياضيات</option>
                    <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا</option>
                    <option value="اللغة العربية">اللغة العربية</option>
                    <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
                    <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                    <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">الطور والشهادة المستهدفة:</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="السنة الرابعة متوسط (شهادة التعليم المتوسط BEM 2026)">السنة الرابعة متوسط (BEM 2026)</option>
                    <option value="السنة الثالثة ثانوي (شهادة البكالوريا BAC 2026)">السنة الثالثة ثانوي (BAC 2026)</option>
                    <option value="الطور المتوسط (جميع المستويات)">الطور المتوسط (جميع المستويات)</option>
                  </select>
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">التاريخ:</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">توقيت الانطلاق:</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">المدة (بالدقائق):</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="45">45 دقيقة</option>
                    <option value="60">60 دقيقة (ساعة كاملة)</option>
                    <option value="75">75 دقيقة (ساعة وربع)</option>
                    <option value="90">90 دقيقة (ساعة ونصف)</option>
                  </select>
                </div>
              </div>

              {/* Google Meet Link & Code Box */}
              <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-emerald-950 block">
                    رمز ورابط غرفة Google Meet:
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateNewCode}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 underline"
                  >
                    توليد رمز جديد
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 bg-white px-2 py-2 rounded-lg border border-emerald-200" dir="ltr">
                    meet.google.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={newMeetCode}
                    onChange={(e) => setNewMeetCode(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="flex-1 px-3 py-2 bg-white rounded-lg border border-emerald-300 font-mono font-bold text-slate-900 focus:outline-hidden"
                    placeholder="tilmidi-math-bem"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Lesson Topics */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  محاور الحصة البيداغوجية (سطر لكل محور):
                </label>
                <textarea
                  rows={3}
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  placeholder="المحور الأول&#10;المحور الثاني&#10;حل المسألة الإدماجية"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                ></textarea>
              </div>

              {/* Automated Parents Notification Checkbox */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="notifyImmediate"
                  checked={notifyParentsImmediately}
                  onChange={(e) => setNotifyParentsImmediately(e.target.checked)}
                  className="mt-1 rounded-sm text-red-700 focus:ring-red-500 w-4 h-4"
                />
                <label htmlFor="notifyImmediate" className="cursor-pointer space-y-0.5">
                  <span className="font-extrabold text-amber-950 block">
                    إرسال تنبيه آلي فوري للأولياء والتلاميذ برابط الحصة
                  </span>
                  <span className="text-[11px] text-amber-900/80 block">
                    يتم إشعار أولياء الفوج عبر فضاء الأولياء والرسائل بموعد البث المباشر ورابط الدخول لحث التلميذ على الحضور.
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>تأكيد وجدولة حصة Google Meet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
