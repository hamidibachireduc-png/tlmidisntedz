import React, { useState } from 'react';
import { DzExamResource, Subject, UserRole } from '../types';
import { PdfExamModal } from './PdfExamModal';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ExternalLink, 
  School, 
  Eye, 
  Layers, 
  Check, 
  Share2,
  BookmarkCheck,
  TrendingUp,
  FileCheck2,
  FolderOpen,
  Award
} from 'lucide-react';

interface DzExamsHubProps {
  exams: DzExamResource[];
  onConvertToQuiz: (exam: DzExamResource) => void;
  userRole: UserRole;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const DzExamsHub: React.FC<DzExamsHubProps> = ({
  exams,
  onConvertToQuiz,
  userRole,
  searchQuery = '',
  onSearchChange,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);
  const [previewingExam, setPreviewingExam] = useState<DzExamResource | null>(null);

  // Filter logic
  const filteredExams = exams.filter((exam) => {
    // Level filter
    const matchLevel = 
      selectedLevelFilter === 'all' || 
      (selectedLevelFilter === 'bem' && (exam.level.includes('BEM') || exam.level.includes('الرابعة متوسط') || exam.term.includes('BEM'))) ||
      (selectedLevelFilter === 'bac' && (exam.level.includes('BAC') || exam.level.includes('ثانوي') || exam.term.includes('BAC'))) ||
      (selectedLevelFilter === 'primary' && (exam.level.includes('الابتدائي') || exam.level.includes('تقييم المكتسبات')));

    // Subject filter
    const matchSubject = selectedSubjectFilter === 'all' || exam.subject === selectedSubjectFilter;

    // Term filter
    const matchTerm = selectedTermFilter === 'all' || exam.term.includes(selectedTermFilter);

    // Search query
    const effectiveSearch = searchQuery || localSearch;
    const matchSearch = 
      !effectiveSearch.trim() ||
      exam.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      exam.subject.includes(effectiveSearch) ||
      exam.institution.includes(effectiveSearch) ||
      exam.year.includes(effectiveSearch);

    return matchLevel && matchSubject && matchTerm && matchSearch;
  });

  const subjectsList: Subject[] = [
    'الرياضيات',
    'العلوم الفيزيائية والتكنولوجيا',
    'علوم الطبيعة والحياة',
    'اللغة العربية',
    'التاريخ والجغرافيا',
    'التربية الإسلامية',
    'التربية المدنية',
    'اللغة الفرنسية',
    'اللغة الإنجليزية',
    'الفلسفة'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner like onec.edu.dz in Royal Algerian Palette with Crystal-Clear Contrast */}
      <div 
        className="dz-royal-banner p-6 sm:p-7 text-white relative overflow-hidden shadow-2xl rounded-3xl"
        style={{ 
          backgroundColor: '#033224',
          backgroundImage: 'linear-gradient(135deg, #02261a 0%, #064e3b 45%, #008751 75%, #78350f 100%)',
          color: '#ffffff'
        }}
      >
        <div className="dz-national-ribbon absolute top-0 left-0 right-0"></div>
        <div className="relative z-10 max-w-3xl space-y-3.5 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-black/60 text-amber-300 font-black text-[11px] border border-amber-400 shadow-md">
              الجمهورية الجزائرية الديمقراطية الشعبية
            </span>
            <span className="text-amber-400 font-bold">●</span>
            <span className="text-white font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/80 shadow-xs">
              وزارة التربية الوطنية · الديوان الوطني للامتحانات والمسابقات
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            بنك الفروض والامتحانات المدرسية الرسمية المعتمدة في الجزائر
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl font-bold drop-shadow-sm">
            مكتبة متكاملة لمواضيع وحوليات شهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC) والفروض المحروسة الفصلية مع عناصر الإجابة الرسمية وسلم التنقيط الوزاري، مع إمكانية التحويل المباشر إلى كويز تفاعلي فوري.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-black text-amber-200">
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span className="text-white">مواضيع وفروض محروسة PDF</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="text-white">تصحيح نموذجي وزاري معتمد</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300">تحويل فوري إلى كويز آلي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Educational Cycles Quick Tabs (الطور الابتدائي · المتوسط BEM · الثانوي BAC) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setSelectedLevelFilter('all')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center ${
            selectedLevelFilter === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          جميع الأطوار والمستويات ({exams.length})
        </button>

