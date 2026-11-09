import React, { useState } from 'react';
import { FontSettings, ArabicFontFamily, FontScale, FontWeightPreference, DEFAULT_FONT_SETTINGS } from '../types';
import { 
  Type, 
  X, 
  Check, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Eye, 
  Sliders, 
  Award,
  Crown
} from 'lucide-react';

interface FontCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fontSettings: FontSettings;
  onSave: (settings: FontSettings) => void;
}

interface FontOption {
  id: ArabicFontFamily;
  name: string;
  englishName: string;
  tag: string;
  category: string;
  sampleText: string;
  cssFamily: string;
  description: string;
}

const ARABIC_FONTS: FontOption[] = [
  {
    id: 'Cairo',
    name: 'خط القاهرة',
    englishName: 'Cairo',
    tag: 'النموذج القياسي المعتمد',
    category: 'عصري وواضح',
    sampleText: 'الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية',
    cssFamily: "'Cairo', sans-serif",
    description: 'خط هندسي عربي فائق الوضوح، ممتاز لواجهات الامتحانات والبيانات والجداول.',
  },
  {
    id: 'Readex Pro',
    name: 'خط ريدكس برو',
    englishName: 'Readex Pro',
    tag: 'موصى به للكويزات الرقمية',
    category: 'رقمي حديث',
    sampleText: 'شهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC)',
    cssFamily: "'Readex Pro', sans-serif",
    description: 'تصميم مطور مريح للعين على الشاشات، ذو تباعد متقن وسهولة قراءة فورية.',
  },
  {
    id: 'Amiri',
    name: 'خط الأميري الملكي',
    englishName: 'Amiri',
    tag: 'طابع وزاري ملكي فاخر',
    category: 'نسخ تقليدي راقٍ',
    sampleText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ — العلم يبني بيوتاً لا عماد لها',
    cssFamily: "'Amiri', serif",
    description: 'خط نسخي عربي أصيل مستلهم من مطبعة بولاق التاريخية، يعطي طابعاً رسمياً مهيباً.',
  },
  {
    id: 'Tajawal',
    name: 'خط تجوال',
    englishName: 'Tajawal',
    tag: 'رسمي ومؤسساتي متوازن',
    category: 'مؤسساتي أنيق',
    sampleText: 'النقابة الوطنية لعمال التربية (SNTE) — المدرسة العمومية تكافؤ فرص',
    cssFamily: "'Tajawal', sans-serif",
    description: 'حروف رصينة ذات طابع بيداغوجي هادئ وتناسق بصري متميز في العناوين والنصوص.',
  },
  {
    id: 'Almarai',
    name: 'خط المراعي',
    englishName: 'Almarai',
    tag: 'انسيابي ومريح للمطالعة',
    category: 'انسيابي حديث',
    sampleText: 'دفتر النقط، رصد الحضور الفوري، وبنك الامتحانات onec.edu.dz',
    cssFamily: "'Almarai', sans-serif",
    description: 'خط معاصر ذو نسب هندسية متوازنة يجعل قراءة الفروض والأسئلة الطويلة سلسة للغاية.',
  },
  {
    id: 'Alexandria',
    name: 'خط الإسكندرية المغاربي',
    englishName: 'Alexandria',
    tag: 'لمسة هندسية معاصرة',
    category: 'معاصر هندسي',
    sampleText: 'التقويم البيداغوجي ورزنامة الاختبارات الفصلية 2025 / 2026',
    cssFamily: "'Alexandria', sans-serif",
    description: 'مزيج فريد من الحداثة والأصالة المغاربية، يضفي مظهراً راقياً ومميزاً على المنصة.',
  },
];

