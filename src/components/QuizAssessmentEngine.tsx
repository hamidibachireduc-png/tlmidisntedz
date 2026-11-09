import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  QuizAssessment, 
  QuizQuestion, 
  QuizSubmission, 
  DzExamResource, 
  UserRole, 
  Subject,
  GradeEntry,
  Student
} from '../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  Award, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  RotateCcw, 
  Check, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft,
  ChevronDown, 
  Download, 
  Layers, 
  Search, 
  Send,
  Zap,
  BookmarkCheck,
  TrendingUp,
  BrainCircuit,
  AlertCircle,
  School
} from 'lucide-react';

interface QuizAssessmentEngineProps {
  quizzes: QuizAssessment[];
  dzExams: DzExamResource[];
  submissions: QuizSubmission[];
  students: Student[];
  userRole: UserRole;
  onAddQuiz: (newQuiz: QuizAssessment) => void;
  onSubmitQuiz: (submission: QuizSubmission) => void;
  onRecordGrade?: (grade: GradeEntry) => void;
}

export const QuizAssessmentEngine: React.FC<QuizAssessmentEngineProps> = ({
  quizzes,
  dzExams,
  submissions,
  students,
  userRole,
  onAddQuiz,
  onSubmitQuiz,
  onRecordGrade,
}) => {
  // Navigation sub-tabs within Quiz engine
  const [activeTab, setActiveTab] = useState<'quizzes' | 'onec' | 'create' | 'submissions'>('quizzes');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Quiz Playing State
  const [playingQuiz, setPlayingQuiz] = useState<QuizAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [currentSubmissionResult, setCurrentSubmissionResult] = useState<QuizSubmission | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || 'std-1');

  // Teacher Creation Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<Subject>('الرياضيات');
  const [newLevel, setNewLevel] = useState('السنة الرابعة متوسط (شهادة التعليم المتوسط BEM)');
  const [newTimeLimit, setNewTimeLimit] = useState<number>(15);
  const [newExamSource, setNewExamSource] = useState('onec.edu.dz/bem/session-2026');
  const [newPdfUrl, setNewPdfUrl] = useState('https://onec.edu.dz');
  const [newQuestions, setNewQuestions] = useState<QuizQuestion[]>([
    {
      id: `q-${Date.now()}-1`,
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      points: 5,
    },
  ]);
  const [createSuccessMsg, setCreateSuccessMsg] = useState('');

  // Timer countdown for active quiz
  useEffect(() => {
    if (!playingQuiz || quizSubmitted || timeRemainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playingQuiz, quizSubmitted, timeRemainingSeconds]);

  // Start a Quiz
  const handleStartQuiz = (quiz: QuizAssessment) => {
    setPlayingQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemainingSeconds(quiz.timeLimitMinutes * 60);
    setQuizSubmitted(false);
    setCurrentSubmissionResult(null);
  };

  // Select option in active quiz
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit and Auto-Grade Quiz
  const handleFinishQuiz = () => {
    if (!playingQuiz) return;

    let earnedScore = 0;
    let totalScore = 0;

    playingQuiz.questions.forEach((q) => {
      totalScore += q.points;
      const selected = userAnswers[q.id];
      if (selected !== undefined && selected === q.correctOptionIndex) {
        earnedScore += q.points;
      }
    });

    const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];
    const percentage = totalScore > 0 ? Math.round((earnedScore / totalScore) * 100) : 0;
    const timeSpent = playingQuiz.timeLimitMinutes * 60 - timeRemainingSeconds;

    const submission: QuizSubmission = {
      id: `sub-${Date.now()}`,
      quizId: playingQuiz.id,
      quizTitle: playingQuiz.title,
      studentId: activeStudent?.id || 'std-1',
      studentName: activeStudent?.name || 'محمد لمين بلقاسم',
      answers: userAnswers,
      score: earnedScore,
      totalScore: totalScore,
      percentage: percentage,
      timeSpentSeconds: Math.max(15, timeSpent),
      submittedAt: new Date().toLocaleDateString('ar-DZ') + ' ' + new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      savedToGrades: false,
    };

    setQuizSubmitted(true);
    setCurrentSubmissionResult(submission);
    onSubmitQuiz(submission);

    // Trigger celebration confetti if passing score
    if (percentage >= 50) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6b0066', '#9236b8', '#bb95ff', '#ffbc4e', '#10b981'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Record score into grades book
  const handleSaveToGradebook = () => {
    if (!currentSubmissionResult || !playingQuiz || !onRecordGrade) return;

    const newGrade: GradeEntry = {
      id: `grd-quiz-${Date.now()}`,
      studentId: currentSubmissionResult.studentId,
      studentName: currentSubmissionResult.studentName,
      subject: playingQuiz.subject,
      evaluationName: `كويز تقييمي: ${playingQuiz.title.slice(0, 30)}...`,
      score: currentSubmissionResult.score,
      coefficient: 1,
      date: new Date().toISOString().split('T')[0],
      teacherComment: `تقويم آلي عبر كويز onec.edu.dz - النسبة: ${currentSubmissionResult.percentage}%`,
    };

    onRecordGrade(newGrade);
    setCurrentSubmissionResult((prev) => prev ? { ...prev, savedToGrades: true } : null);
  };

  // Convert a onec resource directly into an interactive quiz
  const handleConvertDzExamToQuiz = (exam: DzExamResource) => {
    const newQuiz: QuizAssessment = {
      id: `quiz-dz-${Date.now()}`,
      title: `كويز تفاعلي: ${exam.title}`,
      subject: exam.subject,
      level: exam.level,
      examSourceDzExams: `الديوان الوطني للامتحانات (ONEC) - ${exam.id}`,
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

    onAddQuiz(newQuiz);
    setActiveTab('quizzes');
    handleStartQuiz(newQuiz);
  };

  // Add question to teacher creator
  const handleAddQuestionToBuilder = () => {
    setNewQuestions((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}-${prev.length + 1}`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        explanation: '',
        points: 5,
      },
    ]);
  };

  // Update question field
  const handleUpdateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setNewQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Update option text
  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setNewQuestions((prev) => {
      const copy = [...prev];
      const newOpts = [...copy[qIndex].options];
      newOpts[optIndex] = text;
      copy[qIndex].options = newOpts;
      return copy;
    });
  };

  // Remove question
  const handleRemoveQuestion = (index: number) => {
    if (newQuestions.length <= 1) return;
    setNewQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit new Quiz from Teacher
  const handleSaveTeacherQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Validate that questions have text and options
    const validQuestions = newQuestions.filter(
      (q) => q.questionText.trim() && q.options.some((o) => o.trim())
    );

    if (validQuestions.length === 0) {
      alert('يرجى كتابة نص السؤال والخيارات المتاحة قبل الحفظ.');
      return;
    }

    const totalPts = validQuestions.reduce((sum, q) => sum + (Number(q.points) || 5), 0);

    const createdQuiz: QuizAssessment = {
      id: `quiz-custom-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      level: newLevel,
      examSourceDzExams: newExamSource || 'بنك الفروض والامتحانات الوطنية الرسمية (ONEC)',
      timeLimitMinutes: newTimeLimit,
      totalScore: totalPts,
      questions: validQuestions,
      teacherName: 'الأستاذ المؤطر (عضو SNTE)',
      pdfAttachmentUrl: newPdfUrl,
      createdAt: new Date().toISOString().split('T')[0],
      completionsCount: 0,
      averageScore: 0,
    };

    onAddQuiz(createdQuiz);
    setCreateSuccessMsg('تم إنشاء ونشر الكويز التقييمي بنجاح، وأصبح متاحاً للتلاميذ الآن!');
    setTimeout(() => {
      setCreateSuccessMsg('');
      setActiveTab('quizzes');
    }, 1800);
  };

  // Preload a ready onec template into creator
  const handleLoadTemplateIntoBuilder = (exam: DzExamResource) => {
    setNewTitle(`كويز تدريبي: ${exam.title.slice(0, 40)}...`);
    setNewSubject(exam.subject);
    setNewLevel(exam.level);
    setNewPdfUrl(exam.downloadUrl);
    setNewExamSource(`onec.edu.dz/${exam.id}`);
    setNewQuestions(exam.sampleQuestions);
    setActiveTab('create');
  };

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    const matchSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    const matchSearch = searchQuery === '' || q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.subject.includes(searchQuery);
    return matchSubject && matchSearch;
  });

  // Filter onec resources
  const filteredDzExams = dzExams.filter((d) => {
    const matchSubject = selectedSubject === 'all' || d.subject === selectedSubject;
    const matchSearch = searchQuery === '' || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.subject.includes(searchQuery);
    return matchSubject && matchSearch;
  });

  return (
    <div className="space-y-8 relative">
      {/* Ambient Radial Glow in fedu.ai style */}
      <div className="fedu-glow top-0 right-1/4"></div>

      {/* Hero Header with Fedu.ai visual language */}
      <div className="fedu-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-white via-[#faf5fb] to-[#faebf9]/60 border border-[#6b0066]/15">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            {/* Fedu.ai Pill Badge with geometric accent */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faebf9] text-[#6b0066] text-xs font-bold border border-[#6b0066]/20 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#9236b8] animate-pulse"></span>
              <span>بنك الامتحانات الرسمية والكويزات التفاعلية · onec.edu.dz</span>
              <span className="text-slate-400">·</span>
              <span className="text-[#330524] font-semibold">تصحيح آلي فوري 2026</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#330524] tracking-tight leading-snug">
              منصة الاختبارات التقييمية القصيرة (Quizzes) ومواضيع BEM
            </h1>

            <p className="text-sm text-[#330524]/80 leading-relaxed">
              تحويل مواضيع وحوليات شهادة التعليم المتوسط (BEM) والبكالوريا الرسمية من بنك الموقع الجزائري 
              <strong className="text-[#6b0066] mx-1">onec.edu.dz</strong> 
              إلى كويزات تقييمية تفاعلية مع تصحيح بيداغوجي ذاتي وحفظ مباشر في كشوف النقاط.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#330524]/70">
              <div className="flex items-center gap-1.5 font-bold text-[#6b0066]">
                <CheckCircle2 className="w-4 h-4 text-[#9236b8]" />
                <span>تصحيح آلي فوري</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>مواضيع BEM 2024-2026 رسمية</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                <span>شرح تفصيلي للحل النموذجي</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Cards */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <div className="p-4 rounded-2xl bg-white border border-[#6b0066]/10 text-center shadow-xs min-w-[110px]">
              <span className="block text-2xl font-black text-[#6b0066] tabular-nums">{quizzes.length}</span>
              <span className="text-[11px] font-bold text-slate-500">كويز متاح</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#6b0066]/10 text-center shadow-xs min-w-[110px]">
              <span className="block text-2xl font-black text-[#9236b8] tabular-nums">{dzExams.length}</span>
              <span className="text-[11px] font-bold text-slate-500">موضوع امتحاني رسمي</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#6b0066]/10 text-center shadow-xs min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-700 tabular-nums">{submissions.length}</span>
              <span className="text-[11px] font-bold text-slate-500">إجابة مصححة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pill Navigation Tabs in Fedu.ai Style */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="inline-flex p-1.5 rounded-full bg-white border border-[#6b0066]/15 shadow-xs max-w-full overflow-x-auto">
          <button
            onClick={() => { setPlayingQuiz(null); setActiveTab('quizzes'); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quizzes' && !playingQuiz
                ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                : 'text-[#330524] hover:text-[#6b0066] hover:bg-[#faebf9]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الاختبارات التفاعلية ({quizzes.length})</span>
          </button>

          <button
            onClick={() => { setPlayingQuiz(null); setActiveTab('onec'); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'onec' && !playingQuiz
                ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                : 'text-[#330524] hover:text-[#6b0066] hover:bg-[#faebf9]'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            <span>بنك الامتحانات الرسمية الوطنية ({dzExams.length})</span>
          </button>

          <button
            onClick={() => { setPlayingQuiz(null); setActiveTab('create'); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'create' && !playingQuiz
                ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                : 'text-[#330524] hover:text-[#6b0066] hover:bg-[#faebf9]'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>إنشاء Quiz جديد (للأستاذ)</span>
          </button>

          <button
            onClick={() => { setPlayingQuiz(null); setActiveTab('submissions'); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'submissions' && !playingQuiz
                ? 'bg-gradient-to-r from-[#6b0066] to-[#9236b8] text-white shadow-xs'
                : 'text-[#330524] hover:text-[#6b0066] hover:bg-[#faebf9]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#bb95ff]" />
            <span>سجل النتائج ({submissions.length})</span>
          </button>
        </div>

        {/* Filter and Student Switcher */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-full bg-white border border-[#6b0066]/15 text-xs font-bold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
          >
            <option value="all">جميع المواد التعليمية</option>
            <option value="الرياضيات">الرياضيات</option>
            <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا</option>
            <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
            <option value="اللغة العربية">اللغة العربية</option>
          </select>

          {/* Student Selector (for simulation / grading) */}
          <div className="hidden md:flex items-center gap-1 text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-slate-200">
            <span className="text-slate-400">التلميذ الممتحن:</span>
            <select
              value={activeStudentId}
              onChange={(e) => setActiveStudentId(e.target.value)}
              className="bg-transparent text-[#6b0066] font-bold focus:outline-none cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MODE 1: ACTIVE QUIZ PLAYER (Interactive Assessment with Timer & Auto-Correction) */}
      {playingQuiz && (
        <div className="fedu-card p-6 sm:p-8 space-y-6 border-2 border-[#6b0066]/20 bg-white shadow-lg relative overflow-hidden">
          {/* Top Progress Bar & Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#6b0066]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#faebf9] text-[#6b0066] border border-[#6b0066]/20">
                  {playingQuiz.subject}
                </span>
                <span>·</span>
                <span className="text-slate-500">{playingQuiz.level}</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#330524] mt-1">
                {playingQuiz.title}
              </h2>
            </div>

            {/* Timer and Exit Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Countdown Timer */}
              <div className={`px-4 py-2 rounded-full font-mono font-bold text-sm flex items-center gap-2 border ${
                timeRemainingSeconds < 120 
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-[#faebf9] text-[#6b0066] border-[#6b0066]/20'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">
                  {Math.floor(timeRemainingSeconds / 60)}:{('0' + (timeRemainingSeconds % 60)).slice(-2)}
                </span>
              </div>

              <button
                onClick={() => setPlayingQuiz(null)}
                className="fedu-btn-secondary px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                إنهاء وخروج
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#330524] mb-1.5">
              <span>السؤال {currentQuestionIndex + 1} من {playingQuiz.questions.length}</span>
              <span>
                تمت الإجابة: {Object.keys(userAnswers).length} من {playingQuiz.questions.length}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6b0066] via-[#9236b8] to-[#bb95ff] rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / playingQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question and Options Area */}
          {!quizSubmitted ? (
            <div className="space-y-6 pt-2">
              {/* Current Question */}
              {(() => {
                const currentQ = playingQuiz.questions[currentQuestionIndex];
                if (!currentQ) return null;
                const selectedOption = userAnswers[currentQ.id];

                return (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-[#faf9fb] border border-[#6b0066]/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                        <span className="text-[#6b0066]">العلامة: {currentQ.points} نقاط</span>
                        {currentQ.sourceExamInfo && (
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {currentQ.sourceExamInfo}
                          </span>
                        )}
                      </div>
                      <p className="text-base sm:text-lg font-bold text-[#330524] leading-relaxed">
                        {currentQ.questionText}
                      </p>
                    </div>

                    {/* Choices (أ، ب، ج، د) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ.options.map((option, optIdx) => {
                        const isChosen = selectedOption === optIdx;
                        const letters = ['أ', 'ب', 'ج', 'د'];

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(currentQ.id, optIdx)}
                            className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${
                              isChosen
                                ? 'bg-[#faebf9] border-[#6b0066] ring-2 ring-[#6b0066]/30 text-[#6b0066] font-bold shadow-xs'
                                : 'bg-white border-slate-200 text-[#330524] hover:border-[#6b0066]/40 hover:bg-[#faf9fb]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isChosen ? 'bg-[#6b0066] text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {letters[optIdx] || optIdx + 1}
                              </span>
                              <span className="text-sm">{option}</span>
                            </div>
                            {isChosen && (
                              <CheckCircle2 className="w-5 h-5 text-[#6b0066] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pagination & Next/Previous Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="fedu-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>السؤال السابق</span>
                      </button>

                      {currentQuestionIndex < playingQuiz.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => Math.min(playingQuiz.questions.length - 1, prev + 1))}
                          className="fedu-btn-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
                        >
                          <span>السؤال الموالي</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleFinishQuiz}
                          className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                          <Check className="w-4 h-4" />
                          <span>إنهاء وتصحيح الكويز آلياً</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Post-Submission Auto-Corrected Results View */
            currentSubmissionResult && (
              <div className="space-y-8 pt-4">
                {/* Result Hero Banner */}
                <div className={`p-6 sm:p-8 rounded-[26px] border text-center space-y-3 ${
                  currentSubmissionResult.percentage >= 80
                    ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-300'
                    : currentSubmissionResult.percentage >= 50
                    ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-white border-amber-300'
                    : 'bg-gradient-to-br from-rose-50 via-red-50 to-white border-rose-300'
                }`}>
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-sm text-2xl font-black bg-white">
                    {currentSubmissionResult.percentage >= 80 ? '🎉' : currentSubmissionResult.percentage >= 50 ? '👍' : '⚠️'}
                  </div>

                  <h3 className="text-2xl font-black text-[#330524]">
                    نتيجة التصحيح الآلي للكويز: {currentSubmissionResult.score} / {currentSubmissionResult.totalScore}
                  </h3>

                  <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
                    {currentSubmissionResult.percentage >= 80 
                      ? 'ممتاز جداً! تحكم بيداغوجي رائع في كفاءات المادة وفق معايير شهادة التعليم المتوسط BEM.'
                      : currentSubmissionResult.percentage >= 50
                      ? 'مستوى متوسط ومقبول! راجع الحل النموذجي أسفله لتدارك الأخطاء والارتقاء بالمعدل.'
                      : 'تحتاج إلى مراجعة مكثفة للدرس والتمارين المحلولة. طالع التوضيحات البيداغوجية أسفله.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">
                      النسبة المئوية: <strong className="text-[#6b0066]">{currentSubmissionResult.percentage}%</strong>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">
                      التلميذ: <strong>{currentSubmissionResult.studentName}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">
                      الوقت المستغرق: <strong>{Math.floor(currentSubmissionResult.timeSpentSeconds / 60)} دقيقة و {currentSubmissionResult.timeSpentSeconds % 60} ثانية</strong>
                    </span>
                  </div>

                  {/* Save to Grades Action */}
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    {onRecordGrade && !currentSubmissionResult.savedToGrades ? (
                      <button
                        onClick={handleSaveToGradebook}
                        className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#6b0066] text-white hover:bg-[#540050] shadow-md flex items-center gap-2 transition-all"
                      >
                        <BookmarkCheck className="w-4 h-4" />
                        <span>تسجيل العلامة ({currentSubmissionResult.score}/20) في كشف النقاط الرسمي</span>
                      </button>
                    ) : currentSubmissionResult.savedToGrades ? (
                      <div className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>تم حفظ العلامة بنجاح في كشف نقاط التلميذ</span>
                      </div>
                    ) : null}

                    <button
                      onClick={() => handleStartQuiz(playingQuiz)}
                      className="fedu-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة المحاولة من جديد</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Model Answers & Step-by-Step Pedagogical Explanation */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-[#6b0066]" />
                    <h4 className="text-base font-extrabold text-[#330524]">
                      التصحيح النموذجي المفصل وشبكة التقويم البيداغوجي (onec.edu.dz)
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {playingQuiz.questions.map((q, idx) => {
                      const userChoice = userAnswers[q.id];
                      const isCorrect = userChoice === q.correctOptionIndex;
                      const letters = ['أ', 'ب', 'ج', 'د'];

                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isCorrect 
                              ? 'bg-emerald-50/50 border-emerald-200' 
                              : 'bg-rose-50/50 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center text-white ${
                                isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-600">
                                السؤال {idx + 1} ({q.points} نقاط)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              {isCorrect ? (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>إجابة صحيحة (+{q.points})</span>
                                </span>
                              ) : (
                                <span className="text-rose-700 flex items-center gap-1">
                                  <XCircle className="w-4 h-4" />
                                  <span>إجابة خاطئة (0/{q.points})</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm font-bold text-[#330524] mb-3">
                            {q.questionText}
                          </p>

                          {/* Options Breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {q.options.map((opt, oIdx) => {
                              const wasSelected = userChoice === oIdx;
                              const isTheCorrectOne = q.correctOptionIndex === oIdx;

                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                    isTheCorrectOne
                                      ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 font-bold'
                                      : wasSelected
                                      ? 'bg-rose-100/80 border-rose-300 text-rose-900 font-semibold'
                                      : 'bg-white/80 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold">{letters[oIdx] || oIdx + 1}.</span>
                                    <span>{opt}</span>
                                  </div>
                                  {isTheCorrectOne && (
                                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">
                                      الإجابة الصحيحة ✓
                                    </span>
                                  )}
                                  {wasSelected && !isTheCorrectOne && (
                                    <span className="text-[10px] font-bold text-rose-800 bg-rose-200 px-1.5 py-0.5 rounded">
                                      إجابتك ✗
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Pedagogical Explanation */}
                          {q.explanation && (
                            <div className="p-3 rounded-xl bg-white/90 border border-slate-200 text-xs text-[#330524] leading-relaxed">
                              <span className="font-bold text-[#6b0066] block mb-1">
                                💡 الشرح البيداغوجي وسلّم التنقيط:
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* MODE 2: QUIZZES CATALOG */}
      {activeTab === 'quizzes' && !playingQuiz && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#330524]">
              الاختبارات التفاعلية المتاحة للحل الذاتي
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              يعرض {filteredQuizzes.length} كويز
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                className="fedu-card p-6 flex flex-col justify-between hover:border-[#6b0066]/30 transition-all bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#faebf9] text-[#6b0066] border border-[#6b0066]/20">
                      {quiz.subject}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{quiz.timeLimitMinutes} دقيقة</span>
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-[#330524] leading-snug">
                    {quiz.title}
                  </h4>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#9236b8]" />
                      <span>المستوى: {quiz.level}</span>
                    </div>
                    {quiz.examSourceDzExams && (
                      <div className="flex items-center gap-2 text-amber-800">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>المصدر: {quiz.examSourceDzExams}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600 font-semibold border-t border-slate-100">
                    <span>عدد الأسئلة: <strong className="text-[#6b0066]">{quiz.questions.length}</strong></span>
                    <span>العلامة الإجمالية: <strong className="text-emerald-700">{quiz.totalScore}/20</strong></span>
                    <span>تم إنجازه: <strong className="text-[#9236b8]">{quiz.completionsCount} مرة</strong></span>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-3">
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="fedu-btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>ابدأ الكويز التفاعلي الآن</span>
                  </button>

                  {quiz.pdfAttachmentUrl && (
                    <a
                      href={quiz.pdfAttachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fedu-btn-secondary p-2.5 text-xs"
                      title="عرض موضوع الامتحان PDF من onec.edu.dz"
                    >
                      <Download className="w-4 h-4 text-[#6b0066]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 3: onec.edu.dz REPOSITORY BROWSER */}
      {activeTab === 'onec' && !playingQuiz && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                DZ
              </span>
              <div>
                <strong className="block text-amber-950 font-bold">
                  بنك الفروض والامتحانات المدرسية الرسمية المعتمدة (الديوان الوطني ONEC)
                </strong>
                <span>
                  مواضيع شهادة BEM والبكالوريا والفروض الفصلية مع سلم التنقيط الوزاري. انقر على "تحويل إلى كويز تفاعلي" لإنشاء اختبار فوري للدرس.
                </span>
              </div>
            </div>

            <a
              href="https://onec.edu.dz"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>زيارة الموقع الأصلي</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDzExams.map((exam) => (
              <div 
                key={exam.id}
                className="fedu-card p-6 flex flex-col justify-between hover:border-amber-400/50 transition-all bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100/70 text-amber-900 border border-amber-200">
                      {exam.term}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold">
                      دورة {exam.year}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#330524] leading-snug">
                    {exam.title}
                  </h4>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#6b0066]" />
                      <span>{exam.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span>المصدر: {exam.institution}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold border-t border-slate-100">
                    <span>حجم الملف: <strong>{exam.fileSizeBytes}</strong></span>
                    <span>التحميلات: <strong>{exam.downloadsCount}</strong></span>
                    <span>أسئلة جاهزة: <strong>{exam.sampleQuestions.length} أسئلة</strong></span>
                  </div>
                </div>

                <div className="pt-5 space-y-2">
                  <button
                    onClick={() => handleConvertDzExamToQuiz(exam)}
                    className="fedu-btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>تحويل الموضوع إلى Quiz تفاعلي</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={exam.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fedu-btn-secondary flex-1 py-1.5 text-xs text-center flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>تحميل الموضوع PDF</span>
                    </a>

                    <button
                      onClick={() => handleLoadTemplateIntoBuilder(exam)}
                      className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#330524] text-xs font-bold transition-colors"
                      title="تعديل الأسئلة في أداة الأستاذ"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 4: TEACHER QUIZ CREATOR */}
      {activeTab === 'create' && !playingQuiz && (
        <form onSubmit={handleSaveTeacherQuiz} className="fedu-card p-6 sm:p-8 space-y-6 bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6b0066] mb-1">
                <Plus className="w-4 h-4 text-[#9236b8]" />
                <span>أداة تصميم ونشر الاختبارات التقييمية للأستاذ المؤطر</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#330524]">
                إنشاء Quiz تقييمي قصير لدرس الدعم أو موضوع onec.edu.dz
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleLoadTemplateIntoBuilder(dzExams[0])}
              className="fedu-btn-secondary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>استيراد نموذج جاهز من BEM 2024</span>
            </button>
          </div>

          {createSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{createSuccessMsg}</span>
            </div>
          )}

          {/* Form Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#330524]">عنوان الكويز التقييمي</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: كويز مراجعة خاصية طالس وحساب المثلثات"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#330524]">المادة التعليمية</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value as Subject)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
              >
                <option value="الرياضيات">الرياضيات</option>
                <option value="العلوم الفيزيائية والتكنولوجيا">العلوم الفيزيائية والتكنولوجيا</option>
                <option value="علوم الطبيعة والحياة">علوم الطبيعة والحياة</option>
                <option value="اللغة العربية">اللغة العربية</option>
                <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                <option value="اللغة الفرنسية">اللغة الفرنسية</option>
                <option value="التاريخ والجغرافيا">التاريخ والجغرافيا</option>
                <option value="التربية الإسلامية">التربية الإسلامية</option>
                <option value="التربية المدنية">التربية المدنية</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#330524]">مدة الإنجاز (بالدقائق)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={newTimeLimit}
                onChange={(e) => setNewTimeLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-[#330524]">المستوى التعليمي والشهادة المستهدفة</label>
              <input
                type="text"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#330524]">رابط ملف PDF من onec.edu.dz (اختياري)</label>
              <input
                type="url"
                value={newPdfUrl}
                onChange={(e) => setNewPdfUrl(e.target.value)}
                placeholder="https://onec.edu.dz/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
              />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-[#330524]">
                قائمة الأسئلة وخيارات الإجابة ({newQuestions.length} أسئلة)
              </h4>
              <button
                type="button"
                onClick={handleAddQuestionToBuilder}
                className="fedu-btn-secondary px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 text-[#6b0066]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة سؤال جديد</span>
              </button>
            </div>

            <div className="space-y-6">
              {newQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-[#faf9fb] border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-[#6b0066] text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-slate-500">النقاط:</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={q.points}
                          onChange={(e) => handleUpdateQuestion(idx, 'points', Number(e.target.value))}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold text-center"
                        />
                      </div>
                      {newQuestions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1"
                        >
                          حذف السؤال
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">نص السؤال</label>
                    <textarea
                      rows={2}
                      required
                      value={q.questionText}
                      onChange={(e) => handleUpdateQuestion(idx, 'questionText', e.target.value)}
                      placeholder="اكتب صيغة السؤال الرياضي أو البيداغوجي هنا..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
                    />
                  </div>

                  {/* Options (4 choices) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">
                      خيارات الإجابة (حدد الزر الدائري للإجابة الصحيحة):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctOptionIndex === oIdx}
                            onChange={() => handleUpdateQuestion(idx, 'correctOptionIndex', oIdx)}
                            className="w-4 h-4 text-[#6b0066] focus:ring-[#6b0066] cursor-pointer"
                          />
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => handleUpdateOption(idx, oIdx, e.target.value)}
                            placeholder={`الخيار ${['أ', 'ب', 'ج', 'د'][oIdx]}`}
                            className="w-full px-2 py-1 text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      شرح الحل النموذجي وسلّم التنقيط (يظهر للتلميذ بعد التصحيح الآلي)
                    </label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                      placeholder="مثال: يطبق التلميذ خاصية طالس في المثلث ABC..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#330524] focus:outline-none focus:ring-2 focus:ring-[#9236b8]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('quizzes')}
              className="fedu-btn-secondary px-6 py-2.5 text-xs font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="fedu-btn-primary px-8 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>حفظ ونشر الكويز في المنصة</span>
            </button>
          </div>
        </form>
      )}

      {/* MODE 5: SUBMISSIONS & GRADEBOOK INTEGRATION */}
      {activeTab === 'submissions' && !playingQuiz && (
        <div className="fedu-card p-6 sm:p-8 space-y-6 bg-white">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-[#330524]">
                سجل إجابات ونتائج التلاميذ في الكويزات التفاعلية
              </h3>
              <p className="text-xs text-slate-500">
                نتائج التصحيح الآلي مع نسبة النجاح ومطابقة إجابات التلاميذ.
              </p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Award className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold">لم يسجل أي تلميذ إجابة بعد</p>
              <p className="text-xs">ابدأ بحل أحد الكويزات لتظهر النتيجة هنا.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-3 px-4">التلميذ</th>
                    <th className="py-3 px-4">عنوان الكويز</th>
                    <th className="py-3 px-4">العلامة</th>
                    <th className="py-3 px-4">النسبة المئوية</th>
                    <th className="py-3 px-4">الوقت المستغرق</th>
                    <th className="py-3 px-4">تاريخ الإرسال</th>
                    <th className="py-3 px-4">كشف النقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#faf9fb] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#330524]">{sub.studentName}</td>
                      <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">{sub.quizTitle}</td>
                      <td className="py-3.5 px-4 font-extrabold text-[#6b0066] tabular-nums">
                        {sub.score} / {sub.totalScore}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold tabular-nums ${
                          sub.percentage >= 80 
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.percentage >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 tabular-nums">
                        {Math.floor(sub.timeSpentSeconds / 60)}د {sub.timeSpentSeconds % 60}ث
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{sub.submittedAt}</td>
                      <td className="py-3.5 px-4">
                        {sub.savedToGrades ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مسجلة</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">تقييم تدريبي</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