        <button
          onClick={() => setSelectedLevelFilter('bem')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            selectedLevelFilter === 'bem'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>الطور المتوسط (شهادة BEM)</span>
        </button>

        <button
          onClick={() => setSelectedLevelFilter('bac')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            selectedLevelFilter === 'bac'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>الطور الثانوي (شهادة البكالوريا BAC)</span>
        </button>

        <button
          onClick={() => setSelectedLevelFilter('primary')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
            selectedLevelFilter === 'primary'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الطور الابتدائي (تقييم المكتسبات)</span>
        </button>
      </div>

      {/* Search and Multi-Criteria Filtering Bar */}
      <div className="dz-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery || localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            placeholder="ابحث بالعنوان، المادة أو المؤسسة..."
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>

        {/* Dropdowns: Subject & Trimester */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="all">جميع المواد التعليمية</option>
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {/* Trimester Filter */}
          <select
            value={selectedTermFilter}
            onChange={(e) => setSelectedTermFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
          >
            <option value="all">جميع الفصول والامتحانات</option>
            <option value="الفصل الأول">فروض واختبارات الفصل الأول</option>
            <option value="الفصل الثاني">فروض واختبارات الفصل الثاني</option>
            <option value="الفصل الثالث">فروض واختبارات الفصل الثالث</option>
            <option value="BEM">شهادة التعليم المتوسط الرسمية</option>
            <option value="BAC">شهادة البكالوريا الرسمية</option>
            <option value="تجريبي">امتحانات بيضاء وتجريبية</option>
          </select>

          <span className="text-xs text-slate-500 font-bold">
            النتائج: <strong className="text-emerald-700">{filteredExams.length}</strong> موضوع
          </span>
        </div>
      </div>

      {/* Exams Grid View matching onec.edu.dz */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div 
            key={exam.id}
            className="dz-card p-5 bg-white flex flex-col justify-between hover:border-emerald-600 transition-all border border-slate-200 shadow-2xs"
          >
            <div className="space-y-3">
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  exam.term.includes('BEM') 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : exam.term.includes('BAC')
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {exam.term}
                </span>

                <span className="text-xs font-mono font-bold text-slate-600">
                  دورة {exam.year}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
                {exam.title}
              </h3>

              {/* Metadata */}
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>المادة: {exam.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{exam.level}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  <School className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{exam.institution}</span>
                </div>
              </div>

              {/* Verified badge */}
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
                <span>حجم الملف: <strong>{exam.fileSizeBytes}</strong></span>
                <span className="text-emerald-700 font-bold">✓ مع التصحيح الوزاري</span>
                <span>التحميلات: <strong>{exam.downloadsCount}</strong></span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
              {/* Primary action: Preview in Algerian PDF Modal */}
              <button
                onClick={() => setPreviewingExam(exam)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>معاينة وقراءة موضوع الامتحان (PDF)</span>
              </button>

              {/* Secondary actions: Direct Downloads from onec.edu.dz & Convert to Quiz */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={exam.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dz-btn-pdf py-1.5 px-2 text-xs text-center flex items-center justify-center gap-1"
                  title="تحميل موضوع الامتحان الأصلي بصيغة PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الموضوع</span>
                </a>

                <a
                  href={exam.solutionUrl || exam.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dz-btn-solution py-1.5 px-2 text-xs text-center flex items-center justify-center gap-1"
                  title="تحميل الحل النموذجي وسلم التنقيط"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تحميل الحل</span>
                </a>
              </div>

              {/* Convert to interactive quiz with Royal Gold button */}
              <button
                onClick={() => onConvertToQuiz(exam)}
                className="w-full py-2 px-3 rounded-xl dz-btn-gold text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-950" />
                <span>تحويل الموضوع إلى Quiz تفاعلي آلي</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h4 className="font-extrabold text-base text-slate-800">
            لا توجد مواضيع مطابقة للبحث الحالي
          </h4>
          <p className="text-xs">
            يرجى تجربة اختيار مادة أخرى أو مسح نص البحث لعرض جميع مواضيع بنك الامتحانات الوطنية المعتمدة.
          </p>
          <button
            onClick={() => {
              setSelectedLevelFilter('all');
              setSelectedSubjectFilter('all');
              setSelectedTermFilter('all');
              setLocalSearch('');
              if (onSearchChange) onSearchChange('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

      {/* PDF Exam Modal */}
      <PdfExamModal
        exam={previewingExam}
        onClose={() => setPreviewingExam(null)}
        onConvertToQuiz={onConvertToQuiz}
      />
    </div>
  );
};
