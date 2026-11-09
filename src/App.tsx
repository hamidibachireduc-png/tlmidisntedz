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
import { QuizAssessmentEngine } from './components/QuizAssessmentEngine';
import { RightSidebar } from './components/RightSidebar';
import { DzExamsTopNav } from './components/DzExamsTopNav';
import { DzExamsHub } from './components/DzExamsHub';
import { FontCustomizerModal } from './components/FontCustomizerModal';
import { LoginPage } from './components/LoginPage';
import { AdminSupervisionHub } from './components/AdminSupervisionHub';
import { ParentPortal } from './components/ParentPortal';
import { FinancialSecretaryPortal } from './components/FinancialSecretaryPortal';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';

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
  GoogleMeetTutoringSession,
  QuizAssessment,
  DzExamResource,
  QuizSubmission,
  FontSettings,
  DEFAULT_FONT_SETTINGS,
  AppUser,
  FeeReceipt,
  StudentFeeSummary,
  AbsenceJustification
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
  INITIAL_MEET_TUTORING_SESSIONS,
  INITIAL_NATIONAL_EXAMS_RESOURCES,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_SUBMISSIONS,
  INITIAL_APP_USERS,
  INITIAL_STUDENT_FEES,
  INITIAL_FEE_RECEIPTS,
  INITIAL_ABSENCE_JUSTIFICATIONS
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
  Video,
  Type,
  Crown
} from 'lucide-react';

