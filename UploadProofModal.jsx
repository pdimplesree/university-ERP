import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  UploadCloud,
  Sparkles
} from 'lucide-react';

export default function UploadProofModal() {
  const { uploadProofFee, setUploadProofFee, user, showToast } = useAuth();
  const fileInputRef = useRef(null);

  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState(35000);
  const [payerName, setPayerName] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank UPI / PhonePe');
  const [remarks, setRemarks] = useState('Amount debited from bank account but ERP portal showed pending status.');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('/uploads/sample_receipt_proof.svg');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uploadProofFee) {
      setTransactionId(uploadProofFee.suggestedTxnId || 'UPI' + Math.floor(1000000000 + Math.random() * 9000000000));
      setAmount(uploadProofFee.amount || 35000);
      setPayerName(user?.name || uploadProofFee.studentName || '');
      setSelectedFile(null);
      setPreviewUrl('/uploads/sample_receipt_proof.svg');
    }
  }, [uploadProofFee, user]);

  if (!uploadProofFee) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUseSampleProof = () => {
    setTransactionId(uploadProofFee.suggestedTxnId || 'UPI' + Math.floor(1000000000 + Math.random() * 9000000000));
    setPreviewUrl('/uploads/sample_receipt_proof.svg');
    showToast('Loaded sample verified bank debit screenshot!', 'info');
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast('Please enter the UPI Transaction ID / UTR number.', 'error');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('feeId', uploadProofFee.feeId);
    formData.append('studentId', user?.studentId || uploadProofFee?.studentId);
    formData.append('transactionId', transactionId.trim());
    formData.append('amount', amount);
    formData.append('payerName', payerName || user?.name || 'Student');
    formData.append('bankName', bankName);
    formData.append('remarks', remarks);
    if (selectedFile) {
      formData.append('screenshot', selectedFile);
    }

    try {
      const res = await fetch('/api/payments/upload-proof', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast('Payment proof submitted successfully! Verification is now pending in Admin Desk.', 'success');
        setUploadProofFee(null);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(data.message || 'Submission failed.', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('Server connection error during upload.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded">
                STEP 2: PROOF VERIFICATION
              </span>
              <span className="text-xs text-amber-200 font-mono">BCE CONTROLLER LINK</span>
            </div>
            <h3 className="text-lg font-bold mt-0.5">Upload Payment Screenshot & UTR Proof</h3>
          </div>
          <button
            onClick={() => setUploadProofFee(null)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitProof} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 flex justify-between items-center">
            <div>
              <span className="text-[11px] font-bold text-orange-800 uppercase">Verifying Fee Item</span>
              <div className="font-bold text-slate-900 text-sm">{uploadProofFee.feeType}</div>
              <div className="text-slate-600 text-[11px]">Fee ID: {uploadProofFee.feeId} • Sem {uploadProofFee.semester}</div>
            </div>
            <div className="text-right font-extrabold text-orange-700 text-xl">
              ₹{uploadProofFee.amount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  UPI Transaction ID / Bank UTR <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. UPI1234567890 or 49281039812"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Must match 12-digit UTR from your bank SMS / UPI app.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payer Account / Name</label>
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={e => setPayerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method / Bank App</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="e.g. Google Pay / PhonePe / SBI Yono"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Remarks / Explanation</label>
                <textarea
                  rows="2"
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                ></textarea>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-slate-700">
                Payment Proof Screenshot
              </label>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] relative group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="w-full flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Proof Preview"
                      className="max-h-36 rounded-lg object-contain border border-slate-200 shadow-sm"
                    />
                    <span className="text-[11px] text-orange-600 font-bold mt-2 group-hover:underline">
                      Click to Change Screenshot
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mb-2" />
                    <span className="font-bold text-slate-700">Click to Upload Screenshot</span>
                    <span className="text-[10px] text-slate-500">Supports JPG, PNG, WebP or SVG receipts</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleUseSampleProof}
                className="w-full py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold border border-slate-300 flex items-center justify-center gap-1 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Auto-fill Matching Sample UTR & Screenshot
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setUploadProofFee(null)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting to Admin Queue...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Submit Verification Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
