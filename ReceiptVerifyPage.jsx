import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  Building2
} from 'lucide-react';

export default function ReceiptVerifyPage() {
  const { setSelectedReceipt } = useAuth();
  const [code, setCode] = useState('AU-REC-250520-ST101-8500');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/receipts/verify/${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      setLoading(false);
      setResult(data);
    } catch (err) {
      setLoading(false);
      setResult({ success: false, message: 'Could not connect to verification server' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase">
          Public e-Receipt Validator
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Verify Official Fee Receipt
        </h1>
        <p className="text-xs text-slate-500">
          Enter Receipt Number or scanned QR code token to cryptographically verify official authentication status.
        </p>

      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Receipt Number or QR Code String
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. RCPT250520001 or AU-REC-..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Verify Authenticity'}</span>
          </button>
        </form>

        {result && (
          <div className={`p-5 rounded-2xl border ${
            result.valid
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-2">
              {result.valid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Valid Aditya University Digital Receipt</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span>Invalid or Forged Receipt Token</span>
                </>
              )}
            </div>

            <p className="text-xs mb-3">{result.message}</p>

            {result.receipt && (
              <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <div>Receipt No: <strong className="font-mono">{result.receipt.receiptNo}</strong></div>
                <div>Student: <strong>{result.receipt.studentName} ({result.receipt.studentId})</strong></div>
                <div>Fee Description: <strong>{result.receipt.feeType}</strong></div>
                <div>Amount: <strong className="text-emerald-700">₹{result.receipt.amount?.toLocaleString('en-IN')}</strong></div>
                <div>Verified By: {result.receipt.verifiedBy}</div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedReceipt(result.receipt)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    View Full Printable Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
