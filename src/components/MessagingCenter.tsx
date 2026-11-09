import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Student, UserRole } from '../types';
import { 
  Send, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  ShieldCheck, 
  Clock, 
  Paperclip, 
  CheckCheck,
  Sparkles,
  Volume2
} from 'lucide-react';

interface MessagingCenterProps {
  messages: ChatMessage[];
  students: Student[];
  onSendMessage: (msg: ChatMessage) => void;
  userRole: UserRole;
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  messages,
  students,
  onSendMessage,
  userRole,
}) => {
  const [activeStudentId, setActiveStudentId] = useState<string>(students[0]?.id || 'std-1');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const recordingTimerRef = useRef<any>(null);

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

  const activeStudent = students.find((s) => s.id === activeStudentId) || (students.length > 0 ? students[0] : fallbackStudent);

  // Filter messages for current student
  const currentMessages = messages.filter(
    (m) => m.studentName === activeStudent?.name
  );

  // Handle voice recording simulation
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingAndSend = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    const minutes = Math.floor(recordingSeconds / 60);
    const seconds = recordingSeconds % 60;
    const durationStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: userRole === 'teacher' ? 'teacher' : 'parent',
      senderName: userRole === 'teacher' ? 'الأستاذ لخضر مزيان' : activeStudent.guardianName,
      studentName: activeStudent.name,
      timestamp: 'الآن',
      type: 'voice',
      voiceDuration: durationStr === '0:00' ? '0:18' : durationStr,
      content: userRole === 'teacher' 
        ? 'تسجيل صوتي: توجيه تربوي من الأستاذ لولي الأمر حول متابعة المقرر والتفوق في شهادة BEM.'
        : 'تسجيل صوتي: استفسار وتأكيد من ولي الأمر.',
      read: true,
    };

    onSendMessage(newMsg);
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: userRole === 'teacher' ? 'teacher' : 'parent',
      senderName: userRole === 'teacher' ? 'الأستاذ لخضر مزيان' : activeStudent.guardianName,
      studentName: activeStudent.name,
      timestamp: 'الآن',
      type: 'text',
      content: inputText.trim(),
      read: true,
    };

    onSendMessage(newMsg);
    setInputText('');
  };

  const playVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      // simulate audio end
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 4000);
    }
  };

  // Quick message template insertion
  const insertTemplate = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <strong className="block text-emerald-200">نظام المراسلات الآمن وحماية الخصوصية:</strong>
            <span className="text-slate-300">
              جميع الرسائل الصوتية والنصية تمر عبر البوابة المدرسية للنقابة بدون كشف أرقام الهواتف الشخصية.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>ساعات التواصل النشطة: 08:30 - 18:00</span>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-4 min-h-[560px]">
        
        {/* Left / Right Sidebar: Students / Conversations */}
        <div className="border-b lg:border-b-0 lg:border-l border-slate-200 bg-slate-50/50 p-3 space-y-2">
          <div className="px-3 py-2">
            <h3 className="font-bold text-slate-800 text-xs">
              {userRole === 'teacher' ? 'محادثات أولياء أمور القسم' : 'محادثة الأستاذ المؤطر'}
            </h3>
            <p className="text-[11px] text-slate-400">تحديث فوري للرسائل</p>
          </div>

          <div className="space-y-1">
            {students.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStudentId(st.id)}
                className={`w-full text-right p-3 rounded-xl transition-all flex items-center gap-3 ${
                  activeStudentId === st.id
                    ? 'bg-white shadow-xs border border-slate-200 font-bold text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {st.name.slice(0, 2)}
                </div>
                <div className="truncate flex-1">
                  <div className="text-xs truncate">{st.name}</div>
                  <div className="text-[11px] text-slate-400 truncate font-normal">
                    ولي الأمر: {st.guardianName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Pane */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full bg-slate-50/20">
          
          {/* Header of Active Student */}
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                {activeStudent.name.slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {activeStudent.name} - {activeStudent.classRoom}
                </h4>
                <span className="text-xs text-slate-500">
                  محادثة مع ولي الأمر: {activeStudent.guardianName}
                </span>
              </div>
            </div>

            <div className="text-left text-xs text-slate-400">
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-medium">
                متصل عبر تطبيق تلميذي
              </span>
            </div>
          </div>

          {/* Quick Presets for Teacher */}
          {userRole === 'teacher' && (
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
              <span className="text-slate-400 shrink-0">نماذج سريعة:</span>
              <button
                onClick={() => insertTemplate(`تحية طيبة، نود إحاطتكم علماً بتسجيل تقدم ملحوظ في مستوى ${activeStudent.name}، نرجو مواصلة الدعم والتشجيع.`)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
              >
                تنويه بالاجتهاد
              </button>
              <button
                onClick={() => insertTemplate(`السلام عليكم، تذكير بإنجاز الواجب المنزلي المقرر في الرياضيات قبل الغد لتعزيز الفهم والاستيعاب.`)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
              >
                تذكير بالواجب
              </button>
              <button
                onClick={() => insertTemplate(`تحية تربوية، يرجى تبرير سبب الغياب الأخير لـ ${activeStudent.name} عبر المنصة أو الإدارة التربوية.`)}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 whitespace-nowrap"
              >
                طلب تبرير غياب
              </button>
            </div>
          )}

          {/* Messages Flow */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[280px]">
            {currentMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                لا توجد رسائل سابقة مع ولي أمر {activeStudent.name}. ابدأ التواصل الآن.
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = (userRole === 'teacher' && msg.senderRole === 'teacher') ||
                             (userRole === 'parent_student' && msg.senderRole === 'parent');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[11px] text-slate-400 mb-1 px-1">
                      {msg.senderName} · {msg.timestamp}
                    </div>

                    <div
                      className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.type === 'voice' ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playVoice(msg.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isMe ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                            }`}
                          >
                            {playingVoiceId === msg.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 mr-0.5" />
                            )}
                          </button>

                          {/* Sound wave visual */}
                          <div className="flex items-center gap-0.5">
                            {[12, 24, 16, 28, 20, 10, 24, 18, 30, 14, 22, 10].map((h, i) => (
                              <span
                                key={i}
                                style={{ height: `${h}px` }}
                                className={`w-1 rounded-full transition-all ${
                                  playingVoiceId === msg.id
                                    ? 'bg-amber-300 animate-pulse'
                                    : isMe
                                    ? 'bg-white/60'
                                    : 'bg-slate-300'
                                }`}
                              />
                            ))}
                          </div>

                          <span className="font-mono text-[11px] tabular-nums shrink-0">
                            {msg.voiceDuration || '0:24'}
                          </span>
                        </div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                      <span>تمت القراءة</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Input & Voice Recorder */}
          <div className="p-3 bg-white border-t border-slate-200">
            {isRecording ? (
              <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="flex items-center gap-3 text-rose-800 text-xs">
                  <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></div>
                  <span className="font-bold">جاري تسجيل الرسالة الصوتية...</span>
                  <span className="font-mono font-bold tabular-nums">
                    {Math.floor(recordingSeconds / 60)}:
                    {(recordingSeconds % 60) < 10 ? '0' : ''}
                    {recordingSeconds % 60}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelRecording}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={stopRecordingAndSend}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 flex items-center gap-1 shadow-xs"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>إيقاف وإرسال</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendText} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startRecording}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                  title="تسجيل رسالة صوتية للأولياء"
                >
                  <Mic className="w-5 h-5 text-emerald-700" />
                </button>

                <input
                  type="text"
                  placeholder="اكتب رسالة لولي الأمر (نصية، استفسار، إشعار، توجيه)..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-slate-50/50"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
