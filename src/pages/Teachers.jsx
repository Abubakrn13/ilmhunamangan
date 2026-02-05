import React from 'react';
import { useData } from '../context/DataContext';
import { 
  GraduationCap, Users, Wallet, Layers, 
  TrendingUp, ArrowRight, Star, PieChart 
} from 'lucide-react';

export const Teachers = () => {
  const { groups, students, theme } = useData();
  const isDark = theme === 'dark';

  const safeGroups = groups || [];
  const safeStudents = students || [];

  // --- 🔥 ENG MUHIM QISM: O'QITUVCHILARNI BIRLASHTIRISH ---
  const teachersMap = {};

  safeGroups.forEach(group => {
    // 1. Ismni olamiz va tozalaymiz (boshidagi/oxiridagi bo'sh joylarni olib tashlaymiz)
    const rawName = group.teacher || "Noma'lum";
    const teacherName = rawName.trim(); 

    // 2. Agar bu o'qituvchi hali ro'yxatda bo'lmasa, ochamiz
    if (!teachersMap[teacherName]) {
      teachersMap[teacherName] = {
        name: teacherName,
        groupsCount: 0,
        totalStudents: 0,
        totalRevenue: 0,  // Markazga tushadigan pul
        totalSalary: 0,   // O'qituvchi oladigan pul
        groupsList: []    // Qaysi guruhlarda dars berishi
      };
    }

    // 3. Shu guruh bo'yicha hisob-kitob
    const currentGroupStudents = safeStudents.filter(s => s.groupIds && s.groupIds.includes(group.id));
    const studentCount = currentGroupStudents.length;
    
    // Moliya
    const price = parseInt(group.price) || 0;
    const groupRevenue = studentCount * price;
    
    // O'qituvchi ulushi
    const percent = parseInt(group.teacherPercent) || 0;
    const salary = (groupRevenue * percent) / 100;

    // 4. Umumiy hisobga qo'shamiz (JAMLASH)
    teachersMap[teacherName].groupsCount += 1;
    teachersMap[teacherName].totalStudents += studentCount;
    teachersMap[teacherName].totalRevenue += groupRevenue;
    teachersMap[teacherName].totalSalary += salary;
    
    // Guruh nomini qo'shib qo'yamiz (chiroyli ko'rinishi uchun)
    teachersMap[teacherName].groupsList.push(group.name);
  });

  // Obyektni massivga aylantiramiz va maoshi ko'plarni tepaga chiqaramiz
  const teachers = Object.values(teachersMap).sort((a, b) => b.totalSalary - a.totalSalary);

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            O'qituvchilar <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{teachers.length} ta</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            KPI va Oylik maoshlar hisoboti (Yagona hisob)
          </p>
        </div>
      </div>

      {/* O'QITUVCHILAR KARTOCHKALARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teachers.length > 0 ? teachers.map((t, idx) => (
          <div key={idx} className={`relative p-6 rounded-[32px] border overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
             
             {/* Orqa fon bezagi */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

             {/* Header */}
             <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${isDark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400' : 'bg-gradient-to-br from-cyan-100 to-blue-50 text-cyan-600'}`}>
                   {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                   <h3 className="text-xl font-bold truncate">{t.name}</h3>
                   <div className="flex flex-wrap gap-1 mt-1">
                      {t.groupsList.slice(0, 3).map((g, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded border font-bold ${isDark ? 'bg-black/20 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                          {g}
                        </span>
                      ))}
                      {t.groupsList.length > 3 && (
                        <span className="text-[10px] text-slate-500 font-bold">+{t.groupsList.length - 3}</span>
                      )}
                   </div>
                </div>
             </div>

             {/* Statistika */}
             <div className="grid grid-cols-2 gap-4">
                {/* O'quvchilar */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Jami O'quvchi</p>
                   <p className="text-xl font-black flex items-center gap-2">
                      <Users size={18} className="text-blue-500"/> {t.totalStudents}
                   </p>
                </div>

                {/* Guruhlar */}
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Guruhlar</p>
                   <p className="text-xl font-black flex items-center gap-2">
                      <Layers size={18} className="text-purple-500"/> {t.groupsCount}
                   </p>
                </div>
             </div>

             {/* MOLIYA (Maosh) */}
             <div className={`mt-4 p-5 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-[#0b1120] border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="relative z-10 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center gap-1">
                         <Wallet size={12}/> Hisoblangan Maosh
                      </p>
                      <p className="text-2xl font-black text-emerald-500 tracking-tight">
                         {t.totalSalary.toLocaleString()} <span className="text-xs font-normal text-slate-500">so'm</span>
                      </p>
                   </div>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-200 text-emerald-600'}`}>
                      <TrendingUp size={20}/>
                   </div>
                </div>
             </div>

             {/* Foyda (Kichkina) */}
             <div className="mt-3 text-center flex justify-between items-center px-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Markaz foydasi:</p>
                <p className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                   +{(t.totalRevenue - t.totalSalary).toLocaleString()} so'm
                </p>
             </div>

          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-500 opacity-50 flex flex-col items-center">
             <GraduationCap size={64} className="mx-auto mb-4"/>
             <p className="text-xl font-bold">O'quvchilar yo'q</p>
             <p>Guruh ochib, o'qituvchi biriktirsangiz, bu yerda paydo bo'ladi.</p>
          </div>
        )}
      </div>

    </div>
  );
};