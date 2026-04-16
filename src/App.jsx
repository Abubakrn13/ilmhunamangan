import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Menu } from 'lucide-react';

import { Landing } from './pages/Landing'; 
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Groups } from './pages/Groups';
import { Teachers } from './pages/Teachers';
import { Payments } from './pages/Payments';
import { Leads } from './pages/Leads';
import { Settings } from './pages/Settings';
import { Subscription } from './pages/Subscription'; // 🔥 YANGI IMPORT
import { Sidebar } from './components/Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useData(); // Mavzuni olamiz
  
  // Tun rejimi yoqilganmi?
  const isDark = theme === 'dark';

  return (
    // 🔥 MUHIM: Butun sayt foni shu yerda o'zgaradi
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Sidebar (Yon panel) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Asosiy Kontent */}
      <div className="flex-1 flex flex-col md:ml-20 min-h-screen transition-all duration-300">
        
        {/* Mobile Header (Faqat telefonda) */}
        <div className={`md:hidden p-4 border-b flex items-center justify-between sticky top-0 z-30 ${isDark ? 'bg-[#0f172a] border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
           <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-500/10 rounded-lg">
             <Menu size={24} />
           </button>
           <span className="font-black text-lg">EduCore</span>
           <div className="w-8"></div>
        </div>

        {/* Sahifa ichi */}
        <main className="p-4 md:p-8 overflow-y-auto flex-1">
          {children}
        </main>

      </div>
    </div>
  );
};

const AppContent = () => {
  const { session } = useData();

  return (
    <Routes>
      <Route path="/" element={!session ? <Landing /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={session ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/students" element={session ? <Layout><Students /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/groups" element={session ? <Layout><Groups /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/teachers" element={session ? <Layout><Teachers /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/payments" element={session ? <Layout><Payments /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/leads" element={session ? <Layout><Leads /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={session ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />} />
      <Route path="/subscription" element={session ? <Layout><Subscription /></Layout> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <DataProvider>
      <AppContent />
    </DataProvider>
  </Router>
);

export default App;