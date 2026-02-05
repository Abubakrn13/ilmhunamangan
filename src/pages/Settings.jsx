import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Moon, Sun, Settings as SettingsIcon, Bell, Shield, 
  BookOpen, CheckCircle, Trash2, AlertTriangle 
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const Settings = () => {
  // resetSystem ni oldik
  const { theme, toggleTheme, storeName, setStoreName, resetSystem } = useData();
  const isDark = theme === 'dark';

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Resetni tasdiqlash
  const handleReset = () => {
    resetSystem();
    setIsResetModalOpen(false);
    alert("Tizim muvaffaqiyatli tozalandi!");
  };

  return (
    <div className={`p-10 min-h-screen transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <SettingsIcon className="text-cyan-500"/> Sozlamalar
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Chap Tomon: Tizim Sozlamalari */}
        <div className="space-y-8">
          <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
               <Shield size={20} className="text-purple-500"/> Tizim
            </h2>
            
            <div className="space-y-6">
               <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>O'quv Markaz Nomi</label>
                  <input 
                    type="text" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className={`w-full p-4 rounded-2xl outline-none border font-bold transition-all focus:border-cyan-500 ${isDark ? 'bg-[#0b1120] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
               </div>

               <div className="flex items-center justify-between">
                  <div>
                     <p className="font-bold">Tungi Rejim</p>
                     <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ko'zni asrash uchun qorong'u fon</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isDark ? 'bg-cyan-600' : 'bg-slate-300'}`}
                  >
                     <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-300 flex items-center justify-center shadow-sm ${isDark ? 'left-9' : 'left-1'}`}>
                        {isDark ? <Moon size={14} className="text-cyan-600"/> : <Sun size={14} className="text-amber-500"/>}
                     </div>
                  </button>
               </div>
            </div>
          </div>

          {/* Ma'lumot */}
          <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Bell size={20} className="text-orange-500"/> Ma'lumot
             </h2>
             <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
               Tizim versiyasi: <span className="font-bold text-cyan-500">v1.0.2 Pro</span>
             </p>
          </div>
        </div>

        {/* O'ng Tomon */}
        <div className="space-y-8">
           
           {/* Qo'llanma */}
           <div className={`p-8 rounded-[32px] border h-fit ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-500"/> Foydalanish Qo'llanmasi
              </h2>
              
              <div className="space-y-4">
                 {[
                   "Avval 'Guruhlar' bo'limida yangi yo'nalish oching.",
                   "'Lidlar' bo'limida yangi kelganlarni ro'yxatga oling.",
                   "Lidlarni 'Qabul qilish' orqali o'quvchiga aylantiring.",
                   "'Davomat' bo'limida har kuni yo'qlamani belgilang.",
                   "O'qituvchilarga guruh ochishda (%) ulush belgilang."
                 ].map((text, idx) => (
                   <div key={idx} className="flex gap-3 items-start">
                      <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0"/>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* 🔥 XAVFLI HUDUD (RESET) */}
           <div className={`p-8 rounded-[32px] border border-rose-500/20 ${isDark ? 'bg-rose-900/5' : 'bg-rose-50'}`}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-rose-500">
                <AlertTriangle size={20}/> Xavfli Hudud
              </h2>
              <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Bu amal barcha o'quvchilar, guruhlar va moliyaviy ma'lumotlarni o'chirib tashlaydi. Qayta tiklashning imkoni yo'q.
              </p>
              <button 
                onClick={() => setIsResetModalOpen(true)}
                className="w-full py-4 rounded-2xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition active:scale-95 flex items-center justify-center gap-2"
              >
                 <Trash2 size={20}/> Tizimni Tozalash (Reset)
              </button>
           </div>

        </div>

      </div>

      {/* 🛑 RESETNI TASDIQLASH */}
      <ConfirmModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        onConfirm={handleReset} 
        isDark={isDark} 
        title="DIQQAT! Tizimni tozalash" 
        message="Siz barcha ma'lumotlarni o'chirib yubormoqchisiz. Rostdan ham tozalab tashlaysizmi yoki yo'qmi?" 
      />

    </div>
  );
};