export default function App() {
  // Accounts & Authentication State
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('tilmidi_app_users_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_APP_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('tilmidi_active_user_dz_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default to admin for immediate preview if wanted, or null for login page
    return null;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [fontModalOpen, setFontModalOpen] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Financial Fees & Receipts State
  const [studentFees, setStudentFees] = useState<StudentFeeSummary[]>(() => {
    const saved = localStorage.getItem('tilmidi_student_fees_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_FEES;
  });

  const [feeReceipts, setFeeReceipts] = useState<FeeReceipt[]>(() => {
    const saved = localStorage.getItem('tilmidi_fee_receipts_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_FEE_RECEIPTS;
  });

  const [justifications, setJustifications] = useState<AbsenceJustification[]>(() => {
    const saved = localStorage.getItem('tilmidi_absence_justifications_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_ABSENCE_JUSTIFICATIONS;
  });

  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<FeeReceipt | null>(null);

  useEffect(() => {
    localStorage.setItem('tilmidi_app_users_dz_2026', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tilmidi_student_fees_dz_2026', JSON.stringify(studentFees));
  }, [studentFees]);

  useEffect(() => {
    localStorage.setItem('tilmidi_fee_receipts_dz_2026', JSON.stringify(feeReceipts));
  }, [feeReceipts]);

  useEffect(() => {
    localStorage.setItem('tilmidi_absence_justifications_dz_2026', JSON.stringify(justifications));
  }, [justifications]);

  // Professional Font settings with localStorage
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => {
    const saved = localStorage.getItem('tilmidi_font_settings_dz_2026');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.family) return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_FONT_SETTINGS;
  });

  // Dynamic CSS Variables injection for selected font, scale and weight
  useEffect(() => {
    try {
      localStorage.setItem('tilmidi_font_settings_dz_2026', JSON.stringify(fontSettings));
    } catch (e) {
      // Storage quota guard
    }

    const fontFamilies: Record<string, string> = {
      'Cairo': "'Cairo', sans-serif",
      'Readex Pro': "'Readex Pro', sans-serif",
      'Amiri': "'Amiri', serif",
      'Tajawal': "'Tajawal', sans-serif",
      'Almarai': "'Almarai', sans-serif",
      'Alexandria': "'Alexandria', sans-serif",
    };

    const scaleValues: Record<string, string> = {
      'normal': '1',
      'comfortable': '1.06',
      'large': '1.12',
    };

    const weightValues: Record<string, string> = {
      'normal': '500',
      'medium': '600',
      'bold': '700',
    };

    const familyCss = fontFamilies[fontSettings.family] || "'Cairo', sans-serif";
    const scaleCss = scaleValues[fontSettings.scale] || '1';
    const weightCss = weightValues[fontSettings.weight] || '500';

    document.documentElement.style.setProperty('--app-font-family', familyCss);
    document.documentElement.style.setProperty('--app-font-scale', scaleCss);
    document.documentElement.style.setProperty('--app-font-weight', weightCss);
    document.body.style.fontFamily = familyCss;
    document.body.style.fontWeight = weightCss;
  }, [fontSettings]);

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

  // Quizzes with localStorage
  const [quizzes, setQuizzes] = useState<QuizAssessment[]>(() => {
    const saved = localStorage.getItem('tilmidi_quizzes_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  // National exams bank resources with localStorage
  const [dzExams, setDzExams] = useState<DzExamResource[]>(() => {
    const saved = localStorage.getItem('tilmidi_onec_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_NATIONAL_EXAMS_RESOURCES;
  });

  // Quiz submissions with localStorage
  const [quizSubmissions, setQuizSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem('tilmidi_quiz_submissions_dz_2026');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_SUBMISSIONS;
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

  useEffect(() => {
    localStorage.setItem('tilmidi_quizzes_dz_2026', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('tilmidi_onec_dz_2026', JSON.stringify(dzExams));
  }, [dzExams]);

  useEffect(() => {
    localStorage.setItem('tilmidi_quiz_submissions_dz_2026', JSON.stringify(quizSubmissions));
  }, [quizSubmissions]);

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

  // Handlers for Quizzes and DzExams Assessment Engine
  const handleAddQuiz = (newQuiz: QuizAssessment) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleSubmitQuiz = (submission: QuizSubmission) => {
    setQuizSubmissions((prev) => [submission, ...prev]);
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
    setNewsEvents([]);
    setCalendarEvents([]);
  };

  const handleImportStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  const handleConvertDzExamToQuiz = (exam: DzExamResource) => {
    const newQuiz: QuizAssessment = {
      id: `quiz-dz-${Date.now()}`,
      title: `كويز تفاعلي: ${exam.title}`,
      subject: exam.subject,
      level: exam.level,
      examSourceDzExams: `onec.edu.dz/${exam.id}`,
      timeLimitMinutes: 15,
      totalScore: 20,
      questions: exam.sampleQuestions,
      teacherName: userRole === 'teacher' ? 'الأستاذ المؤطر' : 'منسق المادة بالنقابة',
      pdfAttachmentUrl: exam.downloadUrl,
      pdfSolutionUrl: exam.solutionUrl,
      linkedLessonTitle: exam.title,
      createdAt: new Date().toISOString().split('T')[0],
      completionsCount: 0,
      averageScore: 0,
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    setCurrentTab('quizzes');
  };

  // Authentication Handlers
  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem('tilmidi_active_user_dz_2026', JSON.stringify(user));

    // Role-based automatic routing as requested
    if (user.role === 'admin') {
      setCurrentTab('admin_hub');
    } else if (user.role === 'teacher') {
      setCurrentTab('attendance');
    } else if (user.role === 'parent') {
      setCurrentTab('parent_portal');
    } else if (user.role === 'secretary') {
      setCurrentTab('financial_secretary');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tilmidi_active_user_dz_2026');
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    const matched = users.find((u) => u.role === newRole);
    if (matched) {
      setCurrentUser(matched);
      localStorage.setItem('tilmidi_active_user_dz_2026', JSON.stringify(matched));
    }
    if (newRole === 'admin') setCurrentTab('admin_hub');
    else if (newRole === 'teacher') setCurrentTab('attendance');
    else if (newRole === 'parent' || newRole === 'parent_student') setCurrentTab('parent_portal');
    else if (newRole === 'secretary') setCurrentTab('financial_secretary');
  };

  const handleAddUser = (newUser: AppUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdateUser = (updatedUser: AppUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('tilmidi_active_user_dz_2026', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleRecordPayment = (newReceipt: FeeReceipt, updatedSummary: StudentFeeSummary) => {
    setFeeReceipts((prev) => [newReceipt, ...prev]);
    setStudentFees((prev) =>
      prev.map((item) => (item.studentId === updatedSummary.studentId ? updatedSummary : item))
    );
  };

  const handleSubmitJustification = (newJust: AbsenceJustification) => {
    setJustifications((prev) => [newJust, ...prev]);
  };

  const handleAddStudent = (newStudent: Student, fee?: number) => {
    setStudents((prev) => [newStudent, ...prev]);
    const feeSummary: StudentFeeSummary = {
      studentId: newStudent.id,
      studentName: newStudent.name,
      registrationNumber: newStudent.registrationNumber,
      classRoom: newStudent.classRoom,
      guardianName: newStudent.guardianName,
      guardianPhone: newStudent.guardianPhone,
      monthlyFee: fee || 3000,
      paidAmount: 0,
      remainingAmount: fee || 3000,
      status: 'unpaid',
      month: 'نوفمبر 2026',
    };
    setStudentFees((prev) => [feeSummary, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    setStudentFees((prev) =>
      prev.map((f) =>
        f.studentId === updatedStudent.id
          ? {
              ...f,
              studentName: updatedStudent.name,
              classRoom: updatedStudent.classRoom,
              guardianName: updatedStudent.guardianName,
              guardianPhone: updatedStudent.guardianPhone,
            }
          : f
      )
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setStudentFees((prev) => prev.filter((f) => f.studentId !== studentId));
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== studentId));
  };

  const handleUpdateStudentFee = (updatedFee: StudentFeeSummary) => {
    setStudentFees((prev) => prev.map((f) => (f.studentId === updatedFee.studentId ? updatedFee : f)));
  };

  const handleDeleteReceipt = (receiptId: string) => {
    setFeeReceipts((prev) => prev.filter((r) => r.id !== receiptId));
  };

  const handleUpdateMeetSession = (updatedSession: GoogleMeetTutoringSession) => {
    setMeetSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)));
  };

  const handleDeleteMeetSession = (sessionId: string) => {
    setMeetSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleAddNewsEvent = (newItem: NewsEventItem) => {
    setNewsEvents((prev) => [newItem, ...prev]);
  };

  const handleUpdateNewsEvent = (updatedItem: NewsEventItem) => {
    setNewsEvents((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteNewsEvent = (itemId: string) => {
    setNewsEvents((prev) => prev.filter((item) => item.id !== itemId));
  };

  // If user is not logged in, show Unified Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} users={users} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Right-Side Vertical Navigation Sidebar (الجهة اليمنى بشكل عمودي) */}
      <RightSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userRole={userRole}
        onChangeRole={handleRoleChange}
        currentUser={currentUser}
        onLogout={handleLogout}
        schoolSettings={schoolSettings}
        onOpenSchoolSettings={() => setSchoolModalOpen(true)}
        isOpenMobile={sidebarMobileOpen}
        onCloseMobile={() => setSidebarMobileOpen(false)}
        dzExamsCount={dzExams.length}
        quizzesCount={quizzes.length}
        onOpenFontCustomizer={() => setFontModalOpen(true)}
        fontName={fontSettings.family}
      />

      {/* Main App Layout on Left of Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar matching onec.edu.dz portal */}
        <DzExamsTopNav
          onToggleSidebar={() => setSidebarMobileOpen((prev) => !prev)}
          userRole={userRole}
          onChangeRole={handleRoleChange}
          currentUser={currentUser}
          onLogout={handleLogout}
          schoolSettings={schoolSettings}
          onOpenSchoolSettings={() => setSchoolModalOpen(true)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onNavigateTab={setCurrentTab}
          onOpenFontCustomizer={() => setFontModalOpen(true)}
          currentFontName={fontSettings.family}
        />

        {/* Role, Institution & Font Banner Indicator (نسق ملكي: أخضر زمردي - أحمر ياقوتي - ذهبي ملكي) */}
        <div className="dz-royal-header text-white py-2 px-4 text-xs border-b border-amber-400/40 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-300" />
              <span>
                الحساب النشط: <strong className="text-amber-200">{currentUser.name}</strong> ({currentUser.title})
              </span>
            </div>
            <div className="flex items-center gap-3.5 text-[11px] text-emerald-100 hidden sm:flex">
              <span>المؤسسة: <strong className="text-white font-bold">{schoolSettings.schoolName}</strong></span>
              <span>·</span>
              <button 
                onClick={() => setFontModalOpen(true)}
                className="dz-badge-gold px-2.5 py-0.5 rounded-lg text-slate-950 hover:brightness-105 transition-all flex items-center gap-1 font-black cursor-pointer shadow-2xs"
                title="تعديل نموذج الخط الاحترافي"
              >
                <Type className="w-3.5 h-3.5 text-amber-900" />
                <span>الخط: {fontSettings.family}</span>
                <Crown className="w-3 h-3 text-amber-700" />
              </button>
              <span>·</span>
              <button 
                onClick={() => setCurrentTab('exams_bank')}
                className="hover:text-amber-300 transition-colors font-bold text-red-200"
              >
                بنك الفروض والامتحانات (PDF)
              </button>
              <span>·</span>
              <button 
                onClick={handleLogout}
                className="text-red-300 hover:text-white transition-colors flex items-center gap-1 font-bold"
              >
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === 'admin_hub' && (
            <AdminSupervisionHub
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              studentFees={studentFees}
              onUpdateStudentFee={handleUpdateStudentFee}
              feeReceipts={feeReceipts}
              onDeleteReceipt={handleDeleteReceipt}
              meetSessions={meetSessions}
              onAddMeetSession={handleAddMeetSession}
              onUpdateMeetSession={handleUpdateMeetSession}
              onDeleteMeetSession={handleDeleteMeetSession}
              newsEvents={newsEvents}
              onAddNewsEvent={handleAddNewsEvent}
              onUpdateNewsEvent={handleUpdateNewsEvent}
              onDeleteNewsEvent={handleDeleteNewsEvent}
              schoolSettings={schoolSettings}
              onUpdateSchoolSettings={setSchoolSettings}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'parent_portal' && currentUser && (
            <ParentPortal
              currentUser={currentUser}
              students={students}
              records={attendanceRecords}
              grades={grades}
              studentFees={studentFees}
              feeReceipts={feeReceipts}
              justifications={justifications}
              onSubmitJustification={handleSubmitJustification}
              onOpenReceiptModal={(rec) => setSelectedReceiptForModal(rec)}
            />
          )}

          {currentTab === 'financial_secretary' && currentUser && (
            <FinancialSecretaryPortal
              currentUser={currentUser}
              studentFees={studentFees}
              feeReceipts={feeReceipts}
              students={students}
              onRecordPayment={handleRecordPayment}
              schoolSettings={schoolSettings}
            />
          )}

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
              onOpenFontCustomizer={() => setFontModalOpen(true)}
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
            schoolSettings={schoolSettings}
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

        {(currentTab === 'exams_bank' || currentTab === 'onec_bank') && (
          <DzExamsHub
            exams={dzExams}
            onConvertToQuiz={handleConvertDzExamToQuiz}
            userRole={userRole}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
          />
        )}

        {currentTab === 'timetable' && (
          <Timetable />
        )}

        {currentTab === 'quizzes' && (
          <QuizAssessmentEngine
            quizzes={quizzes}
            dzExams={dzExams}
            submissions={quizSubmissions}
            students={students}
            userRole={userRole}
            onAddQuiz={handleAddQuiz}
            onSubmitQuiz={handleSubmitQuiz}
            onRecordGrade={handleAddGrade}
          />
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

      {/* Professional Arabic Font Customizer Modal (نافذة تعديل نموذج الخط الاحترافي) */}
      <FontCustomizerModal
        isOpen={fontModalOpen}
        onClose={() => setFontModalOpen(false)}
        fontSettings={fontSettings}
        onSave={(updated) => setFontSettings(updated)}
      />

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        receipt={selectedReceiptForModal}
        onClose={() => setSelectedReceiptForModal(null)}
        schoolSettings={schoolSettings}
      />

      {/* onec.edu.dz Portal Footer with Royal Ribbon */}
      <footer className="bg-slate-900 text-white mt-16 border-t-2 border-amber-400/50">
        <div className="dz-national-ribbon"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 text-white flex items-center justify-center font-bold border border-amber-400/40 shadow-sm">
                  <GraduationCap className="w-6 h-6 text-amber-300" />
                </div>
                {schoolSettings.logoUrl && (
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 bg-white p-0.5 shrink-0 flex items-center justify-center">
                    <img
                      src={schoolSettings.logoUrl}
                      alt={schoolSettings.schoolName}
                      className="w-full h-full object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div>
                  <span className="text-base font-extrabold tracking-tight block">
                    تطبيق تلميذي · بنك امتحانات وفروض الجزائر (onec.edu.dz)
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    النقابة الوطنية لعمال التربية (SNTE) و{schoolSettings.schoolName}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                أكبر بنك مواضيع وفروض وامتحانات رسمية في الجزائر لجميع الأطوار التعليمية: شهادة التعليم المتوسط (BEM)، شهادة البكالوريا (BAC)، وامتحان تقييم المكتسبات مع التصحيح الوزاري المعتمد وسلم التنقيط.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="text-emerald-400 font-bold">● وثائق PDF حصرية ومصححة</span>
                <span>·</span>
                <span className="text-amber-300 font-bold">● نسق ملكي معتمد</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                أقسام الامتحانات (الامتحانات الرسمية)
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button onClick={() => setCurrentTab('exams_bank')} className="hover:text-emerald-300 transition-colors text-emerald-300 font-bold flex items-center gap-1.5">
                    <span>📚 تصفح بنك الفروض والامتحانات الوطنية (PDF)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('quizzes')} className="hover:text-amber-300 transition-colors text-amber-300 font-bold flex items-center gap-1.5">
                    <span>⚡ كويزات تقييمية وتصحيح آلي</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('distance_tutoring')} className="hover:text-emerald-300 transition-colors">
                    دروس الدعم عن بعد (Google Meet)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('calendar')} className="hover:text-emerald-300 transition-colors">
                    التقويم البيداغوجي ورزنامة الامتحانات
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('attendance')} className="hover:text-emerald-300 transition-colors">
                    رصد الحضور والغياب الفوري
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('grades')} className="hover:text-emerald-300 transition-colors">
                    دفتر النقط وكشوف العلامات
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                التخصيص والروابط الرسمية
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button 
                    onClick={() => setFontModalOpen(true)}
                    className="hover:text-amber-200 transition-colors text-amber-300 font-extrabold flex items-center gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعديل نموذج الخط الاحترافي ({fontSettings.family})</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setSchoolModalOpen(true)}
                    className="hover:text-emerald-300 transition-colors text-emerald-300 font-bold flex items-center gap-1.5"
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>تغيير لوغو واسم المؤسسة</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('syndicate')} className="hover:text-emerald-300 transition-colors">
                    فضاء نقابة عمال التربية (SNTE)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('timetable')} className="hover:text-emerald-300 transition-colors">
                    جدول الحصص الأسبوعي
                  </button>
                </li>
                <li>
                  <a href="https://onec.edu.dz" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors text-amber-400 font-bold">
                    بوابة الموقع الرسمي onec.edu.dz ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} · تطبيق تلميذي بالتعاون مع بنك امتحانات onec.edu.dz والنقابة الوطنية لعمال التربية (SNTE)
            </div>
            <div className="flex items-center gap-4">
              <span>المنظومة التربوية الجزائرية 2026</span>
              <span>·</span>
              <span className="text-emerald-400 font-bold">المدرسة العمومية تكافؤ فرص للجميع</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

