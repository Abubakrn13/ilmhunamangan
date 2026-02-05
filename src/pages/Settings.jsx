import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  User, Lock, Shield, Save, Download, 
  Trash2, Building2, LogOut, CheckCircle, AlertTriangle,
  CreditCard, Calendar 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  // 🔥 updateUserData ni oldik
  const { currentUser, updateUserData, setStoreName, resetSystem, students, payments, theme, logout, groups, PLANS } = useData();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('profile'); 
  const [centerName, setLocalCenterName] = useState(currentUser?.centerName || 'EduCore');
  const [username, setUsername] = useState(currentUser?.username || 'Admin');
  
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Plan logic...
  const FALLBACK_PLANS = {
    trial: { name: "Sinov Davri", limitStudents: 1000, limitGroups: 1000 },
    start: { name: "Start ($15)", limitStudents: 50, limitGroups: 5 },
    growth: { name: "Pro ($25)", limitStudents: 200, limitGroups: 15 },
    scale: { name: "Business ($50)", limitStudents: 9999, limitGroups: 9999 }
  };
  const userPlanKey = currentUser?.plan || 'trial';
  const currentPlan = PLANS ? (PLANS[userPlanKey] || PLANS.trial) : FALLBACK_PLANS[userPlanKey];

  const endDate = currentUser?.subscriptionEnd ? new Date(currentUser.subscriptionEnd).toLocaleDateString() : 'Noma\'lum';
  const studentCount = students?.length || 0;
  const groupCount = groups?.length || 0;

  // --- 🔥 1. PROFILNI YANGILASH ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    
    // 1. Markaz nomini yangilash
    setStoreName(centerName);
    
    // 2. User ma'lumotlarini (masalan, Loginni) yangilash (agar input disabled bo'lmasa)
    // Hozir username inputi disabled, lekin kelajakda ochsangiz shu yerga yoziladi:
    // updateUserData({ username: username });

    alert("Profil ma'lumotlari saqlandi! ✅");
  };

  // --- 🔥 2. PAROLNI YANGILASH (HAQIQIY) ---
  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (oldPass && newPass) {
       // Bu yerda eski parolni tekshirish kerak bo'ladi (real loyihada)
       // Biz hozir to'g'ridan-to'g'ri yangisiga almashtiramiz
       
       updateUserData({ password: newPass }); // 🔥 YANGI PAROL SAQLANDI

       alert("Parol muvaffaqiyatli o'zgartirildi! 🔒\nKeyingi safar kirishda yangi paroldan foydalanasiz.");
       setOldPass(''); 
       setNewPass('');
    } else {
       alert("Iltimos, maydonlarni to'ldiring!");
    }
  };

  // ... (exportToExcel va handleReset funksiyalari o'zgarishsiz qoladi) ...
  const exportToExcel = (data, filename) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${filename}_${new Date().toLocaleDateString()}.json`;
    link.click();
    alert(`${filename} yuklab olindi!`);
  };

  const handleReset = () => {
    if (confirm("DIQQAT! Barcha ma'lumotlar o'chib ketadi. Rostan ham rozimisiz?")) {
       if (prompt("Tasdiqlash uchun 'DELETE' deb yozing") === 'DELETE') {
          resetSystem();
          alert("Tizim tozalandi.");
          window.location.reload();
       }
    }
  };

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sozlamalar</h1>
        <p className="text-slate-500">Tizimni o'zingizga moslang va xavfsizlikni ta'minlang.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         
         {/* SIDEBAR TABS */}
         <div className="w-full lg:w-1/4">
            <div className={`p-4 rounded-[24px] border space-y-2 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
               {[
                 { id: 'profile', label: 'Profil Ma\'lumotlari', icon: <User size={20}/> },
                 { id: 'subscription', label: 'Tarif va Obuna', icon: <CreditCard size={20}/>, color: 'text-emerald-500' },
                 { id: 'security', label: 'Xavfsizlik', icon: <Lock size={20}/> },
                 { id: 'backup', label: 'Ma\'lumotlar Bazasi', icon: <Download size={20}/> },
                 { id: 'danger', label: 'Xavfli Hudud', icon: <AlertTriangle size={20}/>, color: 'text-rose-500' }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                     activeTab === tab.id 
                       ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                       : `${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'} ${tab.color || 'text-slate-500'}`
                   }`}
                 >
                    {tab.icon} {tab.label}
                 </button>
               ))}
               
               <div className="pt-4 mt-4 border-t border-slate-500/20">
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-500/10 transition">
                     <LogOut size={20}/> Chiqish
                  </button>
               </div>
            </div>
         </div>

         {/* MAIN CONTENT */}
         <div className="w-full lg:w-3/4">
            
            {/* 1. PROFIL */}
            {activeTab === 'profile' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Profil Ma'lumotlari</h2>
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                     <div>
                        <label className="block text-sm font-bold mb-2">Markaz Nomi</label>
                        <div className="flex items-center px-4 py-3 rounded-2xl border focus-within:ring-2 ring-blue-500 transition bg-transparent">
                           <Building2 className="text-slate-400 mr-3"/>
                           <input value={centerName} onChange={e=>setLocalCenterName(e.target.value)} className="bg-transparent w-full outline-none font-bold"/>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold mb-2">Administrator Login</label>
                        <div className="flex items-center px-4 py-3 rounded-2xl border focus-within:ring-2 ring-blue-500 transition bg-transparent opacity-70">
                           <User className="text-slate-400 mr-3"/>
                           <input value={username} disabled className="bg-transparent w-full outline-none font-bold cursor-not-allowed"/>
                           <span className="text-xs font-bold bg-slate-500/10 px-2 py-1 rounded">O'zgarmas</span>
                        </div>
                     </div>
                     <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={18}/> Saqlash
                     </button>
                  </form>
               </div>
            )}

            {/* 2. TARIF VA OBUNA */}
            {activeTab === 'subscription' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tarif va To'lovlar</h2>
                  
                  <div className={`p-6 rounded-2xl border mb-6 flex flex-col md:flex-row items-center justify-between gap-6 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                     <div>
                        <p className="text-slate-500 text-sm font-bold mb-1">Joriy Reja</p>
                        <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                           {currentPlan.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-emerald-500 font-bold text-sm">
                           <Calendar size={16}/>
                           <span>Tugash vaqti: {endDate}</span>
                        </div>
                     </div>
                     
                     <div className="text-right">
                        <button 
                          onClick={() => navigate('/subscription')} 
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
                        >
                           Tarifni O'zgartirish
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {/* O'quvchilar Limiti */}
                     <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">O'quvchilar Limiti</p>
                        <div className="flex justify-between items-end">
                           <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {studentCount} / {currentPlan.limitStudents > 9000 ? '∞' : currentPlan.limitStudents}
                           </span>
                           <div className="w-24 h-2 bg-slate-500/20 rounded-full overflow-hidden">
                              <div style={{width: `${Math.min((studentCount/currentPlan.limitStudents)*100, 100)}%`}} className="h-full bg-blue-500"></div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Guruhlar Limiti */}
                     <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-2">Guruhlar Limiti</p>
                        <div className="flex justify-between items-end">
                           <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {groupCount} / {currentPlan.limitGroups > 9000 ? '∞' : currentPlan.limitGroups}
                           </span>
                           <div className="w-24 h-2 bg-slate-500/20 rounded-full overflow-hidden">
                              <div style={{width: `${Math.min((groupCount/currentPlan.limitGroups)*100, 100)}%`}} className="h-full bg-purple-500"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* 3. XAVFSIZLIK */}
            {activeTab === 'security' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Parolni O'zgartirish</h2>
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                     <div>
                        <label className="block text-sm font-bold mb-2">Eski Parol</label>
                        <div className="flex items-center px-4 py-3 rounded-2xl border focus-within:ring-2 ring-blue-500 transition bg-transparent">
                           <Lock className="text-slate-400 mr-3"/>
                           <input type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} className="bg-transparent w-full outline-none font-bold"/>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold mb-2">Yangi Parol</label>
                        <div className="flex items-center px-4 py-3 rounded-2xl border focus-within:ring-2 ring-blue-500 transition bg-transparent">
                           <Shield className="text-slate-400 mr-3"/>
                           <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="bg-transparent w-full outline-none font-bold"/>
                        </div>
                     </div>
                     <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition flex items-center gap-2">
                        <CheckCircle size={18}/> Yangilash
                     </button>
                  </form>
               </div>
            )}

            {/* 4. BACKUP (ARXIV) */}
            {activeTab === 'backup' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ma'lumotlar Bazasi</h2>
                  <p className="text-slate-500 mb-8">Ma'lumotlaringizni yo'qotmaslik uchun muntazam ravishda yuklab oling.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className={`p-6 rounded-2xl border flex flex-col items-start gap-4 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><User size={24}/></div>
                        <div>
                           <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>O'quvchilar Bazasi</h3>
                           <p className="text-sm text-slate-500">{studentCount} ta yozuv</p>
                        </div>
                        <button onClick={() => exportToExcel(students, 'students')} className="mt-auto px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition w-full flex items-center justify-center gap-2">
                           <Download size={16}/> Yuklab Olish (JSON)
                        </button>
                     </div>

                     <div className={`p-6 rounded-2xl border flex flex-col items-start gap-4 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Save size={24}/></div>
                        <div>
                           <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>To'lovlar Tarixi</h3>
                           <p className="text-sm text-slate-500">{payments ? payments.length : 0} ta operatsiya</p>
                        </div>
                        <button onClick={() => exportToExcel(payments, 'payments')} className="mt-auto px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition w-full flex items-center justify-center gap-2">
                           <Download size={16}/> Yuklab Olish (JSON)
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* 5. XAVFLI HUDUD */}
            {activeTab === 'danger' && (
               <div className={`p-8 rounded-[32px] border border-rose-500/20 ${isDark ? 'bg-rose-500/5' : 'bg-rose-50'}`}>
                  <h2 className="text-2xl font-bold mb-4 text-rose-600 flex items-center gap-2">
                     <AlertTriangle/> Xavfli Hudud
                  </h2>
                  <p className={`mb-8 font-medium ${isDark ? 'text-rose-200' : 'text-rose-800'}`}>
                     Bu yerdagi amallar qaytarib bo'lmaydi. Ehtiyot bo'ling!
                  </p>
                  
                  <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'bg-[#0b1120] border-rose-500/20' : 'bg-white border-rose-200'}`}>
                     <div>
                        <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Tizimni Tozalash</h3>
                        <p className="text-sm text-slate-500">Barcha o'quvchi, guruh va to'lovlarni o'chirib tashlaydi.</p>
                     </div>
                     <button onClick={handleReset} className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition flex items-center gap-2 shadow-lg shadow-rose-500/30">
                        <Trash2 size={18}/> Tozalash
                     </button>
                  </div>
               </div>
            )}

         </div>

      </div>
    </div>
  );
};