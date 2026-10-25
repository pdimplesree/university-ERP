import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('au_erp_user');
    return saved ? JSON.parse(saved) : {
      studentId: 'ST101',
      name: 'Naga Raju M',
      email: 'nagaraju24@aditya.edu.in',
      phone: '9876543210',
      course: 'B.Tech AIML',
      semester: 'IV',
      role: 'student',
      section: 'AI-A',
      academicYear: '2024-2028',
      fatherName: 'M. Venkateswarlu'
    };
  });

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('au_erp_role');
    return savedRole || 'student';
  });

  const [activeTab, setActiveTab] = useState('home');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [paymentModalFee, setPaymentModalFee] = useState(null);
  const [uploadProofFee, setUploadProofFee] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('au_erp_user', JSON.stringify(user));
      localStorage.setItem('au_erp_role', role);
    } else {
      localStorage.removeItem('au_erp_user');
      localStorage.removeItem('au_erp_role');
    }
  }, [user, role]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const login = (userData, userRole) => {
    setUser({ ...userData, role: userRole });
    setRole(userRole);
    showToast(`Welcome back, ${userData.name}! Logged in as ${userRole === 'admin' ? 'Administrator' : 'Student'}.`, 'success');
  };

  const logout = () => {
    setUser(null);
    setRole('guest');
    localStorage.removeItem('au_erp_user');
    localStorage.removeItem('au_erp_role');
    showToast('Logged out successfully.', 'info');
  };

  const switchPersona = (persona, personaRole) => {
    setUser({ ...persona, role: personaRole });
    setRole(personaRole);
    showToast(`Switched persona to: ${persona.name} (${personaRole.toUpperCase()})`, 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setUser,
        setRole,
        login,
        logout,
        switchPersona,
        activeTab,
        setActiveTab,
        selectedReceipt,
        setSelectedReceipt,
        paymentModalFee,
        setPaymentModalFee,
        uploadProofFee,
        setUploadProofFee,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
