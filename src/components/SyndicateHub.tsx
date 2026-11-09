import React, { useState } from 'react';
import { SyndicateResource, FreeTutoringSession } from '../types';
import { 
  HeartHandshake, 
  BookOpen, 
  Download, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  FileText, 
  Award,
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';

interface SyndicateHubProps {
  resources: SyndicateResource[];
  tutoringSessions: FreeTutoringSession[];
}

export const SyndicateHub: React.FC<SyndicateHubProps> = ({
  resources,
  tutoringSessions,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [registeredSessions, setRegisteredSessions] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredResources = resources.filter((r) => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const handleRegisterSession = (sessionId: string, title: string) => {
    setRegisteredSessions((prev) => ({ ...prev, [sessionId]: true }));
    setToastMessage(`تم تأكيد حجز مقعدك المجاني في (${title}) برعاية النقابة. سيصلك إشعار ورابط الحصة عبر التطبيق.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDownload = (title: string) => {
    alert(`جاري تحميل الوثيقة الرسمية من خادم النقابة التربوي:\n${title}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Hero Syndicate Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 min-h-[300px] flex items-center">
        <img
          src="/src/assets/images/union_solidarity_tutoring_1794131594815.jpg"
          alt="دروس الدعم المجاني والتأطير النقابي"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300 bg-emerald-900/80 border border-emerald-700/50 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              فضاء العمل التضامني والاجتماعي للنقابة
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            من أجل مدرسة جزائرية عمومية ذات جودة وتكافؤ فرص حقيقي لجميع أبنائنا
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            تضع النقابة الوطنية لعمال التربية (SNTE) هذا التطبيق رهن إشارة الأساتذة، التلاميذ وأولياء الأمور لتسهيل المتابعة البيداغوجية، وتقديم حصص الدعم المجاني لشهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC)، وبنك الحوليات النموذجية.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#tutoring-sessions"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" />
              <span>دروس الدعم الحضورية والافتراضية لـ BEM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Free Tutoring Sessions Section */}
      <div id="tutoring-sessions" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <span>برنامج الدعم البيداغوجي التضامني المجاني (الموسم الدراسي 2025 / 2026)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              حصص دعم ومراجعة حضورية وعبر البث الرقمي يقدمها نخبة من أساتذة النقابة المتطوعين لفائدة التلاميذ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutoringSessions.map((session) => {
            const isRegistered = registeredSessions[session.id];
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {session.subject}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {session.level}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {session.teacherName}
                  </h4>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{session.dayTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{session.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      المقاعد: <strong className="text-slate-700 font-mono tabular-nums">{session.registeredCount + (isRegistered ? 1 : 0)}</strong> / {session.maxSeats}
                    </span>
                  </div>

                  <button
                    disabled={isRegistered}
                    onClick={() => handleRegisterSession(session.id, `${session.subject} - ${session.level}`)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                      isRegistered
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                    }`}
                  >
                    {isRegistered ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                    <span>{isRegistered ? 'تم حجز المقعد' : 'حجز مقعد مجاني'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Exam & Resource Bank */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>بنك حوليات BEM و BAC ومذكرات الأرضية الرقمية 2026</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              مواضيع مقترحة وفق معايير الديوان الوطني للامتحانات والمسابقات (ONEC) ومذكرات الجيل الثاني الرسمية
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveCategory('شهادة التعليم المتوسط BEM')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'شهادة التعليم المتوسط BEM' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              شهادة BEM
            </button>
            <button
              onClick={() => setActiveCategory('شهادة البكالوريا BAC')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'شهادة البكالوريا BAC' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              شهادة BAC
            </button>
            <button
              onClick={() => setActiveCategory('تقييم المكتسبات')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'تقييم المكتسبات' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تقييم المكتسبات
            </button>
            <button
              onClick={() => setActiveCategory('مذكرات نقابية وتشريعات')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeCategory === 'مذكرات نقابية وتشريعات' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مذكرات وتشريعات
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-md">
                    {res.category}
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums">{res.date}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>إعداد: <strong>{res.author}</strong></span>
                <button
                  onClick={() => handleDownload(res.title)}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الوثيقة مجاناً</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
