import React, { useState } from 'react';
import { WEEKLY_TIMETABLE } from '../data/initialData';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

export const Timetable: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>('الأحد');

  const currentDayData = WEEKLY_TIMETABLE.find((d) => d.day === activeDay) || WEEKLY_TIMETABLE[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>جدول الحصص والتنظيم الأسبوعي للفوج (السنة الرابعة متوسط 4م2)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            توزيع المواد الدراسية، أوقات الحصص (من الأحد إلى الخميس)، والقاعات المخصصة وفق المنظومة الجزائرية
          </p>
        </div>

        {/* Days Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
          {WEEKLY_TIMETABLE.map((dayItem) => (
            <button
              key={dayItem.day}
              onClick={() => setActiveDay(dayItem.day)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeDay === dayItem.day
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dayItem.day}
            </button>
          ))}
        </div>
      </div>

      {/* Slots List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentDayData.slots.map((slot, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-md">
                {slot.subject}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 tabular-nums flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {slot.time}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{slot.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>الأستاذ المؤطر: <strong>{slot.teacher}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
