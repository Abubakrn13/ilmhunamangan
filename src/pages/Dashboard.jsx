import React from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Layers, Wallet, TrendingUp, TrendingDown, 
  MoreHorizontal, Calendar, ArrowUpRight, Phone,
  CreditCard, Activity
} from 'lucide-react';

export const Dashboard = () => {
  const { students, groups, payments, leads, theme } = useData();
  
  // 🔥 TUN/KUN REJIMINI ANIQLASH
  const isDark = theme === 'dark';

  // --- RANGLAR STYLE ---
  // Bu o'zgaruvchilar orqali ranglarni boshqaramiz
  const cardClass = isDark 
    ? 'bg-[#1e293b] border border-white/5 shadow-xl text-white' 
    : 'bg-white border border-slate-100 shadow-sm text-slate-800';

  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const hoverClass = isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50';

  // =========================================================================
  // 1. STATISTIKA HISOB-KITOBI
  // =========================================================================

  const totalStudents = students.length;
  const totalGroups = groups.length;
  const totalLeads = leads.length;

  const income = payments
    .filter(p => p.type === 'income')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    
  const expense = payments
    .filter(p => p.type === 'expense')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const profit = income - expense;

  // --- DIAGRAMMA (REAL DATA) ---
  const getChartData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      const monthName = d.toLocaleDateString('uz-UZ', { month: 'short' });

      const monthlyPayments = payments.filter(p => {
         const pDate = new Date(p.created_at);
         return pDate.getMonth() === monthIndex && pDate.getFullYear() === year;
      });

      const monthlyIncome = monthlyPayments.filter(p => p.type === 'income').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const monthlyExpense = monthlyPayments.filter(p => p.type === 'expense').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

      data.push({ name: monthName, income: monthlyIncome, expense: monthlyExpense });
    }
    return data;
  };

  const chartData = getChartData();
  const maxChartValue = Math.max(...chartData.map(d => d.income), 100);

  // --- SO'NGGI HARAKATLAR ---
  const recentStudents = [...students].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
  const recentPayments = [...payments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 4);
  const formatMoney = (amount) => Number(amount).toLocaleString() + " so'm";

  // =========================================================================
  // 2. VISUAL (JSX)
  // =========================================================================
  
  return (
    <div className="p-6 md:p-8 min-h-screen pb-24">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${textMain}`}>
             Dashboard <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full font-bold uppercase tracking-wider border border-blue-500/20">Live</span>
          </h1>
          <p className={`${textSub} font-medium mt-1`}>Markazning bugungi holati va moliyaviy ko'rsatkichlari</p>
        </div>
        
        <div className={`hidden md:flex px-4 py-2 rounded-2xl border items-center gap-3 font-bold text-sm ${isDark ? 'bg-[#1e293b] border-white/10 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`}>
           <Calendar size={18} className="text-blue-500"/>
           {new Date().toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* --- STATISTIKA KARTALARI --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* 1. Students */}
        <div className={`p-6 rounded-[28px] transition-all duration-300 group hover:-translate-y-1 ${cardClass}`}>
           <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                 <Users size={28} />
              </div>
           </div>
           <div>
               <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${textSub}`}>Jami O'quvchilar</p>
               <h3 className={`text-4xl font-black ${textMain}`}>{totalStudents}</h3>
           </div>
        </div>

        {/* 2. Groups */}
        <div className={`p-6 rounded-[28px] transition-all duration-300 group hover:-translate-y-1 ${cardClass}`}>
           <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                 <Layers size={28} />
              </div>
           </div>
           <div>
               <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${textSub}`}>Guruhlar</p>
               <h3 className={`text-4xl font-black ${textMain}`}>{totalGroups}</h3>
           </div>
        </div>

        {/* 3. Leads */}
        <div className={`p-6 rounded-[28px] transition-all duration-300 group hover:-translate-y-1 ${cardClass}`}>
           <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                 <Phone size={28} />
              </div>
           </div>
           <div>
               <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${textSub}`}>Yangi Lidlar</p>
               <h3 className={`text-4xl font-black ${textMain}`}>{totalLeads}</h3>
           </div>
        </div>

        {/* 4. Profit (Gradient - Har doim bir xil turadi) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 p-6 rounded-[28px] shadow-lg shadow-blue-900/20 text-white hover:shadow-blue-600/30 hover:-translate-y-1 transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={80} /></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 opacity-90">
                 <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><Wallet size={24}/></div>
                 <span className="font-bold text-blue-100">Sof Foyda</span>
              </div>
              <h3 className="text-3xl font-black mb-2 tracking-tight">
                {profit.toLocaleString()} <span className="text-lg font-medium opacity-70">so'm</span>
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium text-blue-200 mt-4">
                 <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={14}/> Kirim: {income.toLocaleString()}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- ASOSIY GRAFIK VA RO'YXATLAR --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* 1. KATTA DIAGRAMMA */}
         <div className={`lg:col-span-2 p-6 md:p-8 rounded-[32px] flex flex-col justify-between min-h-[400px] ${cardClass}`}>
            
            <div className="flex justify-between items-center mb-8">
               <div>
                   <h3 className={`text-xl font-black flex items-center gap-2 ${textMain}`}>
                     <Activity className="text-blue-500"/> Moliya Statistikasi
                   </h3>
                   <p className={`text-sm font-medium mt-1 ${textSub}`}>So'nggi 6 oylik real kirim va chiqimlar</p>
               </div>
               <button className={`p-2 rounded-full transition ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                   <MoreHorizontal />
               </button>
            </div>

            {/* CHART BODY */}
            <div className={`flex-1 flex items-end justify-between gap-3 md:gap-6 px-2 pb-2 relative border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
               
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                  {[1,2,3,4].map(i => <div key={i} className={`w-full h-px border-t border-dashed ${isDark ? 'border-white' : 'border-black'}`}></div>)}
               </div>

               {chartData.map((item, index) => {
                  const incomePercent = (item.income / maxChartValue) * 100;
                  const expensePercent = (item.expense / maxChartValue) * 100;
                  const hIncome = item.income > 0 ? Math.max(incomePercent, 2) : 2;
                  const hExpense = item.expense > 0 ? Math.max(expensePercent, 2) : 2;

                  return (
                     <div key={index} className="flex flex-col items-center gap-3 flex-1 group relative z-10 h-full justify-end">
                        <div className={`opacity-0 group-hover:opacity-100 absolute -top-12 text-white text-xs font-bold py-2 px-3 rounded-xl transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none shadow-xl z-20 whitespace-nowrap ${isDark ? 'bg-slate-700' : 'bg-slate-800'}`}>
                           <div className="flex flex-col gap-1">
                               <span className="text-emerald-400">+{formatMoney(item.income)}</span>
                               <span className="text-rose-400">-{formatMoney(item.expense)}</span>
                           </div>
                        </div>

                        <div className="flex items-end gap-1 sm:gap-2 w-full justify-center h-full">
                           <div style={{ height: `${hIncome}%` }} className={`w-3 sm:w-5 rounded-t-xl transition-all duration-500 ease-out group-hover:scale-y-105 ${item.income > 0 ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/20' : (isDark ? 'bg-white/5' : 'bg-slate-200')}`}></div>
                           <div style={{ height: `${hExpense}%` }} className={`w-3 sm:w-5 rounded-t-xl transition-all duration-500 ease-out group-hover:scale-y-105 ${item.expense > 0 ? 'bg-gradient-to-t from-rose-500 to-orange-400 opacity-80' : (isDark ? 'bg-white/5 opacity-50' : 'bg-slate-200 opacity-50')}`}></div>
                        </div>
                        
                        <span className={`text-xs font-bold group-hover:text-blue-500 transition-colors uppercase tracking-wide ${textSub}`}>
                            {item.name}
                        </span>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* 2. O'NG TOMON PANEL */}
         <div className="flex flex-col gap-6">
            
            {/* YANGI O'QUVCHILAR */}
            <div className={`p-6 rounded-[32px] flex-1 ${cardClass}`}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className={`text-lg font-black ${textMain}`}>Yangi O'quvchilar</h3>
                </div>

                <div className="space-y-4">
                   {recentStudents.map((student, i) => (
                      <div key={student.id} className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer group border border-transparent ${hoverClass}`}>
                         <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md transform group-hover:scale-110 transition-transform duration-300
                                ${['bg-orange-400', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500'][i % 4]}
                            `}>
                               {student.name.charAt(0)}
                            </div>
                            <div>
                               <h4 className={`font-bold text-sm ${textMain}`}>{student.name}</h4>
                               <p className={`text-xs font-medium ${textSub}`}>{student.phone}</p>
                            </div>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                   ))}
                   {recentStudents.length === 0 && (
                      <div className={`text-center py-8 font-medium rounded-2xl border border-dashed ${isDark ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                          Hozircha o'quvchilar yo'q
                      </div>
                   )}
                </div>
            </div>

            {/* SO'NGGI TO'LOVLAR */}
            <div className={`p-6 rounded-[32px] ${cardClass}`}>
                <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${textMain}`}>
                    <CreditCard size={18} className="text-slate-400"/> So'nggi To'lovlar
                </h3>
                <div className="space-y-3">
                    {recentPayments.map(p => (
                        <div key={p.id} className={`flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0 ${isDark ? 'border-white/10' : 'border-slate-50'}`}>
                            <span className={`font-medium truncate max-w-[120px] ${textSub}`}>{p.comment || 'To\'lov'}</span>
                            <span className={`font-bold ${p.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {p.type === 'income' ? '+' : '-'}{Number(p.amount).toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {recentPayments.length === 0 && (
                        <p className={`text-xs text-center ${textSub}`}>To'lovlar tarixi bo'sh</p>
                    )}
                </div>
            </div>

         </div>
      </div>
    </div>
  );
};