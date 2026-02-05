import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useData } from './context/DataContext';
import { Sidebar } from './components/Sidebar';

// 1. Fayllar borligiga ishonch hosil qiling!
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails'; // 👈 Shu fayl bormi?
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Leads } from './pages/Leads';
import { Finance } from './pages/Finance';
import { Attendance } from './pages/Attendance';
import { Champions } from './pages/Champions';
import { Settings } from './pages/Settings';

function App() {
  const data = useData();
  
  // Agar Context yuklanmasa
  if (!data) return <div className="flex h-screen items-center justify-center">Yuklanmoqda...</div>;

  const { currentUser, theme } = data;

  if (!currentUser) return <Login />;

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      <Sidebar />
      <div className="flex-1 ml-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;