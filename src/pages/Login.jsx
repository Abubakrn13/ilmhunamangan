import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Lock, User, ArrowRight, Hexagon } from 'lucide-react';

export const Login = () => {
  const { login } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulyatsiya (ozgina kutish effekti uchun)
    setTimeout(() => {
      if (username) {
        login(username, password);
      } else {
        alert("Iltimos, ismingizni kiriting!");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] relative overflow-hidden">
      
      {/* ORQA FON EFFEKTLARI */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* LOGIN KARTASI */}
      <div className="w-full max-w-md p-1 z-10 animate-in zoom-in duration-300">
         <div className="bg-[#161d31]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl shadow-black/50">
            
            {/* LOGO QISMI */}
            <div className="flex flex-col items-center mb-10">
               <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/40 mb-6 transform rotate-3 hover:rotate-6 transition duration-500">
                  <Hexagon size={40} className="text-white" strokeWidth={2}/>
               </div>
               <h1 className="text-3xl font-black text-white tracking-tight">EduCore</h1>
               <p className="text-slate-400 mt-2 font-medium">Tizimga kirish</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               
               {/* USERNAME */}
               <div className="group">
                  <div className="relative">
                     <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-cyan-500 transition">
                        <User size={20}/>
                     </div>
                     <input 
                       type="text" 
                       placeholder="Foydalanuvchi nomi" 
                       className="w-full bg-[#0b1120] border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold placeholder:text-slate-600"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                     />
                  </div>
               </div>

               {/* PASSWORD */}
               <div className="group">
                  <div className="relative">
                     <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-cyan-500 transition">
                        <Lock size={20}/>
                     </div>
                     <input 
                       type="password" 
                       placeholder="Parol" 
                       className="w-full bg-[#0b1120] border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all font-bold placeholder:text-slate-600"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
               </div>

               {/* TUGMA */}
               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
               >
                 {isLoading ? (
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 ) : (
                    <>Kirish <ArrowRight size={20}/></>
                 )}
               </button>

            </form>

            <p className="text-center text-slate-500 text-xs mt-8 font-medium">
               © 2026 EduCore System. Barcha huquqlar himoyalangan.
            </p>

         </div>
      </div>

    </div>
  );
};