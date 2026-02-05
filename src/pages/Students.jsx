import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  User, Plus, Search, Trash2, Phone, Star, Layers, X, 
  Edit, Wallet, CheckCircle, Zap, CalendarClock 
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const Students = () => {
  const data = useData();
  if (!data) return null;

  // payments ni oldik
  const { students, groups, payments, addStudent, updateStudent, deleteStudent, addPayment, giveBonus, theme } = data;
  const isDark = theme === 'dark';
  
  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({ id: null, name: '', phone: '', groupIds: [] });
  const [payData, setPayData] = useState({ studentId: null, name: '', amount: '', groupId: '', date: new Date().toISOString().slice(0, 10) });
  const [bonusData, setBonusData] = useState({ studentId: null, name: '', points: 10, reason: '' });
  
  const [search, setSearch] = useState('');

  const safeStudents = students || [];
  const safeGroups = groups || [];

  // --- 🔥 MUHIM: Guruh bo'yicha kunni hisoblash ---
  const getGroupDays = (studentId, groupId) => {
    const group = safeGroups.find(g => g.id === groupId);
    if (!group) return 0;

    // Shu o'quvchi va shu guruh bo'yicha to'lovlar
    const studentPayments = payments?.filter(p => p.studentId === studentId && p.groupId === groupId) || [];
    
    // Jami to'lagan puli
    const totalPaid = studentPayments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    
    // Kun hisoblash
    const monthlyPrice = parseInt(group.price) || 1;
    return Math.floor((totalPaid / monthlyPrice) * 30);
  };

  // Qidiruv
  const filteredStudents = safeStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search)
  );

  // --- ACTIONS ---
  const openModal = (s) => { 
    if(s) { setEditingStudent(s); setFormData({ ...s, groupIds: s.groupIds || [] }); } 
    else { setEditingStudent(null); setFormData({ id: null, name: '', phone: '', groupIds: [] }); }
    setIsModalOpen(true); 
  };

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (!formData.name || !formData.phone) return alert("Ism va Telefon majburiy!");
    editingStudent ? updateStudent(formData) : addStudent(formData); 
    setIsModalOpen(false); 
  };

  const handleDeleteConfirm = () => { deleteStudent(deletingId); setIsDeleteModalOpen(false); };
  
  const toggleGroupSelection = (gid) => { 
    if(formData.groupIds.includes(gid)) setFormData({...formData, groupIds:formData.groupIds.filter(i=>i!==gid)}); 
    else setFormData({...formData, groupIds:[...formData.groupIds, gid]}); 
  };

  const openPayModal = (s) => { 
    if (!s.groupIds || s.groupIds.length === 0) return alert("O'quvchi guruhga a'zo emas!");
    setPayData({ studentId:s.id, name:s.name, amount:'', groupId:s.groupIds[0], date:new Date().toISOString().slice(0,10) }); 
    setIsPayModalOpen(true); 
  };

  const handlePaySubmit = (e) => { 
    e.preventDefault(); 
    if (!payData.amount || !payData.groupId) return alert("Summa va Kursni tanlang!");
    const g = safeGroups.find(gr=>gr.id==payData.groupId); 
    addPayment({ student:payData.name, studentId:payData.studentId, groupId:parseInt(payData.groupId), amount:payData.amount, date:payData.date, type:'income', reason:`To'lov: ${g?.name}` }); 
    setIsPayModalOpen(false); 
  };

  const openBonusModal = (s) => { setBonusData({studentId:s.id, name:s.name, points:10, reason:'Dars faolligi'}); setIsBonusModalOpen(true); };
  const handleBonusSubmit = (e) => { e.preventDefault(); giveBonus(bonusData.studentId, bonusData.points, bonusData.reason); setIsBonusModalOpen(false); };

  const calculateDays = () => { 
    const g=safeGroups.find(gr=>gr.id==payData.groupId); 
    return Math.floor((parseInt(payData.amount)/(parseInt(g?.price)||1))*30); 
  };

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            O'quvchilar <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{safeStudents.length} ta</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Barcha o'quvchilar ro'yxati va boshqaruvi
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
           <div className={`flex items-center px-4 py-3 rounded-2xl border w-full md:w-64 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
              <Search size={20} className="text-slate-400 mr-2"/>
              <input placeholder="Qidirish..." className={`bg-transparent outline-none w-full font-medium ${isDark ? 'text-white' : 'text-slate-900'}`} value={search} onChange={e => setSearch(e.target.value)} />
           </div>
           <button onClick={() => openModal(null)} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-cyan-500/30 px-6 py-3 rounded-2xl font-bold transition flex items-center gap-2 text-white shadow-lg active:scale-95 whitespace-nowrap">
             <Plus size={20}/> Qo'shish
           </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? filteredStudents.map((s) => (
          <div key={s.id} className={`p-6 rounded-[32px] border relative group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${isDark ? 'bg-[#161d31] border-white/5 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200'}`}>
             
             <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
                   {s.name.charAt(0)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => openBonusModal(s)} className="p-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition"><Zap size={18}/></button>
                   <button onClick={() => openPayModal(s)} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition"><Wallet size={18}/></button>
                   <button onClick={() => openModal(s)} className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition"><Edit size={18}/></button>
                   <button onClick={() => { setDeletingId(s.id); setIsDeleteModalOpen(true); }} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition"><Trash2 size={18}/></button>
                </div>
             </div>

             <h3 className="text-xl font-bold mb-1 truncate">{s.name}</h3>
             <p className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
               <Phone size={14} className="text-cyan-500"/> {s.phone}
             </p>

             {/* 🔥 GURUHLAR VA KUNLAR (Multi-Badge) */}
             <div className="mt-4 flex flex-col gap-2 min-h-[30px]">
                {s.groupIds && s.groupIds.length > 0 ? s.groupIds.map(gid => {
                   const g = safeGroups.find(gr => gr.id === gid);
                   const days = getGroupDays(s.id, gid); // Kun hisoblash

                   return g ? (
                     <div key={gid} className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                           <Layers size={12} className="text-purple-500"/> 
                           <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{g.name}</span>
                        </div>
                        <span className={`${days > 5 ? 'text-emerald-500' : days > 0 ? 'text-orange-500' : 'text-rose-500'}`}>
                           {days} kun
                        </span>
                     </div>
                   ) : null;
                }) : (
                   <span className="text-xs text-rose-500 bg-rose-500/10 px-2 py-1 rounded font-bold w-fit">Guruhsiz</span>
                )}
             </div>

             <div className="absolute bottom-6 right-6 flex items-center gap-1 text-orange-500 font-black bg-orange-500/10 px-3 py-1 rounded-lg text-xs border border-orange-500/20">
                <Star size={12} fill="currentColor"/> {s.score || 0} XP
             </div>

          </div>
        )) : (
          <div className="col-span-full py-20 text-center opacity-50 flex flex-col items-center">
             <User size={64} className="mb-4 text-slate-300"/>
             <p className="text-xl font-bold">Topilmadi</p>
          </div>
        )}
      </div>

      {/* MODALLAR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
           <div className={`w-full max-w-lg p-8 rounded-[32px] border shadow-2xl ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingStudent ? "Tahrirlash" : "Yangi O'quvchi"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <input placeholder="Ism Familiya" className={`w-full p-4 rounded-2xl outline-none border font-bold ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} required />
                 <input placeholder="Telefon" className={`w-full p-4 rounded-2xl outline-none border font-bold ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required />
                 <div>
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">Guruhlarga biriktirish</p>
                    <div className={`p-2 rounded-2xl border max-h-40 overflow-y-auto custom-scrollbar ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                       {safeGroups.map(g => (
                         <div key={g.id} onClick={() => toggleGroupSelection(g.id)} className={`p-3 rounded-xl text-sm font-bold cursor-pointer mb-1 transition-all flex justify-between items-center ${formData.groupIds.includes(g.id) ? 'bg-cyan-500 text-white shadow-md' : isDark ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-200'}`}>
                            <span>{g.name}</span>
                            {formData.groupIds.includes(g.id) && <CheckCircle size={16}/>}
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-500/10 rounded-2xl font-bold">Bekor</button>
                    <button type="submit" className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-bold">Saqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isPayModalOpen && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md p-8 rounded-[32px] border shadow-2xl ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
               <h2 className="text-2xl font-bold text-emerald-500 mb-6 flex gap-2"><Wallet /> To'lov</h2>
               <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold">{payData.name}</h3>
               </div>
               <form onSubmit={handlePaySubmit} className="space-y-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase ml-1">Qaysi kurs uchun?</label>
                     <select className={`w-full p-4 rounded-2xl outline-none border font-bold ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={payData.groupId} onChange={e => setPayData({...payData, groupId: e.target.value})} required>
                        <option value="" className="text-black">Tanlang...</option>
                        {safeStudents.find(s => s.id === payData.studentId)?.groupIds.map(gid => {
                           const g = safeGroups.find(gr => gr.id === gid);
                           return <option key={gid} value={gid} className="text-black">{g?.name} ({parseInt(g?.price).toLocaleString()} UZS)</option>
                        })}
                     </select>
                  </div>
                  <input type="number" placeholder="Summa (UZS)" className={`w-full p-4 rounded-2xl outline-none border font-bold text-lg text-emerald-500 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} value={payData.amount} onChange={e => setPayData({...payData, amount: e.target.value})} required />
                  {payData.amount && payData.groupId && (
                     <div className="p-4 rounded-2xl text-center text-sm font-bold bg-emerald-500/10 text-emerald-500">
                        + {calculateDays()} kun qo'shiladi
                     </div>
                  )}
                  <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-emerald-500 text-white">Tasdiqlash</button>
               </form>
            </div>
         </div>
      )}

      {isBonusModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
           <div className={`w-full max-w-sm p-8 rounded-[32px] border shadow-2xl ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-500"><Zap /> Ball Berish</h2>
              <h3 className="text-center font-bold text-xl mb-6">{bonusData.name}</h3>
              <form onSubmit={handleBonusSubmit} className="space-y-4">
                 <input type="number" className={`w-full p-4 rounded-2xl outline-none border font-black text-center text-3xl text-orange-500 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} value={bonusData.points} onChange={e => setBonusData({...bonusData, points: e.target.value})} required />
                 <input className={`w-full p-4 rounded-2xl outline-none border font-bold ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={bonusData.reason} onChange={e => setBonusData({...bonusData, reason: e.target.value})} placeholder="Sabab" required />
                 <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold">Tasdiqlash</button>
              </form>
           </div>
        </div>
      )}

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} isDark={isDark} title="O'chirish" />

    </div>
  );
};