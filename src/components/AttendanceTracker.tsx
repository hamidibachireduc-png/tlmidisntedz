import React, { useState, useEffect } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, UserRole, AutoAttendanceConfig, Subject } from '../types';
import { DEFAULT_AUTO_ATTENDANCE_CONFIG } from '../data/initialData';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Smartphone,
  Info,
  Settings,
  Bell,
  Sliders,
  RotateCcw,
  Users
} from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  records: AttendanceRecord[];
  onUpdateStatus: (studentId: string, status: AttendanceStatus, notes?: string) => void;
  userRole: UserRole;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  records,
  onUpdateStatus,
  userRole,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-11-08');
  const [timeSlot, setTimeSlot] = useState('08:00 - 10:00');
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  // Auto-Attendance Configuration with LocalStorage persistence
  const [autoConfig, setAutoConfig] = useState<AutoAttendanceConfig>(() => {
    const saved = localStorage.getItem('tilmidi_auto_attendance_config_dz_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_AUTO_ATTENDANCE_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('tilmidi_auto_attendance_config_dz_2026', JSON.stringify(autoConfig));
  }, [autoConfig]);

  const getRecordForStudent = (studentId: string): AttendanceRecord | undefined => {
    return records.find(
      (r) => r.studentId === studentId && r.date === selectedDate && r.timeSlot === timeSlot
    );
  };

  const handleStatusChange = (student: Student, newStatus: AttendanceStatus) => {
    onUpdateStatus(student.id, newStatus);
    
    // Instant notification simulation
    if (newStatus === 'absent') {
      setLastNotification(`تم إرسال إشعار غياب فوري لولي أمر التلميذ (${student.name}) على الرقم ${student.guardianPhone} بنجاح ومجاناً عبر خادم النقابة دون كشف رقم هاتف الأستاذ.`);
    } else if (newStatus === 'late') {
      setLastNotification(`تم إشعار ولي أمر التلميذ (${student.name}) بتسجيل تأخر عن الحصة.`);
    } else if (newStatus === 'present') {
      setLastNotification(`تم تأكيد حضور التلميذ (${student.name}) بنجاح.`);
    }

    setTimeout(() => {
      setLastNotification(null);
    }, 4500);
  };

  // Instant apply default auto-attendance for the active day
  const handleApplyAutoAttendanceForDate = () => {
    let appliedCount = 0;
    students.forEach((student) => {
      const existing = getRecordForStudent(student.id);
      if (!existing || existing.status !== 'absent') {
        onUpdateStatus(student.id, autoConfig.defaultStatus, 'حضور افتراضي مجدول آلياً');
        appliedCount++;
      }
    });

    // Update history in config
    const updatedHistory = Array.from(new Set([...(autoConfig.executedDatesHistory || []), selectedDate]));
    setAutoConfig((prev) => ({
      ...prev,
      lastExecutedDate: selectedDate,
      executedDatesHistory: updatedHistory,
    }));

    if (autoConfig.autoNotifyParents) {
      setLastNotification(`تم تسجيل الحضور الافتراضي لجميع تلامذة الفوج (${appliedCount} تلميذاً)، وإرسال تنبيه آلي مؤكد للأولياء عبر فضاء الأولياء بنجاح.`);
    } else {
      setLastNotification(`تم تطبيق الحضور الافتراضي بنجاح لتلامذة الفوج (${appliedCount} تلميذاً) لتاريخ ${selectedDate}.`);
    }

    setTimeout(() => {
      setLastNotification(null);
    }, 5500);
  };

  // Calculations
  const total = students.length;
  const presentCount = students.filter((s) => {
    const rec = getRecordForStudent(s.id);
    return rec ? rec.status === 'present' : true;
  }).length;
  const absentCount = students.filter((s) => getRecordForStudent(s.id)?.status === 'absent').length;
  const lateCount = students.filter((s) => getRecordForStudent(s.id)?.status === 'late').length;

  const daysLabels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification */}
      {lastNotification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm shadow-xs transition-all">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{lastNotification}</span>
          </div>
          <button 
            onClick={() => setLastNotification(null)}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Control bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-heading">رصد الحضور والغياب الفوري</h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                فوري ومحمي
              </span>
              {autoConfig.enabled && (
                <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>الحضور الافتراضي مجدول</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تسجيل الحضور بنقرة زر واحدة أو جدولته آلياً مع خيار إشعار أولياء التلاميذ تلقائياً دون كشف رقم هاتف الأستاذ
            </p>
          </div>

          {/* Action buttons & Scheduled Attendance Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto Attendance Schedule Modal Opener */}
            <button
              onClick={() => setConfigModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>إعدادات الحضور الافتراضي والتنبيه</span>
            </button>

            {/* Instant Apply Default Attendance Button */}
            <button
              onClick={handleApplyAutoAttendanceForDate}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-102"
              title="تسجيل جميع تلاميذ الفوج كحاضرين لليوم وإرسال التنبيه الآلي"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>تطبيق الحضور الافتراضي لليوم فوراً</span>
            </button>
          </div>
        </div>

        {/* Date and Time Slot Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-0 focus:outline-hidden text-slate-700 font-bold"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="bg-transparent border-0 focus:outline-hidden text-slate-700 font-bold cursor-pointer"
              >
                <option value="08:00 - 10:00">الفترة الصباحية الأولى (08:00 - 10:00)</option>
                <option value="10:00 - 12:00">الفترة الصباحية الثانية (10:00 - 12:00)</option>
                <option value="13:30 - 15:30">الفترة المسائية الأولى (13:30 - 15:30)</option>
                <option value="15:30 - 17:30">الفترة المسائية الثانية (15:30 - 17:30)</option>
              </select>
            </div>
          </div>

          {/* Quick Notice about Scheduled Auto-Attendance */}
          {autoConfig.enabled && (
            <div className="text-[11px] text-amber-800 bg-amber-50/80 px-3 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5">
              <Bell className="w-3 h-3 text-amber-600" />
              <span>
                تنبيه الأولياء الآلي: <strong>{autoConfig.autoNotifyParents ? 'مفعّل ونشط' : 'معطل'}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-500 block">إجمالي تلامذة الفوج</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">{total}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs text-emerald-700 block">الحاضرون الآن</span>
            <span className="text-xl font-black text-emerald-800 tabular-nums">{presentCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100">
            <span className="text-xs text-rose-700 block">الغيابات المسجلة</span>
            <span className="text-xl font-black text-rose-800 tabular-nums">{absentCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
            <span className="text-xs text-amber-700 block">المتأخرون</span>
            <span className="text-xl font-black text-amber-800 tabular-nums">{lateCount}</span>
          </div>
        </div>
      </div>

      {/* Privacy guarantee note */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-amber-500/30">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>
            <strong>ميزة الحماية النقابية والخصوصية:</strong> يتم إرسال الإشعارات والتنبيهات للأولياء عبر خوادم تلميذي السحابية دون إظهار رقم هاتفك الشخصي، مع احترام أوقات الراحة الرسمية.
          </span>
        </div>
        <span className="bg-emerald-800 text-amber-300 px-3 py-1 rounded-xl text-[11px] shrink-0 font-bold self-start sm:self-auto border border-emerald-700">
          حماية الخصوصية 100%
        </span>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm font-heading">
              قائمة الفوج التربوي: السنة الرابعة متوسط (4م2) · مادة الرياضيات (تحضير BEM 2026)
            </h3>
            <span className="text-xs text-slate-500">
              التاريخ: {selectedDate} | الحصة: {timeSlot}
            </span>
          </div>

          {autoConfig.enabled && (
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold self-start sm:self-auto">
              ● الحضور الافتراضي للأيام غير المرصودة: حاضر (تلقائي)
            </span>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {students.map((student) => {
            const currentRecord = getRecordForStudent(student.id);
            const status: AttendanceStatus = currentRecord ? currentRecord.status : autoConfig.defaultStatus;
            const isAutoGenerated = currentRecord?.notes?.includes('افتراضي');

            return (
              <div 
                key={student.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                    {student.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{student.name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {student.registrationNumber}
                      </span>
                      {isAutoGenerated && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          حضور افتراضي
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>ولي الأمر: {student.guardianName}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums text-slate-600">{student.guardianPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status buttons */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      onClick={() => handleStatusChange(student, 'present')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'present'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>حاضر</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(student, 'absent')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'absent'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-rose-700'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>غائب</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(student, 'late')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'late'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-amber-700'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>متأخر</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(student, 'excused')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                        status === 'excused'
                          ? 'bg-sky-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-sky-700'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>مبرر</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUTO ATTENDANCE SCHEDULING MODAL */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scale-in space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 font-heading">
                    جدولة الحضور الافتراضي والتنبيه الآلي
                  </h3>
                  <p className="text-xs text-slate-500">
                    ضبط قاعدة الحضور التلقائي للأيام التي لا يتم فيها رصد الغياب يدوياً
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConfigModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Enable / Disable Master Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">
                    تفعيل الحضور الافتراضي المجدول
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    اعتبار جميع تلامذة الفوج حاضرين تلقائياً في الأيام المحددة إن لم يرصد غياب يدوي
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoConfig.enabled}
                    onChange={(e) => setAutoConfig((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Scheduled Days Selector */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">
                  أيام الأسبوع المجدولة للحضور الافتراضي (المنظومة الجزائرية):
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {daysLabels.map((dayName, idx) => {
                    const isChecked = autoConfig.scheduledDays.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const updated = isChecked
                            ? autoConfig.scheduledDays.filter((d) => d !== idx)
                            : [...autoConfig.scheduledDays, idx];
                          setAutoConfig((prev) => ({ ...prev, scheduledDays: updated }));
                        }}
                        className={`py-2 px-1 text-center rounded-xl font-bold border transition-all text-xs ${
                          isChecked
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {dayName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Automated Parents Notification Settings */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-extrabold text-amber-950 block">
                      إرسال تنبيه آلي للأولياء عبر فضاء الأولياء
                    </span>
                    <span className="text-[11px] text-amber-900/80 block">
                      إرسال إشعار فوري لولي الأمر بتسجيل مواظبة التلميذ في اليوم المجدول
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoConfig.autoNotifyParents}
                    onChange={(e) => setAutoConfig((prev) => ({ ...prev, autoNotifyParents: e.target.checked }))}
                    className="mt-1 rounded-sm text-red-700 focus:ring-red-500 w-4 h-4"
                  />
                </div>

                {autoConfig.autoNotifyParents && (
                  <div className="space-y-1 pt-2 border-t border-amber-200">
                    <label className="text-[11px] font-bold text-amber-900 block">
                      صيغة التنبيه الآلي المرسل لولي الأمر:
                    </label>
                    <textarea
                      rows={2}
                      value={autoConfig.customNotificationMessage}
                      onChange={(e) => setAutoConfig((prev) => ({ ...prev, customNotificationMessage: e.target.value }))}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-slate-900 text-xs focus:outline-hidden focus:ring-1 focus:ring-amber-500 leading-relaxed"
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Execution History */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">
                  آخر أيام تم فيها تطبيق الحضور الافتراضي:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {(autoConfig.executedDatesHistory || []).slice(-5).map((dt, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                      ✓ {dt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleApplyAutoAttendanceForDate}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تطبيق الحضور الافتراضي لليوم الآن</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfigModalOpen(false);
                    setLastNotification('تم حفظ إعدادات جدولة الحضور الافتراضي بنجاح.');
                    setTimeout(() => setLastNotification(null), 3500);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  حفظ الإعدادات وإغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
