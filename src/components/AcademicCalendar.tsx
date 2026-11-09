import React, { useState } from 'react';
import { CalendarEvent, CalendarEventType, UserRole, SchoolSettings } from '../types';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Clock, 
  MapPin, 
  GraduationCap, 
  Award, 
  FileText, 
  Users, 
  Bookmark, 
  CheckCircle, 
  Printer, 
  Trash2, 
  School, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  CalendarDays,
  PenTool,
  AlertCircle,
  Flag
} from 'lucide-react';

interface AcademicCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  userRole: UserRole;
  schoolSettings: SchoolSettings;
}

export const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
  userRole,
  schoolSettings,
}) => {
  // Current viewing date (default to November 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10); // 0-indexed: 10 = November
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-17');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [printMode, setPrintMode] = useState<boolean>(false);

  // New Event Form State
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(selectedDate);
  const [formEndDate, setFormEndDate] = useState<string>('');
  const [formType, setFormType] = useState<CalendarEventType>('test');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formClassRoom, setFormClassRoom] = useState<string>('السنة الرابعة متوسط (4م2)');

  const ARABIC_MONTH_NAMES = [
    'جانفي (يناير)',
    'فيفري (فبراير)',
    'مارس',
    'أفريل (أبريل)',
    'ماي (مايو)',
    'جوان (يونيو)',
    'جويلية (يوليو)',
    'أوت (أغسطس)',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
  ];

  // Algerian Weekday order: Starts on Sunday (الأحد) through Thursday, Weekend is Friday & Saturday
  const WEEK_DAYS = [
    { name: 'الأحد', isWeekend: false },
    { name: 'الإثنين', isWeekend: false },
    { name: 'الثلاثاء', isWeekend: false },
    { name: 'الأربعاء', isWeekend: false },
    { name: 'الخميس', isWeekend: false },
    { name: 'الجمعة', isWeekend: true },
    { name: 'السبت', isWeekend: true },
  ];

  // Helper: Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: Get day of week for 1st day of month (0 = Sunday, 1 = Monday...)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleResetToCurrent = () => {
    setCurrentYear(2026);
    setCurrentMonth(10); // November 2026
    setSelectedDate('2026-11-17');
  };

  // Check if an event falls on a specific date (single date or in range [date, endDate])
  const getEventsForDate = (dateStr: string) => {
    return events.filter((e) => {
      if (selectedTypeFilter !== 'all' && e.type !== selectedTypeFilter) {
        return false;
      }
      if (e.date === dateStr) return true;
      if (e.endDate && e.date <= dateStr && e.endDate >= dateStr) {
        return true;
      }
      return false;
    });
  };

  // Build grid days
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth); // 0 (Sun) to 6 (Sat)
  const prevMonthTotalDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const gridCells: {
    dayNumber: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isWeekend: boolean;
  }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const m = currentMonth === 0 ? 12 : currentMonth;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const formatted = `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
    const dayOfWeek = (firstDayIndex - 1 - i) % 7;
    gridCells.push({
      dayNumber: d,
      dateStr: formatted,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const m = currentMonth + 1;
    const formatted = `${currentYear}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
    const dayOfWeek = (firstDayIndex + d - 1) % 7;
    gridCells.push({
      dayNumber: d,
      dateStr: formatted,
      isCurrentMonth: true,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remainingCells = 35 - gridCells.length > 0 ? 35 - gridCells.length : 42 - gridCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const m = currentMonth === 11 ? 1 : currentMonth + 2;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const formatted = `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`;
    const dayOfWeek = (gridCells.length) % 7;
    gridCells.push({
      dayNumber: d,
      dateStr: formatted,
      isCurrentMonth: false,
      isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
    });
  }

  // Active selected date events
  const selectedDateEvents = getEventsForDate(selectedDate);

  // Month Statistics
  const monthStartStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`;
  const monthEndStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${totalDays.toString().padStart(2, '0')}`;
  
  const currentMonthEvents = events.filter(e => {
    return (e.date >= monthStartStr && e.date <= monthEndStr) || 
           (e.endDate && e.endDate >= monthStartStr && e.date <= monthEndStr);
  });

  const examsCount = currentMonthEvents.filter(e => e.type === 'exam' || e.type === 'test').length;
  const holidaysCount = currentMonthEvents.filter(e => e.type === 'holiday').length;
  const meetingsCount = currentMonthEvents.filter(e => e.type === 'meeting').length;

  const handleOpenAddModal = (forDate?: string) => {
    setFormDate(forDate || selectedDate);
    setFormEndDate('');
    setFormTitle('');
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: formTitle.trim(),
      date: formDate,
      endDate: formEndDate || undefined,
      type: formType,
      description: formDescription.trim() || undefined,
      classRoom: formClassRoom,
      teacherName: userRole === 'teacher' ? 'الأستاذ لخضر مزيان' : undefined,
      isOfficial: false,
    };

    onAddEvent(newEv);
    setIsAddModalOpen(false);
  };

  const getTypeStyle = (type: CalendarEventType) => {
    switch (type) {
      case 'exam':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-600',
          label: 'امتحان رسمي / فصلي',
          icon: <GraduationCap className="w-3.5 h-3.5 text-rose-700" />,
        };
      case 'holiday':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          label: 'عطلة رسمية ومدرسية',
          icon: <Flag className="w-3.5 h-3.5 text-emerald-700" />,
        };
      case 'test':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-amber-600',
          label: 'فرض محروس',
          icon: <FileText className="w-3.5 h-3.5 text-amber-700" />,
        };
      case 'meeting':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-600',
          label: 'مجلس قسم / ندوة تربوية',
          icon: <Users className="w-3.5 h-3.5 text-blue-700" />,
        };
      case 'note':
      default:
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-600',
          label: 'ملاحظة وتوجيه بيداغوجي',
          icon: <PenTool className="w-3.5 h-3.5 text-purple-700" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-red-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <CalendarDays className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                التقويم البيداغوجي والرزنامة المدرسية 2026
              </h2>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                وزارة التربية الوطنية
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              متابعة مواعيد الفروض المحروسة، الامتحانات الرسمية (BEM / BAC)، العطل المدرسية، مع إمكانية إضافة ملاحظات الأستاذ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setPrintMode(!printMode)}
            className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>{printMode ? 'العودة لشبكة التقويم' : 'معاينة الرزنامة الرسمية للطباعة'}</span>
          </button>

          {userRole === 'teacher' && (
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 text-xs font-extrabold bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>إضافة موعد أو ملاحظة للأستاذ</span>
            </button>
          )}
        </div>
      </div>

      {printMode ? (
        /* Printable Official Calendar View */
        <div className="bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-sm space-y-6 printable-report">
          {/* Institutional Header */}
          <div className="flex items-center justify-between border-b-2 border-emerald-800 pb-5 gap-4">
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

            <div className="text-center space-y-1">
              <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden border border-amber-400 bg-white p-1 shadow-2xs flex items-center justify-center">
                <img
                  src={schoolSettings.logoUrl}
                  alt={schoolSettings.schoolName}
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                رزنامة المواعيد التربوية والامتحانات والعطل المدرسية
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                شهر {ARABIC_MONTH_NAMES[currentMonth]} {currentYear} · الموسم الدراسي 2025 / 2026
              </p>
            </div>

            <div className="text-left text-xs text-slate-600 space-y-1">
              <p>تاريخ الاستخراج: <strong>08 نوفمبر 2026</strong></p>
              <p>الفوج التربوي: <strong>السنة الرابعة متوسط 4م2</strong></p>
              <div className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                النقابة الوطنية لعمال التربية (SNTE)
              </div>
            </div>
          </div>

          {/* Agenda Table */}
          <table className="w-full text-right text-xs border border-slate-300">
            <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
              <tr>
                <th className="p-3">التاريخ واليوم</th>
                <th className="p-3">طبيعة الحدث أو الموعد</th>
                <th className="p-3">عنوان الموعد / الملاحظة</th>
                <th className="p-3">المستوى المعني</th>
                <th className="p-3">التفاصيل والتوجيهات البيداغوجية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentMonthEvents.map((ev) => {
                const style = getTypeStyle(ev.type);
                return (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {ev.date} {ev.endDate ? `إلى ${ev.endDate}` : ''}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${style.bg}`}>
                        {style.icon}
                        <span>{style.label}</span>
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{ev.title}</td>
                    <td className="p-3 text-slate-700">{ev.classRoom || 'جميع الأطوار'}</td>
                    <td className="p-3 text-slate-600 leading-relaxed">{ev.description || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs text-slate-700 border-t border-slate-200">
            <div>
              <p className="font-bold">تأشيرة الأستاذ المؤطر</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
            <div>
              <p className="font-bold">مكتب التنسيق التربوي والنقابي</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
            <div>
              <p className="font-bold">خاتم وتأشيرة مدير المؤسسة</p>
              <div className="h-12 border-b border-dashed border-slate-300 mt-2"></div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Interactive Grid + Inspector Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Calendar View (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            
            {/* Calendar Month Navigation & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-xl hover:bg-white text-slate-700 hover:text-slate-900 transition-colors"
                    title="الشهر اللاحق"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="px-3 py-1 text-sm font-extrabold text-slate-900 min-w-[170px] text-center font-heading">
                    {ARABIC_MONTH_NAMES[currentMonth]} {currentYear}
                  </div>

                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-xl hover:bg-white text-slate-700 hover:text-slate-900 transition-colors"
                    title="الشهر السابق"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleResetToCurrent}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-colors"
                >
                  نوفمبر 2026 (الحالي)
                </button>
              </div>

              {/* Event Type Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setSelectedTypeFilter('all')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    selectedTypeFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('test')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    selectedTypeFilter === 'test'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الفروض
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('exam')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    selectedTypeFilter === 'exam'
                      ? 'bg-rose-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الامتحانات
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('holiday')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    selectedTypeFilter === 'holiday'
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  العطل
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('meeting')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                    selectedTypeFilter === 'meeting'
                      ? 'bg-blue-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  المجالس
                </button>
              </div>
            </div>

            {/* Calendar Days Header (Sunday to Saturday) */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
              {WEEK_DAYS.map((wd, idx) => (
                <div
                  key={idx}
                  className={`py-2 rounded-xl text-center ${
                    wd.isWeekend
                      ? 'text-slate-400 bg-slate-50/80 font-semibold'
                      : 'text-slate-700 bg-slate-100/60'
                  }`}
                >
                  <span>{wd.name}</span>
                  {wd.isWeekend && <span className="block text-[10px] text-slate-400">عطلة</span>}
                </div>
              ))}
            </div>

            {/* Month Day Cells Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {gridCells.map((cell, idx) => {
                const dayEvents = getEventsForDate(cell.dateStr);
                const isSelected = selectedDate === cell.dateStr;
                const isToday = cell.dateStr === '2026-11-08';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(cell.dateStr)}
                    className={`min-h-[92px] sm:min-h-[105px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      !cell.isCurrentMonth
                        ? 'bg-slate-50/40 border-slate-100 text-slate-300'
                        : cell.isWeekend
                        ? 'bg-slate-50/70 border-slate-200/60 text-slate-600'
                        : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-800'
                    } ${
                      isSelected
                        ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/30 shadow-xs'
                        : ''
                    }`}
                  >
                    {/* Top Row in Cell: Date Number & Today marker */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                          isToday
                            ? 'bg-emerald-700 text-white font-extrabold'
                            : isSelected
                            ? 'bg-emerald-600 text-white'
                            : !cell.isCurrentMonth
                            ? 'text-slate-300'
                            : 'text-slate-700'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1 rounded-sm">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>

                    {/* Middle Events List in Cell */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((ev) => {
                        const style = getTypeStyle(ev.type);
                        return (
                          <div
                            key={ev.id}
                            className={`text-[10px] leading-tight px-1.5 py-0.5 rounded-md truncate font-semibold flex items-center gap-1 ${style.bg}`}
                            title={`${ev.title} (${style.label})`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`}></span>
                            <span className="truncate">{ev.title}</span>
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <div className="text-[9px] text-slate-400 font-bold px-1">
                          +{dayEvents.length - 2} مواعيد أخرى
                        </div>
                      )}
                    </div>

                    {/* Bottom Indicator Bar */}
                    <div className="pt-1 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {userRole === 'teacher' && cell.isCurrentMonth && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAddModal(cell.dateStr);
                          }}
                          className="w-5 h-5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center justify-center"
                          title="إضافة ملاحظة لهذا اليوم"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span>امتحان رسمي / فصلي (BEM / BAC)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>عطلة مدرسية ورسمية</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>فرض محروس</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>مجلس قسم / ندوة تربوية</span>
                </div>
              </div>

              <div className="text-slate-400 text-[11px]">
                انقر على أي يوم لاستعراض تفاصيله أو إضافة ملاحظات
              </div>
            </div>
          </div>

          {/* Right Inspector & Day Detail Panel (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Selected Date Inspector Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-emerald-700 block">
                    اليوم المحدد
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    {selectedDate}
                  </h3>
                </div>

                {userRole === 'teacher' && (
                  <button
                    onClick={() => handleOpenAddModal(selectedDate)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>إضافة ملاحظة</span>
                  </button>
                )}
              </div>

              {/* Events occurring on selected date */}
              <div className="space-y-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">
                      لا توجد امتحانات أو عطل مسجلة في هذا اليوم
                    </p>
                    {userRole === 'teacher' && (
                      <button
                        onClick={() => handleOpenAddModal(selectedDate)}
                        className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline inline-block pt-1"
                      >
                        أضف فرضاً أو ملاحظة بيداغوجية
                      </button>
                    )}
                  </div>
                ) : (
                  selectedDateEvents.map((ev) => {
                    const style = getTypeStyle(ev.type);
                    return (
                      <div
                        key={ev.id}
                        className={`p-3.5 rounded-2xl border transition-all space-y-2 ${style.bg}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold flex items-center gap-1">
                            {style.icon}
                            <span>{style.label}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            {ev.isOfficial && (
                              <span className="text-[10px] font-bold bg-white/80 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                                رسمي من الوزارة
                              </span>
                            )}
                            {onDeleteEvent && !ev.isOfficial && userRole === 'teacher' && (
                              <button
                                onClick={() => onDeleteEvent(ev.id)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="حذف الملاحظة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {ev.title}
                        </h4>

                        {ev.description && (
                          <p className="text-xs text-slate-700 leading-relaxed bg-white/60 p-2 rounded-xl">
                            {ev.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
                          {ev.classRoom && <span>الفوج: <strong>{ev.classRoom}</strong></span>}
                          {ev.teacherName && <span>الأستاذ: <strong>{ev.teacherName}</strong></span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Monthly Summary Statistics Strip */}
            <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-red-950 text-white rounded-3xl p-5 shadow-xs space-y-3.5 border border-amber-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-bold text-amber-300">
                  إحصائيات شهر {ARABIC_MONTH_NAMES[currentMonth]}
                </span>
                <span className="text-[11px] text-emerald-200 font-mono">
                  {currentMonthEvents.length} مواعيد مبرمجة
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-emerald-200 block">فروض وامتحانات</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">{examsCount}</span>
                </div>
                <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-amber-200 block">عطل رسمية</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">{holidaysCount}</span>
                </div>
                <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-blue-200 block">مجالس وندوات</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">{meetingsCount}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 leading-relaxed pt-1">
                وفق المنشور الوزاري رقم 84 المتعلق بالتنظيم الزمني للفروض المحروسة والامتحانات الرسمية.
              </div>
            </div>

            {/* Quick List of Upcoming Major Milestones */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>محطات الامتحانات الرسمية الكبرى 2026</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">امتحان شهادة التعليم المتوسط (BEM)</span>
                    <span className="text-[11px] text-slate-500">01 إلى 03 جوان 2027</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-[10px]">
                    رسمي
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">امتحان شهادة البكالوريا (BAC)</span>
                    <span className="text-[11px] text-slate-500">07 إلى 11 جوان 2027</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold rounded-md text-[10px]">
                    رسمي
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">تقييم مكتسبات مرحلة الابتدائي</span>
                    <span className="text-[11px] text-slate-500">10 إلى 14 ماي 2027</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px]">
                    إصلاحات 2026
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Event / Note Modal (for Teacher) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-600/30 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarDays className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-heading">
                    إضافة موعد أو ملاحظة بيداغوجية
                  </h3>
                  <p className="text-xs text-slate-500">
                    تظهر الملاحظة في التقويم الشهري للقسم وإشعار التلاميذ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  عنوان الموعد أو الملاحظة
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرض محروس رقم 2 في مادة الرياضيات، ندوة تربوية لمفتش المادة..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-bold text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تصنيف الموعد
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as CalendarEventType)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-semibold"
                  >
                    <option value="test">فرض محروس</option>
                    <option value="exam">امتحان رسمي أو فصلي</option>
                    <option value="holiday">عطلة مدرسية ورسمية</option>
                    <option value="meeting">مجلس قسم أو ندوة تربوية</option>
                    <option value="note">ملاحظة وتوجيه الأستاذ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الفوج / القسم المعني
                  </label>
                  <input
                    type="text"
                    value={formClassRoom}
                    onChange={(e) => setFormClassRoom(e.target.value)}
                    placeholder="مثال: السنة الرابعة متوسط (4م2)"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تاريخ الانطلاق / الموعد
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    تاريخ الانتهاء (اختياري للفترات)
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  تعليمات وتفاصيل بيداغوجية
                </label>
                <textarea
                  rows={3}
                  placeholder="اكتب التوجيهات، الدروس المقررة، أو المستلزمات للموعد..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl transition-colors shadow-xs"
                >
                  حفظ وإدراج في الرزنامة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
