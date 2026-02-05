import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, Users, UserPlus, Layers, 
  Briefcase, // 👈 O'qituvchi ikonkasini import qildik
  Wallet, CalendarCheck, Settings, LogOut, Trophy 
} from 'lucide-react';

export const Sidebar = () => {
  const { logout, storeName, theme } = useData();
  const isDark = theme === 'dark';

  const links = [
    { path: '/', icon: <LayoutDashboard size={24} />, label: "Boshqaruv" },
    { path: '/students', icon: <Users size={24} />, label: "O'quvchilar" },
    { path: '/leads', icon: <UserPlus size={24} />, label: "Lidlar" },
    { path: '/groups', icon: <Layers size={24} />, label: "Guruhlar" },
    
    // 👇 MANA SHU QATORNI QO'SHING
    { path: '/teachers', icon: <Briefcase size={24} />, label: "O'qituvchilar" },
    
    { path: '/finance', icon: <Wallet size={24} />, label: "Moliya" },
    { path: '/attendance', icon: <CalendarCheck size={24} />, label: "Davomat" },
    { path: '/champions', icon: <Trophy size={24} />, label: "Chempionlar" },
    { path: '/settings', icon: <Settings size={24} />, label: "Sozlamalar" },
  ];

  // ... (Qolgan kod o'zgarmaydi) ...
  return (
    <div className={`fixed left-0 top-0 h-screen z-50 flex flex-col border-r transition-all duration-500 ease-in-out group w-20 hover:w-72 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
      
      {/* Logo */}
      <div className="h-24 flex items-center justify-center relative flex-shrink-0">
        <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/30 absolute transition-all duration-300 group-hover:opacity-0 group-hover:scale-0">
          {(storeName || 'E').charAt(0)}
        </div>
        <h1 className="text-2xl font-black text-cyan-500 tracking-tighter absolute opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 delay-100 whitespace-nowrap">
          {storeName || 'EDUCORE'}
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-2 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              relative flex items-center h-14 px-4 mx-3 rounded-2xl transition-all duration-300 font-bold overflow-hidden whitespace-nowrap
              ${isActive 
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
            `}
          >
            <span className="min-w-[24px] flex justify-center">{link.icon}</span>
            <span className="ml-4 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 mt-auto relative flex-shrink-0">
        <button onClick={logout} className={`w-full flex items-center h-14 px-4 rounded-2xl font-bold transition-all duration-300 overflow-hidden whitespace-nowrap ${isDark ? 'text-rose-500 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}>
          <span className="min-w-[24px] flex justify-center"><LogOut size={24} /></span>
          <span className="ml-4 opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75">Chiqish</span>
        </button>
      </div>
    </div>
  );
};