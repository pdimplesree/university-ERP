import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Sparkles,
  Cpu
} from 'lucide-react';

export default function HomePage() {
  const { role, user, setActiveTab } = useAuth();


  return (
    <div className="py-8 space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Institutional ERP Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            ERP Fee Payment & <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Verification System</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
            A comprehensive, fault-tolerant platform for student fee management, resolving unreflected bank payment failures, automated screenshot & UTR reconciliation, and digital receipt generation.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setActiveTab('login')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
            >
              <span>Access ERP Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('bank-ledger')}
              className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Bank Gateway Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab('verify-receipt')}
              className="px-6 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-sky-400" />
              <span>Verify Receipt (QR)</span>
            </button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Fee Management</div>
              <div className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant & Transparent</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Reconciliation</div>
              <div className="font-bold text-sky-300 flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Automated & Manual</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Security</div>
              <div className="font-bold text-indigo-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>QR Verification</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow Problem & Solution Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">The Unreflected Payment Challenge</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            When students pay tuition or hostel fees, bank accounts are debited, but gateway timeout or dropped callbacks can leave the status pending in ERP.
          </p>
          <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 text-xs text-amber-900 font-medium">
            Bank Debited (-₹35,000) ➔ Gateway Webhook drops ➔ Payment marked Pending.
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">The Verification Solution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students upload bank UTR & transaction proof. Administrators verify side-by-side with bank gateway ledgers and issue official receipts instantly.
          </p>
          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 font-medium">
            Proof Uploaded ➔ Bank Ledger Matched ➔ Admin 1-Click Verification ➔ Official Receipt with QR.
          </div>
        </div>
      </section>

      {/* System Modules Navigation */}
      <section className="space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-slate-900">ERP Modules</h2>
          <p className="text-xs text-slate-500">
            {role === 'student'
              ? 'Access your fee dues, submit proof for unreflected payments, and view receipts.'
              : role === 'admin'
              ? 'Manage verification queue, match against bank ledgers, and approve receipts.'
              : 'Select a portal below to sign in or verify an existing receipt.'}
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${role ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
          {/* Student Portal (Shown for Students and Logged-out users) */}
          {role !== 'admin' && (
            <div
              onClick={() => setActiveTab('student')}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {role === 'student' ? 'My Fee Portal' : 'Student Portal'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  View fee dues, pay online, submit UTR proof, and download receipts.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition">
                <span>{role === 'student' ? 'Go to My Dashboard' : 'Student Login / Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Admin Desk (Shown for Admins and Logged-out users) */}
          {role !== 'student' && (
            <div
              onClick={() => setActiveTab('admin')}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Admin Desk</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review uploaded proofs, match against bank ledgers, and approve payments.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-0.5 transition">
                <span>{role === 'admin' ? 'Open Verification Queue' : 'Admin Login / Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Bank Gateway (Shown for Admins and Logged-out users) */}
          {role !== 'student' && (
            <div
              onClick={() => setActiveTab('bank-ledger')}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition group cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Bank Gateway Ledger</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time simulated institutional settlement ledger from bank gateways.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition">
                <span>View Bank Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Verify Receipt (Available for everyone) */}
          <div
            onClick={() => setActiveTab('verify-receipt')}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-400 hover:shadow-lg transition group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Verify Receipt</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan QR or lookup receipt hash for instant tamper-proof verification.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-0.5 transition">
              <span>Verify QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


