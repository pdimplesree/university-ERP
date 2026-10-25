import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  FileCheck2,
  LogOut,
  LogIn,
  Building2,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, activeTab, setActiveTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Strictly separated navigation items per role
  let navItems = [{ id: 'home', label: 'Home', icon: Building2 }];

  if (!user) {
    navItems.push(
      { id: 'verify-receipt', label: 'Verify Receipt', icon: FileCheck2 }
    );
  } else if (role === 'student') {
    // Only Student portal items for students
    navItems.push(
      { id: 'student', label: 'My Fee Portal', icon: GraduationCap },
      { id: 'verify-receipt', label: 'Verify Receipt', icon: FileCheck2 }
    );
  } else if (role === 'admin') {
    // Only Admin desk items for administrators
    navItems.push(
      { id: 'admin', label: 'Admin Verification Desk', icon: ShieldCheck },
      { id: 'bank-ledger', label: 'Bank Gateway Ledger', icon: CreditCard },
      { id: 'verify-receipt', label: 'Verify Receipt', icon: FileCheck2 }
    );
  }

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition tracking-wider text-sm">
              ERP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-blue-400 transition">
                  ERP Portal
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-medium">Fee Payment & Verification System</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-slate-800/60 p-1.5 rounded-2xl border border-slate-700/60">
            {navItems.map((item) => {
              if (item.hidden) return null;
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User / Login Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end">
                    <span>{user.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {role === 'admin' ? (user.adminRole || 'Fee Officer') : (user.studentId || 'Student')}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 rounded-xl border border-slate-700/60 transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button
                onClick={logout}
                className="p-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1.5 animate-in fade-in duration-150">
            {navItems.map((item) => {
              if (item.hidden) return null;
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {!user && (
              <button
                onClick={() => handleNav('login')}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

