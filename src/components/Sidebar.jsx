import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Wallet, 
  Settings, 
  LogOut, 
  GraduationCap, 
  ClipboardCheck, 
  UserPlus 
} from 'lucide-react';

export const Sidebar = () => {
  // DataContext dan ma'lumotlarni olishda xatolik bo'lmasligi uchun tekshiramiz
  const data = useData();
  const storeName = data?.storeName || 'EduCore';
  const logout = data?.logout || (() => console.log("Logout function not found"));
  const theme = data?.theme || 'light';
  
  const isDark = theme === 'dark';

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={24} />, label: 'Boshqaruv' },
    { path: '/leads', icon: <UserPlus size={24} />, label: 'Lidlar (Qabul)' },
    { path: '/students', icon: <Users size={24} />, label: 'O\'quvchilar' },
    { path: '/groups', icon: <Layers size={24} />, label: 'Guruhlar' },
    { path: '/attendance', icon: <ClipboardCheck size={24} />, label: 'Davomat' },
    { path: '/finance', icon: <Wallet size={24} />, label: 'Moliya' },
    { path: '/teachers', icon: <GraduationCap size={24} />, label: 'O\'qituvchilar' },
    { path: '/settings', icon: <Settings size={24} />, label: 'Sozlamalar' },
  ];

  return (
    // 🔥 ASOSIY KONTEYNER
    // w-20 (80px) -> hover:w-64 (256px)
    <div 
      className={`hidden md:flex flex-col fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300 ease-in-out group w-20 hover:w-64 overflow-hidden ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}
    >
      
      {/* --- LOGO QISMI --- */}
      <div className="h-20 flex items-center min-w-[256px] px-5 border-b border-dashed border-slate-200/20">
        <div className="w-10 h-10 min-w-[40px] bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
          Ec
        </div>
        
        {/* Yozuv (Animatsiya bilan chiqadi) */}
        <h1 className={`font-black text-xl tracking-tight ml-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {storeName}
        </h1>
      </div>

      {/* --- MENU QISMI --- */}
      <div className="flex-1 overflow-y-auto py-6 space-y-2 custom-scrollbar overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center h-12 mx-3 px-3 rounded-xl font-bold transition-all duration-200 min-w-[200px]
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {/* Ikonka */}
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
               {item.icon}
            </div>

            {/* Yozuv */}
            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap delay-75">
               {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};