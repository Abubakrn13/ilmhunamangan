import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, ArrowRight, ArrowLeft, Moon, Sun, UserPlus, LogIn } from 'lucide-react';

export const Login = () => {
  const { login, theme, toggleTheme } = useData();
  const navigate = useNavigate();
  const location = useLocation(); // Landing sahifadan qaysi tugma bosilganini bilish uchun
  
  // 🔥 MAVZUNI VA REJIMNI ANIQLASH
  const isDark = theme === 'dark';
  // Odatda 'login', lekin Landing'dan 'register' bosilgan bo'lsa 'register' bo'ladi
  const [mode, setMode] = useState(location.state?.mode || 'login'); 

  // --- STATELAR ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Faqat Register uchun
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 

  // Landingdan bosilgan mode o'zgarsa, oynani moslash
  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);

  // 🔥 ASOSIY FUNKSIYA (LOGIN YOKI REGISTER)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Agar ro'yxatdan o'tish bo'lsa, parollarni tekshiramiz
    if (mode === 'register' && password !== confirmPassword) {
       return setError("Parollar bir-biriga mos tushmadi!");
    }

    setLoading(true);

    try {
      // Hozircha backend login funksiyasi avtomat ro'yxatdan o'tkazayotganligi 
      // uchun ikkalasida ham bir xil funksiya chaqiramiz. 
      // Agar backendda alohida "register" API qilsangiz, shu yerda ajratishingiz mumkin.
      const res = await login(username, password);
      
      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setError(res?.message || "Xatolik yuz berdi!");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(`Backend xatosi: ${err.message || "Server bilan aloqa yo'q"}`);
    }
  };

  // Rejimni o'zgartirish (Login <-> Register)
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative transition-colors duration-300 ${isDark ? 'bg-[#0b1120]' : 'bg-slate-50'}`}>
      
      {/* TEPADAGI TUGMALAR (Orqaga + Tun/Kun) */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 font-bold transition px-4 py-2 rounded-xl ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-white'}`}
          >
            <ArrowLeft size={20}/> Bosh sahifa
          </button>

          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition ${isDark ? 'bg-white/10 text-yellow-400' : 'bg-white text-slate-600 shadow-sm'}`}
          >
            {isDark ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
      </div>

      {/* ASOSIY KARTA */}
      <div className={`p-8 md:p-12 rounded-[32px] shadow-2xl w-full max-w-md border transition-all duration-500 ${isDark ? 'bg-[#1e293b] border-white/10' : 'bg-white border-slate-100'}`}>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
            {mode === 'login' ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
          <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'login' ? 'Xush Kelibsiz!' : "Ro'yxatdan O'tish"}
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'login' 
              ? "Boshqaruv paneliga kirish uchun ma'lumotlaringizni kiriting." 
              : "Yangi tizimdan foydalanish uchun o'z profilingizni yarating."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* LOGIN INPUT */}
          <div>
            <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Login</label>
            <div className={`flex items-center px-4 py-3.5 border rounded-xl focus-within:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`}>
              <User className={`mr-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20}/>
              <input 
                type="text" 
                required
                placeholder="Markaz nomini kiriting" 
                className={`bg-transparent w-full outline-none font-bold placeholder:font-normal ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-400'}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* PAROL INPUT */}
          <div>
            <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Parol</label>
            <div className={`flex items-center px-4 py-3.5 border rounded-xl focus-within:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`}>
              <Lock className={`mr-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20}/>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className={`bg-transparent w-full outline-none font-bold placeholder:font-normal ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-400'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 🔥 FAQAT REGISTER REJIMIDA CHIQADIGAN "PAROLNI TASDIQLASH" QISMI */}
          {mode === 'register' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className={`block text-xs font-bold uppercase mb-2 ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Parolni tasdiqlang</label>
              <div className={`flex items-center px-4 py-3.5 border rounded-xl focus-within:ring-2 ring-blue-500 transition ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200 focus-within:bg-white'}`}>
                <Lock className={`mr-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20}/>
                <input 
                  type="password" 
                  required
                  placeholder="Parolni qayta kiriting" 
                  className={`bg-transparent w-full outline-none font-bold placeholder:font-normal ${isDark ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-400'}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* XATOLIKNI EKRANDA KO'RSATISH QISMI */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold text-center animate-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          {/* TUGMA */}
          <button 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition active:scale-95 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <span className="animate-pulse">Yuklanmoqda...</span>
            ) : (
                <>
                  {mode === 'login' ? 'Tizimga Kirish' : 'Profil Yaratish'} 
                  <ArrowRight size={20}/>
                </>
            )}
          </button>
        </form>
        
        {/* REJIMNI O'ZGARTIRISH (TOGGLE) QISMI */}
        <div className={`mt-8 pt-6 border-t text-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
               {mode === 'login' ? "Akkauntingiz yo'qmi?" : "Allaqachon akkauntingiz bormi?"}
               <button 
                 onClick={toggleMode} 
                 className="ml-2 text-blue-500 font-bold hover:underline outline-none"
               >
                 {mode === 'login' ? "Ro'yxatdan o'ting" : "Tizimga kiring"}
               </button>
            </p>
        </div>

      </div>
    </div>
  );
};