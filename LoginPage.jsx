import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  UserPlus,
  LogIn,
  Lock,
  User
} from 'lucide-react';

export default function LoginPage({ initialTab = 'student' }) {
  const { login, setActiveTab, showToast } = useAuth();
  const [tab, setTab] = useState(initialTab); // student | admin | register
  const [emailOrId, setEmailOrId] = useState(initialTab === 'admin' ? 'ADM01' : 'ST101');
  const [password, setPassword] = useState(initialTab === 'admin' ? 'admin123' : 'password123');
  const [loading, setLoading] = useState(false);


  // Registration form
  const [regData, setRegData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    course: 'B.Tech AIML',
    semester: 'IV',
    password: '',
    fatherName: '',
    section: 'AI-A'
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrId, password, role: tab })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        login(data.user, data.role);
        setActiveTab(data.role === 'admin' ? 'admin' : 'student');
      } else {
        showToast(data.message || 'Login failed.', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('Could not connect to server.', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        login(data.user, 'student');
        showToast('Registration successful! Account created in ERP database.', 'success');
        setActiveTab('student');
      } else {
        showToast(data.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      setLoading(false);
      showToast('Server connection error.', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          ERP
        </div>
        <h1 className="text-2xl font-black text-slate-900">Welcome to ERP Portal</h1>
        <p className="text-xs text-slate-500">
          Sign in to your account or register to manage fee payments.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => {
              setTab('student');
              setEmailOrId('ST101');
              setPassword('password123');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'student' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>
          <button
            onClick={() => {
              setTab('admin');
              setEmailOrId('ADM01');
              setPassword('admin123');
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'admin' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer ${
              tab === 'register' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Login Form */}
        {tab !== 'register' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                {tab === 'student' ? 'Student ID / Roll Number' : 'Administrator ID / Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder={tab === 'student' ? 'e.g. ST101' : 'e.g. ADM01'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer ${
                  tab === 'admin'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                }`}
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to {tab === 'admin' ? 'Admin Desk' : 'Student Portal'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student ID / Roll No</label>
                <input
                  type="text"
                  required
                  value={regData.studentId}
                  onChange={(e) => setRegData({ ...regData, studentId: e.target.value })}
                  placeholder="e.g. ST105"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regData.name}
                  onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="rahul@erp.edu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={regData.phone}
                  onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course / Branch</label>
                <select
                  value={regData.course}
                  onChange={(e) => setRegData({ ...regData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>B.Tech AIML</option>
                  <option>B.Tech CSE</option>
                  <option>B.Tech ECE</option>
                  <option>B.Tech Data Science</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <select
                  value={regData.semester}
                  onChange={(e) => setRegData({ ...regData, semester: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>I</option>
                  <option>II</option>
                  <option>III</option>
                  <option>IV</option>
                  <option>V</option>
                  <option>VI</option>
                  <option>VII</option>
                  <option>VIII</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={regData.password}
                onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                placeholder="Create password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

