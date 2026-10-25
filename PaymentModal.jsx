import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  UploadCloud,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentModal() {
  const { paymentModalFee, setPaymentModalFee, user, setUploadProofFee, setSelectedReceipt, showToast } = useAuth();
  const [paymentMode, setPaymentMode] = useState('upi');
  const [simulateDrop, setSimulateDrop] = useState(true);
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  if (!paymentModalFee) return null;

  const handleProcessPayment = async () => {
    setLoading(true);
    setPaymentResult(null);

    try {
      const res = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feeId: paymentModalFee.feeId,
          studentId: user?.studentId || paymentModalFee?.studentId,
          amount: paymentModalFee.amount,
          mode: paymentMode.toUpperCase(),
          simulateUnreflected: simulateDrop
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.status === 'GATEWAY_SYNC_ERROR') {
        setPaymentResult({
          type: 'unreflected',
          transactionId: data.transactionId,
          message: data.message,
          amount: data.amount
        });
        showToast('Payment completed in Bank, but ERP sync failed! (Simulated)', 'warning');
      } else if (data.status === 'SUCCESS') {
        setPaymentResult({
          type: 'success',
          receipt: data.receipt,
          transactionId: data.transactionId,
          message: data.message
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        showToast('Payment successful & official receipt generated!', 'success');
      }
    } catch (err) {
      setLoading(false);
      showToast('Payment simulation encountered network error.', 'error');
    }
  };

  const handleOpenProofSubmission = () => {
    const feeToVerify = {
      ...paymentModalFee,
      suggestedTxnId: paymentResult?.transactionId || 'UPI1234567890'
    };
    setPaymentModalFee(null);
    setUploadProofFee(feeToVerify);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                AU SECURE GATEWAY
              </span>
              <span className="text-xs text-slate-300 font-mono">GW-2025-RECON</span>
            </div>
            <h3 className="text-lg font-bold mt-0.5">Online Fee Checkout</h3>
          </div>
          <button
            onClick={() => setPaymentModalFee(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!paymentResult ? (
            <>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Paying For</span>
                  <div className="text-sm font-bold text-slate-900">{paymentModalFee.feeType}</div>
                  <div className="text-xs text-slate-500">{user?.name} ({user?.studentId}) • Sem {paymentModalFee.semester}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Amount Due</span>
                  <div className="text-2xl font-extrabold text-blue-700">₹{paymentModalFee.amount.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMode === 'upi'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <span>UPI / QR Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('card')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMode === 'card'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('netbanking')}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition ${
                    paymentMode === 'netbanking'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-5 h-5 text-emerald-600" />
                  <span>Net Banking</span>
                </button>
              </div>

              {paymentMode === 'upi' && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-5 flex flex-col items-center text-center">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200 mb-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=adityauniversity@okhdfcbank&pn=AdityaUniversity&am=${paymentModalFee.amount}&cu=INR`}
                      alt="UPI QR"
                      className="w-32 h-32"
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">adityauniversity@okhdfcbank</span>
                  <p className="text-[11px] text-slate-500 mt-1">Scan via Google Pay, PhonePe, Paytm or BHIM UPI</p>
                </div>
              )}

              {paymentMode === 'card' && (
                <div className="space-y-3 mb-5 text-left text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="08/28"
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">CVV</label>
                      <input
                        type="password"
                        readOnly
                        value="982"
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMode === 'netbanking' && (
                <div className="space-y-3 mb-5 text-left text-xs">
                  <label className="block text-slate-600 font-medium">Select Bank</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium">
                    <option>HDFC Bank Direct Gateway</option>
                    <option>State Bank of India (SBI Collect)</option>
                    <option>ICICI Bank Payment Portal</option>
                    <option>Axis Bank Payment Gateway</option>
                  </select>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 text-left">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="simDrop"
                    checked={simulateDrop}
                    onChange={e => setSimulateDrop(e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-600 rounded border-amber-300 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="simDrop" className="text-xs cursor-pointer">
                    <strong className="text-amber-900 block flex items-center gap-1 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Simulate Project Scenario: "Bank Debited, Portal Dropped"
                    </strong>
                    <span className="text-amber-700 text-[11px] block mt-0.5">
                      Check this box to test the project problem statement: bank money is deducted, but portal does not reflect payment, triggering the screenshot verification workflow!
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Gateway Settlement...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{paymentModalFee.amount.toLocaleString('en-IN')} Now</span>
                  </>
                )}
              </button>
            </>
          ) : paymentResult.type === 'unreflected' ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                Bank Debited • ERP Sync Dropped
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2">Payment Not Reflected on University Portal</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                {paymentResult.message}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 my-4 text-left font-mono text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Bank Transaction ID / UTR:</span>
                  <span className="font-bold text-slate-900">{paymentResult.transactionId}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Debited:</span>
                  <span className="font-bold text-emerald-700">₹{paymentResult.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bank Gateway Status:</span>
                  <span className="font-bold text-blue-700">Settled in University Bank A/c</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleOpenProofSubmission}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 text-xs flex items-center justify-center gap-2 transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Payment Screenshot for Instant Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModalFee(null)}
                  className="w-full text-slate-500 hover:text-slate-700 text-xs py-2 font-medium"
                >
                  Close & Submit Later
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                Instant Payment Success
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-2">Official Fee Receipt Generated!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Your fee has been verified and settled. Receipt #{paymentResult.receipt?.receiptNo} has been stamped.
              </p>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalFee(null);
                    setSelectedReceipt(paymentResult.receipt);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>View Official Fee Receipt</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentModalFee(null)}
                  className="w-full text-slate-500 hover:text-slate-700 text-xs py-2 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
