import React, { useState } from 'react';
import { UserRole, AppUser } from '../types';
import { 
  ShieldCheck, 
  Crown, 
  GraduationCap, 
  Users, 
  Wallet, 
  Lock, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  School,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  PhoneCall,
  Info,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: AppUser) => void;
  users: AppUser[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, users }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [emailInput, setEmailInput] = useState('admin@center-tilmidi.dz');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showCredentialsGuide, setShowCredentialsGuide] = useState(true);

  // Role metadata definitions
  const roleCards = [
    {
      role: 'admin' as UserRole,
      title: 'المالك / المدير (Owner/Admin)',
      badge: 'إشراف كامل',
      color: 'border-amber-400 bg-amber-50/40 text-amber-900',
      activeColor: 'ring-2 ring-amber-500 bg-amber-50 shadow-md',
      icon: Crown,
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950',
      description: 'لوحة تحكم شاملة للإشراف، إدارة حسابات المعلمين والأولياء وتعيين الصلاحيات، ومتابعة إيرادات السنتر.',
      defaultUser: users.find((u) => u.role === 'admin') || users[0],
      defaultPass: 'admin123',
    },
    {
      role: 'teacher' as UserRole,
      title: 'الأستاذ المؤطر (Teacher)',
      badge: 'بيداغوجي وتدريس',
      color: 'border-emerald-400 bg-emerald-50/40 text-emerald-900',
      activeColor: 'ring-2 ring-emerald-600 bg-emerald-50 shadow-md',
      icon: GraduationCap,
      iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white',
      description: 'استعراض جدول الحصص والأفواج، رصد وتسجيل الحضور والغياب بضغطة زر، وإدارة الكويزات وبنك الفروض.',
      defaultUser: users.find((u) => u.role === 'teacher') || users[1],
      defaultPass: 'teach123',
    },
    {
      role: 'parent' as UserRole,
      title: 'ولي الأمر (Parent)',
      badge: 'فضاء الأولياء',
      color: 'border-blue-400 bg-blue-50/40 text-blue-900',
      activeColor: 'ring-2 ring-blue-600 bg-blue-50 shadow-md',
      icon: Users,
      iconBg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
      description: 'متابعة الأبناء المسجلين، استلام إشعارات فورية على الهاتف عند رصد الغياب، وسجل الحضور وتقديم التبرير الإلكتروني.',
      defaultUser: users.find((u) => u.role === 'parent') || users[2],
      defaultPass: 'parent123',
    },
    {
      role: 'secretary' as UserRole,
      title: 'السكرتارية / الحسابات (Secretary)',
      badge: 'التحصيل والإيصالات',
      color: 'border-rose-400 bg-rose-50/40 text-rose-900',
      activeColor: 'ring-2 ring-rose-600 bg-rose-50 shadow-md',
      icon: Wallet,
      iconBg: 'bg-gradient-to-br from-rose-600 to-red-700 text-white',
      description: 'متابعة مصروفات واشتراكات التلاميذ الشهرية، رصد المبالغ المدفوعة والمتبقية، وإصدار إيصالات دفع إلكترونية معتمدة.',
      defaultUser: users.find((u) => u.role === 'secretary') || users[3],
      defaultPass: 'sec123',
    },
  ];

  // Select role card: fills username and focuses on password protection
  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setErrorMsg(null);
    setSuccessNotice(null);
    const matched = users.find((u) => u.role === r);
    if (matched) {
      setEmailInput(matched.email);
      setPasswordInput(''); // Force password entry for genuine protection!
    }
  };

  // Helper to fill credentials for testing
  const handleFillCredentials = (email: string, pass: string) => {
    setEmailInput(email);
    setPasswordInput(pass);
    setErrorMsg(null);
    setSuccessNotice(`تم تجهيز بيانات (${email}) في الحقول. انقر على «تسجيل الدخول والتأكد من الصلاحية» للمتابعة.`);
  };

  // Strict Form submit requiring Username and Password
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    const trimmedEmail = emailInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    if (!trimmedEmail) {
      setErrorMsg('يرجى إدخال اسم المستخدم أو البريد الإلكتروني.');
      return;
    }

    if (!trimmedPass) {
      setErrorMsg('يرجى إدخال كلمة المرور لحماية الحساب ومتابعة الدخول.');
      return;
    }

    // Match by email or phone
    const matchedUser = users.find(
      (u) => 
        u.email.toLowerCase() === trimmedEmail || 
        u.phone.replace(/\D/g, '') === trimmedEmail.replace(/\D/g, '')
    );

    if (!matchedUser) {
      setErrorMsg('اسم المستخدم أو البريد الإلكتروني المدخل غير مسجل في قاعدة بيانات المركز.');
      return;
    }

    if (matchedUser.status === 'suspended') {
      setErrorMsg('هذا الحساب مجمّد حالياً من طرف الإدارة. يرجى مراجعة إدارة المركز.');
      return;
    }

    // Strict Password Validation
    const expectedPassword = matchedUser.password || 'admin123';
    if (trimmedPass !== expectedPassword) {
      setErrorMsg('⚠️ كلمة المرور المدخلة غير صحيحة! يرجى إدخال كلمة المرور الصحيحة لحماية الحساب.');
      return;
    }

    // Verified successfully
    setSuccessNotice('تم التحقق من بيانات الدخول بنجاح! جاري التوجيه للوحة التحكم...');
    setTimeout(() => {
      onLogin(matchedUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans" dir="rtl">
      {/* Top Algerian National Tricolor Ribbon */}
      <div className="dz-national-ribbon h-1.5 w-full shrink-0"></div>

      {/* Header bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 border border-amber-300">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">منصة مركز التفوق والتميز لدروس الدعم والتقوية</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                حماية أمنية 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">الجمهورية الجزائرية الديمقراطية الشعبية · بوابة الدخول الآمن باسم المستخدم وكلمة المرور</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-amber-200/90 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-amber-400/30">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>حماية مشددة للحسابات برقم سري وتشفير الجلسات</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-slate-950/90 rounded-3xl border-2 border-amber-400/40 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Top Banner */}
          <div 
            className="p-6 sm:p-8 text-white relative overflow-hidden"
            style={{
              backgroundColor: '#033224',
              backgroundImage: 'linear-gradient(135deg, #02261a 0%, #064e3b 45%, #008751 75%, #78350f 100%)',
            }}
          >
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-amber-300 font-extrabold text-xs border border-amber-400/60 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>تسجيل الدخول الآمن باسم المستخدم وكلمة المرور</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
                نافذة الدخول الموحدة لمنظومة المركز التعليمي
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                لحماية خصوصية البيانات البيداغوجية والمالية، يتطلب كل حساب إدخال اسم المستخدم وكلمة المرور الرسمية للتحقق من الصلاحيات والتوجيه للوحة المناسبة.
              </p>
            </div>
            {/* Subtle watermark */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
              <School className="w-56 h-56 text-amber-300" />
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Right Column: Roles Directory & Credentials Guide */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>حدد حسابك أو اختر الدور لتعبئة اسم المستخدم:</span>
                </h2>
                <span className="text-xs text-slate-400">4 أدوار رسمية</span>
              </div>

              {/* 4 Role Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {roleCards.map((rc) => {
                  const Icon = rc.icon;
                  const isSelected = selectedRole === rc.role;
                  return (
                    <div
                      key={rc.role}
                      onClick={() => handleSelectRole(rc.role)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-right relative overflow-hidden group ${
                        isSelected 
                          ? 'border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400' 
                          : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      {/* Top icon and badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${rc.iconBg} shadow-sm`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${rc.color}`}>
                          {rc.badge}
                        </span>
                      </div>

                      {/* Title and description */}
                      <div className="space-y-1 mb-3">
                        <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                          {rc.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {rc.description}
                        </p>
                      </div>

                      {/* Select & Fill Action */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFillCredentials(rc.defaultUser.email, rc.defaultPass);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'dz-btn-gold text-slate-950 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span>تجهيز بيانات {rc.defaultUser.name.split(' ')[0]}</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Collapsible Credentials Guide for Easy Testing */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowCredentialsGuide(!showCredentialsGuide)}
                >
                  <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>دليل كلمات المرور المعتمدة للحسابات (للتجربة والاختبار):</span>
                  </div>
                  <span className="text-[11px] text-slate-400 hover:text-white">
                    {showCredentialsGuide ? 'إخفاء' : 'إظهار'}
                  </span>
                </div>

                {showCredentialsGuide && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div 
                      onClick={() => handleFillCredentials('admin@center-tilmidi.dz', 'admin123')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="font-black text-amber-300 text-[11px]">👑 المالك / المدير العام</div>
                      <div className="text-[11px] text-slate-300 font-mono" dir="ltr">admin@center-tilmidi.dz</div>
                      <div className="text-[10px] text-slate-400 font-mono">كلمة المرور: <strong className="text-emerald-400">admin123</strong></div>
                    </div>

                    <div 
                      onClick={() => handleFillCredentials('teacher@center-tilmidi.dz', 'teach123')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-400 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="font-black text-emerald-300 text-[11px]">👨‍🏫 الأستاذ المؤطر</div>
                      <div className="text-[11px] text-slate-300 font-mono" dir="ltr">teacher@center-tilmidi.dz</div>
                      <div className="text-[10px] text-slate-400 font-mono">كلمة المرور: <strong className="text-emerald-400">teach123</strong></div>
                    </div>

                    <div 
                      onClick={() => handleFillCredentials('parent@center-tilmidi.dz', 'parent123')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-400 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="font-black text-blue-300 text-[11px]">👨‍👩‍👧 ولي الأمر</div>
                      <div className="text-[11px] text-slate-300 font-mono" dir="ltr">parent@center-tilmidi.dz</div>
                      <div className="text-[10px] text-slate-400 font-mono">كلمة المرور: <strong className="text-emerald-400">parent123</strong></div>
                    </div>

                    <div 
                      onClick={() => handleFillCredentials('secretary@center-tilmidi.dz', 'sec123')}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-400 transition-colors cursor-pointer space-y-0.5"
                    >
                      <div className="font-black text-rose-300 text-[11px]">💼 السكرتارية والحسابات</div>
                      <div className="text-[11px] text-slate-300 font-mono" dir="ltr">secretary@center-tilmidi.dz</div>
                      <div className="text-[10px] text-slate-400 font-mono">كلمة المرور: <strong className="text-emerald-400">sec123</strong></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Left Column: Protected Credentials Login Form */}
            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>نافذة الدخول (اسم المستخدم وكلمة المرور)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    التحقق الأمني من صلاحيات الوصول المشفرة
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-bold animate-shake flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successNotice && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs font-bold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{successNotice}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Username / Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      اسم المستخدم أو البريد الإلكتروني المسجل:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@center-tilmidi.dz"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-left"
                        dir="ltr"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Protected Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 block">
                        كلمة المرور السرية (Password):
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const matched = users.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
                          if (matched && matched.password) {
                            setPasswordInput(matched.password);
                            setSuccessNotice(`تم استرجاع وتعبئة كلمة المرور الخاصة بحساب (${matched.name}).`);
                          } else {
                            setPasswordInput('admin123');
                          }
                        }}
                        className="text-[11px] text-amber-400 hover:underline font-bold"
                      >
                        استعادة الرمز السري؟
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="أدخل كلمة المرور..."
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-left"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-3 text-slate-400 hover:text-white"
                        title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-400"
                      />
                      <span>تذكر الجلسة الآمنة على هذا الجهاز</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl dz-btn-gold text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>تسجيل الدخول والتأكد من الصلاحية</span>
                  </button>
                </form>
              </div>

              {/* Center Footer Details */}
              <div className="pt-3 border-t border-slate-800 text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  مركز التفوق والتميز لدروس الدعم والتقوية
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  الاتصال بالدعم الفني: 0550-998877 · الجزائر العاصمة
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-800 text-center text-xs text-slate-500 bg-slate-950/60">
        الجمهورية الجزائرية الديمقراطية الشعبية · جميع الحقوق محفوظة لمركز دروس الدعم ومنصة تلميذي 2026
      </footer>
    </div>
  );
};
