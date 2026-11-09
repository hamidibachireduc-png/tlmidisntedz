import React, { useState } from 'react';
import { SchoolSettings } from '../types';
import { 
  School, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  ShieldCheck, 
  Award,
  Sparkles
} from 'lucide-react';

interface SchoolSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  onSave: (newSettings: SchoolSettings) => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [republicHeading, setRepublicHeading] = useState(settings.republicHeading || 'الجمهورية الجزائرية الديمقراطية الشعبية');
  const [ministryHeading, setMinistryHeading] = useState(settings.ministryHeading || 'وزارة التربية الوطنية');
  const [regionalDirectorate, setRegionalDirectorate] = useState(settings.regionalDirectorate || 'مديرية التربية لولاية الجزائر (وسط)');
  const [schoolType, setSchoolType] = useState(settings.schoolType);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [motto, setMotto] = useState(settings.motto);

  if (!isOpen) return null;

  const PRESET_LOGOS = [
    {
      name: 'الشعار الوطني والتربوي الرسمي المعتمد',
      url: '/src/assets/images/school_crest_emblem_1794132676249.jpg',
    },
    {
      name: 'شعار المتوسطات والثانويات النموذجية',
      url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'شعار مجمع مدارس التميز والابتكار',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      schoolName,
      republicHeading,
      ministryHeading,
      regionalDirectorate,
      schoolType,
      logoUrl,
      motto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-500/30 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 via-emerald-800 to-amber-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <School className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                إعدادات هوية المؤسسة التربوية واللوغو الرسمي
              </h3>
              <p className="text-xs text-slate-500">
                وفق معايير وزارة التربية الوطنية (يظهر في كشف النقاط، الترويسة، والمراسلات)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 py-4">
          {/* Logo preview & Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              لوغو وشعار المؤسسة التعليمية
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 bg-white p-1 shrink-0 shadow-sm flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="شعار المؤسسة"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-2 flex-1 text-xs">
                <span className="font-bold text-slate-800 block">
                  الشعار المعتمد حالياً في الترويسة وكشوف النقاط
                </span>
                <p className="text-[11px] text-slate-500">
                  يمكنك رفع صورة من جهازك (PNG أو JPG) أو اختيار أحد الشعارات المعتمدة:
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="cursor-pointer px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>رفع شعار من جهازك</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setLogoUrl('/src/assets/images/school_crest_emblem_1794132676249.jpg')}
                    className="px-2.5 py-1.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 font-semibold rounded-lg text-xs transition-colors"
                  >
                    الشعار الذهبي الملكي
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* School Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المؤسسة التعليمية
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="مثال: متوسطة الشهيد العربي بن مهيدي"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الطور التعليمي للمؤسسة
              </label>
              <select
                value={schoolType}
                onChange={(e) => setSchoolType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-semibold text-slate-800"
              >
                <option value="متوسطة">متوسطة (الطور المتوسط - تحضير BEM)</option>
                <option value="ثانوية">ثانوية (الطور الثانوي - تحضير البكالوريا BAC)</option>
                <option value="مدرسة ابتدائية">مدرسة ابتدائية (الطور الابتدائي - تقييم المكتسبات)</option>
                <option value="مجمع مدرسي">مجمع مدرسي متكامل</option>
              </select>
            </div>
          </div>

          {/* Institutional Heading: Republic & Ministry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الجمهورية (الترويسة الرسمية)
              </label>
              <input
                type="text"
                required
                value={republicHeading}
                onChange={(e) => setRepublicHeading(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الوزارة الوصية
              </label>
              <input
                type="text"
                required
                value={ministryHeading}
                onChange={(e) => setMinistryHeading(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Regional Directorate */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              مديرية التربية للولاية
            </label>
            <input
              type="text"
              required
              value={regionalDirectorate}
              onChange={(e) => setRegionalDirectorate(e.target.value)}
              placeholder="مثال: مديرية التربية لولاية الجزائر (وسط) / وهران / سطيف / قسنطينة"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              شعار المؤسسة أو الحكمة التربوية
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="مثال: العلم · الأخلاق · التميز البيداغوجي"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              يتم حفظ التغييرات محلياً وتظهر تلقائياً في ترويسة التطبيق، كشف النقاط الرسمي المطابق للأرضية الرقمية، والوثائق الإدارية المطبوعة.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>تطبيق وحفظ الإعدادات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
