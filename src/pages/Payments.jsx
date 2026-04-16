import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, Calendar, User, Search, X } from 'lucide-react';

export const Payments = () => {
  const { payments, students, addPayment, deletePayment, theme } = useData();
  
  // 🔥 MAVZU SOZLAMALARI
  const isDark = theme === 'dark';

  // Ranglar o'zgaruvchilari (Stil)
  const cardClass = isDark 
    ? 'bg-[#1e293b] border border-white/5 text-white shadow-xl' 
    : 'bg-white border border-slate-100 text-slate-800 shadow-sm';

  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputClass = isDark 
    ? 'bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500' 
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500';
  
  const hoverRow = isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50';

  // --- STATE ---
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // 'income' yoki 'expense'
  const [studentId, setStudentId] = useState('');
  const [comment, setComment] = useState('');

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return alert("Summani kiriting!");

    await addPayment({
      amount: Number(amount),
      type,
      student_id: studentId || null,
      comment,
      date: new Date().toISOString()
    });

    setAmount(''); setType('income'); setStudentId(''); setComment(''); setShowModal(false);
  };

  // --- STATISTIKA ---
  const totalIncome = payments.filter(p => p.type === 'income').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalExpense = payments.filter(p => p.type === 'expense').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const profit = totalIncome - totalExpense;

  const getStudentName = (id) => {
    const s = students.find(st => String(st.id) === String(id));
    return s ? s.name : "Markaz hisobidan";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className={`p-6 md:p-8 min-h-screen pb-24 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className={`text-3xl font-black ${textMain}`}>To'lovlar</h1>
          <p className={`${textSub} font-medium`}>Moliya bo'limi va hisobotlar</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition active:scale-95"
        >
          <Plus size={20}/> Yangi To'lov
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Kirim */}
        <div className={`p-6 rounded-[24px] flex items-center gap-4 ${cardClass}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
             <TrendingUp size={24}/>
           </div>
           <div>
             <p className={`text-xs font-bold uppercase ${textSub}`}>Jami Kirim</p>
             <h3 className={`text-2xl font-black ${textMain}`}>+{totalIncome.toLocaleString()}</h3>
           </div>
        </div>

        {/* Chiqim */}
        <div className={`p-6 rounded-[24px] flex items-center gap-4 ${cardClass}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
             <TrendingDown size={24}/>
           </div>
           <div>
             <p className={`text-xs font-bold uppercase ${textSub}`}>Jami Chiqim</p>
             <h3 className={`text-2xl font-black ${textMain}`}>-{totalExpense.toLocaleString()}</h3>
           </div>
        </div>

        {/* Foyda */}
        <div className={`p-6 rounded-[24px] flex items-center gap-4 ${cardClass}`}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
             <Wallet size={24}/>
           </div>
           <div>
             <p className={`text-xs font-bold uppercase ${textSub}`}>Sof Foyda</p>
             <h3 className={`text-2xl font-black ${profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {profit.toLocaleString()}
             </h3>
           </div>
        </div>
      </div>

      {/* JADVAL (TABLE) */}
      <div className={`rounded-[24px] overflow-hidden ${cardClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="p-5">Summa</th>
                <th className="p-5">Turi</th>
                <th className="p-5">Kimdan / Izoh</th>
                <th className="p-5">Sana</th>
                <th className="p-5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {payments.map(p => (
                <tr key={p.id} className={`transition ${hoverRow}`}>
                  <td className="p-5">
                    <span className={`font-black text-lg ${p.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {p.type === 'income' ? '+' : '-'}{Number(p.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                        p.type === 'income' 
                          ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700') 
                          : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700')
                    }`}>
                       {p.type === 'income' ? 'Kirim' : 'Chiqim'}
                    </span>
                  </td>
                  <td className="p-5">
                     <div className="flex flex-col">
                        <span className={`font-bold flex items-center gap-2 ${textMain}`}>
                           <User size={14} className={textSub}/> 
                           {p.student_id ? getStudentName(p.student_id) : "Markaz hisobidan"}
                        </span>
                        {p.comment && <span className={`text-xs mt-1 ${textSub}`}>{p.comment}</span>}
                     </div>
                  </td>
                  <td className={`p-5 font-medium text-sm ${textSub}`}>
                     <span className="flex items-center gap-2">
                        <Calendar size={14}/> {formatDate(p.created_at)}
                     </span>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => { if(confirm("O'chirasizmi?")) deletePayment(p.id) }} 
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className={`p-8 text-center font-medium ${textSub}`}>
                    Hozircha to'lovlar yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (TO'LOV QO'SHISH) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`p-8 rounded-[32px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 ${cardClass}`}>
            
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-black ${textMain}`}>To'lov Qo'shish</h2>
                <button onClick={() => setShowModal(false)} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type Toggle */}
              <div className={`flex p-1 rounded-xl mb-4 ${isDark ? 'bg-[#0f172a]' : 'bg-slate-100'}`}>
                 <button 
                   type="button"
                   onClick={() => setType('income')}
                   className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${type === 'income' ? (isDark ? 'bg-[#1e293b] text-emerald-400 shadow' : 'bg-white shadow text-emerald-600') : 'text-slate-500'}`}
                 >
                   Kirim
                 </button>
                 <button 
                   type="button"
                   onClick={() => setType('expense')}
                   className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${type === 'expense' ? (isDark ? 'bg-[#1e293b] text-rose-400 shadow' : 'bg-white shadow text-rose-600') : 'text-slate-500'}`}
                 >
                   Chiqim
                 </button>
              </div>

              <input 
                type="number" 
                placeholder="Summa (so'm)" 
                className={`w-full p-4 rounded-xl font-bold outline-none border transition ${inputClass}`} 
                required 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
              />

              {/* Faqat Kirim bo'lsa Student tanlash chiqadi */}
              {type === 'income' && (
                <select 
                  className={`w-full p-4 rounded-xl font-bold outline-none border transition ${inputClass}`} 
                  value={studentId} 
                  onChange={e => setStudentId(e.target.value)}
                >
                  <option value="">O'quvchi tanlang (Ixtiyoriy)</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id} className={isDark ? 'bg-slate-800' : ''}>{s.name}</option>
                  ))}
                </select>
              )}

              <input 
                placeholder="Izoh (masalan: Arenda, Svet...)" 
                className={`w-full p-4 rounded-xl font-bold outline-none border transition ${inputClass}`} 
                value={comment} 
                onChange={e => setComment(e.target.value)}
              />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setShowModal(false)} className={`flex-1 py-3 font-bold rounded-xl transition ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>Bekor</button>
                <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};