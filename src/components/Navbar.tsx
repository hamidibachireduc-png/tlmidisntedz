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
  Video
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-500/40 shadow-xs">
      {/* Royal Moroccan Red & Gold Accent Stripe */}
      <div className="h-1 bg-gradient-to-r from-red-700 via-amber-500 to-emerald-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Zone 1: Brand Zone with Syndicate Emblem AND School Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Syndicate Badge */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-700 via-red-800 to-emerald-900 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-amber-400/40 shrink-0">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>

            {/* School Logo */}
            {schoolSettings.logoUrl && (
              <div 
                onClick={onOpenSchoolSettings}
                className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-300/80 bg-white p-0.5 shadow-2xs hover:border-red-600 transition-all cursor-pointer hidden sm:flex items-center justify-center shrink-0"
                title="انقر لتعديل لوغو وهوية المؤسسة التعليمية"
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
                <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  تطبيق تلميذي
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                  النقابة الوطنية لعمال التربية (SNTE)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 truncate max-w-[240px] sm:max-w-xs">
                <span className="truncate text-emerald-800 font-semibold">{schoolSettings.schoolName}</span>
                <span>·</span>
                <span className="text-amber-800 font-bold">{schoolSettings.motto}</span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold text-slate-700">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'hover:text-red-700 hover:bg-red-50/60'
              }`}
            >
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => onSelectTab('news')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'news'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'hover:text-red-700 hover:bg-red-50/60'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-amber-500" />
              <span>الأخبار والفعاليات</span>
            </button>

            <button
              onClick={() => onSelectTab('calendar')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'calendar'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'hover:text-emerald-800 hover:bg-emerald-50/60'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
              <span>التقويم البيداغوجي</span>
            </button>

            <button
              onClick={() => onSelectTab('attendance')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'attendance'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>الغياب والحضور</span>
            </button>

            <button
              onClick={() => onSelectTab('homework')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'homework'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفتر الواجبات</span>
            </button>

            <button
              onClick={() => onSelectTab('grades')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'grades'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفتر النقط</span>
            </button>

            <button
              onClick={() => onSelectTab('messages')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'messages'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>المراسلات الآمنة</span>
            </button>

            <button
              onClick={() => onSelectTab('syndicate')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'syndicate'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'hover:text-red-800 hover:bg-red-50/60'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-red-600" />
              <span>فضاء النقابة</span>
            </button>

            <button
              onClick={() => onSelectTab('distance_tutoring')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'distance_tutoring'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'hover:text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>دروس الدعم (Google Meet)</span>
            </button>

            <button
              onClick={() => onSelectTab('data_backup')}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                currentTab === 'data_backup'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'hover:text-amber-700 hover:bg-amber-50/70'
              }`}
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-amber-500" />
              <span>إدارة وتصدير البيانات</span>
            </button>
          </nav>

          {/* Zone 3: School Logo Customizer & Role Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            {/* School Logo Customization Button */}
            <button
              onClick={onOpenSchoolSettings}
              className="p-2 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 transition-colors flex items-center gap-1 text-xs font-bold"
              title="تعديل لوغو المؤسسة والترويسة الرسمية"
            >
              <School className="w-4 h-4 text-red-700" />
              <span className="hidden xl:inline">لوغو المدرسة</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onChangeRole('teacher')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  userRole === 'teacher'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                الأستاذ
              </button>
              <button
                onClick={() => onChangeRole('parent_student')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  userRole === 'parent_student'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                التلميذ / الأسرة
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 text-xs font-bold no-scrollbar">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onSelectTab('news')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'news' ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الأخبار والفعاليات
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'calendar' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            التقويم والرزنامة
          </button>
          <button
            onClick={() => onSelectTab('attendance')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'attendance' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الغياب
          </button>
          <button
            onClick={() => onSelectTab('homework')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'homework' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الواجبات
          </button>
          <button
            onClick={() => onSelectTab('grades')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'grades' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            النقط
          </button>
          <button
            onClick={() => onSelectTab('messages')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'messages' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            المراسلات
          </button>
          <button
            onClick={() => onSelectTab('syndicate')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              currentTab === 'syndicate' ? 'bg-red-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            فضاء النقابة
          </button>
          <button
            onClick={() => onSelectTab('distance_tutoring')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'distance_tutoring' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>دروس Google Meet</span>
          </button>
          <button
            onClick={() => onSelectTab('data_backup')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'data_backup' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-amber-500" />
            <span>تصدير واستيراد البيانات</span>
          </button>
        </div>
      </div>
    </header>
  );
};
