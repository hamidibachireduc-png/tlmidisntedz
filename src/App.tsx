import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AttendanceTracker } from './components/AttendanceTracker';
import { HomeworkJournal } from './components/HomeworkJournal';
import { GradesReport } from './components/GradesReport';
import { MessagingCenter } from './components/MessagingCenter';
import { SyndicateHub } from './components/SyndicateHub';
import { Timetable } from './components/Timetable';
import { NewsAndEvents } from './components/NewsAndEvents';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { AcademicCalendar } from './components/AcademicCalendar';
import { DataBackupManager } from './components/DataBackupManager';
import { DistanceTutoringMeet } from './components/DistanceTutoringMeet';

import { 
  Student, 
  AttendanceRecord, 
  HomeworkAssignment, 
  GradeEntry, 
  ChatMessage, 
  UserRole, 
  AttendanceStatus,
  NewsEventItem,
  SchoolSettings,
  CalendarEvent,
  TeacherProfile,
  GoogleMeetTutoringSession
} from './types';

import { 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_GRADES, 
  INITIAL_MESSAGES, 
  SYNDICATE_RESOURCES, 
  FREE_TUTORING_SESSIONS,
  INITIAL_NEWS_EVENTS,
  DEFAULT_SCHOOL_SETTINGS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TEACHER_PROFILES,
  INITIAL_MEET_TUTORING_SESSIONS
} from './data/initialData';

