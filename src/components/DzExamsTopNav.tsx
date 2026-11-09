import React, { useState } from 'react';
import { UserRole, SchoolSettings, FontSettings, AppUser } from '../types';
import { 
  Menu, 
  Search, 
  GraduationCap, 
  School, 
  FileText, 
  Zap, 
  UserCheck, 
  ExternalLink, 
  ShieldCheck, 
  Download, 
  Type, 
  Crown, 
  Sparkles,
  LogOut,
  ChevronDown,
  Users,
  Wallet
} from 'lucide-react';

interface DzExamsTopNavProps {
  onToggleSidebar: () => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  currentUser: AppUser | null;
  onLogout: () => void;
  schoolSettings: SchoolSettings;
  onOpenSchoolSettings: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenFontCustomizer: () => void;
  currentFontName?: string;
}

export const DzExamsTopNav: React.FC<DzExamsTopNavProps> = ({
  onToggleSidebar,
  userRole,
  onChangeRole,
  currentUser,
  onLogout,
  schoolSettings,
  onOpenSchoolSettings,
  searchQuery,
  onSearchChange,
  onNavigateTab,
  onOpenFontCustomizer,
  currentFontName = 'القاهرة',
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleMeta = {
    admin: { label: 'المالك / المدير', bg: 'bg-amber-100 text-amber-900 border-amber-400', icon: Crown },
    teacher: { label: 'الأستاذ المؤطر', bg: 'bg-emerald-100 text-emerald-900 border-emerald-400', icon: GraduationCap },
    parent: { label: 'ولي الأمر', bg: 'bg-blue-100 text-blue-900 border-blue-400', icon: Users },
    secretary: { label: 'السكرتارية والحسابات', bg: 'bg-rose-100 text-rose-900 border-rose-400', icon: Wallet },
    parent_student: { label: 'ولي الأمر / التلميذ', bg: 'bg-blue-100 text-blue-900 border-blue-400', icon: Users },
    syndicate_admin: { label: 'إدارة السنتر', bg: 'bg-amber-100 text-amber-900 border-amber-400', icon: Crown },
  }[userRole] || { label: userRole, bg: 'bg-slate-100 text-slate-800 border-slate-300', icon: Crown };

  const RoleIcon = roleMeta.icon;

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-amber-400/30 shadow-xs">
      {/* Algerian National Flag & Royal Gold Top Ribbon (أخضر زمردي - ذهبي ملكي - أحمر ياقوتي) */}
      <div className="dz-national-ribbon"></div>

      <div className="px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Right Zone: Sidebar Hamburger Toggle + Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="القائمة الجانبية للأقسام"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigateTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <School className="w-5 h-5 text-amber-300" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 whitespace-nowrap">
                    مركز التفوق لدروس الدعم
                  </span>
                  <span className="text-[10px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.2 rounded-full">
                    معتمد رسمي
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  {schoolSettings.schoolName}
                </p>
              </div>
            </div>
          </div>

          {/* Center Zone: Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.trim().length > 0) {
                    onNavigateTab('exams_bank');
                  }
                }}
                placeholder="ابحث في بنك الفروض والامتحانات، الدروس، أو الاختبارات..."
                className="w-full pl-4 pr-10 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2" />
            </div>
          </div>

          {/* Left Zone: Font Customizer, Current User Profile, Role & Logout */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Customizer Button */}
            <button
              onClick={onOpenFontCustomizer}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl dz-badge-gold hover:brightness-105 active:scale-95 transition-all text-xs font-black shadow-xs border border-amber-400/60 text-amber-950 cursor-pointer"
              title="تعديل نموذج الخط الاحترافي وحجم القراءة"
            >
              <Type className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden lg:inline text-[11px]">الخط:</span>
              <span className="font-extrabold text-[11px] text-amber-950">{currentFontName}</span>
              <Crown className="w-3 h-3 text-amber-700 hidden lg:inline" />
            </button>

            {/* Logged in User Profile Pill & Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer shadow-2xs ${roleMeta.bg}`}
              >
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-black text-[11px]">
                  <RoleIcon className="w-3 h-3" />
                </div>
                <div className="text-right hidden sm:block">
                  <span className="font-black text-xs block leading-tight">{currentUser?.name.split(' ')[0] || 'المستخدم'}</span>
                  <span className="text-[10px] opacity-80 block leading-tight">{roleMeta.label}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Role Dropdown Menu */}
              {roleDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-2 z-50 text-right animate-in fade-in zoom-in-95 duration-150"
                  dir="rtl"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-black text-slate-900 text-xs">{currentUser?.name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser?.title}</div>
                  </div>

                  <div className="py-1">
                    <span className="px-3 py-1 text-[10px] font-bold text-slate-400 block uppercase">
                      التبديل المباشر بين الأدوار (تجريبي):
                    </span>
                    <button
                      onClick={() => {
                        onChangeRole('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${userRole === 'admin' ? 'bg-amber-50 text-amber-900 font-black' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                        <span>المالك / المدير (Admin)</span>
                      </span>
                      {userRole === 'admin' && <span className="text-xs text-amber-600">✓</span>}
                    </button>

                    <button
                      onClick={() => {
                        onChangeRole('teacher');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${userRole === 'teacher' ? 'bg-emerald-50 text-emerald-900 font-black' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>الأستاذ (Teacher)</span>
                      </span>
                      {userRole === 'teacher' && <span className="text-xs text-emerald-600">✓</span>}
                    </button>

                    <button
                      onClick={() => {
                        onChangeRole('parent');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${userRole === 'parent' ? 'bg-blue-50 text-blue-900 font-black' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>ولي الأمر (Parent)</span>
                      </span>
                      {userRole === 'parent' && <span className="text-xs text-blue-600">✓</span>}
                    </button>

                    <button
                      onClick={() => {
                        onChangeRole('secretary');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${userRole === 'secretary' ? 'bg-rose-50 text-rose-900 font-black' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <span className="flex items-center gap-2">
                        <Wallet className="w-3.5 h-3.5 text-rose-600" />
                        <span>السكرتارية والحسابات (Secretary)</span>
                      </span>
                      {userRole === 'secretary' && <span className="text-xs text-rose-600">✓</span>}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-right px-3 py-2 rounded-xl text-xs font-black text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>تسجيل الخروج والعودة للواجهة الموحدة</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Icon Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
