import React from 'react';
import { UserRole, SchoolSettings } from '../types';
import { 
  GraduationCap, 
  CalendarCheck2, 
  CalendarDays,
  BookOpen, 
  Award, 
  MessageSquare, 
  HeartHandshake, 
  Sparkles,
  Newspaper,
  School,
  Settings,
  HardDriveDownload,
  Video,
  HelpCircle,
  Zap
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  schoolSettings: SchoolSettings;
  onOpenSchoolSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeRole,
  schoolSettings,
  onOpenSchoolSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#6b0066]/15 shadow-xs">
      {/* Fedu.ai Signature Plum-to-Amber Gradient Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#6b0066] via-[#9236b8] to-[#ffbc4e]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-20">
          
          {/* Zone 1: Brand Zone with Fedu.ai squircle emblem & typography */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Fedu-style rounded emblem */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6b0066] to-[#9236b8] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#6b0066]/25 border border-[#bb95ff]/40 shrink-0">
              <GraduationCap className="w-6 h-6 text-[#ffbc4e]" />
            </div>

            {/* School Logo */}
            {schoolSettings.logoUrl && (
              <div 
                onClick={onOpenSchoolSettings}
                className="w-10 h-10 rounded-2xl overflow-hidden border border-[#6b0066]/20 bg-white p-0.5 shadow-2xs hover:border-[#6b0066] transition-all cursor-pointer hidden sm:flex items-center justify-center shrink-0"
                title="تعديل لوغو وهوية المؤسسة التعليمية"
              >
                <img
                  src={schoolSettings.logoUrl}
                  alt={schoolSettings.schoolName}
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#330524] whitespace-nowrap">
                  تطبيق تلميذي
                </span>
                <span className="text-[11px] font-bold text-[#6b0066] bg-[#faebf9] border border-[#6b0066]/25 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  النقابة الوطنية لعمال التربية (SNTE)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 truncate max-w-[240px] sm:max-w-xs">
                <span className="truncate text-[#6b0066] font-semibold">{schoolSettings.schoolName}</span>
                <span>·</span>
                <span className="text-[#330524] font-bold">{schoolSettings.motto}</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links in Fedu.ai Pill Style */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-[#330524]">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <span>الرئيسية</span>
            </button>

            {/* Quizzes & National Exams Bank Tab */}
            <button
              onClick={() => onSelectTab('quizzes')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'quizzes'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>بنك الكويزات (الامتحانات الرسمية)</span>
            </button>

            <button
              onClick={() => onSelectTab('distance_tutoring')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'distance_tutoring'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#bb95ff]" />
              <span>دروس الدعم (Meet)</span>
            </button>

            <button
              onClick={() => onSelectTab('calendar')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'calendar'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
              <span>الرزنامة 2026</span>
            </button>

            <button
              onClick={() => onSelectTab('attendance')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'attendance'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>الغياب والحضور</span>
            </button>

            <button
              onClick={() => onSelectTab('grades')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'grades'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفتر النقط</span>
            </button>

            <button
              onClick={() => onSelectTab('homework')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'homework'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>الواجبات</span>
            </button>

            <button
              onClick={() => onSelectTab('news')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'news'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-slate-500" />
              <span>الأخبار</span>
            </button>

            <button
              onClick={() => onSelectTab('messages')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'messages'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>المراسلات</span>
            </button>

            <button
              onClick={() => onSelectTab('syndicate')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'syndicate'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#6b0066]" />
              <span>النقابة</span>
            </button>

            <button
              onClick={() => onSelectTab('data_backup')}
              className={`px-3 py-2 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'data_backup'
                  ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                  : 'hover:text-[#6b0066] hover:bg-[#faebf9]'
              }`}
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-amber-500" />
              <span>البيانات</span>
            </button>
          </nav>

          {/* Zone 3: School Logo & Role Switcher in Fedu Pill Style */}
          <div className="flex items-center gap-2 shrink-0">
            {/* School Logo Customization Button */}
            <button
              onClick={onOpenSchoolSettings}
              className="p-2 rounded-full border border-[#6b0066]/20 bg-[#faebf9]/80 hover:bg-[#faebf9] text-[#6b0066] transition-colors flex items-center gap-1 text-xs font-bold"
              title="تعديل لوغو المؤسسة والترويسة الرسمية"
            >
              <School className="w-4 h-4 text-[#6b0066]" />
              <span className="hidden xl:inline">المؤسسة</span>
            </button>

            {/* Fedu.ai Pill Role Switcher */}
            <div className="flex items-center bg-[#faebf9] p-1 rounded-full border border-[#6b0066]/20">
              <button
                onClick={() => onChangeRole('teacher')}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  userRole === 'teacher'
                    ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                    : 'text-[#330524] hover:text-[#6b0066]'
                }`}
              >
                الأستاذ
              </button>
              <button
                onClick={() => onChangeRole('parent_student')}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  userRole === 'parent_student'
                    ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                    : 'text-[#330524] hover:text-[#6b0066]'
                }`}
              >
                التلميذ / الأسرة
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row in Fedu Pill Style */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 text-xs font-bold no-scrollbar">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectTab('quizzes')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'quizzes' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>كويزات onec</span>
          </button>
          <button
            onClick={() => onSelectTab('distance_tutoring')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'distance_tutoring' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            <Video className="w-3 h-3 text-[#bb95ff]" />
            <span>دروس Meet</span>
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'calendar' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            التقويم والرزنامة
          </button>
          <button
            onClick={() => onSelectTab('attendance')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'attendance' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            الغياب
          </button>
          <button
            onClick={() => onSelectTab('grades')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'grades' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            النقط
          </button>
          <button
            onClick={() => onSelectTab('homework')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'homework' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            الواجبات
          </button>
          <button
            onClick={() => onSelectTab('news')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'news' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            الأخبار
          </button>
          <button
            onClick={() => onSelectTab('messages')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'messages' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            المراسلات
          </button>
          <button
            onClick={() => onSelectTab('syndicate')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'syndicate' ? 'bg-[#6b0066] text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            فضاء النقابة
          </button>
          <button
            onClick={() => onSelectTab('data_backup')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap ${
              currentTab === 'data_backup' ? 'bg-amber-600 text-white' : 'bg-white text-[#330524] border border-slate-200'
            }`}
          >
            تصدير البيانات
          </button>
        </div>
      </div>
    </header>
  );
};
