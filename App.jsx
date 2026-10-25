import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PaymentModal from './components/PaymentModal';
import UploadProofModal from './components/UploadProofModal';
import ReceiptModal from './components/ReceiptModal';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BankLedgerPage from './pages/BankLedgerPage';
import ReceiptVerifyPage from './pages/ReceiptVerifyPage';

function MainContent() {
  const { user, role, activeTab, toast } = useAuth();

  const renderActiveView = () => {
    if (activeTab === 'home') return <HomePage />;
    if (activeTab === 'login') return <LoginPage />;
    if (activeTab === 'verify-receipt') return <ReceiptVerifyPage />;

    // Student View Guard
    if (activeTab === 'student') {
      if (!user) return <LoginPage initialTab="student" />;
      if (role === 'admin') return <AdminDashboard />;
      return <StudentDashboard />;
    }

    // Admin View Guard
    if (activeTab === 'admin') {
      if (!user) return <LoginPage initialTab="admin" />;
      if (role === 'student') return <StudentDashboard />;
      return <AdminDashboard />;
    }

    // Bank Ledger (Admin Feature)
    if (activeTab === 'bank-ledger') {
      if (user && role === 'student') return <StudentDashboard />;
      return <BankLedgerPage />;
    }

    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-600'
              : toast.type === 'warning'
              ? 'bg-amber-950 text-amber-100 border-amber-600'
              : toast.type === 'error'
              ? 'bg-red-950 text-red-100 border-red-600'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Active View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {renderActiveView()}
      </main>



      {/* Global Modals */}
      <PaymentModal />
      <UploadProofModal />
      <ReceiptModal />

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
