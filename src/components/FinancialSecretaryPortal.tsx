import React, { useState } from 'react';
import { StudentFeeSummary, FeeReceipt, Student, AppUser, SchoolSettings, PaymentStatus } from '../types';
import { 
  Wallet, 
  CreditCard, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Clock, 
  Eye, 
  Sparkles, 
  ArrowUpRight, 
  DollarSign, 
  Building2, 
  Phone, 
  Calendar, 
  Check, 
  X,
  Smartphone,
  ChevronDown,
  Layers,
  Crown
} from 'lucide-react';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface FinancialSecretaryPortalProps {
  currentUser: AppUser;
  studentFees: StudentFeeSummary[];
  feeReceipts: FeeReceipt[];
  students: Student[];
  onRecordPayment: (newReceipt: FeeReceipt, updatedSummary: StudentFeeSummary) => void;
  schoolSettings?: SchoolSettings;
}

export const FinancialSecretaryPortal: React.FC<FinancialSecretaryPortalProps> = ({
  currentUser,
  studentFees,
  feeReceipts,
  students,
  onRecordPayment,
  schoolSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'fees_roster' | 'receipts_archive'>('fees_roster');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState<StudentFeeSummary | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(4500);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'baridimob' | 'ccp' | 'bank_card'>('cash');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  
  // Receipt view modal
  const [viewingReceipt, setViewingReceipt] = useState<FeeReceipt | null>(null);

  // Financial Metrics
  const totalTarget = studentFees.reduce((acc, curr) => acc + curr.monthlyFee, 0);
  const totalCollected = studentFees.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalRemaining = studentFees.reduce((acc, curr) => acc + curr.remainingAmount, 0);
  const paidCount = studentFees.filter((f) => f.status === 'paid').length;
  const partialCount = studentFees.filter((f) => f.status === 'partial').length;
  const unpaidCount = studentFees.filter((f) => f.status === 'unpaid' || f.status === 'overdue').length;

  // Filtered student fees
  const filteredFees = studentFees.filter((item) => {
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchSearch = 
      !searchQuery.trim() ||
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.guardianPhone.includes(searchQuery) ||
      item.registrationNumber.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  // Filtered receipts
  const filteredReceipts = feeReceipts.filter((rec) => {
    return (
      !searchQuery.trim() ||
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.guardianPhone.includes(searchQuery)
    );
  });

  // Open Record Payment Modal for a student
  const handleOpenRecordPayment = (feeItem: StudentFeeSummary) => {
    setSelectedStudentForPay(feeItem);
    // If partial or unpaid, default to remaining amount
    setPaymentAmount(feeItem.remainingAmount > 0 ? feeItem.remainingAmount : feeItem.monthlyFee);
    setPaymentNotes(`تسديد اشتراك شهر ${feeItem.month} - دروس الدعم`);
    setIsRecordModalOpen(true);
  };

  // Submit payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPay) return;

    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateFormatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}`;

    const newPaidTotal = selectedStudentForPay.paidAmount + paymentAmount;
    const newRemaining = Math.max(0, selectedStudentForPay.monthlyFee - newPaidTotal);
    const newStatus: PaymentStatus = newRemaining === 0 ? 'paid' : 'partial';

    const newReceipt: FeeReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: selectedStudentForPay.studentId,
      studentName: selectedStudentForPay.studentName,
      classRoom: selectedStudentForPay.classRoom,
      guardianName: selectedStudentForPay.guardianName,
      guardianPhone: selectedStudentForPay.guardianPhone,
      amount: paymentAmount,
      totalDue: selectedStudentForPay.monthlyFee,
      remainingAmount: newRemaining,
      month: selectedStudentForPay.month,
      subject: 'دروس دعم مادة الرياضيات والفيزياء (مكثف BEM)',
      paymentMethod: paymentMethod,
      paymentDate: dateFormatted,
      receivedBy: currentUser.name,
      status: newStatus,
      notes: paymentNotes || 'تم التسجيل بواسطة السكرتارية وتأكيد العملية.',
    };

    const updatedSummary: StudentFeeSummary = {
      ...selectedStudentForPay,
      paidAmount: newPaidTotal,
      remainingAmount: newRemaining,
      status: newStatus,
      lastPaymentDate: now.toISOString().split('T')[0],
      lastReceiptNumber: receiptNum,
    };

    onRecordPayment(newReceipt, updatedSummary);
    setIsRecordModalOpen(false);

    // Auto open printable receipt modal immediately!
    setViewingReceipt(newReceipt);
  };

  return (
    <div className="space-y-6">
      {/* Top Royal Algerian Banner */}
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
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>فضاء السكرتارية والحسابات (Finance & Secretary Portal)</span>
            </span>
            <span className="text-amber-400 font-bold">●</span>
            <span className="text-white font-black bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-400/80">
              المسؤول(ة): {currentUser.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            متابعة رسوم الحصص، التحصيل وإصدار إيصالات الدفع الإلكترونية
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl font-bold drop-shadow-sm">
            إدارة شاملة لمصروفات واشتراكات التلاميذ الشهرية: رصد المبالغ المدفوعة والمتبقية، تسجيل الدفعات نقداً أو عبر بريدي موب BaridiMob و CCP، وإصدار إيصالات دفع إلكترونية معتمدة قابلة للطباعة والتسليم الفوري.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs bg-emerald-900/90 text-amber-200 border border-emerald-400/60 px-3 py-1.5 rounded-xl font-bold">
              إجمالي المحصل لشهر نوفمبر: <strong className="text-white font-mono">{totalCollected.toLocaleString('ar-DZ')} دج</strong>
            </span>
            <span className="text-xs bg-red-950/80 text-red-200 border border-red-500/50 px-3 py-1.5 rounded-xl font-bold">
              المتبقي قيد التحصيل: <strong className="text-white font-mono">{totalRemaining.toLocaleString('ar-DZ')} دج</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">إجمالي المداخيل المحصلة</span>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              {totalCollected.toLocaleString('ar-DZ')} دج
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              اشتراكات شهر نوفمبر 2026
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Dues */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">المبالغ المتبقية</span>
            <div className="text-2xl font-black text-red-600 font-mono">
              {totalRemaining.toLocaleString('ar-DZ')} دج
            </div>
            <div className="text-[11px] text-red-600 font-bold">
              مطلوبة من أولياء الأمور
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Fully Paid Students */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">الاشتراكات المسددة بالكامل</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {paidCount} <span className="text-xs font-normal text-slate-500">/ {studentFees.length}</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              تم إصدار إيصالاتهم
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Partial / Overdue */}
        <div className="dz-card p-5 bg-white flex items-center justify-between border border-slate-200">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500">اشتراكات متأخرة أو جزئية</span>
            <div className="text-2xl font-black text-amber-700 font-mono">
              {unpaidCount + partialCount} تلميذ
            </div>
            <div className="text-[11px] text-amber-800 font-bold">
              {partialCount} دفعات جزئية · {unpaidCount} غير مسدد
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
        <button
          onClick={() => setActiveTab('fees_roster')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'fees_roster'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>جدول اشتراكات ومصروفات التلاميذ ({studentFees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('receipts_archive')}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 ${
            activeTab === 'receipts_archive'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>أرشيف إيصالات الدفع الإلكترونية الصادرة ({feeReceipts.length})</span>
        </button>
      </div>

      {/* TAB 1: FEES ROSTER & RECORD PAYMENT */}
      {activeTab === 'fees_roster' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="dz-card p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-200">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم التلميذ، الولي أو الهاتف..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500">حالة السداد:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">جميع الحالات ({studentFees.length})</option>
                <option value="paid">مسدد بالكامل ({paidCount})</option>
                <option value="partial">دفعة جزئية ({partialCount})</option>
                <option value="unpaid">غير مسدد ({studentFees.filter(f => f.status === 'unpaid').length})</option>
                <option value="overdue">متأخر عن الموعد ({studentFees.filter(f => f.status === 'overdue').length})</option>
              </select>
            </div>
          </div>

          {/* Student Fees Table */}
          <div className="dz-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">التلميذ والفوج</th>
                    <th className="py-3.5 px-4">ولي الأمر والهاتف</th>
                    <th className="py-3.5 px-4 text-center">المبلغ المطلوب</th>
                    <th className="py-3.5 px-4 text-center">المسدد</th>
                    <th className="py-3.5 px-4 text-center">المتبقي</th>
                    <th className="py-3.5 px-4 text-center">حالة السداد</th>
                    <th className="py-3.5 px-4 text-center">إجراءات السكرتارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map((item) => {
                    const statusTag = {
                      paid: { label: 'مسدد بالكامل ✓', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
                      partial: { label: 'دفعة جزئية ⏳', bg: 'bg-amber-100 text-amber-900 border-amber-300' },
                      unpaid: { label: 'غير مسدد ✕', bg: 'bg-slate-100 text-slate-700 border-slate-300' },
                      overdue: { label: 'متأخر ⚠️', bg: 'bg-red-100 text-red-900 border-red-300' },
                    }[item.status];

                    return (
                      <tr key={item.studentId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-black text-slate-900">{item.studentName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.registrationNumber} · {item.classRoom.split('-')[0]}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{item.guardianName}</div>
                          <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{item.guardianPhone}</div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 text-center">
                          {item.monthlyFee.toLocaleString('ar-DZ')} دج
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-emerald-800 text-center bg-emerald-50/30">
                          {item.paidAmount.toLocaleString('ar-DZ')} دج
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-center">
                          <span className={item.remainingAmount > 0 ? 'text-red-600' : 'text-emerald-700'}>
                            {item.remainingAmount.toLocaleString('ar-DZ')} دج
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${statusTag.bg}`}>
                            {statusTag.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Record Payment Button */}
                            <button
                              onClick={() => handleOpenRecordPayment(item)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              title="تسجيل دفعة سداد جديدة"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>تسجيل دفعة</span>
                            </button>

                            {/* View Receipt Button (if has receipt) */}
                            {item.lastReceiptNumber && (
                              <button
                                onClick={() => {
                                  const found = feeReceipts.find(r => r.receiptNumber === item.lastReceiptNumber);
                                  if (found) setViewingReceipt(found);
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="معاينة وطباعة الإيصال الرسمي"
                              >
                                <FileText className="w-3.5 h-3.5 text-amber-600" />
                                <span>الإيصال</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECEIPTS ARCHIVE */}
      {activeTab === 'receipts_archive' && (
        <div className="space-y-4">
          <div className="dz-card p-4 bg-white flex items-center justify-between border border-slate-200">
            <h3 className="font-black text-slate-900 text-sm">أرشيف إيصالات السداد الإلكترونية الصادرة</h3>
            <span className="text-xs text-slate-500 font-bold">إجمالي الإيصالات: {feeReceipts.length} إيصال</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReceipts.map((rec) => (
              <div 
                key={rec.id} 
                className="dz-card p-5 bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono font-black text-amber-800 text-xs">{rec.receiptNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      rec.status === 'paid' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {rec.status === 'paid' ? 'مسدد بالكامل ✓' : 'دفعة جزئية'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-black text-slate-900 text-sm">{rec.studentName}</div>
                    <div className="text-slate-500 text-[11px]">{rec.classRoom}</div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-600">المبلغ المسدد:</span>
                      <span className="font-mono font-black text-emerald-800 text-sm">{rec.amount.toLocaleString('ar-DZ')} دج</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      طريقة الدفع: <strong>{rec.paymentMethod === 'baridimob' ? 'بريدي موب BaridiMob' : rec.paymentMethod === 'cash' ? 'نقداً' : 'حوالة CCP'}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {rec.paymentDate} · بواسطة: {rec.receivedBy.split(' ')[0]}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setViewingReceipt(rec)}
                  className="w-full mt-2 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>معاينة وطباعة الإيصال الإلكتروني</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isRecordModalOpen && selectedStudentForPay && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-2 border-emerald-500 overflow-hidden animate-in fade-in zoom-in-95 duration-200" dir="rtl">
            <div className="dz-royal-header p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <CreditCard className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">تسجيل دفعة سداد جديدة</h3>
                  <p className="text-xs text-emerald-100 font-medium">إصدار إيصال دفع إلكتروني رسمي فوري</p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="dz-national-ribbon"></div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs font-bold">
              {/* Student info box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">التلميذ:</span>
                  <span className="font-black text-slate-900 text-sm">{selectedStudentForPay.studentName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">الفوج:</span>
                  <span className="text-emerald-800 font-bold">{selectedStudentForPay.classRoom}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">المبلغ المطلوب / المتبقي:</span>
                  <span className="font-mono text-red-600 font-bold">{selectedStudentForPay.remainingAmount.toLocaleString('ar-DZ')} دج</span>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-slate-700">المبلغ المدفوع حالياً (دج):</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min={100}
                  step={500}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono font-black"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-slate-700">طريقة التحصيل / الدفع:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'cash' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💵 نقداً بمكتب الاستقبال
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('baridimob')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'baridimob' 
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    📱 بريدي موب BaridiMob
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ccp')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'ccp' 
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    📮 حوالة بريد الجزائر CCP
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_card')}
                    className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'bank_card' 
                        ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💳 بطاقة بنكية
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-slate-700">ملاحظات على الإيصال (اختياري):</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="مثال: تسديد اشتراك شهر نوفمبر 2026 كاملاً"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="dz-btn-gold px-5 py-2.5 rounded-xl text-slate-950 font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>تأكيد السداد وتوليد الإيصال الإلكتروني</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW / PRINT RECEIPT MODAL */}
      <PaymentReceiptModal
        receipt={viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        schoolSettings={schoolSettings}
      />
    </div>
  );
};
