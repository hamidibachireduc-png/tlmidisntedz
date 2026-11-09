import React, { useState } from 'react';
import { HomeworkAssignment, Subject, UserRole } from '../types';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Download,
  Filter,
  Check
} from 'lucide-react';

interface HomeworkJournalProps {
  assignments: HomeworkAssignment[];
  onAddAssignment: (assignment: HomeworkAssignment) => void;
  onToggleStatus: (assignmentId: string) => void;
  userRole: UserRole;
}

export const HomeworkJournal: React.FC<HomeworkJournalProps> = ({
  assignments,
  onAddAssignment,
  onToggleStatus,
  userRole,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('الرياضيات');
  const [dueDate, setDueDate] = useState('2026-11-12');
  const [instructions, setInstructions] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const filteredAssignments = assignments.filter((item) => {
    if (selectedSubject === 'all') return true;
    return item.subject === selectedSubject;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructions) return;

    const newAssignment: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      title,
      subject,
      classRoom: 'السنة الرابعة متوسط - 4م2 (BEM)',
      assignedDate: '2026-11-08',
      dueDate,
      instructions,
      attachmentName: attachmentName || undefined,
      status: 'pending',
      teacherName: 'الأستاذ لخضر مزيان (عضو النقابة الوطنية لعمال التربية SNTE)',
    };

    onAddAssignment(newAssignment);
    setModalOpen(false);
    setTitle('');
    setInstructions('');
    setAttachmentName('');
    setNotification('تم نشر الواجب المنزلي بنجاح وإشعار جميع تلامذة القسم وأولياء أمورهم.');

    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs">
          <span>{notification}</span>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">دفتر الواجبات والفروض المدرسية</h2>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              متابعة رقمية
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إرسال ومتابعة الواجبات المدرسية بنقرة واحدة، تنظيم مواعيد التسليم، وتوفير المرفقات والتمارين
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent border-0 focus:outline-hidden text-slate-700 font-medium"
            >
              <option value="all">جميع المواد الدراسية</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="الفيزياء والكيمياء">الفيزياء والكيمياء</option>
              <option value="علوم الحياة والأرض">علوم الحياة والأرض</option>
              <option value="اللغة العربية">اللغة العربية</option>
              <option value="اللغة الفرنسية">اللغة الفرنسية</option>
              <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
            </select>
          </div>

          {userRole === 'teacher' && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة واجب منزلي جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.map((hw) => {
          const isDone = hw.status === 'submitted' || hw.status === 'graded';
          return (
            <div 
              key={hw.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {hw.subject}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mt-1.5 leading-snug">
                      {hw.title}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1 ${
                      hw.status === 'graded'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{hw.status === 'graded' ? 'تم التصحيح' : isDone ? 'تم التسليم' : 'قيد الإنجاز'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {hw.instructions}
                </p>

                {hw.attachmentName && (
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{hw.attachmentName}</span>
                    </div>
                    <button
                      onClick={() => alert(`جاري تحميل المرفق: ${hw.attachmentName}`)}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>تاريخ التسليم: <strong className="text-slate-700">{hw.dueDate}</strong></span>
                </div>

                <div>
                  <button
                    onClick={() => onToggleStatus(hw.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDone ? 'إلغاء التأكيد' : 'تأكيد إنجاز الواجب'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                نشر واجب منزلي جديد للقسم
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الواجب أو التمرين
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حل سلسلة تمارين مبرهنة فيثاغورس"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المادة الدراسية
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as Subject)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-semibold"
                  >
                    <option value="الرياضيات">الرياضيات</option>
                    <option value="اللغة العربية">اللغة العربية</option>
                    <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا</option>
                    <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
                    <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                    <option value="التربية الإسلامية">التربية الإسلامية</option>
                    <option value="التربية المدنية">التربية المدنية</option>
                    <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="الإعلام الآلي">الإعلام الآلي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    آخر أجل للتسليم
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تعليمات وتوجيهات الأستاذ
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب التمارين المطلوبة، أرقام الصفحات، وطريقة تحرير الإجابات..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  مرفق الواجب (ملف PDF أو صورة)
                </label>
                <input
                  type="text"
                  placeholder="مثال: ورقة_فروض_الرياضيات_الدورة_الأولى.pdf"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
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
                  نشر الواجب لجميع التلاميذ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
