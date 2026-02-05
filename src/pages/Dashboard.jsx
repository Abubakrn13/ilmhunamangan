import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Layers, Wallet, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, CalendarClock 
} from 'lucide-react';

export const Dashboard = () => {
  const data = useData();

  // 🔥 1-HIMOYA: Agar ma'lumot hali yuklanmagan bo'lsa, oq ekran bermaydi
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400 font-bold animate-pulse">
        Tizim yuklanmoqda...
      </div>
    );
  }

  const { students, groups, payments, expenses, leads, theme } = data;
  const isDark = theme === 'dark';

  // 🔥 2-HIMOYA: Agar arraylar (ro'yxatlar) bo'sh bo'lsa, xato bermaydi
  const safeStudents = students || [];
  const safeGroups = groups || [];
  const safePayments = payments || [];
  const safeExpenses = expenses || [];
  const safeLeads = leads || [];

  // --- HISOBLASH ---
  const totalStudents = safeStudents.length;
  const totalGroups = safeGroups.length;
  const totalIncome = safePayments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
  const totalExpense = safeExpenses.reduce((sum, e) => sum + (parseInt(e.amount) || 0), 0);
  const profit = totalIncome - totalExpense;

  // Oxirgi 5 ta operatsiya (Kirim va Chiqim aralash)
  const recentTransactions = [...safePayments, ...safeExpenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className={`p-10 min-h-screen transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SALOM QISMI */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Activity className="text-cyan-500" size={36} /> Boshqaruv Paneli
          </h1>
          <p className={`font-medium text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            O'quv markazingizning bugungi holati
          </p>
        </div>
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-sm ${isDark ? 'bg-[#161d31] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
           <CalendarClock size={18}/> Bugun: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* 📊 STATISTIKA KARTALARI (GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        
        {/* 1. O'QUVCHILAR */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <Users size={28} />
            </div>
            <div>
               <p className={`font-bold uppercase text-xs tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>O'quvchilar</p>
               <p className="text-3xl font-black">{totalStudents}</p>
            </div>
          </div>
          <p className="text-xs font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg w-fit">
             + {safeLeads.length} ta yangi lid
          </p>
        </div>

        {/* 2. GURUHLAR */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Layers size={28} />
            </div>
            <div>
               <p className={`font-bold uppercase text-xs tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Guruhlar</p>
               <p className="text-3xl font-black">{totalGroups}</p>
            </div>
          </div>
          <p className="text-xs font-bold text-purple-500 bg-purple-500/10 px-3 py-1 rounded-lg w-fit">
             Faol yo'nalishlar
          </p>
        </div>

        {/* 3. JAMI TUSHUM */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <Wallet size={28} />
            </div>
            <div>
               <p className={`font-bold uppercase text-xs tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Jami Tushum</p>
               <p className="text-3xl font-black text-emerald-500">+{totalIncome.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg w-fit">
             Umumiy kirim
          </p>
        </div>

        {/* 4. SOF FOYDA */}
        <div className={`p-6 rounded-[32px] border relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gradient-to-br from-cyan-900/20 to-[#161d31] border-cyan-500/20' : 'bg-gradient-to-br from-cyan-50 to-white border-cyan-200 shadow-cyan-100'}`}>
          
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
              <TrendingUp size={28} />
            </div>
            <div>
               <p className={`font-bold uppercase text-xs tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sof Foyda</p>
               <p className={`text-3xl font-black ${profit >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-rose-500'}`}>
                 {profit.toLocaleString()}
               </p>
            </div>
          </div>
          <p className={`text-xs font-bold px-3 py-1 rounded-lg w-fit ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
             Xarajatlar chiqarildi
          </p>
        </div>
      </div>

      {/* 📜 OXIRGI OPERATSIYALAR TARIXI */}
      <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
         <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
            <h3 className="font-bold text-lg flex items-center gap-2">
               So'nggi Moliyaviy Operatsiyalar
            </h3>
         </div>
         
         <div className="divide-y divide-white/5">
           {recentTransactions.length > 0 ? recentTransactions.map(t => (
             <div key={t.id} className={`p-6 flex justify-between items-center transition ${isDark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {t.type === 'income' ? <ArrowUpRight size={24}/> : <ArrowDownRight size={24}/>}
                   </div>
                   <div>
                      <p className="font-bold text-lg">{t.student || t.category || t.reason}</p>
                      <p className="text-xs text-slate-500 font-bold">{t.date}</p>
                   </div>
                </div>
                <p className={`font-black text-xl ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {t.type === 'income' ? '+' : '-'}{parseInt(t.amount).toLocaleString()}
                </p>
             </div>
           )) : (
             <div className="p-10 text-center opacity-50">
               <TrendingUp size={48} className="mx-auto mb-4 text-slate-300"/>
               <p className="font-bold">Hozircha ma'lumot yo'q</p>
             </div>
           )}
         </div>
      </div>

    </div>
  );
};