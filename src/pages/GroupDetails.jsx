import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, User, Phone, Calendar, Clock, DollarSign, 
  Users, Edit, Trash2, X, GraduationCap, TrendingUp, Wallet, Search, CalendarClock 
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 🔥 Barcha kerakli ma'lumotlarni olamiz (payments qo'shildi)
  const { groups, students, updateGroup, deleteGroup, addPayment, payments, theme } = useData();
  const isDark = theme === 'dark';

  const group = groups?.find(g => g.id === parseInt(id));
  const groupStudents = students?.filter(s => s.groupIds && s.groupIds.includes(parseInt(id))) || [];

  // --- STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  
  // To'lov formasi
  const [payData, setPayData] = useState({ 
    studentId: null, 
    name: '', 
    amount: '', 
    date: new Date().toISOString().slice(0, 10) 
  });

  // Qidiruv
  const [search, setSearch] = useState('');

  // Tahrirlash formasi
  const [formData, setFormData] = useState({
    id: null, name: '', teacher: '', price: '', days: '', time: '', teacherPercent: ''
  });

  useEffect(() => {
    if (!group && groups.length > 0) {
      navigate('/groups');
    }
  }, [group, groups, navigate]);

  if (!group) return null;

  // --- 🧠 YANGI FUNKSIYA: KUN HISOBLASH ---
  const getPaidDays = (studentId) => {
    // 1. Shu o'quvchining faqat SHU guruh uchun qilgan to'lovlarini olamiz
    const studentPayments = payments?.filter(p => p.studentId === studentId && p.groupId === group.id) || [];
    
    // 2. Jami to'lagan summasi
    const totalPaid = studentPayments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    
    // 3. Guruh narxi
    const monthlyPrice = parseInt(group.price) || 1; 
    
    // 4. Kunini hisoblash (Summa / Narx * 30)
    const days = Math.floor((totalPaid / monthlyPrice) * 30);
    return days;
  };

  // --- QIDIRUV ---
  const filteredStudents = groupStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search)
  );

  // --- STATISTIKA ---
  const price = parseInt(group.price) || 0;
  const count = groupStudents.length;
  const totalRevenue = count * price;
  const teacherPercent = parseInt(group.teacherPercent) || 0; 
  const teacherSalary = (totalRevenue * teacherPercent) / 100;
  const centerProfit = totalRevenue - teacherSalary;

  // --- ACTIONS ---
  const handleEditOpen = () => { setFormData(group); setIsEditModalOpen(true); };
  const handlePreSave = (e) => { e.preventDefault(); setIsConfirmSaveOpen(true); };
  const handleFinalSave = () => { updateGroup(formData); setIsConfirmSaveOpen(false); setIsEditModalOpen(false); };
  const handleDelete = () => { deleteGroup(group.id); navigate('/groups'); };

  // To'lov Actions
  const openPayModal = (student) => {
    setPayData({
      studentId: student.id,
      name: student.name,
      amount: '',
      date: new Date().toISOString().slice(0, 10)
    });
    setIsPayModalOpen(true);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    if (!payData.amount) return alert("Summani kiriting!");

    addPayment({
      student: payData.name,
      studentId: payData.studentId,
      groupId: group.id,
      amount: payData.amount,
      date: payData.date,
      type: 'income',
      reason: `To'lov: ${group.name}`
    });
    setIsPayModalOpen(false);
    alert("To'lov qabul qilindi!");
  };

  // Preview (Modal ichida ko'rsatish uchun)
  const calculatePreviewDays = () => {
    if (!payData.amount) return 0;
    return Math.floor((parseInt(payData.amount) / (parseInt(group.price) || 1)) * 30);
  };

  return (
    <div className={`min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* NAVBAR */}
      <div className={`px-8 py-6 sticky top-0 z-20 backdrop-blur-md border-b flex justify-between items-center ${isDark ? 'bg-[#0b1120]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <button onClick={() => navigate(-1)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
          <ArrowLeft size={20} /> Orqaga
        </button>

        <div className="flex gap-2">
           <button onClick={handleEditOpen} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-500 font-bold hover:bg-cyan-500 hover:text-white transition">
             <Edit size={18} /> <span className="hidden sm:inline">Tahrirlash</span>
           </button>
           <button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition">
             <Trash2 size={18} /> <span className="hidden sm:inline">O'chirish</span>
           </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HERO CARD */}
        <div className={`relative overflow-hidden rounded-[40px] p-10 border ${isDark ? 'bg-gradient-to-br from-[#161d31] to-[#0f1524] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>ID: #{group.id}</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{group.name}</h1>
                 <p className={`text-xl font-medium flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <GraduationCap className="text-cyan-500" /> O'qituvchi: <span className={isDark ? 'text-white' : 'text-slate-900'}>{group.teacher}</span>
                 </p>
              </div>
              <div className="flex gap-3">
                 <div className={`p-4 rounded-2xl border text-center min-w-[100px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <Calendar size={20} className="mx-auto mb-2 text-purple-500"/>
                    <p className="font-bold text-sm">{group.days}</p>
                 </div>
                 <div className={`p-4 rounded-2xl border text-center min-w-[100px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <Clock size={20} className="mx-auto mb-2 text-orange-500"/>
                    <p className="font-bold text-sm">{group.time}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* STATISTIKA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className={`p-6 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-2 text-blue-500 font-bold"><Users size={20}/> Jami O'quvchi</div>
              <p className="text-3xl font-black">{count} ta</p>
           </div>
           <div className={`p-6 rounded-[32px] border ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-3 mb-2 text-emerald-500 font-bold"><TrendingUp size={20}/> Jami Tushum</div>
              <p className="text-3xl font-black">{totalRevenue.toLocaleString()}</p>
           </div>
           <div className={`p-6 rounded-[32px] border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-indigo-900/20 to-[#161d31] border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className="flex items-center gap-3 mb-2 text-indigo-500 font-bold"><Wallet size={20}/> O'qituvchi ({teacherPercent}%)</div>
              <p className="text-3xl font-black text-indigo-500">{teacherSalary.toLocaleString()}</p>
           </div>
           <div className={`p-6 rounded-[32px] border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-emerald-900/20 to-[#161d31] border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-center gap-3 mb-2 text-emerald-600 font-bold"><DollarSign size={20}/> Markaz Foydasi</div>
              <p className="text-3xl font-black text-emerald-600">{centerProfit.toLocaleString()}</p>
           </div>
        </div>

        {/* 🔍 JADVAL (TO'LOV KUNLARI BILAN) */}
        <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
           
           <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2">
                 <Users className="text-cyan-500"/> Guruh O'quvchilari
              </h3>
              
              <div className={`flex items-center px-4 py-2 rounded-xl border w-full md:w-64 ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-200'}`}>
                 <Search size={18} className="text-slate-400 mr-2"/>
                 <input 
                   placeholder="Qidirish..." 
                   className="bg-transparent outline-none w-full font-medium text-sm"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
                 {search && <button onClick={() => setSearch('')}><X size={14} className="text-slate-400 hover:text-rose-500"/></button>}
              </div>
           </div>
           
           <table className="w-full text-left">
             <thead className={`text-xs uppercase font-bold border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
               <tr>
                 <th className="p-6">O'quvchi</th>
                 <th className="p-6">To'lov Holati</th> {/* YANGI USTUN */}
                 <th className="p-6 text-center">Reyting</th>
                 <th className="p-6 text-right">Amallar</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => {
                 
                 // 🔥 Shu o'quvchi necha kunlik to'laganini hisoblaymiz
                 const paidDays = getPaidDays(s.id);

                 return (
                   <tr key={s.id} className={`transition group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                     <td className="p-6 flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>{idx + 1}</span>
                        <div>
                          <p className="font-bold text-lg">{s.name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.phone}</p>
                        </div>
                     </td>
                     
                     {/* 🔥 KUN KO'RSATISH */}
                     <td className="p-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit font-bold text-sm ${paidDays > 5 ? 'bg-emerald-500/10 text-emerald-500' : paidDays > 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-rose-500/10 text-rose-500'}`}>
                           <CalendarClock size={16}/> {paidDays} kun qoldi
                        </div>
                     </td>

                     <td className="p-6 text-center">
                       <span className="px-3 py-1 rounded-full font-black bg-orange-500/10 text-orange-500 text-sm">{s.score || 0} XP</span>
                     </td>
                     
                     <td className="p-6 text-right">
                        <button 
                          onClick={() => openPayModal(s)}
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition flex items-center gap-2 ml-auto"
                        >
                          <Wallet size={16}/> To'lov
                        </button>
                     </td>
                   </tr>
                 );
               }) : (
                 <tr><td colSpan="4" className="p-16 text-center text-slate-500">O'quvchilar topilmadi</td></tr>
               )}
             </tbody>
           </table>
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className={`w-full max-w-lg p-8 rounded-[32px] ${isDark ? 'bg-[#161d31]' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-6">Tahrirlash</h2>
              <form onSubmit={handlePreSave} className="space-y-4">
                 <input className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} placeholder="Nom" required />
                 <div className="flex gap-4">
                    <input className={`w-2/3 p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.teacher} onChange={e=>setFormData({...formData, teacher: e.target.value})} placeholder="O'qituvchi" required />
                    <input type="number" className={`w-1/3 p-4 rounded-2xl outline-none border text-center font-bold text-emerald-500 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} value={formData.teacherPercent} onChange={e=>setFormData({...formData, teacherPercent: e.target.value})} placeholder="%" />
                 </div>
                 <div className="flex gap-4">
                    <input type="number" className={`w-1/2 p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} placeholder="Narx" required />
                    <input className={`w-1/2 p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.time} onChange={e=>setFormData({...formData, time: e.target.value})} placeholder="Vaqt" />
                 </div>
                 <input className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={formData.days} onChange={e=>setFormData({...formData, days: e.target.value})} placeholder="Kunlar" />
                 <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-500/10 rounded-2xl font-bold">Bekor</button>
                    <button type="submit" className="flex-1 py-4 bg-cyan-600 text-white rounded-2xl font-bold">Saqlash</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* 💰 TO'LOV MODALI */}
      {isPayModalOpen && (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md p-8 rounded-[32px] ${isDark ? 'bg-[#161d31]' : 'bg-white'}`}>
               <h2 className="text-2xl font-bold text-emerald-500 mb-6 flex gap-2"><Wallet /> To'lov</h2>
               <div className="mb-4 text-center">
                  <h3 className="text-xl font-bold">{payData.name}</h3>
                  <p className="text-sm text-slate-500">{group.name}</p>
               </div>
               <form onSubmit={handlePaySubmit} className="space-y-4">
                  <input type="number" placeholder="Summa (UZS)" className={`w-full p-4 rounded-2xl outline-none border font-bold text-lg text-emerald-500 ${isDark ? 'bg-[#0b1120] border-white/5' : 'bg-slate-50 border-slate-200'}`} value={payData.amount} onChange={e => setPayData({...payData, amount: e.target.value})} required />
                  
                  {payData.amount && (
                     <div className="p-4 rounded-2xl text-center text-sm font-bold bg-emerald-500/10 text-emerald-500">
                        + {calculatePreviewDays()} kun qo'shiladi
                     </div>
                  )}

                  <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-emerald-500 text-white">Tasdiqlash</button>
                  <button type="button" onClick={() => setIsPayModalOpen(false)} className="w-full py-2 text-slate-500">Bekor</button>
               </form>
            </div>
         </div>
      )}

      <ConfirmModal isOpen={isConfirmSaveOpen} onClose={() => setIsConfirmSaveOpen(false)} onConfirm={handleFinalSave} isDark={isDark} title="Saqlash" />
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} isDark={isDark} title="O'chirish" />
    </div>
  );
};