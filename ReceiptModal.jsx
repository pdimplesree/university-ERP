import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Printer, ShieldCheck } from 'lucide-react';

export default function ReceiptModal() {
  const { selectedReceipt, setSelectedReceipt } = useAuth();

  if (!selectedReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[94vh]">
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Official University Digital Fee Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div id="printable-receipt" className="p-8 overflow-y-auto bg-white text-slate-900">
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-700 flex items-center justify-center text-white font-extrabold text-xl shadow">
                ERP
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-blue-950 uppercase m-0">
                  ERP Institutional Portal
                </h1>
                <p className="text-xs font-semibold text-slate-600">
                  Finance & Accounts Directorate • Digital Payment Reconciliations
                </p>
                <p className="text-[11px] text-slate-500">
                  Official Institutional Fee Payment Confirmation
                </p>
              </div>

            </div>

            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-emerald-300 uppercase tracking-wide">
                ✓ VERIFIED & PAID
              </span>
              <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                {selectedReceipt.receiptNo}
              </div>
              <div className="text-[10px] text-slate-500">
                Date: {selectedReceipt.generatedOn}
              </div>
            </div>
          </div>

          <div className="text-center my-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 inline-block border-b-2 border-amber-500 pb-0.5">
              Official e-Receipt for University Fees
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div className="space-y-1">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Student Name</span>
                <span className="font-bold text-slate-900">{selectedReceipt.studentName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Roll Number / Student ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.studentId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Course & Branch</span>
                <span className="text-slate-800 font-medium">{selectedReceipt.course || 'B.Tech AIML'}</span>
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Semester / Term</span>
                <span className="font-bold text-slate-900">Semester {selectedReceipt.semester || 'IV'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Payment Mode</span>
                <span className="text-slate-800 font-medium">{selectedReceipt.paymentMode || 'UPI Gateway'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Bank UTR / Transaction ID</span>
                <span className="font-mono font-bold text-blue-900">{selectedReceipt.transactionId || 'UPI4567890123'}</span>
              </div>
            </div>
          </div>

          <table className="w-full text-xs border border-slate-300 rounded-lg overflow-hidden mb-6">
            <thead className="bg-slate-800 text-white font-bold">
              <tr>
                <th className="py-2.5 px-3 text-left">S.No</th>
                <th className="py-2.5 px-3 text-left">Fee Particulars & Description</th>
                <th className="py-2.5 px-3 text-left">Semester</th>
                <th className="py-2.5 px-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-3 font-mono">01</td>
                <td className="py-3 px-3">
                  <div className="font-bold text-slate-900">{selectedReceipt.feeType}</div>
                  <div className="text-[10px] text-slate-500">Verified and approved by University Accounts Section</div>
                </td>
                <td className="py-3 px-3">{selectedReceipt.semester || 'IV'}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-900">
                  ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}.00
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
              <tr>
                <td colSpan="3" className="py-2.5 px-3 text-right uppercase text-slate-700">Total Amount Settled:</td>
                <td className="py-2.5 px-3 text-right text-base text-blue-950 font-extrabold">
                  ₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}.00
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="border-t border-slate-200 pt-4 grid grid-cols-3 gap-4 items-end text-xs">
            <div className="flex items-center gap-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=http://localhost:5173/verify/${selectedReceipt.qrCode || selectedReceipt.receiptNo}`}
                alt="Verification QR"
                className="w-16 h-16 border border-slate-300 p-1 rounded"
              />
              <div className="text-[10px] text-slate-500">
                <span className="font-bold text-slate-800 block">Digitally Signed</span>
                Scan QR to authenticate.
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block border-2 border-blue-900/40 rounded-full px-4 py-1.5 text-[10px] font-bold text-blue-900 tracking-wider uppercase rotate-[-6deg] bg-blue-50/50">
                ★ ERP SYSTEM ★<br />ACCOUNTS VERIFIED
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-blue-950 text-sm">
                S. R. Murthy / Fee Officer
              </div>
              <div className="text-[10px] text-slate-600 font-bold border-t border-slate-400 mt-1 pt-0.5">
                Authorized Signatory
              </div>
              <div className="text-[9px] text-slate-400">Finance & ERP Directorate</div>
            </div>
          </div>

          <div className="mt-6 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2">
            This is a computer-generated official receipt modeled using OOAD UML Architecture.
          </div>
        </div>
      </div>
    </div>
  );
}
