import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, CreditCard, FileCheck2 } from 'lucide-react';

export default function Footer() {
  const { setActiveTab } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                ERP
              </div>
              <h3 className="font-bold text-base text-white">ERP Portal</h3>
            </div>
            <p className="text-xs text-slate-400">
              Institutional Fee Payment, Gateway Reconciliation & Digital Receipt System.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('student')}
              className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('bank-ledger')}
              className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Bank Gateway</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('verify-receipt')}
              className="hover:text-sky-400 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Verify Receipt</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
          <p>© 2025 ERP System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

