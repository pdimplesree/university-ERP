import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  Building,
  UserCheck,
  Zap,
  ArrowRight,
  Sliders,
  DollarSign,
  PlusCircle,
  Layers,
  Trash2,
  Users,
  GraduationCap
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, showToast, setSelectedReceipt } = useAuth();
  const [activeTab, setActiveTab] = useState('fees'); // 'queue' or 'fees'
  const [queue, setQueue] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedVer, setSelectedVer] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fee Management States
  const [students, setStudents] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [feeFilter, setFeeFilter] = useState('all');
  const [feeSearch, setFeeSearch] = useState('');

  // Add Fee Form State
  const [assignMode, setAssignMode] = useState('existing'); // 'existing', 'new', 'bulk'
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [feeType, setFeeType] = useState('Semester Tuition Fee');
  const [customFeeType, setCustomFeeType] = useState('');
  const [semester, setSemester] = useState('IV');
  const [amount, setAmount] = useState('35000');
  const [dueDate, setDueDate] = useState('2025-07-31');
  const [description, setDescription] = useState('');
  const [submittingFee, setSubmittingFee] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [queueRes, analyticsRes, feesRes, studentsRes] = await Promise.all([
        fetch('/api/verifications/queue'),
        fetch('/api/reports/analytics'),
        fetch('/api/fees/all'),
        fetch('/api/fees/students')
      ]);
      const queueData = await queueRes.json();
      const analyticsData = await analyticsRes.json();
      const feesData = await feesRes.json();
      const studentsData = await studentsRes.json();

      if (queueData.success) {
        setQueue(queueData.queue || []);
        if (queueData.queue?.length > 0 && !selectedVer) {
          setSelectedVer(queueData.queue[0]);
        }
      }
      if (analyticsData.success) {
        setAnalytics(analyticsData);
      }
      if (feesData.success) {
        setAllFees(feesData.fees || []);
      }
      if (studentsData.success) {
        setStudents(studentsData.students || []);
        if (studentsData.students?.length > 0 && !selectedStudentId) {
          setSelectedStudentId(studentsData.students[0].studentId);
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (verId) => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/verifications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verId,
          adminId: user?.adminId || 'ADM01',
          adminRemarks: remarks || 'Verified & Reconciled with Bank Gateway'
        })
      });
      const data = await res.json();
      setActionLoading(false);

      if (data.success) {
        showToast('Payment verified successfully! Official fee receipt created.', 'success');
        fetchAdminData();
        if (data.receipt) {
          setSelectedReceipt(data.receipt);
        }
      } else {
        showToast(data.message || 'Approval failed', 'error');
      }
    } catch (err) {
      setActionLoading(false);
      showToast('Error during approval', 'error');
    }
  };

  const handleReject = async (verId) => {
    const reason = prompt('Please enter rejection reason:', 'Could not match UTR in bank ledger.');
    if (!reason) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/verifications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationId: verId,
          adminId: user?.adminId || 'ADM01',
          reason
        })
      });
      const data = await res.json();
      setActionLoading(false);

      if (data.success) {
        showToast('Payment verification rejected.', 'info');
        fetchAdminData();
      }
    } catch (err) {
      setActionLoading(false);
      showToast('Error during rejection', 'error');
    }
  };

  const handleAutoReconcileAll = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/verifications/auto-reconcile-all', { method: 'POST' });
      const data = await res.json();
      setActionLoading(false);
      if (data.success) {
        showToast(`Auto-reconciliation finished: ${data.matchedCount} transactions matched & approved!`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      setActionLoading(false);
      showToast('Auto-reconciliation error', 'error');
    }
  };

  const handleAddFeeSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast('Please enter a valid fee amount.', 'error');
      return;
    }
    if (!dueDate) {
      showToast('Please select a due date.', 'error');
      return;
    }

    const finalFeeType = feeType === 'Custom' ? customFeeType.trim() : feeType;
    if (!finalFeeType) {
      showToast('Please enter the fee type / name.', 'error');
      return;
    }

    setSubmittingFee(true);

    const payload = {
      feeType: finalFeeType,
      semester,
      amount: Number(amount),
      dueDate,
      description: description || finalFeeType,
      isBulkAll: assignMode === 'bulk'
    };

    if (assignMode === 'existing') {
      const stu = students.find(s => s.studentId === selectedStudentId);
      payload.studentId = selectedStudentId;
      payload.studentName = stu ? stu.name : '';
    } else if (assignMode === 'new') {
      if (!newStudentName.trim()) {
        showToast('Please enter the student full name.', 'error');
        setSubmittingFee(false);
        return;
      }
      payload.studentName = newStudentName.trim();
      payload.studentId = newStudentId.trim() || `ST${Math.floor(100 + Math.random() * 900)}`;
    }

    try {
      const res = await fetch('/api/fees/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSubmittingFee(false);

      if (data.success) {
        showToast(data.message || 'Fee demand added successfully!', 'success');
        // Reset form
        setCustomFeeType('');
        setDescription('');
        setNewStudentName('');
        setNewStudentId('');
        fetchAdminData();
      } else {
        showToast(data.message || 'Failed to add fee', 'error');
      }
    } catch (err) {
      setSubmittingFee(false);
      showToast('Error assigning fee demand', 'error');
    }
  };

  const handleDeleteFee = async (feeId, feeName) => {
    if (!window.confirm(`Are you sure you want to delete ${feeName} (${feeId})?`)) return;
    try {
      const res = await fetch(`/api/fees/${feeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Fee removed', 'info');
        fetchAdminData();
      } else {
        showToast(data.message || 'Failed to remove fee', 'error');
      }
    } catch (err) {
      showToast('Network error deleting fee', 'error');
    }
  };

  const stats = analytics?.stats || {};

  const filteredFees = allFees.filter(fee => {
    const matchesFilter =
      feeFilter === 'all' ? true :
      feeFilter === 'pending' ? (fee.status === 'Pending' || fee.status === 'In Verification') :
      feeFilter === 'paid' ? (fee.status === 'Paid') : true;

    const matchesSearch =
      feeSearch === '' ? true :
      (fee.studentName?.toLowerCase().includes(feeSearch.toLowerCase()) ||
       fee.studentId?.toLowerCase().includes(feeSearch.toLowerCase()) ||
       fee.feeType?.toLowerCase().includes(feeSearch.toLowerCase()) ||
       fee.feeId?.toLowerCase().includes(feeSearch.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
              ADMINISTRATION & ERP DESK
            </span>
            <span className="text-xs text-slate-300 font-mono">FINANCE & ACCOUNTS PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Fee Management & Verification Portal
          </h1>
          <p className="text-xs text-slate-300">
            Officer: <strong className="text-white">{user?.name || 'Admin User'}</strong> ({user?.adminRole || 'Fee Officer'}) • Finance & Accounts Directorate
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoReconcileAll}
            disabled={actionLoading}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 transition disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>1-Click Auto Reconcile</span>
          </button>

          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
            activeTab === 'fees'
              ? 'bg-blue-600 text-white shadow-blue-600/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>➕ Assign Student Fees & Ledger</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'fees' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {allFees.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white shadow-blue-600/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>🛡️ Verification Desk (UTR Reconcile)</span>
          {queue.filter(q => q.status === 'Pending').length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-black animate-pulse">
              {queue.filter(q => q.status === 'Pending').length} Pending
            </span>
          )}
        </button>
      </div>

      {/* Analytics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Institutional Dues</span>
          <div className="text-xl font-black text-slate-900">₹{(stats.totalBilled || 0).toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-slate-400">{students.length || stats.totalStudents || 4} Registered Students</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/20">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Verified Collections</span>
          <div className="text-xl font-black text-emerald-700">₹{(stats.totalCollected || 0).toLocaleString('en-IN')}</div>
          <p className="text-[10px] text-emerald-600">{stats.approvedVerificationsCount || 0} Verifications Approved</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/20">
          <span className="text-[11px] font-bold text-amber-700 uppercase">Pending Queue</span>
          <div className="text-xl font-black text-amber-700">{stats.pendingVerificationsCount || queue.filter(q => q.status === 'Pending').length}</div>
          <p className="text-[10px] text-amber-600">Awaiting Reconciliation</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-1 bg-blue-50/20">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Total Fee Heads</span>
          <div className="text-xl font-black text-blue-700">{allFees.length} Demands</div>
          <p className="text-[10px] text-blue-600">Active in ERP Database</p>
        </div>
      </div>

      {/* TAB 1: ADD & ASSIGN FEES MODULE */}
      {activeTab === 'fees' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Add Fee Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  INSTITUTIONAL FEE CREATOR
                </span>
                <h2 className="text-lg font-bold mt-1">Assign Fee Demand to Students</h2>
                <p className="text-xs text-slate-300">
                  Add custom or standard semester fees to any student. Newly assigned fees will instantly reflect in the student's portal for payment.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddFeeSubmit} className="p-6 space-y-6">
              {/* Assignment Target Mode */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  1. Target Student Selection
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAssignMode('existing')}
                    className={`p-3 rounded-2xl border text-left text-xs transition ${
                      assignMode === 'existing'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-bold">Select Existing Student</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Pick from registered ERP students list</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignMode('new')}
                    className={`p-3 rounded-2xl border text-left text-xs transition ${
                      assignMode === 'new'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold">New / Specific Name</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Enter student name and roll number directly</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssignMode('bulk')}
                    className={`p-3 rounded-2xl border text-left text-xs transition ${
                      assignMode === 'bulk'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">Bulk Assign (All Students)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Apply fee to all {students.length} students</p>
                  </button>
                </div>
              </div>

              {/* Student Fields based on Mode */}
              {assignMode === 'existing' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Registered Student from College Database:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    {students.map(s => (
                      <option key={s.studentId} value={s.studentId}>
                        {s.name} — Roll No: {s.studentId} ({s.course || 'B.Tech AIML'} • Sem {s.semester || 'IV'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {assignMode === 'new' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={e => setNewStudentName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar / Sravani Rao"
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student Roll / ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={newStudentId}
                      onChange={e => setNewStudentId(e.target.value)}
                      placeholder="e.g. ST105 / 24B11AI301"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                    />
                  </div>
                </div>
              )}

              {assignMode === 'bulk' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <strong>Bulk Assignment Enabled:</strong> This fee will be generated simultaneously for all <strong>{students.length}</strong> active students in the ERP system.
                  </div>
                </div>
              )}

              {/* Fee Particulars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fee Head / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={feeType}
                    onChange={e => setFeeType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Semester Tuition Fee">Semester Tuition Fee</option>
                    <option value="Hostel & Premium Mess Fee">Hostel & Premium Mess Fee</option>
                    <option value="Semester End Examination Fee">Semester End Examination Fee</option>
                    <option value="AI & ML GPU Supercomputing Lab Fee">AI & ML GPU Supercomputing Lab Fee</option>
                    <option value="Library & Digital Book Bank Fee">Library & Digital Book Bank Fee</option>
                    <option value="Campus Transport & Bus Fee">Campus Transport & Bus Fee</option>
                    <option value="Special Training & Placement Fee">Special Training & Placement Fee</option>
                    <option value="Custom">Custom / Other Fee Name</option>
                  </select>
                </div>

                {feeType === 'Custom' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter Custom Fee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customFeeType}
                      onChange={e => setCustomFeeType(e.target.value)}
                      placeholder="e.g. Workshop / Certification Fee"
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Semester / Term <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="I">Semester I</option>
                    <option value="II">Semester II</option>
                    <option value="III">Semester III</option>
                    <option value="IV">Semester IV</option>
                    <option value="V">Semester V</option>
                    <option value="VI">Semester VI</option>
                    <option value="VII">Semester VII</option>
                    <option value="VIII">Semester VIII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fee Amount (₹ INR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="e.g. 35000"
                      required
                      min="1"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Particulars / Description Note
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g. Academic fee for Semester IV Regular curriculum & facilities"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingFee}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{submittingFee ? 'Assigning Fee in ERP Database...' : 'Assign Fee Demand Now'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* All Fees Ledger Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active Student Fee Ledger ({filteredFees.length} Records)
                </h3>
                <p className="text-xs text-slate-500">Live fee demands across all registered students in ERP records</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={feeSearch}
                    onChange={e => setFeeSearch(e.target.value)}
                    placeholder="Search student or fee..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  <button
                    onClick={() => setFeeFilter('all')}
                    className={`px-3 py-1 rounded-lg transition ${feeFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    All ({allFees.length})
                  </button>
                  <button
                    onClick={() => setFeeFilter('pending')}
                    className={`px-3 py-1 rounded-lg transition ${feeFilter === 'pending' ? 'bg-white text-amber-800 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFeeFilter('paid')}
                    className={`px-3 py-1 rounded-lg transition ${feeFilter === 'paid' ? 'bg-white text-emerald-800 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    Paid
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Fee ID</th>
                    <th className="py-3 px-4">Student Particulars</th>
                    <th className="py-3 px-4">Fee Particulars</th>
                    <th className="py-3 px-4">Sem</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                        No fee demands matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredFees.map(f => (
                      <tr key={f.feeId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">{f.feeId}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{f.studentName}</div>
                          <div className="text-[10px] font-mono text-slate-500">{f.studentId} • {f.studentCourse || 'B.Tech AIML'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{f.feeType}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{f.description}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">{f.semester || 'IV'}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          ₹{f.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{f.dueDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            f.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : f.status === 'In Verification'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleDeleteFee(f.feeId, f.feeType)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Fee Demand"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION QUEUE & RECONCILIATION DESK */}
      {activeTab === 'queue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-150">
          {/* Verification Queue List */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Verification Queue ({queue.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-500">SORT: RECENT</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {queue.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No verification submissions in queue.
                </div>
              ) : (
                queue.map(ver => {
                  const isSelected = selectedVer?.verificationId === ver.verificationId;
                  const isMatched = ver.bankGatewayMatch ? true : false;

                  return (
                    <div
                      key={ver.verificationId}
                      onClick={() => {
                        setSelectedVer(ver);
                        setRemarks('');
                      }}
                      className={`p-4 cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50/80 border-l-4 border-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start text-xs mb-1">
                        <span className="font-bold text-slate-900">{ver.studentName} ({ver.studentId})</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ver.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ver.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ver.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex justify-between items-center">
                        <span>{ver.feeType}</span>
                        <span className="font-bold text-slate-900">₹{ver.amount?.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-500">{ver.transactionId}</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ✓ Matched in Bank (100%)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Verification Inspector (Side-by-Side Proof vs Bank Ledger) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            {selectedVer ? (
              <>
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      Reconciliation Inspector
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">
                      Verification ID: {selectedVer.verificationId}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedVer.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedVer.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {selectedVer.status}
                  </span>
                </div>

                {/* Side by side comparison grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left Pane: Student Uploaded Proof */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
                      <span>1. Student Proof Submission</span>
                      <span className="text-[10px] text-slate-500">{selectedVer.submittedOn}</span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div>Student: <strong className="text-slate-800">{selectedVer.studentName} ({selectedVer.studentId})</strong></div>
                      <div>Claimed UTR: <strong className="font-mono text-blue-700">{selectedVer.transactionId}</strong></div>
                      <div>Claimed Amount: <strong className="font-bold text-slate-900">₹{selectedVer.amount?.toLocaleString('en-IN')}</strong></div>
                      <div>Student Note: <span className="italic text-slate-600">"{selectedVer.remarks}"</span></div>
                    </div>

                    {/* Screenshot Thumbnail */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 block mb-1">Uploaded Screenshot Proof:</span>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                        <img
                          src={selectedVer.screenshotPath || '/uploads/sample_receipt_proof.svg'}
                          alt="Proof"
                          className="max-h-48 mx-auto rounded object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Bank Gateway Ledger Match */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-2">
                      <span>2. Bank Gateway Ledger Match</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Match Found ✓ (100% Verified)
                      </span>
                    </div>

                    {selectedVer.bankGatewayMatch ? (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                          <div className="font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Bank Settlement Confirmed
                          </div>
                          <div>Ref: <strong className="font-mono">{selectedVer.bankGatewayMatch.referenceNo}</strong></div>
                          <div>Bank: {selectedVer.bankGatewayMatch.bankName}</div>
                          <div>Payer: {selectedVer.bankGatewayMatch.payerName} ({selectedVer.bankGatewayMatch.payerAccount})</div>
                          <div>Amount Credited: <strong>₹{selectedVer.bankGatewayMatch.amount?.toLocaleString('en-IN')}</strong></div>
                          <div>Time: {selectedVer.bankGatewayMatch.settlementTime}</div>
                        </div>

                        <div className="text-[10px] text-slate-500">
                          The UTR and amount match exactly with the university's merchant bank settlement account ledger.
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 space-y-2">
                        <div className="text-amber-600 font-bold">No Transaction In Gateway Feed</div>
                        <p className="text-[10px]">
                          The transaction ID '{selectedVer.transactionId}' could not be matched against current bank settlement logs.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Controls */}
                {selectedVer.status === 'Pending' ? (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Administrative Decision Remarks
                      </label>
                      <input
                        type="text"
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="e.g. Verified against HDFC Bank Settlement Report. Approved."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(selectedVer.verificationId)}
                        disabled={actionLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Issue Official Fee Receipt</span>
                      </button>

                      <button
                        onClick={() => handleReject(selectedVer.verificationId)}
                        disabled={actionLoading}
                        className="px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2.5 rounded-xl text-xs border border-red-200 transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex justify-between items-center">
                    <span>Verified by: <strong>{selectedVer.verifiedBy || 'Admin User'}</strong> on {selectedVer.verifiedOn}</span>
                    <span className="italic">"{selectedVer.remarks}"</span>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center text-xs text-slate-500">
                Select a verification request from the left queue to inspect proof.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
