import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
// Sahifalar
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails';
import { Finance } from './pages/Finance';
import { Teachers } from './pages/Teachers';
import { Settings } from './pages/Settings';
import { Attendance } from './pages/Attendance';
import { Leads } from './pages/Leads';
import { Subscription } from './pages/Subscription';
import { Checkout } from './pages/Checkout'; // 🔥

// Komponentlar
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useData();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const Layout = ({ children }) => {
  const { theme } = useData();
  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      <Sidebar />
      {/* 🔥 md:ml-20 -> Sidebar kichkina holati uchun joy */}
      <div className="flex-1 md:ml-20 pb-24 md:pb-0 relative w-full transition-all duration-300">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

const AppContent = () => {
  const { currentUser } = useData();
  return (
    <Routes>
      <Route path="/" element={currentUser ? (<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>) : (<Landing />)} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      
      {/* Ichki sahifalar */}
      <Route path="/students" element={<ProtectedRoute><Layout><Students /></Layout></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><Layout><Groups /></Layout></ProtectedRoute>} />
      <Route path="/groups/:id" element={<ProtectedRoute><Layout><GroupDetails /></Layout></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute><Layout><Finance /></Layout></ProtectedRoute>} />
      <Route path="/teachers" element={<ProtectedRoute><Layout><Teachers /></Layout></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Layout><Leads /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Layout><Subscription /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <DataProvider>
    <Router><AppContent /></Router>
  </DataProvider>
);

export default App;