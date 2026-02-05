import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom'; // 🔥 useLocation qo'shildi
import { 
  User, Lock, ArrowRight, Building2, 
  ArrowLeft, Users, Wallet, TrendingUp, Activity 
} from 'lucide-react';

export const Login = () => {
  const { login, register } = useData();
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 URL va State ni o'qish uchun

  // 🔥 STATE ni locationdan o'qib olamiz
  // Agar Landingdan 'register' signali kelsa TRUE, aks holda FALSE
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (location.state && location.state.mode === 'register') {
      setIsRegister(true);
    } else {
      setIsRegister(false);
    }
  }, [location]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [centerName, setCenterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isRegister) {
        if (username && password && centerName) register(username, password, centerName);
        else { setError("Ma'lumotlar to'liq emas!"); setIsLoading(false); }
      } else {
        if (username && password) login(username, password);
        else { setError("Login va parolni kiriting!"); setIsLoading(false); }
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      
      {/* ORQAGA QAYTISH TUGMASI */}
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-slate-500 lg:text-white hover:bg-white/20 transition">
         <ArrowLeft size={24}/>
      </button>

      {/* --- CHAP TOMON (ANIMATSIYA) --- */}
      <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative items-center justify-center p-12 overflow-hidden">
         <div className="absolute inset-0 w-full h-full">
           {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute bg-blue-500/20 rounded-full animate-float"
                style={{
                   width: Math.random() * 100 + 20 + 'px', height: Math.random() * 100 + 20 + 'px',
                   top: Math.random() * 100 + '%', left: Math.random() * 100 + '%',
                   animationDuration: Math.random() * 10 + 5 + 's', animationDelay: Math.random() * 5 + 's'
                }}></div>
           ))}
        </div>
        <div className="relative z-10 w-[500px] h-[500px] flex items-center justify-center">
           <div className="absolute w-[450px] h-[450px] border border-blue-500/10 rounded-full animate-[spin_20s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-[#1e293b] border border-blue-500/30 rounded-2xl shadow-xl shadow-blue-500/20"><Users className="text-blue-400" size={24}/></div>
              <div className="absolute bottom-0 right-1/4 translate-y-1/2 p-3 bg-[#1e293b] border border-emerald-500/30 rounded-2xl shadow-xl shadow-emerald-500/20"><Wallet className="text-emerald-400" size={24}/></div>
           </div>
           <div className="absolute w-[300px] h-[300px] border border-purple-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]">
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-3 bg-[#1e293b] border border-purple-500/30 rounded-2xl shadow-xl shadow-purple-500/20"><TrendingUp className="text-purple-400" size={24}/></div>
           </div>
           <div className="relative z-20 w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-pulse-slow">
              <span className="text-4xl font-black text-white">Ec</span>
           </div>
           <div className="absolute -bottom-24 text-center w-full">
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">EduCore CRM</h1>
              <p className="text-slate-400 font-medium">Barcha jarayonlar nazorat ostida</p>
           </div>
        </div>
      </div>

      {/* --- O'NG TOMON (FORMA) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-8">
           <div className="text-center lg:text-left">
              <div className="lg:hidden w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30"><span className="text-white font-black text-2xl">Ec</span></div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">{isRegister ? "Ro'yxatdan o'tish" : "Xush kelibsiz!"}</h2>
              <p className="text-slate-500 text-lg">{isRegister ? "3 kunlik bepul sinov davrini boshlang." : "Hisobingizga kiring va boshqaring."}</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                 <div className="space-y-2 animate-in slide-in-from-top-4 fade-in">
                    <label className="text-sm font-bold text-slate-700 ml-1">O'quv Markaz Nomi</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Building2 size={20}/></div>
                       <input type="text" placeholder="Masalan: Harvard Education" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700" />
                    </div>
                 </div>
              )}
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1">Login</label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><User size={20}/></div>
                    <input type="text" placeholder="Admin" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-700 ml-1">Parol</label>
                 <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"><Lock size={20}/></div>
                    <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700" />
                 </div>
              </div>
              {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-500 text-sm font-bold text-center border border-rose-100 animate-pulse">{error}</div>}
              <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group">
                 {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>{isRegister ? "Boshlash" : "Kirish"} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/></>}
              </button>
           </form>

           <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-slate-500">
                 {isRegister ? "Hisobingiz bormi? " : "Hisobingiz yo'qmi? "}
                 <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="font-bold text-blue-600 hover:text-blue-700 transition">
                    {isRegister ? "Kirish" : "Ro'yxatdan o'tish"}
                 </button>
              </p>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; } 50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; } }
        .animate-float { animation: float infinite ease-in-out; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); } 50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(37, 99, 235, 0); } }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
      `}</style>
    </div>
  );
};