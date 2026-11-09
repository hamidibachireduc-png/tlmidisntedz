import React, { useState } from 'react';
import { DzExamResource } from '../types';
import { 
  X, 
  Download, 
  ExternalLink, 
  Printer, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Award,
  Zap,
  BookOpen,
  School
} from 'lucide-react';

interface PdfExamModalProps {
  exam: DzExamResource | null;
  onClose: () => void;
  onConvertToQuiz: (exam: DzExamResource) => void;
}

export const PdfExamModal: React.FC<PdfExamModalProps> = ({
  exam,
  onClose,
  onConvertToQuiz,
}) => {
  const [activeView, setActiveView] = useState<'paper' | 'solution'>('paper');

  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  وثيقة PDF رسمية · الديوان الوطني (ONEC)
                </span>
                <span className="text-xs text-slate-500 font-semibold">{exam.term}</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-md sm:max-w-xl">
                {exam.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Subject Paper vs Model Answer */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-100 border-b border-slate-200 shrink-0 text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('paper')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeView === 'paper'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📄 موضوع الامتحان (PDF)
            </button>
            <button
              onClick={() => setActiveView('solution')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeView === 'solution'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✓ التصحيح النموذجي وسلم التنقيط
            </button>
          </div>

          {/* Action CTAs in Royal Algerian palette */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onConvertToQuiz(exam);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg dz-btn-gold text-slate-950 font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-950" />
              <span>تحويل إلى كويز تفاعلي</span>
            </button>

            <a
              href={activeView === 'paper' ? exam.downloadUrl : (exam.solutionUrl || exam.downloadUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black transition-all shadow-xs flex items-center gap-1.5 border border-emerald-600"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل PDF الأصلي</span>
            </a>
          </div>
        </div>

        {/* Realistic Algerian Examination Sheet Content (A4 style) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-200/60 font-serif">
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 shadow-md border border-slate-300 rounded-sm space-y-6 text-slate-900 min-h-[750px]">
            
            {/* Algerian Official Exam Header */}
            <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
              <h4 className="text-xs font-bold text-slate-700">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </h4>
              <h5 className="text-xs font-bold text-slate-800">
                وزارة التربية الوطنية · بنك امتحانات onec.edu.dz
              </h5>
              
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-300 mt-2">
                <div>
                  <span>المستوى: <strong>{exam.level}</strong></span>
                </div>
                <div>
                  <span>دورة: <strong>{exam.year}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-1">
                <div>
                  <span>اختبار مادة: <strong className="text-emerald-800 text-sm">{exam.subject}</strong></span>
                </div>
                <div>
                  <span>المدة: <strong>ساعتان</strong></span>
                  <span className="mx-2">·</span>
                  <span>المعامل: <strong>4</strong></span>
                </div>
              </div>
            </div>

            {/* Content Body: Paper or Solution */}
            {activeView === 'paper' ? (
              <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-800">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-center font-bold text-xs text-slate-600">
                  ⚠️ اختبار رسمي مقتبس من بنك مواضيع الجزائر المعتمد onec.edu.dz - يحتوي الموضوع على صفحة واحدة
                </div>

                {/* Part 1: Exercises (12 Pts) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <h6 className="font-bold text-slate-900">
                      الجزء الأول (12 نقطة)
                    </h6>
                    <span className="text-xs text-slate-500 font-sans">تمارين تطبيقية</span>
                  </div>

                  {exam.sampleQuestions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="font-sans text-emerald-800">
                          التمرين {qIdx + 1} ({q.points} نقاط):
                        </span>
                        {q.sourceExamInfo && (
                          <span className="text-slate-500 font-sans">{q.sourceExamInfo}</span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900 leading-relaxed">
                        {q.questionText}
                      </p>
                      
                      {/* Options preview */}
                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-sans">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx} className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 font-bold flex items-center justify-center text-slate-700">
                              {['أ', 'ب', 'ج', 'د'][optIdx]}
                            </span>
                            <span className="text-slate-800">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Part 2: Integration Situation (8 Pts) */}
                <div className="space-y-3 pt-4 border-t border-slate-300">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                    <h6 className="font-bold text-slate-900">
                      الجزء الثاني: الوضعية الإدماجية المركبة (08 نقاط)
                    </h6>
                    <span className="text-xs text-slate-500 font-sans">شبكة معايير التقويم</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    السياق: في إطار التحضير لشهادة التعليم المتوسط، يُطلب من المترشح توظيف مكتسباته البيداغوجية في مادة {exam.subject} لحل وضعية دالة تحاكي الواقع وتعتمد على معايير: الوجاهة، الاستعمال السليم لأدوات المادة، الانسجام، ودقة الصياغة والإتقان.
                  </p>
                </div>
              </div>
            ) : (
              /* Solution & Marking Scheme */
              <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-800">
                <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-center font-bold text-xs text-emerald-800">
                  ✓ عناصر الإجابة الرسمية وشبكة التقويم وسلّم التنقيط الوزاري (onec.edu.dz)
                </div>

                <div className="space-y-4">
                  {exam.sampleQuestions.map((q, qIdx) => (
                    <div key={q.id} className="p-4 rounded border border-emerald-200 bg-emerald-50/30 space-y-2">
                      <div className="flex items-center justify-between font-bold text-xs font-sans">
                        <span className="text-emerald-800">
                          حل التمرين {qIdx + 1} (العلامة: {q.points} / {q.points}):
                        </span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          الإجابة الصحيحة: {['أ', 'ب', 'ج', 'د'][q.correctOptionIndex]} ({q.options[q.correctOptionIndex]})
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded border border-emerald-100 text-xs text-slate-800 leading-relaxed font-sans">
                        <strong className="text-emerald-900 block mb-1">
                          طريقة الحل والتعليل المنهجي:
                        </strong>
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Footer */}
            <div className="border-t border-slate-300 pt-3 text-center text-[11px] text-slate-500 font-sans">
              صفحة 1 من 1 · بنك امتحانات وفروض الجزائر المعتمد onec.edu.dz
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-500 font-semibold">
            حجم الملف: <strong className="text-slate-800">{exam.fileSizeBytes}</strong> · التحميلات: <strong className="text-emerald-700">{exam.downloadsCount}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
