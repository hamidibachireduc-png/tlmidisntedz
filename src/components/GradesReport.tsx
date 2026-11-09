import React, { useState } from 'react';
import { GradeEntry, Student, Subject, UserRole, SchoolSettings } from '../types';
import { 
  Award, 
  TrendingUp, 
  Plus, 
  FileCheck, 
  CheckCircle, 
  Printer, 
  Sparkles, 
  BarChart3, 
  Calendar, 
  School,
  LineChart as LineChartIcon,
  CheckCircle2,
  ArrowUpRight,
  Target,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface GradesReportProps {
  grades: GradeEntry[];
  students: Student[];
  onAddGrade: (grade: GradeEntry) => void;
  userRole: UserRole;
  schoolSettings: SchoolSettings;
  onOpenSchoolSettings?: () => void;
}

export const GradesReport: React.FC<GradesReportProps> = ({
  grades,
  students,
  onAddGrade,
  userRole,
  schoolSettings,
  onOpenSchoolSettings,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'std-1');
  const [modalOpen, setModalOpen] = useState(false);
  const [printPreview, setPrintPreview] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<'الفصل الأول' | 'الفصل الثاني' | 'الفصل الثالث'>('الفصل الأول');

  // New grade form according to Algerian reforms
  const [subject, setSubject] = useState<Subject>('الرياضيات');
  const [evaluationName, setEvaluationName] = useState('الفرض المحروس والاختبار الفصلي');
  const [assessmentScore, setAssessmentScore] = useState<string>('18.0');
  const [testScore, setTestScore] = useState<string>('17.5');
  const [examScore, setExamScore] = useState<string>('17.0');
  const [coefficient, setCoefficient] = useState<string>('4');
  const [teacherComment, setTeacherComment] = useState('');

  const fallbackStudent: Student = {
    id: 'default',
    name: 'تلميذ الفوج',
    registrationNumber: '2026000000',
    classRoom: 'السنة الرابعة متوسط 4م2',
    guardianName: 'ولي الأمر',
    guardianPhone: '0550-000000',
    attendanceStats: { present: 0, absent: 0, late: 0, excused: 0 },
    currentAverage: 15.0,
  };

  const currentStudent = students.find((s) => s.id === selectedStudentId) || (students.length > 0 ? students[0] : fallbackStudent);
  const studentGrades = grades.filter((g) => g.studentId === currentStudent?.id);

  const [chartMode, setChartMode] = useState<'timeline' | 'subject'>('timeline');

  // Calculate weighted average in Algerian standard:
  // sum(subject_average * coefficient) / sum(coefficients)
  const totalCoeff = studentGrades.reduce((sum, g) => sum + g.coefficient, 0);
  const totalScore = studentGrades.reduce((sum, g) => sum + (g.score * g.coefficient), 0);
  const calculatedAverage = totalCoeff > 0 ? (totalScore / totalCoeff).toFixed(2) : '0.00';

  // Process timeline evolution data for recharts
  const sortedGrades = [...studentGrades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let runningSum = 0;
  let runningWeight = 0;

  const timelineChartData = sortedGrades.map((g, idx) => {
    runningSum += g.score * g.coefficient;
    runningWeight += g.coefficient;
    const runningAvg = parseFloat((runningSum / runningWeight).toFixed(2));

    const dateParts = g.date.split('-');
    const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : g.date;

    return {
      index: idx + 1,
      date: g.date,
      displayDate: formattedDate,
      name: `${g.subject} (${formattedDate})`,
      shortName: g.subject.length > 10 ? g.subject.slice(0, 8) + '...' : g.subject,
      evaluation: g.evaluationName,
      subject: g.subject,
      score: g.score,
      cumulativeAverage: runningAvg,
      coeff: g.coefficient,
      teacherComment: g.teacherComment,
    };
  });

  // Process subject-by-subject comparison data
  const subjectMap = new Map<string, { totalScore: number; count: number; coeff: number }>();
  studentGrades.forEach((g) => {
    const cur = subjectMap.get(g.subject) || { totalScore: 0, count: 0, coeff: g.coefficient };
    subjectMap.set(g.subject, {
      totalScore: cur.totalScore + g.score,
      count: cur.count + 1,
      coeff: Math.max(cur.coeff, g.coefficient),
    });
  });

  const subjectChartData = Array.from(subjectMap.entries()).map(([subj, data]) => ({
    subject: subj,
    shortSubject: subj.length > 12 ? subj.slice(0, 10) + '..' : subj,
    average: parseFloat((data.totalScore / data.count).toFixed(2)),
    evaluationsCount: data.count,
  }));

  // Statistics
  const highestScore = studentGrades.length > 0 ? Math.max(...studentGrades.map((g) => g.score)) : 0;
  const lowestScore = studentGrades.length > 0 ? Math.min(...studentGrades.map((g) => g.score)) : 0;
  const firstScore = timelineChartData[0]?.score || 0;
  const lastScore = timelineChartData[timelineChartData.length - 1]?.score || 0;
  const scoreTrend = (lastScore - firstScore).toFixed(1);

  // Algerian Official Appreciations (تقديرات المنظومة التربوية الرسمية ومجالس الأقسام):
  const getAppreciation = (avg: number) => {
    if (avg >= 18) return { text: 'ممتاز · تهنئة مجلس القسم ولوحة الشرف', color: 'text-emerald-700 bg-emerald-50' };
    if (avg >= 16) return { text: 'جيد جداً · لوحة الشرف والامتياز', color: 'text-emerald-800 bg-emerald-50' };
    if (avg >= 14) return { text: 'جيد · تشجيع مجلس القسم', color: 'text-blue-700 bg-blue-50' };
    if (avg >= 12) return { text: 'قريب من الجيد · لوحة شرف', color: 'text-teal-700 bg-teal-50' };
    if (avg >= 10) return { text: 'مقبول · مواصلة الجهد والاستمرار', color: 'text-amber-700 bg-amber-50' };
    return { text: 'دون المعدل · يستوجب استدراك ودعم بيداغوجي مكثف', color: 'text-rose-700 bg-rose-50' };
  };

  const appreciation = getAppreciation(parseFloat(calculatedAverage));

  const handleAddGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluationName) return;

    const pAssess = parseFloat(assessmentScore) || 0;
    const pTest = parseFloat(testScore) || 0;
    const pExam = parseFloat(examScore) || 0;
    
    // Official Algerian Middle & High School formula: (تقويم + فرض + اختبار*2) / 4
    const computedScore = parseFloat(((pAssess + pTest + (pExam * 2)) / 4).toFixed(2));

    const newGrade: GradeEntry = {
      id: `grd-${Date.now()}`,
      studentId: selectedStudentId,
      studentName: currentStudent.name,
      subject,
      evaluationName,
      term: currentTerm,
      assessmentScore: pAssess,
      testScore: pTest,
      examScore: pExam,
      score: computedScore,
      coefficient: parseInt(coefficient, 10) || 1,
      date: new Date().toISOString().split('T')[0],
      teacherComment: teacherComment || 'نتائج ممتازة مع متمنياتنا بمزيد من التفوق والنجاح في شهادة BEM.',
    };

    onAddGrade(newGrade);
    setModalOpen(false);
    setTeacherComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">دفتر النقط والمعدلات والتقويم البيداغوجي</h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              النظام التربوي الجزائري (إصلاحات 2026)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            احتساب المعدلات الفصلية وفق صيغة وزارة التربية الوطنية: (التقويم المستمر + الفرض + الاختبار × 2) ÷ 4 والمطابقة مع الأرضية الرقمية
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Select Student (for Teacher) */}
          {userRole === 'teacher' && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500">التلميذ:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-transparent border-0 focus:outline-hidden text-slate-800 font-semibold"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.classRoom})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setPrintPreview(!printPreview)}
            className="px-3.5 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-red-700" />
            <span>{printPreview ? 'العودة لدفتر النقط' : 'معاينة كشف النقاط الرسمي (الأرضية الرقمية)'}</span>
          </button>

          {userRole === 'teacher' && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تقويم / نقطة مادة</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Card & Average */}
      <div className="bg-gradient-to-l from-emerald-900 via-slate-900 to-red-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-500/30">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-red-900/80 px-2.5 py-0.5 rounded-md border border-amber-400/40">
              كشف نقاط {currentTerm} (الموسم 2025 / 2026)
            </span>
            <span className="text-xs text-slate-300">
              رقم التعريف الوطني (R.N.E): <strong className="font-mono text-white">{currentStudent?.registrationNumber}</strong>
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">
            {currentStudent?.name}
          </h3>

          <p className="text-xs text-emerald-100/90 flex items-center gap-2">
            <span>القسم: {currentStudent?.classRoom}</span>
            <span>·</span>
            <span>المؤسسة: {schoolSettings.schoolName}</span>
            <span>·</span>
            <span>ولي الأمر: {currentStudent?.guardianName}</span>
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
          <div className="text-center">
            <span className="text-[11px] text-emerald-200 block uppercase tracking-wider font-semibold">
              المعدل الفصلي العام
            </span>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-white mt-0.5">
              {calculatedAverage}
              <span className="text-base font-normal text-emerald-200">/20</span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/20"></div>

          <div>
            <span className="text-[11px] text-emerald-200 block font-semibold">
              قرار وملاحظة مجلس القسم
            </span>
            <span className="text-xs font-bold text-amber-300 block mt-1">
              {appreciation.text}
            </span>
          </div>
        </div>
      </div>

      {/* Grades Table or Printable Preview */}
      {printPreview ? (
        <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-sm space-y-6 printable-report">
          {/* Official Algerian Ministry Bulletin Header */}
          <div className="border-b-2 border-emerald-800 pb-5">
            <div className="flex items-center justify-between gap-4">
              {/* Right: Republic & Ministry Hierarchy */}
              <div className="text-right space-y-0.5 text-xs">
                <h4 className="font-extrabold text-red-800 text-sm">
                  {schoolSettings.republicHeading || 'الجمهورية الجزائرية الديمقراطية الشعبية'}
                </h4>
                <p className="font-bold text-slate-800">
                  {schoolSettings.ministryHeading || 'وزارة التربية الوطنية'}
                </p>
                <p className="text-slate-600 font-semibold">
                  {schoolSettings.regionalDirectorate || 'مديرية التربية لولاية الجزائر (وسط)'}
                </p>
                <p className="font-bold text-emerald-800 text-sm">
                  {schoolSettings.schoolName} ({schoolSettings.schoolType})
                </p>
              </div>

              {/* Center: School & National Emblem */}
              <div className="text-center space-y-1">
                <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-400 bg-white p-1 shadow-2xs flex items-center justify-center">
                  <img
                    src={schoolSettings.logoUrl}
                    alt={schoolSettings.schoolName}
                    className="w-full h-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="inline-block px-3 py-0.5 bg-gradient-to-r from-emerald-800 via-amber-600 to-red-800 text-white text-[11px] font-extrabold rounded-full shadow-2xs">
                  كشف النقاط الرسمي للموسم الدراسي 2025 / 2026
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  كشف نقاط نتائج الفصل الأول
                </h3>
              </div>

              {/* Left: Metadata & Digital Authentication QR */}
              <div className="text-left text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-end gap-2">
                  <QrCode className="w-10 h-10 text-slate-800 p-0.5 border border-slate-300 rounded-md" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono">الأرضية الرقمية</p>
                    <p className="text-[10px] text-emerald-700 font-bold">مصادق إلكترونياً</p>
                  </div>
                </div>
                <p>تاريخ الاستخراج: <strong>08 نوفمبر 2026</strong></p>
                <p>رقم التعريف الوطني (R.N.E): <strong className="font-mono text-red-800">{currentStudent?.registrationNumber}</strong></p>
              </div>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div><span className="text-slate-500">اسم ولقب التلميذ:</span> <strong>{currentStudent?.name}</strong></div>
            <div><span className="text-slate-500">القسم والفوج:</span> <strong>{currentStudent?.classRoom}</strong></div>
            <div><span className="text-slate-500">رقم التعريف (R.N.E):</span> <strong className="font-mono">{currentStudent?.registrationNumber}</strong></div>
            <div><span className="text-slate-500">المعدل الفصلي العام:</span> <strong className="text-emerald-700 text-sm font-bold font-mono">{calculatedAverage} / 20</strong></div>
          </div>

          {/* Detailed Algerian Grades Matrix (تقويم مستمر + فرض محروس + اختبار فصلي + معدل المادة + معامل + المجموع) */}
          <table className="w-full text-right text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
              <tr>
                <th className="p-2.5">المادة التعليمية</th>
                <th className="p-2.5 text-center">التقويم المستمر /20</th>
                <th className="p-2.5 text-center">الفرض المحروس /20</th>
                <th className="p-2.5 text-center">الاختبار الفصلي /20</th>
                <th className="p-2.5 text-center bg-emerald-50 text-emerald-900 font-extrabold">معدل المادة /20</th>
                <th className="p-2.5 text-center">المعامل</th>
                <th className="p-2.5 text-center font-mono">الجداء</th>
                <th className="p-2.5">ملاحظات وتقديرات الأستاذ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {studentGrades.map((g) => {
                const assess = g.assessmentScore ?? (g.score >= 17 ? 18 : g.score >= 15 ? 16 : 14);
                const test = g.testScore ?? g.score;
                const exam = g.examScore ?? g.score;
                const product = (g.score * g.coefficient).toFixed(2);

                return (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{g.subject}</td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">{assess.toFixed(1)}</td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">{test.toFixed(1)}</td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-700">{exam.toFixed(1)}</td>
                    <td className="p-2.5 text-center font-bold font-mono tabular-nums text-emerald-900 bg-emerald-50/70 text-sm">
                      {g.score.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-800 font-bold">{g.coefficient}</td>
                    <td className="p-2.5 text-center font-mono tabular-nums text-slate-600">{product}</td>
                    <td className="p-2.5 text-slate-600 italic">{g.teacherComment || 'عمل مستحسن'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
              <tr>
                <td className="p-2.5 text-slate-900">المجموع العام:</td>
                <td colSpan={4} className="p-2.5 text-left text-slate-600 text-[11px]">
                  صيغة حساب المعدل: (التقويم + الفرض + 2×الاختبار) ÷ 4
                </td>
                <td className="p-2.5 text-center font-mono">{totalCoeff}</td>
                <td className="p-2.5 text-center font-mono text-emerald-800 font-extrabold">{totalScore.toFixed(2)}</td>
                <td className="p-2.5 text-emerald-800 font-extrabold">المعدل العام: {calculatedAverage} / 20</td>
              </tr>
            </tfoot>
          </table>

          {/* Decision and Signatures */}
          <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-amber-950">قرار مجلس القسم والتقدير العام:</span>
            <span className="font-extrabold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-md">
              {appreciation.text}
            </span>
          </div>

          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs text-slate-700 border-t border-slate-200">
            <div>
              <p className="font-bold">توقيع وملاحظة ولي الأمر</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
            <div>
              <p className="font-bold">توقيع الأستاذ الرئيسي</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
            <div>
              <p className="font-bold">تأشيرة وخاتم مدير المتوسطة</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Interactive Evolution Chart (Recharts) */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-red-700 text-white flex items-center justify-center shadow-2xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    الرسم البياني لتطور نقط ومعدل التلميذ بمرور الوقت
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  تتبع بياني تفاعلي لمسار التحصيل الدراسي عبر الفروض المحروسة والتقويم المستمر وفق النظام التربوي الجزائري
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                <button
                  onClick={() => setChartMode('timeline')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    chartMode === 'timeline'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LineChartIcon className="w-3.5 h-3.5" />
                  <span>تطور المعدل الزمني</span>
                </button>
                <button
                  onClick={() => setChartMode('subject')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    chartMode === 'subject'
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>المعدل حسب المواد</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80">
                <span className="text-[11px] text-emerald-800 font-bold block">أعلى معدل مادة محقق</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-emerald-900 font-mono tabular-nums">{highestScore}</span>
                  <span className="text-xs text-emerald-700">/20</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200/80">
                <span className="text-[11px] text-red-800 font-bold block">أدنى نقطة مسجلة</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-red-900 font-mono tabular-nums">{lowestScore}</span>
                  <span className="text-xs text-red-700">/20</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80">
                <span className="text-[11px] text-amber-800 font-bold block">منحى التطور البيداغوجي</span>
                <div className="flex items-center gap-1 mt-0.5 text-amber-900 font-bold text-xs">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono font-bold tabular-nums text-base">
                    {parseFloat(scoreTrend) >= 0 ? `+${scoreTrend}` : scoreTrend}
                  </span>
                  <span>نقطة</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-600 font-bold block">إجمالي المواد المقومة</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800 font-mono tabular-nums">{studentGrades.length}</span>
                  <span className="text-xs text-slate-500">مواد تعليمية</span>
                </div>
              </div>
            </div>

            {/* Recharts Area / Bar View */}
            <div className="pt-2">
              {chartMode === 'timeline' ? (
                <div className="h-80 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timelineChartData}
                      margin={{ top: 15, right: 25, left: 0, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#b91c1c" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="avgColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#047857" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#047857" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="displayDate"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis
                        domain={[0, 20]}
                        ticks={[0, 5, 10, 15, 20]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />

                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-xl border border-amber-400/40 text-xs text-right space-y-1.5 max-w-xs" dir="rtl">
                                <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 gap-2">
                                  <span className="font-bold text-amber-300">{data.subject}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{data.date}</span>
                                </div>
                                <div className="text-slate-300 font-medium text-[11px]">{data.evaluation}</div>
                                <div className="flex items-center justify-between pt-1">
                                  <span className="text-slate-400">معدل المادة:</span>
                                  <span className="font-extrabold text-red-400 font-mono tabular-nums text-sm">{data.score} / 20</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">المعدل التراكمي الفصلي:</span>
                                  <span className="font-extrabold text-emerald-400 font-mono tabular-nums text-sm">{data.cumulativeAverage} / 20</span>
                                </div>
                                {data.teacherComment && (
                                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                                    "{data.teacherComment}"
                                  </p>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{ fontSize: 12, paddingBottom: 10 }}
                      />

                      <ReferenceLine
                        y={10}
                        stroke="#d97706"
                        strokeDasharray="4 4"
                        label={{
                          value: 'عتبة النجاح الرسمية (10/20)',
                          position: 'insideBottomRight',
                          fill: '#b45309',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />

                      <ReferenceLine
                        y={16}
                        stroke="#059669"
                        strokeDasharray="4 4"
                        label={{
                          value: 'عتبة الامتياز ولوحة الشرف (16/20)',
                          position: 'insideTopRight',
                          fill: '#047857',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="score"
                        name="نقطة المادة /20"
                        stroke="#b91c1c"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#scoreColor)"
                        activeDot={{ r: 6, fill: '#b91c1c', stroke: '#ffffff', strokeWidth: 2 }}
                      />

                      <Area
                        type="monotone"
                        dataKey="cumulativeAverage"
                        name="المعدل التراكمي الفصلي"
                        stroke="#047857"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#avgColor)"
                        activeDot={{ r: 6, fill: '#047857', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectChartData}
                      margin={{ top: 15, right: 25, left: 0, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="shortSubject"
                        tick={{ fontSize: 11, fill: '#475569' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />
                      <YAxis
                        domain={[0, 20]}
                        ticks={[0, 5, 10, 15, 20]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickLine={false}
                        axisLine={{ stroke: '#cbd5e1' }}
                      />

                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl border border-amber-400/40 text-xs text-right space-y-1" dir="rtl">
                                <span className="font-bold text-amber-300 block">{data.subject}</span>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-slate-400">معدل المادة:</span>
                                  <span className="font-extrabold text-emerald-400 font-mono tabular-nums text-sm">{data.average} / 20</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  عدد التقويمات المسجلة: {data.evaluationsCount}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <ReferenceLine
                        y={10}
                        stroke="#d97706"
                        strokeDasharray="4 4"
                        label={{
                          value: 'عتبة النجاح (10/20)',
                          position: 'insideBottomRight',
                          fill: '#b45309',
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />

                      <Bar
                        dataKey="average"
                        name="معدل المادة"
                        fill="#047857"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Grades Matrix Table */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>تفاصيل تقويمات ومعدلات المواد المقررة - السنة الرابعة متوسط</span>
              </h3>
              <span className="text-xs text-slate-500">
                إجمالي المواد المقومة: {studentGrades.length} مواد
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {studentGrades.map((grade) => (
                <div 
                  key={grade.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{grade.subject}</span>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        المعامل {grade.coefficient}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{grade.evaluationName}</span>
                    </div>

                    {grade.teacherComment && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        "{grade.teacherComment}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-left">
                      <span className="text-xl font-extrabold font-mono tabular-nums text-emerald-800">
                        {grade.score.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400"> / 20</span>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                      grade.score >= 16 ? 'bg-emerald-50 text-emerald-700' :
                      grade.score >= 12 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {grade.score >= 16 ? 'ممتاز' : grade.score >= 12 ? 'حسن' : 'متوسط'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Grade Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border-2 border-emerald-500/30 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                تسجيل نقطة جديدة لـ: {currentStudent?.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGradeSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المادة التعليمية
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="الرياضيات">الرياضيات (معامل 4)</option>
                    <option value="اللغة العربية">اللغة العربية (معامل 5)</option>
                    <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا (معامل 2)</option>
                    <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة (معامل 2)</option>
                    <option value="التاريخ والجغرافيا">التاريخ والجغرافيا (معامل 3)</option>
                    <option value="التربية الإسلامية">التربية الإسلامية (معامل 2)</option>
                    <option value="التربية المدنية">التربية المدنية (معامل 1)</option>
                    <option value="اللغة الفرنسية">اللغة الفرنسية (معامل 3)</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية (معامل 2)</option>
                    <option value="الإعلام الآلي">الإعلام الآلي (معامل 1)</option>
                    <option value="التربية البدنية والرياضية">التربية البدنية والرياضية (معامل 1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    معامل المادة
                  </label>
                  <select
                    value={coefficient}
                    onChange={(e) => setCoefficient(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-semibold"
                  >
                    <option value="1">معامل 1</option>
                    <option value="2">معامل 2</option>
                    <option value="3">معامل 3</option>
                    <option value="4">معامل 4</option>
                    <option value="5">معامل 5</option>
                  </select>
                </div>
              </div>

              {/* Algerian 2026 Three-Pillar Inputs: Continuous Assessment + Test + Exam */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    التقويم المستمر
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    required
                    value={assessmentScore}
                    onChange={(e) => setAssessmentScore(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">من 20</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الفرض المحروس
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    required
                    value={testScore}
                    onChange={(e) => setTestScore(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">من 20</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الاختبار الفصلي
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.25"
                    required
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-hidden font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">معامل 2</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-semibold flex items-center justify-between">
                <span>المعدل الفصلي المحسوب تلقائياً للمادة:</span>
                <span className="font-mono font-bold text-sm">
                  {((parseFloat(assessmentScore || '0') + parseFloat(testScore || '0') + (parseFloat(examScore || '0') * 2)) / 4).toFixed(2)} / 20
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظة وتوجيه بيداغوجي للتلميذ والأسرة
                </label>
                <textarea
                  rows={2}
                  placeholder="ملاحظة حول نقاط القوة ونقاط التحسين تحضيراً لشهادة BEM..."
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg transition-colors shadow-xs"
                >
                  حفظ وتحديث كشف النقاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
