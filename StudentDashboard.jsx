import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, setPaymentModalFee, paymentModalFee, setUploadProofFee, uploadProofFee, setSelectedReceipt, selectedReceipt, showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudentData = async () => {
    if (!user?.studentId) return;
    try {
      const res = await fetch(`/api/fees/student/${user.studentId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user, paymentModalFee, uploadProofFee, selectedReceipt]);

  if (loading && !data) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">Loading Student ERP Ledger...</p>
      </div>
    );
  }

  const { student, fees = [], verifications = [], receipts = [], summary = {} } = data || {};

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
              STUDENT DASHBOARD
            </span>
            <span className="text-xs text-slate-300 font-mono">B.Tech AI & ML • Sem {student?.semester || 'IV'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {student?.name || user?.name}!
          </h1>
          <p className="text-xs text-slate-300">
            Student ID: <strong className="font-mono text-white">{student?.studentId || user?.studentId}</strong> • Section: {student?.section || 'AI-A'} • Course: {student?.course || 'B.Tech'}
          </p>

        </div>

        <button
          onClick={fetchStudentData}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Billed Fees</span>
          <div className="text-2xl font-black text-slate-900">
            ₹{(summary.totalAmount || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">Total assigned fee structures</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/20">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Settled & Verified</span>
          <div className="text-2xl font-black text-emerald-700">
            ₹{(summary.paidAmount || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600">Official receipt available</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-1 bg-amber-50/20">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Pending / Under Verification</span>
          <div className="text-2xl font-black text-amber-700">
            ₹{(summary.pendingAmount || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-amber-600">Needs payment or admin approval</p>
        </div>
      </div>

      {/* Fee Items Table with Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Assigned Fee Structures & Actions</h2>
            <p className="text-xs text-slate-500">Pay directly online or upload screenshot if bank was debited</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Fee ID</th>
                <th className="py-3 px-4">Fee Description</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map(fee => {
                const isPaid = fee.status === 'Paid';
                const isUnderVer = fee.status === 'In Verification';
                const matchingReceipt = receipts.find(r => r.feeId === fee.feeId);

                return (
                  <tr key={fee.feeId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{fee.feeId}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{fee.feeType}</div>
                      <div className="text-[11px] text-slate-500">{fee.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">Sem {fee.semester}</td>
                    <td className="py-3.5 px-4 text-slate-600">{fee.dueDate}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{fee.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPaid && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      )}
                      {isUnderVer && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-amber-200">
                          <Clock className="w-3 h-3" /> In Verification
                        </span>
                      )}
                      {!isPaid && !isUnderVer && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full text-[11px] border border-red-200">
                          <AlertCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {isPaid ? (
                        <button
                          onClick={() => matchingReceipt && setSelectedReceipt(matchingReceipt)}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-blue-200 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setPaymentModalFee(fee)}
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Online</span>
                          </button>

                          <button
                            onClick={() => setUploadProofFee(fee)}
                            className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-orange-200 transition"
                            title="If bank money debited but not reflected in portal"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Proof</span>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Requests Tracker & Receipts Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Status Stepper */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Active Verification Tracking</h3>
            <span className="text-[11px] text-slate-400 font-mono">BCE CONTROLLER STATUS</span>
          </div>

          {verifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No active payment verification requests. If your bank was debited without a receipt, click "Upload Proof" above.
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map(ver => (
                <div key={ver.verificationId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{ver.feeType}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      ver.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ver.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ver.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div>Bank UTR: <span className="font-mono font-bold text-slate-800">{ver.transactionId}</span></div>
                    <div>Amount: <span className="font-bold text-slate-900">₹{ver.amount?.toLocaleString('en-IN')}</span></div>
                    <div>Submitted: {ver.submittedOn}</div>
                    {ver.remarks && <div className="text-slate-500 italic">"{ver.remarks}"</div>}
                  </div>

                  {/* Stepper Visual */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <div className="text-center font-bold text-emerald-700">✓ Uploaded</div>
                    <div className="h-0.5 flex-1 bg-slate-300 mx-2"></div>
                    <div className={`text-center font-bold ${ver.status !== 'Pending' ? 'text-emerald-700' : 'text-amber-600'}`}>
                      {ver.status !== 'Pending' ? '✓ Reconciled' : '⏳ Admin Review'}
                    </div>
                    <div className="h-0.5 flex-1 bg-slate-300 mx-2"></div>
                    <div className={`text-center font-bold ${ver.status === 'Approved' ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {ver.status === 'Approved' ? '✓ Receipt Issued' : 'Receipt'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issued Receipts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Official Fee Receipts</h3>
            <span className="text-[11px] text-slate-500">{receipts.length} Stamped</span>
          </div>

          {receipts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No fee receipts issued yet. Complete a payment to generate an official digital receipt.
            </div>
          ) : (
            <div className="space-y-3">
              {receipts.map(rc => (
                <div
                  key={rc.receiptId}
                  className="p-4 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 flex justify-between items-center transition"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-blue-900">{rc.receiptNo}</div>
                    <div className="text-xs font-bold text-slate-900">{rc.feeType}</div>
                    <div className="text-[11px] text-slate-500">Issued: {rc.generatedOn} • Mode: {rc.paymentMode}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm font-black text-slate-900">₹{rc.amount?.toLocaleString('en-IN')}</div>
                    <button
                      onClick={() => setSelectedReceipt(rc)}
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