import { 
  ShieldCheck, 
  HeartHandshake, 
  Calendar, 
  CalendarDays,
  GraduationCap, 
  UserCheck, 
  School,
  Sparkles,
  Award,
  Video
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);

  // School identity settings with localStorage (v2026 Algerian educational system)
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('tilmidi_school_settings_dz_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.republicHeading) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_SCHOOL_SETTINGS;
  });

  // News and events state with localStorage
  const [newsEvents, setNewsEvents] = useState<NewsEventItem[]>(() => {
    const saved = localStorage.getItem('tilmidi_news_events_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_NEWS_EVENTS;
  });

  // Students state with localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('tilmidi_students_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Attendance state with localStorage
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('tilmidi_attendance_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Homework assignments with localStorage
  const [assignments, setAssignments] = useState<HomeworkAssignment[]>(() => {
    const saved = localStorage.getItem('tilmidi_assignments_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Grades with localStorage
  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem('tilmidi_grades_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  // Messages with localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tilmidi_messages_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Calendar events with localStorage (Algerian pedagogical calendar 2025/2026)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('tilmidi_calendar_events_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  // Teacher Profiles for Tutoring
  const [teacherProfiles, setTeacherProfiles] = useState<TeacherProfile[]>(() => {
    const saved = localStorage.getItem('tilmidi_teacher_profiles_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_PROFILES;
  });

  // Active Teacher Profile for Tutoring
  const [activeTeacherId, setActiveTeacherId] = useState<string>(() => {
    const saved = localStorage.getItem('tilmidi_active_teacher_id_dz_2026');
    return saved || 'teach-1';
  });

  // Google Meet Tutoring Sessions
  const [meetSessions, setMeetSessions] = useState<GoogleMeetTutoringSession[]>(() => {
    const saved = localStorage.getItem('tilmidi_meet_sessions_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_MEET_TUTORING_SESSIONS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('tilmidi_school_settings_dz_2026', JSON.stringify(schoolSettings));
  }, [schoolSettings]);

  useEffect(() => {
    localStorage.setItem('tilmidi_news_events_dz_2026', JSON.stringify(newsEvents));
  }, [newsEvents]);

  useEffect(() => {
    localStorage.setItem('tilmidi_students_dz_2026', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('tilmidi_attendance_dz_2026', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('tilmidi_assignments_dz_2026', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('tilmidi_grades_dz_2026', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('tilmidi_messages_dz_2026', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tilmidi_calendar_events_dz_2026', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('tilmidi_teacher_profiles_dz_2026', JSON.stringify(teacherProfiles));
  }, [teacherProfiles]);

  useEffect(() => {
    localStorage.setItem('tilmidi_active_teacher_id_dz_2026', activeTeacherId);
  }, [activeTeacherId]);

  useEffect(() => {
    localStorage.setItem('tilmidi_meet_sessions_dz_2026', JSON.stringify(meetSessions));
  }, [meetSessions]);

  // Handlers for Academic Calendar
  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers for Google Meet Distance Tutoring
  const handleAddMeetSession = (newSession: GoogleMeetTutoringSession) => {
    setMeetSessions((prev) => [newSession, ...prev]);
  };

  const handleToggleEnrollment = (sessionId: string) => {
    setMeetSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const isEnrolled = !s.isStudentEnrolled;
          const registeredStudentsCount = isEnrolled
            ? s.registeredStudentsCount + 1
            : Math.max(0, s.registeredStudentsCount - 1);
          return { ...s, isStudentEnrolled: isEnrolled, registeredStudentsCount };
        }
        return s;
      })
    );
  };

  // Handler: Update attendance
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus, notes?: string) => {
    const today = '2026-11-08';
    const slot = '08:30 - 10:30';

    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) => r.studentId === studentId && r.date === today && r.timeSlot === slot
      );

      const targetStudent = students.find((s) => s.id === studentId);
      const studentName = targetStudent?.name || '';

      const updatedRecord: AttendanceRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `att-${Date.now()}`,
        studentId,
        studentName,
        date: today,
        timeSlot: slot,
        status,
        subject: 'الرياضيات',
        notifiedParent: true,
        notes,
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedRecord;
        return copy;
      } else {
        return [updatedRecord, ...prev];
      }
    });

    // Update student stats
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            attendanceStats: {
              ...st.attendanceStats,
              [status]: st.attendanceStats[status] + 1,
            },
          };
        }
        return st;
      })
    );
  };

  // Handler: Add Homework Assignment
  const handleAddAssignment = (newAssignment: HomeworkAssignment) => {
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  // Handler: Toggle Assignment status
  const handleToggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'pending' ? 'submitted' : 'pending';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Handler: Add Grade Entry
  const handleAddGrade = (newGrade: GradeEntry) => {
    setGrades((prev) => [newGrade, ...prev]);

    // Recalculate student average
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === newGrade.studentId) {
          const allStudentGrades = [...grades.filter((g) => g.studentId === st.id), newGrade];
          const totalCoeff = allStudentGrades.reduce((sum, g) => sum + g.coefficient, 0);
          const totalScore = allStudentGrades.reduce((sum, g) => sum + g.score * g.coefficient, 0);
          const newAvg = totalCoeff > 0 ? parseFloat((totalScore / totalCoeff).toFixed(2)) : st.currentAverage;
          return { ...st, currentAverage: newAvg };
        }
        return st;
      })
    );
  };

  // Handler: Send Message
  const handleSendMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  // Handler: News & Events Likes Toggle
  const handleToggleLike = (itemId: string) => {
    setNewsEvents((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isLiked = !item.isLiked;
          const likesCount = isLiked ? item.likesCount + 1 : item.likesCount - 1;
          return { ...item, isLiked, likesCount };
        }
        return item;
      })
    );
  };

  // Handler: Event RSVP toggle
  const handleToggleRsvp = (itemId: string) => {
    setNewsEvents((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const isRsvp = !item.isRsvp;
          const attendeesCount = (item.attendeesCount || 0) + (isRsvp ? 1 : -1);
          return { ...item, isRsvp, attendeesCount };
        }
        return item;
      })
    );
  };

  // Handler: Add Comment to News or Event
  const handleAddComment = (itemId: string, content: string, authorName: string, authorRole: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName,
      authorRole,
      avatarText: authorName.slice(0, 2),
      content,
      timestamp: 'الآن',
    };

    setNewsEvents((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, comments: [...item.comments, newComment] };
        }
        return item;
      })
    );
  };

  // Handler: Add new News or Event
  const handleAddNewNewsEvent = (newItem: NewsEventItem) => {
    setNewsEvents((prev) => [newItem, ...prev]);
  };

  // Data Management Handlers: Restore, Import, Clear & Reset
  const handleRestoreAllData = (data: {
    students?: Student[];
    attendanceRecords?: AttendanceRecord[];
    assignments?: HomeworkAssignment[];
    grades?: GradeEntry[];
    messages?: ChatMessage[];
    newsEvents?: NewsEventItem[];
    schoolSettings?: SchoolSettings;
    calendarEvents?: CalendarEvent[];
  }) => {
    if (data.students) setStudents(data.students);
    if (data.attendanceRecords) setAttendanceRecords(data.attendanceRecords);
    if (data.assignments) setAssignments(data.assignments);
    if (data.grades) setGrades(data.grades);
    if (data.messages) setMessages(data.messages);
    if (data.newsEvents) setNewsEvents(data.newsEvents);
    if (data.schoolSettings) setSchoolSettings(data.schoolSettings);
    if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
  };

  const handleClearAttendance = () => {
    setAttendanceRecords([]);
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        attendanceStats: { present: 0, absent: 0, late: 0, excused: 0 },
      }))
    );
  };

  const handleClearGrades = () => {
    setGrades([]);
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        currentAverage: 0,
      }))
    );
  };

  const handleClearAssignments = () => {
    setAssignments([]);
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleClearCalendarNotes = () => {
    setCalendarEvents((prev) => prev.filter((e) => e.isOfficial));
  };

  const handleResetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setAssignments(INITIAL_ASSIGNMENTS);
    setGrades(INITIAL_GRADES);
    setMessages(INITIAL_MESSAGES);
    setNewsEvents(INITIAL_NEWS_EVENTS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
  };

  const handleFullWipe = () => {
    setStudents([]);
    setAttendanceRecords([]);
    setAssignments([]);
    setGrades([]);
    setMessages([]);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS.filter((e) => e.isOfficial));
  };

  const handleImportStudents = (newStudents: Student[]) => {
    setStudents((prev) => [...prev, ...newStudents]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar with Royal Red, Green, and Gold palette */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onChangeRole={setUserRole}
        schoolSettings={schoolSettings}
        onOpenSchoolSettings={() => setSchoolModalOpen(true)}
      />

      {/* Role and Institution Banner Indicator */}
      <div className="bg-gradient-to-r from-red-900 via-emerald-900 to-slate-900 text-white py-1.5 px-4 text-xs border-b border-amber-500/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-300" />
            <span>
              الحساب النشط: <strong className="text-amber-200">{userRole === 'teacher' ? 'الأستاذ المؤطر (عضو النقابة الوطنية لعمال التربية SNTE)' : 'التلميذ / ولي الأمر'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-200 hidden sm:flex">
            <span>المؤسسة: <strong className="text-white font-bold">{schoolSettings.schoolName}</strong></span>
            <span>·</span>
            <span>الفوج: السنة الرابعة متوسط (4م2 - BEM)</span>
            <span>·</span>
            <button 
              onClick={() => setCurrentTab('timetable')}
              className="underline hover:text-amber-300 transition-colors"
            >
              عرض جدول الحصص
            </button>
            <span>·</span>
            <button 
              onClick={() => setSchoolModalOpen(true)}
              className="text-amber-300 hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <School className="w-3.5 h-3.5" />
              <span>تغيير لوغو المؤسسة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            students={students}
            assignments={assignments}
            grades={grades}
            userRole={userRole}
            onNavigateTab={setCurrentTab}
            schoolSettings={schoolSettings}
            onOpenSchoolSettings={() => setSchoolModalOpen(true)}
            calendarEvents={calendarEvents}
            attendanceRecords={attendanceRecords}
          />
        )}

        {currentTab === 'calendar' && (
          <AcademicCalendar
            events={calendarEvents}
            onAddEvent={handleAddCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            userRole={userRole}
            schoolSettings={schoolSettings}
          />
        )}

        {currentTab === 'news' && (
          <NewsAndEvents
            items={newsEvents}
            onToggleLike={handleToggleLike}
            onToggleRsvp={handleToggleRsvp}
            onAddComment={handleAddComment}
            onAddNewItem={handleAddNewNewsEvent}
            userRole={userRole}
          />
        )}

        {currentTab === 'attendance' && (
          <AttendanceTracker
            students={students}
            records={attendanceRecords}
            onUpdateStatus={handleUpdateAttendance}
            userRole={userRole}
          />
        )}

        {currentTab === 'homework' && (
          <HomeworkJournal
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onToggleStatus={handleToggleAssignmentStatus}
            userRole={userRole}
          />
        )}

        {currentTab === 'grades' && (
          <GradesReport
            grades={grades}
            students={students}
            onAddGrade={handleAddGrade}
            userRole={userRole}
            schoolSettings={schoolSettings}
            onOpenSchoolSettings={() => setSchoolModalOpen(true)}
          />
        )}

        {currentTab === 'messages' && (
          <MessagingCenter
            messages={messages}
            students={students}
            onSendMessage={handleSendMessage}
            userRole={userRole}
          />
        )}

        {currentTab === 'syndicate' && (
          <SyndicateHub
            resources={SYNDICATE_RESOURCES}
            tutoringSessions={FREE_TUTORING_SESSIONS}
          />
        )}

        {currentTab === 'timetable' && (
          <Timetable />
        )}

        {currentTab === 'distance_tutoring' && (
          <DistanceTutoringMeet
            sessions={meetSessions}
            teacherProfiles={teacherProfiles}
            activeTeacherId={activeTeacherId}
            onSelectTeacher={setActiveTeacherId}
            onAddSession={handleAddMeetSession}
            onToggleEnrollment={handleToggleEnrollment}
            userRole={userRole}
            schoolSettings={schoolSettings}
          />
        )}

        {currentTab === 'data_backup' && (
          <DataBackupManager
            students={students}
            attendanceRecords={attendanceRecords}
            assignments={assignments}
            grades={grades}
            messages={messages}
            newsEvents={newsEvents}
            schoolSettings={schoolSettings}
            calendarEvents={calendarEvents}
            userRole={userRole}
            onRestoreAllData={handleRestoreAllData}
            onClearAttendance={handleClearAttendance}
            onClearGrades={handleClearGrades}
            onClearAssignments={handleClearAssignments}
            onClearMessages={handleClearMessages}
            onClearCalendarNotes={handleClearCalendarNotes}
            onResetToDefaults={handleResetToDefaults}
            onFullWipe={handleFullWipe}
            onImportStudents={handleImportStudents}
          />
        )}
      </main>

      {/* School Settings Modal */}
      <SchoolSettingsModal
        isOpen={schoolModalOpen}
        onClose={() => setSchoolModalOpen(false)}
        settings={schoolSettings}
        onSave={(updated) => setSchoolSettings(updated)}
      />

      {/* Institutional Royal Moroccan Footer */}
      <footer className="bg-slate-950 text-white mt-16 border-t-2 border-amber-500/40">
        <div className="h-1 bg-gradient-to-r from-red-700 via-amber-500 to-emerald-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-700 to-emerald-800 text-white flex items-center justify-center font-bold border border-amber-400">
                  <GraduationCap className="w-6 h-6 text-amber-300" />
                </div>
                {schoolSettings.logoUrl && (
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400/80 bg-white p-0.5 shrink-0 flex items-center justify-center">
                    <img
                      src={schoolSettings.logoUrl}
                      alt={schoolSettings.schoolName}
                      className="w-full h-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div>
                  <span className="text-lg font-extrabold tracking-tight block">
                    تطبيق تلميذي · النقابة الوطنية لعمال التربية (SNTE)
                  </span>
                  <span className="text-xs text-amber-400 font-bold">
                    {schoolSettings.schoolName} ({schoolSettings.schoolType})
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                مبادرة تربوية ورقمية تضامنية مخصصة للتلاميذ والأساتذة والأولياء وفق أحدث إصلاحات وزارة التربية الوطنية 2026، لتعزيز المتابعة المدرسية، حفظ خصوصية الأستاذ، وتقديم الدعم المجاني لتحضير شهادة التعليم المتوسط (BEM) والبكالوريا (BAC).
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="text-emerald-400 font-bold">● نظام متوافق مع الأرضية الرقمية</span>
                <span>·</span>
                <span className="text-amber-300">ألوان وتنسيق الهوية الوطنية والملكية الذهبية</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                الأقسام والخدمات
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => setCurrentTab('calendar')} className="hover:text-amber-300 transition-colors text-amber-200/90 font-medium flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                    <span>التقويم البيداغوجي والرزنامة الرسمية 2026</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('news')} className="hover:text-amber-300 transition-colors">
                    الأخبار والفعاليات والأنشطة
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('attendance')} className="hover:text-amber-300 transition-colors">
                    رصد الحضور والغياب الفوري
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('homework')} className="hover:text-amber-300 transition-colors">
                    دفتر الواجبات والفروض المدرسية
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('grades')} className="hover:text-amber-300 transition-colors">
                    كشف النقط والرسم البياني
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('messages')} className="hover:text-amber-300 transition-colors">
                    المراسلات والرسائل الصوتية
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('distance_tutoring')} className="hover:text-amber-300 transition-colors text-emerald-300 font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>دروس الدعم عن بعد (Google Meet)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('data_backup')} className="hover:text-amber-300 transition-colors text-amber-300 font-bold">
                    تصدير واستيراد وتفريغ البيانات
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3">
                تخصيص وهوية المدرسة
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button 
                    onClick={() => setSchoolModalOpen(true)}
                    className="hover:text-amber-300 transition-colors text-emerald-400 font-bold flex items-center gap-1.5"
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>تغيير لوغو واسم المؤسسة</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('syndicate')} className="hover:text-amber-300 transition-colors">
                    دروس الدعم المجاني لـ BEM
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('syndicate')} className="hover:text-amber-300 transition-colors">
                    بنك حوليات BEM و BAC الرسمية
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('timetable')} className="hover:text-amber-300 transition-colors">
                    جدول الحصص الأسبوعي (الأحد - الخميس)
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">حماية الخصوصية وساعات العمل</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} · تطبيق تلميذي وفق النظام التربوي الجزائري برعاية النقابة الوطنية لعمال التربية (SNTE) و{schoolSettings.schoolName}
            </div>
            <div className="flex items-center gap-4">
              <span>منصة رقمية للمدرسة الجزائرية العمومية</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">تضامن · جودة · تكافؤ فرص</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
