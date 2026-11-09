import React from 'react';
import { UserRole, SchoolSettings, AppUser } from '../types';
import { 
  Home, 
  FileText, 
  Zap, 
  Video, 
  CalendarDays, 
  CalendarCheck2, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Newspaper, 
  HeartHandshake, 
  Clock, 
  HardDriveDownload, 
  GraduationCap, 
  School, 
  X, 
  UserCheck, 
  Search, 
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Layers,
  Type,
  Crown,
  Wallet,
  Users,
  CreditCard,
  LogOut,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

interface RightSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentUser?: AppUser | null;
  onLogout?: () => void;
  schoolSettings: SchoolSettings;
  onOpenSchoolSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  dzExamsCount: number;
  quizzesCount: number;
  onOpenFontCustomizer: () => void;
  fontName?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  onChangeRole,
  currentUser,
  onLogout,
  schoolSettings,
  onOpenSchoolSettings,
  isOpenMobile,
  onCloseMobile,
  dzExamsCount,
  quizzesCount,
  onOpenFontCustomizer,
  fontName = 'القاهرة',
}) => {
  // Navigation categories adapted by Role
  const getNavSections = () => {
    if (userRole === 'admin') {
      return [
        {
          group: 'إدارة وإشراف السنتر (Admin/Owner)',
          items: [
            { id: 'admin_hub', label: 'لوحة الإشراف العام والمؤشرات', icon: Crown, badge: 'رئيسي', color: 'text-amber-500' },
            { id: 'dashboard', label: 'لوحة التحكم البيداغوجية', icon: Home, badge: null, color: 'text-emerald-700' },
            { id: 'financial_secretary', label: 'متابعة الرسوم والتحصيل المالي', icon: Wallet, badge: 'مالية', color: 'text-rose-600' },
          ],
        },
        {
          group: 'البيداغوجيا ومتابعة الفصول',
          items: [
            { id: 'attendance', label: 'رصد الحضور وتنبيهات الواتساب', icon: CalendarCheck2, badge: 'فوري', color: 'text-emerald-600' },
            { id: 'exams_bank', label: 'بنك الفروض والامتحانات الوطنية (PDF)', icon: FileText, badge: `${dzExamsCount}`, color: 'text-red-600' },
            { id: 'quizzes', label: 'كويزات تقييمية وتصحيح آلي', icon: Zap, badge: `${quizzesCount}`, color: 'text-amber-500' },
            { id: 'distance_tutoring', label: 'دروس الدعم (Google Meet)', icon: Video, badge: 'مباشر', color: 'text-blue-600' },
            { id: 'timetable', label: 'جدول الحصص الأسبوعي', icon: Clock, badge: null, color: 'text-slate-600' },
          ],
        },
        {
          group: 'المنظومة والخدمات',
          items: [
            { id: 'calendar', label: 'التقويم والرزنامة الرسمية 2026', icon: CalendarDays, badge: 'BEM/BAC', color: 'text-emerald-600' },
            { id: 'news_events', label: 'أخبار الوزارة ومستجدات المنظومة', icon: Newspaper, badge: null, color: 'text-blue-600' },
          ],
        },
      ];
    }

    if (userRole === 'secretary') {
      return [
        {
          group: 'التحصيل والسكرتارية (Secretary)',
          items: [
            { id: 'financial_secretary', label: 'الاشتراكات ورسوم التلاميذ', icon: Wallet, badge: 'رئيسي', color: 'text-rose-600' },
            { id: 'attendance', label: 'رصد الحضور والغياب اليومي', icon: CalendarCheck2, badge: 'يومي', color: 'text-emerald-600' },
            { id: 'timetable', label: 'جدول المجموعات والحصص', icon: Clock, badge: null, color: 'text-slate-600' },
          ],
        },
        {
          group: 'المراجع البيداغوجية',
          items: [
            { id: 'exams_bank', label: 'بنك الفروض والامتحانات الوطنية (PDF)', icon: FileText, badge: `${dzExamsCount}`, color: 'text-red-600' },
            { id: 'calendar', label: 'التقويم والرزنامة 2026', icon: CalendarDays, badge: null, color: 'text-emerald-600' },
            { id: 'news_events', label: 'أخبار المركز والوزارة', icon: Newspaper, badge: null, color: 'text-blue-600' },
          ],
        },
      ];
    }

    if (userRole === 'parent' || userRole === 'parent_student') {
      return [
        {
          group: 'فضاء الأولياء ومتابعة الأبناء',
          items: [
            { id: 'parent_portal', label: 'لوحة متابعة الأبناء والإشعارات', icon: Users, badge: 'تنبيهات', color: 'text-blue-600' },
            { id: 'attendance', label: 'سجل الحضور وطلب التبرير', icon: CalendarCheck2, badge: null, color: 'text-emerald-600' },
            { id: 'grades', label: 'كشف النقاط والتقويمات', icon: Award, badge: null, color: 'text-amber-600' },
            { id: 'financial_secretary', label: 'حالة الاشتراكات والإيصالات', icon: CreditCard, badge: null, color: 'text-rose-600' },
          ],
        },
        {
          group: 'المراجعة والدعم المدرسي',
          items: [
            { id: 'exams_bank', label: 'بنك الفروض والامتحانات الوطنية (PDF)', icon: FileText, badge: `${dzExamsCount}`, color: 'text-red-600' },
            { id: 'quizzes', label: 'كويزات وتدريب تفاعلي', icon: Zap, badge: `${quizzesCount}`, color: 'text-amber-500' },
            { id: 'distance_tutoring', label: 'دروس الدعم عن بعد (Google Meet)', icon: Video, badge: null, color: 'text-blue-600' },
            { id: 'calendar', label: 'رزنامة امتحانات 2026', icon: CalendarDays, badge: null, color: 'text-emerald-600' },
          ],
        },
      ];
    }

    // Default: Teacher
    return [
      {
        group: 'الرئيسية والامتحانات الرسمية',
        items: [
          { id: 'dashboard', label: 'الرئيسية (لوحة التحكم)', icon: Home, badge: null, color: 'text-emerald-700' },
          { id: 'exams_bank', label: 'بنك الفروض والامتحانات الوطنية (PDF)', icon: FileText, badge: `${dzExamsCount} موضوع`, color: 'text-red-600' },
          { id: 'quizzes', label: 'كويزات تقييمية وتصحيح آلي', icon: Zap, badge: `${quizzesCount} كويز`, color: 'text-amber-500' },
        ],
      },
      {
        group: 'البيداغوجيا والدعم والغيابات',
        items: [
          { id: 'attendance', label: 'رصد الحضور والغياب الفوري', icon: CalendarCheck2, badge: 'واتساب', color: 'text-emerald-600' },
          { id: 'timetable', label: 'جدول الحصص والمجموعات', icon: Clock, badge: null, color: 'text-slate-600' },
          { id: 'distance_tutoring', label: 'دروس الدعم (Google Meet)', icon: Video, badge: 'مباشر', color: 'text-blue-600' },
          { id: 'grades', label: 'دفتر النقط والتقويم الفصلي', icon: Award, badge: null, color: 'text-amber-600' },
          { id: 'homework', label: 'دفتر الواجبات والفروض', icon: BookOpen, badge: null, color: 'text-indigo-600' },
        ],
      },
      {
        group: 'الرزنامة والتواصل',
        items: [
          { id: 'calendar', label: 'التقويم والرزنامة 2026', icon: CalendarDays, badge: 'BEM/BAC', color: 'text-emerald-600' },
          { id: 'messages', label: 'المراسلات مع الأولياء', icon: MessageSquare, badge: null, color: 'text-emerald-700' },
          { id: 'news_events', label: 'أخبار الوزارة والمستجدات', icon: Newspaper, badge: null, color: 'text-blue-600' },
        ],
      },
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Main Right Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 right-0 z-40 h-screen w-72 bg-white border-l border-slate-200 shadow-xl lg:shadow-none flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
        dir="rtl"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/20">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900">مركز التفوق</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  معتمد
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                {schoolSettings.schoolName}
              </p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-3 mx-3 my-2 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.title}</div>
              </div>
            </div>

            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
              userRole === 'admin' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              userRole === 'teacher' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
              userRole === 'parent' ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}>
              {userRole === 'admin' ? 'المدير' : userRole === 'teacher' ? 'أستاذ' : userRole === 'parent' ? 'ولي أمر' : 'سكرتارية'}
            </span>
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="p-3 overflow-y-auto space-y-5 flex-1 text-right">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>{section.group}</span>
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 text-white shadow-md shadow-emerald-900/15 font-black border-r-4 border-amber-400'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isActive 
                            ? 'bg-amber-400 text-slate-950 shadow-2xs' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom User Role, Font Customizer & Logout Strip */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-2 shrink-0 text-xs">
          {/* Professional Arabic Font Customizer Button */}
          <button
            onClick={() => {
              onOpenFontCustomizer();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl dz-badge-gold hover:brightness-105 active:scale-98 transition-all text-xs font-black shadow-2xs cursor-pointer border border-amber-400/60"
            title="انقر لتعديل نموذج الخط الاحترافي وحجم القراءة المعتمد"
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-900" />
              <span className="text-amber-950 font-black">نموذج الخط الاحترافي</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200/90 text-amber-950 font-black border border-amber-300">
                {fontName}
              </span>
              <Crown className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={() => {
                if (isOpenMobile) onCloseMobile();
                onLogout();
              }}
              className="w-full py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج (تبديل الحساب)</span>
            </button>
          )}

          {/* Official link */}
          <a
            href="https://onec.edu.dz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-bold text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>الديوان الوطني للمسابقات والامتحانات</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-extrabold">ONEC</span>
          </a>
        </div>
      </aside>
    </>
  );
};