export const FontCustomizerModal: React.FC<FontCustomizerModalProps> = ({
  isOpen,
  onClose,
  fontSettings,
  onSave,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<ArabicFontFamily>(fontSettings.family);
  const [selectedScale, setSelectedScale] = useState<FontScale>(fontSettings.scale);
  const [selectedWeight, setSelectedWeight] = useState<FontWeightPreference>(fontSettings.weight);

  if (!isOpen) return null;

  const currentOption = ARABIC_FONTS.find((f) => f.id === selectedFamily) || ARABIC_FONTS[0];

  const handleSave = () => {
    onSave({
      family: selectedFamily,
      scale: selectedScale,
      weight: selectedWeight,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedFamily(DEFAULT_FONT_SETTINGS.family);
    setSelectedScale(DEFAULT_FONT_SETTINGS.scale);
    setSelectedWeight(DEFAULT_FONT_SETTINGS.weight);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-amber-400/50 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header: Algerian Emerald, Crimson Red & Royal Gold */}
        <div className="dz-royal-header p-5 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          {/* Subtle gold watermark */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
            <Crown className="w-24 h-24 text-amber-300" />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-slate-900 flex items-center justify-center font-black shadow-md border border-amber-200">
              <Type className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  تعديل نموذج الخط الاحترافي
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/30 text-amber-200 border border-amber-300/40">
                  نسق ملكي
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                اختر خط المنظومة التربوية الجزائرية المناسب للقراءة والامتحانات الرسمية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* National Ribbon Stripe */}
        <div className="dz-national-ribbon shrink-0"></div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Font Selection Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  نماذج الخطوط العربية المعتمدة
                </h4>
              </div>
              <span className="text-[11px] text-slate-500">
                انقر على أي خط لتجربته وتحديده
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ARABIC_FONTS.map((font) => {
                const isSelected = selectedFamily === font.id;
                return (
                  <div
                    key={font.id}
                    onClick={() => setSelectedFamily(font.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative text-right flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50/60 to-emerald-50/40 shadow-md ring-2 ring-amber-400/30'
                        : 'border-slate-200 bg-white hover:border-emerald-500/50 hover:bg-slate-50/80 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-slate-900">
                            {font.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-sans font-semibold">
                            ({font.englishName})
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isSelected 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {font.tag}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mb-2">
                        {font.description}
                      </p>
                    </div>

                    {/* Live Sample of font */}
                    <div 
                      className="p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 text-xs text-center font-bold truncate mt-1"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.sampleText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Scale and Weight Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Scale Control */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                  <span>حجم الخط البيداغوجي (Scale)</span>
                </span>
                <span className="text-[11px] text-emerald-800 font-bold font-mono">
                  {selectedScale === 'normal' ? '100%' : selectedScale === 'comfortable' ? '106%' : '112%'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setSelectedScale('normal')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedScale === 'normal'
                      ? 'bg-emerald-700 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  عادي
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScale('comfortable')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedScale === 'comfortable'
                      ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  مريح (+6%)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedScale('large')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedScale === 'large'
                      ? 'bg-red-700 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  مكبر (+12%)
                </button>
              </div>
            </div>

            {/* Weight Control */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-600" />
                  <span>سماكة ونبرة الحروف (Weight)</span>
                </span>
                <span className="text-[11px] text-amber-800 font-bold">
                  {selectedWeight === 'normal' ? 'عادي (500)' : selectedWeight === 'medium' ? 'متوسط (600)' : 'غليظ عريض (700)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setSelectedWeight('normal')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedWeight === 'normal'
                      ? 'bg-emerald-700 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  عادي
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWeight('medium')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedWeight === 'medium'
                      ? 'bg-amber-600 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  متوسط
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWeight('bold')}
                  className={`py-1.5 rounded-lg transition-all ${
                    selectedWeight === 'bold'
                      ? 'bg-red-700 text-white shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  عريض
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Live Pedagogical Preview Box */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-amber-400/60 bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-800">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" />
                <span>معاينة حية فورية للخط المختار ({currentOption.name})</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                {currentOption.englishName}
              </span>
            </div>

            <div 
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-right transition-all"
              style={{
                fontFamily: currentOption.cssFamily,
                fontWeight: selectedWeight === 'normal' ? 500 : selectedWeight === 'medium' ? 600 : 700,
                fontSize: selectedScale === 'normal' ? '1rem' : selectedScale === 'comfortable' ? '1.06rem' : '1.12rem',
              }}
            >
              <div className="text-emerald-800 font-black text-base border-b border-slate-100 pb-1.5 flex items-center justify-between">
                <span>الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</span>
                <span className="text-xs text-red-600 font-extrabold">دورة 2026</span>
              </div>
              <p className="text-slate-800 leading-relaxed font-semibold">
                امتحان شهادة التعليم المتوسط (BEM) وبنك امتحانات onec.edu.dz:
                «التفوق ثمرة الانضباط المستمر، والمدرسة العمومية تكافؤ فرص للجميع برعاية النقابة الوطنية لعمال التربية (SNTE)».
              </p>
              <div className="text-xs text-slate-500 pt-1 flex items-center gap-4">
                <span className="text-amber-700 font-bold">● تصحيح بيداغوجي آلي وسريع</span>
                <span>● تقويم فصلي ومتابعة يومية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>استعادة النموذج القياسي (Cairo)</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl dz-btn-gold text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>تطبيق وحفظ الخط المختار</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
