import React, { useState } from 'react';
import { NewsEventItem, NewsComment, UserRole } from '../types';
import { 
  Newspaper, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Share2, 
  MapPin, 
  Clock, 
  User, 
  Send, 
  Plus, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Sparkles,
  Bookmark
} from 'lucide-react';

interface NewsAndEventsProps {
  items: NewsEventItem[];
  onToggleLike: (itemId: string) => void;
  onToggleRsvp: (itemId: string) => void;
  onAddComment: (itemId: string, commentText: string, authorName: string, authorRole: string) => void;
  onAddNewItem: (item: NewsEventItem) => void;
  userRole: UserRole;
}

export const NewsAndEvents: React.FC<NewsAndEventsProps> = ({
  items,
  onToggleLike,
  onToggleRsvp,
  onAddComment,
  onAddNewItem,
  userRole,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItemModal, setActiveItemModal] = useState<NewsEventItem | null>(null);
  const [shareModalItem, setShareModalItem] = useState<NewsEventItem | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('أخبار النقابة والوزارة');
  const [newType, setNewType] = useState<'news' | 'event'>('news');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCommentSubmit = (itemId: string) => {
    if (!newCommentText.trim()) return;
    const authorName = userRole === 'teacher' ? 'الأستاذ لخضر مزيان' : 'السيد كمال بلقاسم (ولي أمر)';
    const authorRole = userRole === 'teacher' ? 'أستاذ مؤطر وعضو نقابي SNTE' : 'ولي أمر تلميذ بالمتوسطة';
    onAddComment(itemId, newCommentText.trim(), authorName, authorRole);
    setNewCommentText('');

    // If modal is open, update its local view
    if (activeItemModal && activeItemModal.id === itemId) {
      const updatedComments: NewsComment[] = [
        ...activeItemModal.comments,
        {
          id: `c-${Date.now()}`,
          authorName,
          authorRole,
          avatarText: authorName.slice(0, 2),
          content: newCommentText.trim(),
          timestamp: 'الآن',
        },
      ];
      setActiveItemModal({ ...activeItemModal, comments: updatedComments });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const newItem: NewsEventItem = {
      id: `ne-${Date.now()}`,
      type: newType,
      title: newTitle,
      category: newCategory,
      summary: newSummary || newContent.slice(0, 140) + '...',
      content: newContent,
      imageUrl: newImageUrl || (newType === 'event' ? '/src/assets/images/news_science_fair_1794132675856.jpg' : '/src/assets/images/news_syndicate_conference_1794132677684.jpg'),
      publishedDate: 'اليوم',
      author: userRole === 'teacher' ? 'خلية الإعلام والنشر بالنقابة' : 'إدارة المؤسسة',
      likesCount: 1,
      isLiked: false,
      comments: [],
      eventDate: newType === 'event' ? (newEventDate || 'قريباً') : undefined,
      eventTime: newType === 'event' ? (newEventTime || 'صباحاً') : undefined,
      eventLocation: newType === 'event' ? (newEventLocation || 'فضاء المؤسسة') : undefined,
      attendeesCount: newType === 'event' ? 12 : undefined,
      isRsvp: false,
    };

    onAddNewItem(newItem);
    setCreateModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewSummary('');
    setNewImageUrl('');
  };

  const handleShare = (item: NewsEventItem) => {
    setShareModalItem(item);
    setCopiedLink(false);
  };

  const copyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-700 via-emerald-800 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Newspaper className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              أخبار وفعاليات النقابة والمؤسسة التعليمية
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة مستجدات الأنشطة التربوية، الفعاليات التضامنية، والمؤتمرات المدرسية مع إمكانية التفاعل والمشاركة
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Categories Tab */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedCategory('أخبار النقابة والوزارة')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'أخبار النقابة والوزارة'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              أخبار النقابة والوزارة
            </button>
            <button
              onClick={() => setSelectedCategory('إصلاحات المنظومة 2026')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'إصلاحات المنظومة 2026'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              إصلاحات 2026
            </button>
            <button
              onClick={() => setSelectedCategory('مراجعات BEM و BAC')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'مراجعات BEM و BAC'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مراجعات BEM و BAC
            </button>
            <button
              onClick={() => setSelectedCategory('الفعاليات المدرسية')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'الفعاليات المدرسية'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الفعاليات المدرسية
            </button>
          </div>

          {userRole === 'teacher' && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold bg-gradient-to-r from-red-700 to-emerald-800 text-white rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خبر أو فعالية</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Articles & Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const isEvent = item.type === 'event';

          return (
            <article
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image slot */}
                {item.imageUrl && (
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs ${
                          item.category === 'أخبار النقابة والوزارة'
                            ? 'bg-red-700 text-white'
                            : item.category === 'إصلاحات المنظومة 2026'
                            ? 'bg-emerald-700 text-white'
                            : item.category === 'مراجعات BEM و BAC'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {item.category}
                      </span>

                      {isEvent && (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>فعالية قادمة</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 text-white text-xs flex items-center gap-2 font-medium">
                      <span>{item.author}</span>
                      <span>·</span>
                      <span>{item.publishedDate}</span>
                    </div>
                  </div>
                )}

                {/* Content Body */}
                <div className="p-5 space-y-3">
                  <h3 
                    onClick={() => setActiveItemModal(item)}
                    className="font-extrabold text-slate-900 text-base leading-snug hover:text-red-700 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>

                  {/* Event Details Box if Event */}
                  {isEvent && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-xs text-slate-700 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>موعد الفعالية: {item.eventDate} ({item.eventTime})</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>المكان: {item.eventLocation}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/60">
                        <span className="text-[11px] text-slate-500">
                          المشاركون المسجلون: <strong className="font-mono tabular-nums text-slate-800">{item.attendeesCount || 0}</strong>
                        </span>
                        <button
                          onClick={() => onToggleRsvp(item.id)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            item.isRsvp
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs'
                          }`}
                        >
                          {item.isRsvp ? '✓ تم تأكيد حضورك' : 'تأكيد الحضور (RSVP)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={() => onToggleLike(item.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      item.isLiked ? 'text-red-700' : 'text-slate-500 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    <span className="font-mono tabular-nums">{item.likesCount}</span>
                  </button>

                  {/* Comments count / opener */}
                  <button
                    onClick={() => setActiveItemModal(item)}
                    className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono tabular-nums">{item.comments.length}</span>
                    <span className="hidden sm:inline">تعليقات</span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => handleShare(item)}
                    className="flex items-center gap-1.5 font-semibold text-slate-500 hover:text-amber-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">مشاركة</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveItemModal(item)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-red-700 hover:border-red-300 font-bold text-xs transition-all"
                >
                  قراءة التفاصيل كاملة
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Article / Event Detailed View Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-2 border-amber-500/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md">
                {activeItemModal.category}
              </span>
              <button
                onClick={() => setActiveItemModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {activeItemModal.imageUrl && (
              <div className="rounded-2xl overflow-hidden h-64 w-full">
                <img
                  src={activeItemModal.imageUrl}
                  alt={activeItemModal.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                {activeItemModal.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>الكاتب: <strong className="text-slate-700">{activeItemModal.author}</strong></span>
                <span>·</span>
                <span>تاريخ النشر: {activeItemModal.publishedDate}</span>
              </div>

              {activeItemModal.type === 'event' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>تاريخ وتوقيت الفعالية: {activeItemModal.eventDate} - {activeItemModal.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>المكان: {activeItemModal.eventLocation}</span>
                  </div>
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                {activeItemModal.content}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>التعليقات والمناقشات ({activeItemModal.comments.length})</span>
              </h4>

              {/* Comments stream */}
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {activeItemModal.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">لا توجد تعليقات بعد. كن أول من يشارك برأيه!</p>
                ) : (
                  activeItemModal.comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-100 text-red-800 font-bold text-[10px] flex items-center justify-center">
                            {c.avatarText}
                          </div>
                          <span className="font-bold text-slate-900">{c.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({c.authorRole})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pr-8">{c.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="أضف تعليقك أو استفسارك حول هذا الخبر..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCommentSubmit(activeItemModal.id);
                    }
                  }}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => handleCommentSubmit(activeItemModal.id)}
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2.5 bg-red-700 text-white rounded-xl text-xs font-bold hover:bg-red-800 disabled:opacity-40 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>تعليق</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-500/20 animate-in fade-in zoom-in duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">مشاركة الخبر أو الفعالية</h3>
              </div>
              <button
                onClick={() => setShareModalItem(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-bold">
              {shareModalItem.title}
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareModalItem.title + '\nتطبيق تلميذي النقابة')}`, '_blank');
                  setShareModalItem(null);
                }}
                className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-emerald-200"
              >
                <span>مشاركة عبر واتساب (WhatsApp)</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  setShareModalItem(null);
                }}
                className="w-full p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-blue-200"
              >
                <span>مشاركة عبر فيسبوك (Facebook)</span>
              </button>

              <button
                onClick={copyShareLink}
                className="w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copiedLink ? 'تم نسخ الرابط بنجاح!' : 'نسخ رابط الخبر'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create News or Event Modal (For Teacher/Admin) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500/20 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                نشر خبر أو فعالية تربوية جديدة
              </h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نوع المحتوى
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 font-semibold"
                  >
                    <option value="news">خبر أو مقال إخباري</option>
                    <option value="event">فعالية أو نشاط قادم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    التصنيف
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 font-semibold"
                  >
                    <option value="أخبار النقابة والوزارة">أخبار النقابة والوزارة</option>
                    <option value="إصلاحات المنظومة 2026">إصلاحات المنظومة 2026</option>
                    <option value="مراجعات BEM و BAC">مراجعات BEM و BAC</option>
                    <option value="الفعاليات المدرسية">الفعاليات المدرسية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الخبر أو الفعالية
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: البطولة المدرسية للشطرنج والرياضات الجماعية"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملخص تمهيدي سريع
                </label>
                <input
                  type="text"
                  placeholder="جملة موجزة تلخص أهمية الخبر أو الفعالية..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  تفاصيل المقال أو الفعالية كاملة
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب التغطية الإخبارية، البرنامج، الأهداف، والفئات المستهدفة..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600"
                />
              </div>

              {newType === 'event' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      تاريخ الفعالية
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: السبت 21 نونبر"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      التوقيت
                    </label>
                    <input
                      type="text"
                      placeholder="10:00 - 13:00"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      المكان
                    </label>
                    <input
                      type="text"
                      placeholder="قاعة الأنشطة"
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رابط صورة مرافقة (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="أدخل رابط صورة أو اتركها فارغة لاستخدام الصورة الافتراضية"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-red-700 to-emerald-800 text-white rounded-xl hover:opacity-95 transition-all shadow-xs"
                >
                  نشر المحتوى فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
