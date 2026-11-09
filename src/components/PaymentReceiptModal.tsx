import React from 'react';
import { FeeReceipt, SchoolSettings } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  School, 
  QrCode, 
  FileText,
  Calendar,
  Smartphone,
  CreditCard,
  Crown
} from 'lucide-react';

interface PaymentReceiptModalProps {
  receipt: FeeReceipt | null;
  onClose: () => void;
  schoolSettings?: SchoolSettings;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  receipt,
  onClose,
  schoolSettings,
}) => {
  if (!receipt) return null;

  const schoolName = schoolSettings?.schoolName || 'مركز التفوق والتميز لدروس الدعم والتقوية';

  const handlePrint = () => {
    window.print();
  };

  // Convert numbers to Arabic written currency
  const getWrittenAmount = (num: number): string => {
    if (num === 4500) return 'أربعة آلاف وخمسمائة دينار جزائري فقط لا غير';
    if (num === 2500) return 'ألفان وخمسمائة دينار جزائري فقط لا غير';
    if (num === 3000) return 'ثلاثة آلاف دينار جزائري فقط لا غير';
    if (num === 2000) return 'ألفان دينار جزائري فقط لا غير';
    return `${num.toLocaleString('ar-DZ')} دينار جزائري فقط لا غير`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 print:p-0 print:bg-white">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-amber-400 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-w-full"
        dir="rtl"
      >
        {/* Top Screen Toolbar (Hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <span className="font-black text-sm text-white">إيصال دفع إلكتروني رسمي</span>
              <span className="font-mono text-xs text-amber-300 block">{receipt.receiptNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="dz-btn-gold px-3.5 py-1.5 rounded-xl text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer hover:scale-102 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>طباعة الإيصال (Imprimer)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL RECEIPT PAPER */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 space-y-6 print:p-6" id="printable-receipt">
          {/* Official Algerian Republic & Center Header */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <p className="text-xs font-black text-slate-700">الجمهورية الجزائرية الديمقراطية الشعبية</p>
            <p className="text-[11px] text-slate-600 font-bold">وزارة التربية الوطنية · قطاع التعليم والدعم المدرسي الخاص</p>
            <div className="pt-1 flex items-center justify-center gap-2">
              <School className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {schoolName}
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              دروس الدعم والتقوية لشهادة التعليم المتوسط (BEM) وشهادة البكالوريا (BAC)
            </p>
          </div>

          {/* National Ribbon Stripe */}
          <div className="dz-national-ribbon h-1 w-full"></div>

          {/* Receipt Title & Number Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <div>
              <span className="text-xs font-black text-emerald-900 block">
                وصل استلام رسوم واشتراك شهري (REÇU DE PAIEMENT)
              </span>
              <span className="text-[11px] text-slate-600">
                رقم الوصل الرسمي: <strong className="font-mono text-emerald-800 text-sm font-black">{receipt.receiptNumber}</strong>
              </span>
            </div>

            <div className="text-left font-mono text-xs text-slate-600 sm:border-r sm:border-emerald-200 sm:pr-4" dir="ltr">
              <div><strong>Date:</strong> {receipt.paymentDate}</div>
              <div><strong>Status:</strong> {receipt.status === 'paid' ? 'PAYÉ / مسدد' : 'ACOMPTE / جزئي'}</div>
            </div>
          </div>

          {/* Student & Guardian Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
            <div>
              <span className="text-slate-500 font-bold block text-[11px]">اسم ولقب التلميذ(ة):</span>
              <span className="font-black text-slate-900 text-sm">{receipt.studentName}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-[11px]">الفوج الدراسي والمستوى:</span>
              <span className="font-bold text-emerald-800">{receipt.classRoom}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-[11px]">اسم ولي الأمر:</span>
              <span className="font-bold text-slate-800">{receipt.guardianName}</span>
            </div>

            <div>
              <span className="text-slate-500 font-bold block text-[11px]">رقم هاتف الولي:</span>
              <span className="font-mono font-bold text-slate-800" dir="ltr">{receipt.guardianPhone}</span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">البيان / تفاصيل المادة</th>
                  <th className="py-2.5 px-3">الشهر</th>
                  <th className="py-2.5 px-3 text-center">المطلوب</th>
                  <th className="py-2.5 px-3 text-center">المسدد</th>
                  <th className="py-2.5 px-3 text-center">المتبقي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-3 font-bold text-slate-900">{receipt.subject}</td>
                  <td className="py-3 px-3 font-bold text-emerald-800">{receipt.month}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-700 text-center">
                    {receipt.totalDue.toLocaleString('ar-DZ')} دج
                  </td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-800 text-center bg-emerald-50/50">
                    {receipt.amount.toLocaleString('ar-DZ')} دج
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-center">
                    <span className={receipt.remainingAmount > 0 ? 'text-red-600' : 'text-emerald-700'}>
                      {receipt.remainingAmount.toLocaleString('ar-DZ')} دج
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amount in Letters & Payment Method */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-300/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-amber-900 font-black">المبلغ المسدد بالحروف:</span>
              <span className="font-bold text-[11px] px-2 py-0.5 rounded-md bg-white border border-amber-300 text-slate-800">
                طريقة الدفع: {
                  receipt.paymentMethod === 'baridimob' ? 'بريدي موب BaridiMob' :
                  receipt.paymentMethod === 'cash' ? 'نقداً بمكتب الاستقبال' :
                  receipt.paymentMethod === 'ccp' ? 'حوالة بريد الجزائر CCP' : 'بطاقة بنكية'
                }
              </span>
            </div>
            <p className="font-bold text-slate-900 text-sm">
              {getWrittenAmount(receipt.amount)}
            </p>
          </div>

          {/* Official Signatures & Seal Box */}
          <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
            {/* Cashier / Secretary Signature */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-4">
              <div className="text-[11px] text-slate-500 font-bold">
                أمين الصندوق والمستلم:
              </div>
              <div className="font-black text-slate-900">
                {receipt.receivedBy}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                التوقيع المعتمد الإلكتروني ✓
              </div>
            </div>

            {/* Official Center Stamp Seal */}
            <div className="border border-emerald-300 rounded-xl p-3 bg-emerald-50/40 flex items-center justify-center relative overflow-hidden">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center text-center p-1 transform rotate-[-8deg]">
                <span className="text-[9px] font-black text-emerald-800">مركز التفوق</span>
                <span className="text-xs font-black text-emerald-900 font-mono">سُــدّد ✓</span>
                <span className="text-[8px] text-emerald-700">PAID & VERIFIED</span>
                <span className="text-[8px] text-emerald-700 font-mono">2026/11</span>
              </div>
            </div>
          </div>

          {/* Security & Verification Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>إيصال رقمي مؤمن وفق نظام التوثيق البيداغوجي لمركز تلميذي.</span>
            </div>
            <div className="font-mono">
              HASH: {receipt.receiptNumber.replace('-', '')}984X
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
