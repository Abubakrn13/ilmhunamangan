import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, Check, Zap, Shield, Layout, 
  MessageCircle, Star, HelpCircle, Gift 
} from 'lucide-react';

export const Subscription = () => {
  const navigate = useNavigate();
  const { theme, currentUser } = useData();
  const isDark = theme === 'dark';
  const [billing, setBilling] = useState('month'); // 'month' | 'year'

  // 🔥 1. TELEGRAM ADMIN USERNAME (O'ZINGIZNIKINI YOZING)
  const ADMIN_TG = "Abubakrmirzaev"; 

  // 🔥 2. TELEGRAMGA YUBORISH FUNKSIYASI
  const handleSelectPlan = (planName, price) => {
      const period = billing === 'month' ? "Oylik" : "Yillik";
      
      // Xabar matni
      const text = `👋 Salom! \n\n🆔 Login: ${currentUser.username}\n🚀 Tarif: ${planName}\n📅 Davr: ${period}\n💰 Narx: $${price}\n\nTo'lov qilmoqchiman.`;
      
      // Telegram havolasini yaratish
      const url = `https://t.me/${ADMIN_TG}?text=${encodeURIComponent(text)}`;
      
      // Yangi oynada ochish
      window.open(url, '_blank');
  };

  // Tariflar ma'lumoti
  const plansData = [
    {
      id: 'start',
      name: 'Start',
      priceMonth: 25,
      priceYear: 249,
      save: 50,
      icon: <Layout className="w-6 h-6"/>,
      color: 'blue',
      desc: "Kichik o'quv markazlari uchun.",
      features: ["300 ta O'quvchi", "20 ta Guruh", "Moliyaviy hisobot", "Cheklangan statistika"]
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonth: 40,
      priceYear: 399,
      save: 80,
      icon: <Zap className="w-6 h-6"/>,
      color: 'yellow',
      popular: true, // Eng ommabop
      desc: "Rivojlanayotgan markazlar uchun ideal.",
      features: ["500 ta O'quvchi", "40 ta Guruh", "To'liq statistika", "Priority Yordam", "SMS xabarnoma"]
    },
    {
      id: 'business',
      name: 'Business',
      priceMonth: 75,
      priceYear: 749,
      save: 150,
      icon: <Shield className="w-6 h-6"/>,
      color: 'emerald',
      desc: "Cheklovsiz imkoniyatlar.",
      features: ["Cheksiz O'quvchilar", "Cheksiz Guruhlar", "VIP Server", "Shaxsiy Menejer", "24/7 Qo'llab-quvvatlash"]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0b1120] text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
       
       {/* HEADER */}
       <div className={`sticky top-0 z-20 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between ${isDark ? 'bg-[#0b1120]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
           <button onClick={() => navigate('/settings')} className="flex items-center gap-2 font-bold opacity-70 hover:opacity-100 transition">
              <ArrowLeft size={20}/> <span className="hidden md:inline">Sozlamalar</span>
           </button>
           <h1 className="font-black text-xl tracking-tight">Tariflar</h1>
           <div className="w-20"></div> 
       </div>

       <div className="max-w-6xl mx-auto px-6 py-12">
           
           {/* TEXT & TOGGLE */}
           <div className="text-center mb-16">
              <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                 Biznesingizga mos reja
              </h1>
              <p className="text-lg opacity-60 mb-10 max-w-2xl mx-auto">
                 Yashirin to'lovlar yo'q. Istalgan vaqtda tarifni o'zgartirishingiz mumkin.
              </p>

              {/* OYLIK / YILLIK SWITCH */}
              <div className="inline-flex p-1.5 rounded-full bg-slate-200 dark:bg-white/10 relative">
                  <button 
                    onClick={() => setBilling('month')} 
                    className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 ${billing === 'month' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    Oylik
                  </button>
                  <button 
                    onClick={() => setBilling('year')} 
                    className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${billing === 'year' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                     Yillik <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-lg animate-pulse">-20%</span>
                  </button>
              </div>
              
              {billing === 'year' && (
                 <p className="mt-4 text-emerald-500 font-bold text-sm flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                    <Gift size={16}/> 2 oy mutlaqo bepul beriladi!
                 </p>
              )}
           </div>

           {/* KARTALAR GRID */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {plansData.map((plan) => {
                 const price = billing === 'month' ? plan.priceMonth : plan.priceYear;

                 return (
                    <div 
                      key={plan.id} 
                      className={`relative p-8 rounded-[32px] border transition-all duration-300 flex flex-col group ${
                        plan.popular 
                          ? `border-${plan.color}-500 ring-4 ring-${plan.color}-500/10 shadow-2xl scale-105 z-10 ${isDark ? 'bg-[#161d31]' : 'bg-white'}` 
                          : `${isDark ? 'bg-[#161d31] border-white/5 hover:border-white/10' : 'bg-white border-slate-200 hover:border-slate-300'} hover:-translate-y-2 hover:shadow-xl`
                      }`}
                    >
                       {plan.popular && (
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-${plan.color}-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1`}>
                             <Star size={12} fill="currentColor"/> Eng Ommabop
                          </div>
                       )}

                       {/* ICON & NAME */}
                       <div className="mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-${plan.color}-500/10 text-${plan.color}-500`}>
                             {plan.icon}
                          </div>
                          <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                          <p className="text-sm opacity-60 mt-2 min-h-[40px]">{plan.desc}</p>
                       </div>

                       {/* PRICE */}
                       <div className="mb-8 pb-8 border-b border-dashed border-slate-200 dark:border-white/10">
                          <div className="flex items-end gap-1">
                             <span className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>${price}</span>
                             <span className="text-slate-500 font-bold mb-1.5">/{billing === 'month' ? 'oy' : 'yil'}</span>
                          </div>
                          {billing === 'year' && (
                             <p className="text-xs text-emerald-500 font-bold mt-2 bg-emerald-500/10 inline-block px-2 py-1 rounded-lg">
                                Siz ${plan.save} tejaysiz!
                             </p>
                          )}
                       </div>

                       {/* FEATURES */}
                       <ul className="space-y-4 mb-8 flex-1">
                          {plan.features.map((feature, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm font-bold opacity-80">
                                <div className={`mt-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center bg-${plan.color}-500/20 text-${plan.color}-500`}>
                                   <Check size={10} strokeWidth={4}/>
                                </div>
                                {feature}
                             </li>
                          ))}
                       </ul>

                       {/* 🔥 TELEGRAM TUGMASI */}
                       <button 
                          onClick={() => handleSelectPlan(plan.name, price)}
                          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 bg-${plan.color}-500 hover:bg-${plan.color}-600 text-white shadow-lg shadow-${plan.color}-500/30 active:scale-95`}
                       >
                          <MessageCircle size={20}/> Tanlash
                       </button>
                    </div>
                 );
              })}
           </div>

           {/* FOOTER */}
           <div className="mt-20 text-center">
              <p className="opacity-50 flex items-center justify-center gap-2 text-sm">
                 <HelpCircle size={16}/> Savollaringiz bormi? <span className="underline cursor-pointer hover:text-blue-500" onClick={()=>window.open(`https://t.me/${ADMIN_TG}`)}>Admin bilan bog'laning</span>
              </p>
           </div>

       </div>
    </div>
  );
};