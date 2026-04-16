import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Lock, Shield, Save, Download, 
  Trash2, Building2, LogOut, CheckCircle, AlertTriangle,
  CreditCard, Calendar, Key, BarChart3, 
  Copy, Zap, Crown
} from 'lucide-react';

export const Settings = () => {
  const { 
    currentUser, updateUserData, setStoreName, resetSystem, 
    students, groups, payments, theme, logout, 
    PLANS, activateLicense,
    licenses, createLicense, deleteLicense
  } = useData();
  
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('subscription'); // Boshlanishiga 'subscription' ochilsin
  const [centerName, setLocalCenterName] = useState('');
  const [username, setUsername] = useState('');
  
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  
  // Litsenziya Input
  const [licenseCode, setLicenseCode] = useState(''); 

  // Admin Generator
  const [genPlan, setGenPlan] = useState('start');
  const [genType, setGenType] = useState('month');

  // 🔥 ADMIN TEKSHIRUVI
  const isAdmin = currentUser?.role === 'admin' || currentUser?.username === 'admin';

  useEffect(() => {
    if (currentUser) {
      setLocalCenterName(currentUser.centerName || 'EduCore');
      setUsername(currentUser.username || 'Admin');
    }
  }, [currentUser]);

  // --- PLAN VA LIMITLAR ---
  const currentPlanKey = currentUser?.plan || 'trial';
  const currentPlan = PLANS ? (PLANS[currentPlanKey] || PLANS.trial) : { name: 'Sinov', limitStudents: 10, limitGroups: 2 };

  const daysLeft = currentUser?.subscriptionEnd 
    ? Math.ceil((new Date(currentUser.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)) 
    : 0;

  // --- FUNKSIYALAR ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setStoreName(centerName);
    updateUserData({ centerName: centerName });
    alert("Profil saqlandi! ✅");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPass.length > 3) {
       updateUserData({ password: newPass }); 
       alert("Parol o'zgardi! 🔒");
       setOldPass(''); setNewPass('');
    } else { alert("Parol juda qisqa!"); }
  };

  // 1. Litsenziya ishlatish (USER)
  const handleActivate = (e) => {
      e.preventDefault();
      if(!licenseCode) return alert("Kod kiriting!");
      
      const result = activateLicense(licenseCode); 
      alert(result.message);
      
      if (result.success) {
          setLicenseCode('');
          window.location.reload(); // Ma'lumot yangilanishi uchun
      }
  };

  // 2. Admin Generator (ADMIN)
  const handleGenerateLicense = () => { 
     createLicense(genPlan, genType); 
     alert("Kod yaratildi! ✅");
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Nusxalandi: " + text); };

  const exportToExcel = (data, filename) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a"); link.href = jsonString; link.download = `${currentUser?.username || 'data'}_${filename}.json`; link.click();
  };

  const handleReset = () => {
    if (confirm("DIQQAT! Hamma narsa o'chadi. Rozimisiz?")) {
       if (prompt("Tasdiqlash uchun 'DELETE' deb yozing") === 'DELETE') {
           resetSystem();
       }
    }
  };

  return (
    <div className={`p-6 min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
            <div className="flex items-center gap-2">
                <h1 className={`text-3xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isAdmin ? "Admin Boshqaruv" : "Sozlamalar"}
                </h1>
                {isAdmin && <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1"><Crown size={12}/> ADMIN</span>}
            </div>
            <p className="text-slate-500">
                {isAdmin ? "Litsenziyalar va tizim boshqaruvi." : "Tarifni boshqarish va sozlamalar."}
            </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         
         {/* SIDEBAR TABS */}
         <div className="w-full lg:w-1/4">
            <div className={`p-4 rounded-[24px] border space-y-2 ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
               {[
                 { id: 'subscription', label: 'Tarif va Balans', icon: <CreditCard size={20}/>, color: 'text-emerald-500' },
                 { id: 'profile', label: 'Profil', icon: <User size={20}/> },
                 
                 // Faqat admin ko'radi
                 isAdmin && { id: 'licenses', label: 'Litsenziyalar (Admin)', icon: <Key size={20}/>, color: 'text-purple-500' },

                 { id: 'security', label: 'Xavfsizlik', icon: <Lock size={20}/> },
                 { id: 'backup', label: 'Arxiv', icon: <Download size={20}/> },
                 { id: 'danger', label: 'Xavfli', icon: <AlertTriangle size={20}/>, color: 'text-rose-500' }
               ].filter(Boolean).map(tab => (
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
                  <button onClick={() => { if(confirm("Chiqishni xohlaysizmi?")) logout() }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-500/10 transition">
                     <LogOut size={20}/> Chiqish
                  </button>
               </div>
            </div>
         </div>

         {/* CONTENT */}
         <div className="w-full lg:w-3/4">
            
            {/* 1. SUBSCRIPTION (TARIF) TAB */}
            {/* 1. SUBSCRIPTION (TARIF) TAB */}
            {activeTab === 'subscription' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tarif va Status</h2>
                  
                  {/* Status Banner */}
                  <div className={`p-6 rounded-2xl border mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                     <div>
                        <p className="text-slate-500 text-sm font-bold mb-1">Joriy Reja</p>
                        <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentPlan.name}</h3>
                        <div className="flex items-center gap-2 mt-2 font-bold text-sm">
                           <Calendar size={16}/>
                           <span className={daysLeft < 3 ? "text-rose-500" : "text-emerald-500"}>
                               {daysLeft > 0 ? `${daysLeft} kun qoldi` : "OBUNA TUGAGAN!"}
                           </span>
                        </div>
                     </div>
                     
                     {/* 🔥 O'ZGARGAN JOY: Tugma endi /subscription ga o'tadi */}
                     <button 
                        onClick={() => navigate('/subscription')} 
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
                     >
                        Tarifni O'zgartirish
                     </button>
                  </div>

                  {/* KOD KIRITISH */}
                  <div className={`p-6 rounded-2xl border mb-8 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Key className="text-purple-500"/> Litsenziya Aktivlashtirish</h3>
                      <p className="text-sm opacity-60 mb-4">Admin tomonidan berilgan kodni kiriting.</p>
                      <form onSubmit={handleActivate} className="flex flex-col md:flex-row gap-3">
                          <input 
                            placeholder="Masalan: ABCD-1234-XYZ9" 
                            className={`flex-1 p-3 rounded-xl border bg-transparent font-mono font-bold uppercase outline-none focus:border-purple-500 ${isDark ? 'border-white/10' : 'border-slate-300'}`} 
                            value={licenseCode} 
                            onChange={e => setLicenseCode(e.target.value)}
                          />
                          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30">
                              Faollashtirish
                          </button>
                      </form>
                  </div>

                  {/* CHEKLOVLAR */}
                  <h3 className={`font-bold text-lg mb-4 ${isDark?'text-white':'text-slate-900'}`}>Sizning Limitlaringiz</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Students Limit */}
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                         <div className="flex justify-between items-center mb-2">
                            <p className="text-slate-500 text-xs font-bold uppercase">O'quvchilar</p>
                            <BarChart3 size={16} className="opacity-50"/>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                               {students.length} / {currentPlan.limitStudents > 9000 ? '∞' : currentPlan.limitStudents}
                            </span>
                            <div className="w-24 h-2 bg-slate-500/20 rounded-full overflow-hidden">
                               <div style={{width: `${Math.min((students.length/currentPlan.limitStudents)*100, 100)}%`}} className="h-full bg-blue-500"></div>
                            </div>
                         </div>
                      </div>
                      {/* Groups Limit */}
                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                         <div className="flex justify-between items-center mb-2">
                            <p className="text-slate-500 text-xs font-bold uppercase">Guruhlar</p>
                            <BarChart3 size={16} className="opacity-50"/>
                         </div>
                         <div className="flex justify-between items-end">
                            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                               {groups.length} / {currentPlan.limitGroups > 9000 ? '∞' : currentPlan.limitGroups}
                            </span>
                            <div className="w-24 h-2 bg-slate-500/20 rounded-full overflow-hidden">
                               <div style={{width: `${Math.min((groups.length/currentPlan.limitGroups)*100, 100)}%`}} className="h-full bg-purple-500"></div>
                            </div>
                         </div>
                      </div>
                  </div>
               </div>
            )}

            {/* 2. ADMIN GENERATOR TAB */}
            {activeTab === 'licenses' && isAdmin && (
                <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Litsenziya Yaratish</h2>
                    <p className="text-slate-500 mb-6">Mijozlarga berish uchun kod generatsiya qiling.</p>
                    
                    <div className={`p-6 rounded-2xl border mb-8 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                             <div>
                                <label className="text-xs font-bold opacity-50 uppercase ml-1">Tarif</label>
                                <select value={genPlan} onChange={e=>setGenPlan(e.target.value)} className={`w-full p-3 rounded-xl font-bold outline-none border ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
                                    <option value="start">Start</option>
                                    <option value="pro">Pro</option>
                                    <option value="business">Business</option>
                                </select>
                             </div>
                             <div>
                                <label className="text-xs font-bold opacity-50 uppercase ml-1">Davr</label>
                                <select value={genType} onChange={e=>setGenType(e.target.value)} className={`w-full p-3 rounded-xl font-bold outline-none border ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
                                    <option value="month">1 Oy</option>
                                    <option value="year">1 Yil</option>
                                </select>
                             </div>
                             <div className="flex items-end">
                                <button onClick={handleGenerateLicense} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                                    <Zap size={18}/> Kod Yaratish
                                </button>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {(!licenses || licenses.length === 0) && <p className="text-center opacity-50 py-4">Hozircha aktiv kodlar yo'q</p>}
                        {licenses && licenses.map(l => (
                            <div key={l.id} className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono font-black text-xl tracking-wider text-purple-500 select-all">{l.code}</p>
                                        <button onClick={() => copyToClipboard(l.code)} className="p-1 hover:bg-white/10 rounded"><Copy size={14} className="opacity-50"/></button>
                                    </div>
                                    <p className="text-xs font-bold opacity-50 uppercase">{l.plan} — {l.days} kun</p>
                                </div>
                                <button onClick={() => deleteLicense(l.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* QOLGAN TABLAR (Profile, Security, Backup, Danger) */}
            {activeTab === 'profile' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Profil Ma'lumotlari</h2>
                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                      <div><label className="block text-sm font-bold mb-2">Markaz Nomi</label><div className={`flex items-center px-4 py-3 rounded-2xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}><Building2 className="text-slate-400 mr-3"/><input value={centerName} onChange={e=>setLocalCenterName(e.target.value)} className="bg-transparent w-full outline-none font-bold"/></div></div>
                      <div><label className="block text-sm font-bold mb-2">Login</label><div className={`flex items-center px-4 py-3 rounded-2xl border opacity-70 ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}><User className="text-slate-400 mr-3"/><input value={username} disabled className="bg-transparent w-full outline-none font-bold cursor-not-allowed"/></div></div>
                      <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition flex items-center gap-2"><Save size={18}/> Saqlash</button>
                  </form>
               </div>
            )}
            {activeTab === 'security' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Parolni O'zgartirish</h2>
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                      <div><label className="block text-sm font-bold mb-2">Yangi Parol</label><div className={`flex items-center px-4 py-3 rounded-2xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}><Shield className="text-slate-400 mr-3"/><input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} className="bg-transparent w-full outline-none font-bold"/></div></div>
                      <button className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition flex items-center gap-2"><CheckCircle size={18}/> Yangilash</button>
                  </form>
               </div>
            )}
            {activeTab === 'backup' && (
               <div className={`p-8 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                  <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Arxivlash</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <button onClick={() => exportToExcel(students, 'students')} className={`p-6 rounded-2xl border flex flex-col items-start gap-4 hover:border-blue-500/50 transition ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}><div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><User size={24}/></div><div><h3 className={`font-bold text-lg ${isDark?'text-white':'text-slate-900'}`}>O'quvchilar</h3><p className="text-sm text-slate-500">{students.length} ta yozuv</p></div></button>
                      <button onClick={() => exportToExcel(payments, 'payments')} className={`p-6 rounded-2xl border flex flex-col items-start gap-4 hover:border-emerald-500/50 transition ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}><div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Save size={24}/></div><div><h3 className={`font-bold text-lg ${isDark?'text-white':'text-slate-900'}`}>To'lovlar</h3><p className="text-sm text-slate-500">{payments.length} ta yozuv</p></div></button>
                  </div>
               </div>
            )}
            {activeTab === 'danger' && (
               <div className={`p-8 rounded-[32px] border border-rose-500/20 ${isDark ? 'bg-rose-500/5' : 'bg-rose-50'}`}>
                  <h2 className="text-2xl font-bold mb-4 text-rose-600 flex items-center gap-2"><AlertTriangle/> Xavfli Hudud</h2>
                  <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${isDark ? 'bg-[#0b1120] border-rose-500/20' : 'bg-white border-rose-200'}`}>
                      <div><h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Tizimni Tozalash</h3><p className="text-sm text-slate-500">Barcha ma'lumotlarni o'chirish.</p></div>
                      <button onClick={handleReset} className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition flex items-center gap-2 shadow-lg shadow-rose-500/30"><Trash2 size={18}/> Tozalash</button>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};