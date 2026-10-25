import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  RefreshCw,
  Search,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';

export default function BankLedgerPage() {
  const [ledger, setLedger] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports/analytics');
      const data = await res.json();
      if (data.success) {
        setLedger(data.bankLedger || []);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filtered = ledger.filter(item =>
    item.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    item.payerName?.toLowerCase().includes(search.toLowerCase()) ||
    item.referenceNo?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
            SIMULATED BANK GATEWAY SETTLEMENT LEDGER
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Institutional Payment Gateway Feed
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Simulates real-time bank settlement callbacks from HDFC, SBI, ICICI & Axis Gateways stored in ERP records.
          </p>
        </div>

        <button
          onClick={fetchLedger}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Bank Feed</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Transaction ID, UTR or Payer..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span>Total Transactions: <strong>{ledger.length}</strong></span>
          <span>•</span>
          <span className="text-emerald-700 font-bold">
            Reconciled: {ledger.filter(l => l.reconciled).length}
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction ID (UTR)</th>
                <th className="py-3 px-4">Bank Ref No</th>
                <th className="py-3 px-4">Payer Name & Account</th>
                <th className="py-3 px-4">Gateway / Bank</th>
                <th className="py-3 px-4">Settlement Time</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">ERP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(row => (
                <tr key={row.transactionId} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{row.transactionId}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{row.referenceNo}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{row.payerName}</div>
                    <div className="text-[10px] text-slate-500">{row.payerAccount}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{row.bankName}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.transactionDate}</td>
                  <td className="py-3.5 px-4 font-black text-right text-slate-900">
                    ₹{row.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.reconciled ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-amber-200">
                        In University Bank
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
