import React, { useState } from 'react';
import { 
  Student, 
  AttendanceRecord, 
  GradeEntry, 
  FeeReceipt, 
  StudentFeeSummary, 
  AbsenceJustification,
  Subject,
  AppUser
} from '../types';
import { 
  Users, 
  Bell, 
  CalendarCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Smartphone, 
  Send, 
  Award, 
  BookOpen, 
  Paperclip, 
  Upload, 
  CreditCard, 
  ChevronDown, 
  Info,
  Calendar,
  Sparkles,
  Crown
} from 'lucide-react';

interface ParentPortalProps {
  currentUser: AppUser;
  students: Student[];
  records: AttendanceRecord[];
  grades: GradeEntry[];
  studentFees: StudentFeeSummary[];
  feeReceipts: FeeReceipt[];
  justifications: AbsenceJustification[];
  onSubmitJustification: (justification: AbsenceJustification) => void;
  onOpenReceiptModal?: (receipt: FeeReceipt) => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  currentUser,
  students,
  records,
  grades,
  studentFees,
  feeReceipts,
  justifications,
  onSubmitJustification,
  onOpenReceiptModal,
}) => {
  // Enrolled children for this parent
  // If assignedStudentIds exists, filter, otherwise default to first 2 students
  const parentChildren = students.filter((s) => 
    currentUser.assignedStudentIds?.includes(s.id) || 
    s.guardianPhone === currentUser.phone || 
    s.guardianName.includes(currentUser.name.split(' ')[0])
  );

  const effectiveChildren = parentChildren.length > 0 ? parentChildren : [students[0], students[3]].filter(Boolean);

  const [selectedChildId, setSelectedChildId] = useState<string>(effectiveChildren[0]?.id || students[0]?.id);
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'fees' | 'new_excuse'>('attendance');

  // New excuse form state
  const [excuseReasonType, setExcuseReasonType] = useState<string>('medical_certificate');
  const [excuseDetails, setExcuseDetails] = useState<string>('');
  const [attachedDocName, setAttachedDocName] = useState<string>('شهادة_طبية_معتمدة.pdf');
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  const selectedChild = students.find((s) => s.id === selectedChildId) || effectiveChildren[0] || students[0];

  // Records for this selected child
  const childRecords = records.filter((r) => r.studentId === selectedChild.id);
  const childGrades = grades.filter((g) => g.studentId === selectedChild.id);
  const childFee = studentFees.find((f) => f.studentId === selectedChild.id);
  const childReceipts = feeReceipts.filter((rec) => rec.studentId === selectedChild.id);
  const childJustifications = justifications.filter((j) => j.studentId === selectedChild.id);

  // Check for recent unjustified absences
  const recentAbsences = childRecords.filter((r) => r.status === 'absent');
  const hasUrgentAbsenceAlert = recentAbsences.length > 0;

  // Calculate attendance rate
  const totalSessions = childRecords.length;
  const presentSessions = childRecords.filter((r) => r.status === 'present' || r.status === 'excused').length;
  const attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 95;

  const handleSubmitExcuse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChild) return;

    const newJust: AbsenceJustification = {
      id: `just-parent-${Date.now()}`,
      studentId: selectedChild.id,
      studentName: selectedChild.name,
      guardianName: currentUser.name,
      guardianPhone: currentUser.phone,
      date: new Date().toISOString().split('T')[0],
      timeSlot: '08:00 - 10:00',
      subject: 'الرياضيات',
      reasonType: excuseReasonType as any,
      reasonLabel: excuseReasonType === 'medical_certificate' ? 'شهادة طبية معتمدة' : 'ظرف عائلي طارئ',
      details: excuseDetails || 'نحيطكم علماً بأن التلميذ تغيب بسبب ظرف قاهر، ونرجو منكم قبول التبرير واعتماده نظامياً.',
      attachedDocumentName: attachedDocName,
      attachedDocumentUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      status: 'pending',
      submittedAt: new Date().toLocaleString('ar-DZ', { dateStyle: 'short', timeStyle: 'short' }),
    };

    onSubmitJustification(newJust);
    setSubmissionSuccessMsg('تم إيداع طلب التبرير الإلكتروني بنجاح وهو قيد المراجعة لدى إدارة المركز والأستاذ المؤطر.');
    setExcuseDetails('');
    setTimeout(() => {
      setSubmissionSuccessMsg(null);
      setActiveTab('attendance');
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner for Parent */}
      <div 
        className="dz-royal-banner p-6 sm:p-7 text-white relative overflow-hidden shadow-2xl rounded-3xl"
        style={{
          backgroundColor: '#033224',
          backgroundImage: 'linear-gradient(135deg, #02261a 0%, #064e3b 45%, #008751 75%, #78350f 100%)',
          color: '#ffffff'
        }}
      >
        <div className="dz-national-ribbon absolute top-0 left-0 right-0"></div>
        <div className="relative z-10 max-w-3xl space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-black/60 text-amber-300 font-black text-[11px] border border-amber-400 shadow-md flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>فضاء الأولياء (Parent Portal)</span>
            </span>
            <span className="text-amber-400 font-bold">●</span>
            <span className="text-white font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/80">
              مرحباً بك: {currentUser.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            متابعة الحضور، الإشعارات الفورية والتبرير الإلكتروني
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl font-bold drop-shadow-sm">
            لوحة مخصصة لمتابعة مسار أبنائكم التعليمي في السنتر: تلقي إشعارات فورية عند تسجيل أي غياب، الاطلاع على كشف النقاط والاشتراكات الشهرية، وإيداع الشهادات الطبية والتبريرات بضغطة زر.
          </p>

          {/* Children Selector if multiple */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black text-amber-200">اختر الابن للمتابعة:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {effectiveChildren.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChildId(ch.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                    selectedChildId === ch.id
                      ? 'dz-btn-gold text-slate-950 shadow-md scale-105'
                      : 'bg-black/40 hover:bg-black/60 text-emerald-100 border border-emerald-500/40'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{ch.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({ch.classRoom.split('-')[0]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* URGENT INSTANT ABSENCE ALERT BANNER (If child has recent absent status) */}
      {hasUrgentAbsenceAlert && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xl border-2 border-red-300 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white text-red-700 flex items-center justify-center font-black shrink-0 shadow-md">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold bg-red-950/60 px-2 py-0.5 rounded-full border border-red-400">
                  ⚠️ إشعار فوري عاجل على الهاتف
                </span>
                <span className="text-xs font-black text-amber-200 font-mono">
                  {recentAbsences[0]?.date}
                </span>
              </div>
              <h3 className="text-base font-black text-white mt-1">
                تم رصد غياب غير مبرر لابنكم ({selectedChild.name}) في حصة {recentAbsences[0]?.subject}!
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                الفترة الزمنية: {recentAbsences[0]?.timeSlot}. يُرجى تقديم تبرير إلكتروني خلال 48 ساعة تفادياً للخصم من رصيد الحضور.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('new_excuse')}
            className="dz-btn-gold px-5 py-2.5 rounded-xl text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all shrink-0"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>تقديم تبرير غياب إلكتروني الآن</span>
          </button>
        </div>
      )}

      {/* Success alert */}
      {submissionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-700 text-white border-2 border-emerald-400 flex items-center gap-3 font-bold text-xs shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{submissionSuccessMsg}</span>
        </div>
      )}

      {/* Child Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">نسبة الانضباط والحضور</span>
            <div className="text-2xl font-black text-emerald-800 font-mono">{attendanceRate}%</div>
            <div className="text-[11px] text-emerald-700 font-bold">
              حاضر: {selectedChild.attendanceStats.present} حصة
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Current Average */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">المعدل العام للتقويم</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {selectedChild.currentAverage} <span className="text-xs font-normal text-slate-500">/ 20</span>
            </div>
            <div className="text-[11px] text-amber-700 font-bold">
              رتبة ممتازة في الفوج
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Unjustified Absences */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">الغيابات المسجلة</span>
            <div className={`text-2xl font-black font-mono ${selectedChild.attendanceStats.absent > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {selectedChild.attendanceStats.absent} غياب
            </div>
            <div className="text-[11px] text-slate-500 font-bold">
              المبرر: {selectedChild.attendanceStats.excused} غيابات
            </div>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedChild.attendanceStats.absent > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Subscription Status */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">اشتراك نوفمبر 2026</span>
            <div className="text-lg font-black text-slate-900">
              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                childFee?.status === 'paid' 
                  ? 'bg-emerald-100 text-emerald-900' 
                  : childFee?.status === 'partial' 
                  ? 'bg-amber-100 text-amber-900' 
                  : 'bg-red-100 text-red-900'
              }`}>
                {childFee?.status === 'paid' ? 'مسدد بالكامل ✓' : childFee?.status === 'partial' ? 'دفعة جزئية' : 'غير مسدد'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {childFee ? `${childFee.paidAmount.toLocaleString('ar-DZ')} دج` : '4,500 دج'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'attendance'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4" />
          <span>سجل الحضور والغيابات ({childRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('grades')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'grades'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>النقاط ونتائج الاختبارات ({childGrades.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'fees'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>الاشتراكات والإيصالات الإلكترونية ({childReceipts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new_excuse')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'new_excuse'
              ? 'dz-btn-gold text-slate-950 shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-900" />
          <span>إيداع تبرير غياب إلكتروني</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ATTENDANCE LOG */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="dz-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">سجل حصص التلميذ ({selectedChild.name})</h3>
              <span className="text-xs text-slate-500 font-bold">الفوج: {selectedChild.classRoom}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-black">
                  <tr>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">الحصة / التوقيت</th>
                    <th className="py-3 px-4">المادة التعليمية</th>
                    <th className="py-3 px-4">الحالة المسجلة</th>
                    <th className="py-3 px-4">إشعار الولي</th>
                    <th className="py-3 px-4">ملاحظات الأستاذ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {childRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.date}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.timeSlot}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800">{r.subject}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${
                          r.status === 'present'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : r.status === 'absent'
                            ? 'bg-red-100 text-red-900 border border-red-300 animate-pulse'
                            : r.status === 'late'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {r.status === 'present' ? 'حاضر ✓' : r.status === 'absent' ? 'غائب ⚠️' : r.status === 'late' ? 'متأخر ⏳' : 'غياب مبرر 📋'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {r.status === 'absent' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Smartphone className="w-3 h-3 text-emerald-600" />
                            <span>تم إشعاركم بالواتساب</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {r.notes || 'حصة دعم عادية'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: GRADES */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          <div className="dz-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-sm">نتائج وتقويمات التلميذ ({selectedChild.name})</h3>
              <span className="text-xs font-mono font-bold text-emerald-700">المعدل الفصلي: {selectedChild.currentAverage} / 20</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-black">
                  <tr>
                    <th className="py-3 px-4">المادة</th>
                    <th className="py-3 px-4">التقويم / الاختبار</th>
                    <th className="py-3 px-4">النقطة المحصل عليها</th>
                    <th className="py-3 px-4">المعامل</th>
                    <th className="py-3 px-4">تاريخ الإجراء</th>
                    <th className="py-3 px-4">ملاحظة الأستاذ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {childGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.subject}</td>
                      <td className="py-3 px-4 text-slate-700">{g.evaluationName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-black ${
                          g.score >= 15 ? 'bg-emerald-100 text-emerald-900' : g.score >= 10 ? 'bg-amber-100 text-amber-900' : 'bg-red-100 text-red-900'
                        }`}>
                          {g.score} / 20
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{g.coefficient}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{g.date}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{g.teacherComment || 'مستوى طيب ومستمر في التحسن'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: FEES & RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          <div className="dz-card p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
            <h3 className="font-black text-slate-900 text-base">إيصالات الدفع الإلكترونية المسددة للابن</h3>
            <p className="text-xs text-slate-600">يمكنكم استعراض الإيصال الرسمي المعتمد أو طباعته في أي وقت.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childReceipts.map((rec) => (
                <div key={rec.id} className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-400 bg-slate-50 space-y-3 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-amber-800 text-xs">{rec.receiptNumber}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[10px]">
                      مسدد بالكامل ✓
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-black text-slate-900">{rec.subject}</div>
                    <div className="text-slate-600">المبلغ المسدد: <strong className="font-mono text-emerald-800">{rec.amount.toLocaleString('ar-DZ')} دج</strong></div>
                    <div className="text-[11px] text-slate-500 font-mono">طريقة الدفع: {rec.paymentMethod === 'baridimob' ? 'بريدي موب BaridiMob' : 'نقداً'}</div>
                    <div className="text-[10px] text-slate-400">تاريخ السداد: {rec.paymentDate}</div>
                  </div>

                  <button
                    onClick={() => onOpenReceiptModal && onOpenReceiptModal(rec)}
                    className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>عرض وطباعة الإيصال الإلكتروني المعتمد</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SUBMIT NEW EXCUSE */}
      {activeTab === 'new_excuse' && (
        <div className="dz-card p-6 sm:p-8 bg-white border-2 border-amber-400/50 rounded-3xl shadow-md space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>إيداع طلب تبرير غياب إلكتروني (فضاء الأولياء)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              للتلميذ: <strong className="text-emerald-800">{selectedChild.name}</strong> · الفوج: {selectedChild.classRoom}
            </p>
          </div>

          <form onSubmit={handleSubmitExcuse} className="space-y-4 text-xs font-bold">
            <div className="space-y-1">
              <label className="text-slate-700">نوع المبرر القانوني:</label>
              <select
                value={excuseReasonType}
                onChange={(e) => setExcuseReasonType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-white"
              >
                <option value="medical_certificate">شهادة طبية معتمدة من طبيب محلف (راحة مرضية)</option>
                <option value="family_emergency">ظرف عائلي طارئ وقاهر</option>
                <option value="hospital_visit">موعد فحص استشفائي متخصص</option>
                <option value="prior_notice">إشعار مسبق بالغياب لمانع شرعي</option>
                <option value="other">أسباب إدارية أخرى</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">شرح وتفاصيل المبرر:</label>
              <textarea
                value={excuseDetails}
                onChange={(e) => setExcuseDetails(e.target.value)}
                rows={3}
                placeholder="يرجى كتابة توضيح موجز حول سبب الغياب ومدة الراحة الممنوحة..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">إرفاق الشهادة الطبية أو الوثيقة الثبوتية (PDF / صورة):</label>
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700">
                  <Paperclip className="w-4 h-4 text-amber-600" />
                  <span className="font-mono text-[11px]">{attachedDocName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('تم رفع ومعاينة الوثيقة الطبية بنجاح.')}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-xs font-bold"
                >
                  تغيير الملف
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl dz-btn-gold text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-101 transition-all"
            >
              <Send className="w-4 h-4 text-slate-950" />
              <span>إرسال طلب التبرير لإدارة المركز والأستاذ</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
