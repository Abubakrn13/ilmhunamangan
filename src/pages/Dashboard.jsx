import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Layers, TrendingUp, Wallet, 
  Calendar, ArrowDownLeft, ArrowUpRight, History, Clock, 
  BarChart4, Activity, Filter
} from 'lucide-react';

export const Dashboard = () => {
  const { students, leads, groups, payments, expenses, theme } = useData();
  const isDark = theme === 'dark';

  // --- STATE: Grafik turi ---
  const [chartView, setChartView] = useState('year'); // 'week', 'month', 'year'

  // --- 1. SANA VA HISOBLASH ---
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ru-RU');
  
  // Jami statistika
  const totalIncome = payments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + (parseInt(e.amount) || 0), 0);
  const netProfit = totalIncome - totalExpense;

  // --- 2. GRAFIK LOGIKASI (UNIVERSAL) ---
  const getChartData = () => {
    let data = [];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();

    // A) YILLIK KO'RINISH (12 oy)
    if (chartView === 'year') {
      const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
      data = months.map((name, idx) => {
        // Kelajak oylarini 0 qilish
        if (idx > currentMonth && today.getFullYear() === currentYear) return { name, income: 0, expense: 0 };
        
        const inc = payments.filter(p => new Date(p.date).getMonth() === idx && new Date(p.date).getFullYear() === currentYear)
          .reduce((sum, p) => sum + (parseInt(p.amount)||0), 0);
        const exp = expenses.filter(e => new Date(e.date).getMonth() === idx && new Date(e.date).getFullYear() === currentYear)
          .reduce((sum, e) => sum + (parseInt(e.amount)||0), 0);
        return { name, income: inc, expense: exp };
      });
    } 
    
    // B) OYLIK KO'RINISH (Kunlar: 1-31)
    else if (chartView === 'month') {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Shu oy necha kun?
      for (let i = 1; i <= daysInMonth; i++) {
        // Kelajak kunlarini 0 qilish
        if (i > currentDate) {
           data.push({ name: `${i}`, income: 0, expense: 0 });
           continue;
        }

        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        const inc = payments.filter(p => p.date === dateStr).reduce((sum, p) => sum + (parseInt(p.amount)||0), 0);
        const exp = expenses.filter(e => e.date === dateStr).reduce((sum, e) => sum + (parseInt(e.amount)||0), 0);
        
        data.push({ name: `${i}`, income: inc, expense: exp });
      }
    } 
    
    // C) HAFTALIK KO'RINISH (Dush-Yak)
    else if (chartView === 'week') {
       const weekDays = ["Dush", "Sesh", "Chor", "Pay", "Juma", "Shan", "Yak"];
       // Dushanbani topish
       const dayOfWeek = today.getDay() || 7; // 1 (Mon) - 7 (Sun)
       const monday = new Date(today);
       monday.setDate(today.getDate() - dayOfWeek + 1);

       for (let i = 0; i < 7; i++) {
          const tempDate = new Date(monday);
          tempDate.setDate(monday.getDate() + i);
          const dateStr = tempDate.toISOString().slice(0, 10);
          
          // Kelajak kunlari 0
          if (tempDate > today) {
             data.push({ name: weekDays[i], income: 0, expense: 0 });
             continue;
          }

          const inc = payments.filter(p => p.date === dateStr).reduce((sum, p) => sum + (parseInt(p.amount)||0), 0);
          const exp = expenses.filter(e => e.date === dateStr).reduce((sum, e) => sum + (parseInt(e.amount)||0), 0);
          
          data.push({ name: weekDays[i], income: inc, expense: exp });
       }
    }

    return data;
  };

  const chartData = useMemo(() => getChartData(), [chartView, payments, expenses]);
  const maxVal = Math.max(...chartData.map(d => Math.max(d.income, d.expense))) || 1;

  // --- 3. SO'NGGI OPERATSIYALAR ---
  const recentTransactions = [...payments, ...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Boshqaruv Paneli</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
             <Activity size={16} className="text-emerald-500"/> Jonli statistika
          </p>
        </div>
        <div className={`px-5 py-2 rounded-xl border font-bold flex items-center gap-2 shadow-sm ${isDark ? 'bg-[#161d31] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
           <Calendar size={18} className="text-blue-500"/> Bugun: {formattedDate}
        </div>
      </div>

      {/* --- KARTALAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
         {/* 1. O'quvchilar */}
         <div className={`p-6 rounded-[28px] border relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition"><Users size={80} className="text-blue-500"/></div>
            <div className="flex items-center gap-3 mb-3 text-blue-500 font-bold"><Users size={20}/> O'quvchilar</div>
            <p className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{students.length}</p>
            <p className="text-sm font-bold text-slate-500 text-emerald-500">+ {leads.length} lid</p>
         </div>
         {/* 2. Guruhlar */}
         <div className={`p-6 rounded-[28px] border relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition"><Layers size={80} className="text-purple-500"/></div>
            <div className="flex items-center gap-3 mb-3 text-purple-500 font-bold"><Layers size={20}/> Guruhlar</div>
            <p className={`text-4xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{groups.length}</p>
         </div>
         {/* 3. Tushum */}
         <div className={`p-6 rounded-[28px] border relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition"><TrendingUp size={80} className="text-emerald-500"/></div>
            <div className="flex items-center gap-3 mb-3 text-emerald-500 font-bold"><TrendingUp size={20}/> Jami Tushum</div>
            <p className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>+{totalIncome.toLocaleString()}</p>
         </div>
         {/* 4. Foyda */}
         <div className={`p-6 rounded-[28px] border relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer ${isDark ? 'bg-gradient-to-br from-indigo-900/40 to-[#161d31] border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition"><Wallet size={80} className="text-indigo-500"/></div>
            <div className="flex items-center gap-3 mb-3 text-indigo-500 font-bold"><Wallet size={20}/> Sof Foyda</div>
            <p className={`text-3xl font-black mb-1 ${netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{netProfit.toLocaleString()}</p>
         </div>
      </div>

      {/* --- GRAFIK VA TARIX --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         
         {/* 🔥 TRADING VIEW CHART (O'ZGARUVCHAN) */}
         <div className={`xl:col-span-2 p-8 rounded-[32px] border relative overflow-hidden flex flex-col ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            
            {/* Fon chiziqlari */}
            <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col justify-between p-8 pb-16">
               {[1,2,3,4,5].map(i => <div key={i} className="border-b border-slate-500"></div>)}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10 gap-4">
               <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <BarChart4 className="text-blue-500"/> Moliyaviy Oqim
               </h3>
               
               {/* 🔥 VAQT ORALIQLARI (TUGMALAR) */}
               <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  {[
                    { id: 'week', label: 'Hafta' },
                    { id: 'month', label: 'Oy' },
                    { id: 'year', label: 'Yil' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setChartView(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        chartView === tab.id 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>

            {/* CHART */}
            <div className="h-72 flex items-end justify-between gap-1 md:gap-2 relative z-10 flex-1">
               {chartData.map((data, idx) => {
                  const isProfit = data.income >= data.expense;
                  const higherVal = Math.max(data.income, data.expense);
                  const lowerVal = Math.min(data.income, data.expense);
                  const topPosition = (higherVal / maxVal) * 100;
                  const bottomPosition = (lowerVal / maxVal) * 100;
                  const candleHeight = topPosition - bottomPosition;
                  
                  return (
                     <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-20 bg-slate-900/90 backdrop-blur text-white text-[10px] p-3 rounded-xl shadow-2xl whitespace-nowrap border border-white/10 left-1/2 -translate-x-1/2">
                           <div className="font-bold mb-1 text-center border-b border-white/10 pb-1">{data.name}</div>
                           <div className="text-emerald-400">In: +{data.income.toLocaleString()}</div>
                           <div className="text-rose-400">Out: -{data.expense.toLocaleString()}</div>
                        </div>

                        {/* Shamcha */}
                        <div className="relative w-full h-full flex items-end justify-center">
                           <div 
                              style={{ 
                                 height: `${candleHeight > 0 ? candleHeight : 0.5}%`,
                                 bottom: `${bottomPosition}%` 
                              }} 
                              className={`absolute w-2 md:w-4 rounded-sm transition-all duration-300 group-hover:brightness-110
                                 ${higherVal === 0 ? 'opacity-0' : 'opacity-100'}
                                 ${isProfit 
                                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                    : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]'}
                              `}
                           ></div>
                           {/* Wick (Ingichka chiziq) */}
                           <div style={{ height: `${topPosition}%` }} className={`absolute w-[1px] bg-slate-500/30 bottom-0 z-[-1] ${higherVal === 0 ? 'opacity-0' : ''}`}></div>
                        </div>
                        
                        <span className={`text-[9px] md:text-[10px] font-bold mt-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{data.name}</span>
                     </div>
                  )
               })}
            </div>
         </div>

         {/* TARIX */}
         <div className={`p-6 rounded-[32px] border flex flex-col ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
               <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <History className="text-orange-500"/> Tarix
               </h2>
               <span className="text-xs font-bold text-slate-500 bg-slate-500/10 px-2 py-1 rounded-lg">So'nggi 6 ta</span>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
               {recentTransactions.length > 0 ? recentTransactions.map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl border transition hover:scale-[1.02] cursor-default ${isDark ? 'bg-[#0b1120] border-white/5 hover:bg-white/5' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${item.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                           {item.type === 'income' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}
                        </div>
                        <div>
                           <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.student || item.name || item.reason}</h4>
                           <p className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10}/> {item.date}</p>
                        </div>
                     </div>
                     <span className={`font-black text-sm ${item.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.type === 'income' ? '+' : '-'}{parseInt(item.amount).toLocaleString()}
                     </span>
                  </div>
               )) : (
                  <div className="text-center p-8 text-slate-500 text-sm">Hozircha operatsiyalar yo'q</div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
};