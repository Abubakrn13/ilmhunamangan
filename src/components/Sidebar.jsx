import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, Users, Layers, GraduationCap, 
  Wallet, Phone, Settings, LogOut, X, 
  Moon, Sun 
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, storeName, theme, toggleTheme } = useData();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';

  // --- RANGLAR ---
  const bgClass = isDark ? 'bg-[#0f172a] border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600';
  const activeClass = isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-50 text-blue-600';
  const hoverClass = isDark ? 'hover:bg-white/5 hover:text-white' : 'hover:bg-slate-50 hover:text-slate-900';

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/students', name: "O'quvchilar", icon: <Users size={20} /> },
    { path: '/groups', name: 'Guruhlar', icon: <Layers size={20} /> },
    { path: '/teachers', name: "O'qituvchilar", icon: <GraduationCap size={20} /> },
    { path: '/payments', name: "To'lovlar", icon: <Wallet size={20} /> },
    { path: '/leads', name: 'Lidlar', icon: <Phone size={20} /> },
    { path: '/settings', name: 'Sozlamalar', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    if(confirm("Chiqasizmi?")) { logout(); navigate('/login'); }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"/>}

      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r shadow-2xl overflow-hidden flex flex-col
          ${bgClass}
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
          md:translate-x-0 ${isHovered ? 'md:w-64' : 'md:w-20'}
        `}
      >
        {/* LOGO */}
        <div className="h-20 flex items-center px-5 gap-3 flex-shrink-0">
           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 flex-shrink-0">E</div>
           <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered || isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              <h1 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{storeName || 'EduCore'}</h1>
              <p className="text-[10px] font-bold uppercase opacity-50">CRM System</p>
           </div>
           {/* Mobile Close */}
           <button onClick={onClose} className="md:hidden ml-auto"><X/></button>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 space-y-2 mt-2 overflow-y-auto">
           {menuItems.map(item => (
              <NavLink key={item.path} to={item.path} onClick={() => onClose()}
                className={({isActive}) => `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap overflow-hidden ${isActive ? activeClass : hoverClass}`}
              >
                 <div className="min-w-[24px] flex justify-center">{item.icon}</div>
                 <span className={`transition-all duration-300 ${isHovered || isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}>{item.name}</span>
              </NavLink>
           ))}
        </nav>

        {/* FOOTER */}
        <div className="p-3 mt-auto space-y-2 border-t border-white/5">
           <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all whitespace-nowrap ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}>
              <div className="min-w-[24px] flex justify-center">{isDark ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-600"/>}</div>
              <span className={`transition-all duration-300 font-bold text-sm ${isHovered || isOpen ? 'opacity-100' : 'opacity-0'} ${isDark?'text-white':'text-slate-700'}`}>{isDark ? 'Kunduzgi' : 'Tungi'}</span>
           </button>
           
           
        </div>
      </aside>
    </>
  );
};