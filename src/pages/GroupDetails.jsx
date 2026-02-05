import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  ArrowLeft, Wallet, Calendar, Clock, DollarSign, 
  Users, Edit, Trash2, X, GraduationCap, TrendingUp, Search, CalendarClock, Plus, UserPlus, 
  MessageCircle, Send, Phone, MoreVertical
} from 'lucide-react';
import { ConfirmModal } from '../components/ConfirmModal';

export const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { groups, students, updateGroup, deleteGroup, addPayment, addStudent, getStudentDays, theme } = useData();
  const isDark = theme === 'dark';
  const groupId = parseInt(id);

  const group = groups?.find(g => parseInt(g.id) === groupId);
  
  // Universal Filtr
  const groupStudents = students?.filter(s => {
    if (s.groupId && parseInt(s.groupId) === groupId) return true;
    if (s.groupIds && Array.isArray(s.groupIds) && s.groupIds.includes(groupId)) return true;
    return false;
  }) || [];

  // --- STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [smsMessage, setSmsMessage] = useState("");
  
  // Form State
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("+998 ");
  
  const [payData, setPayData] = useState({ 
    studentId: null, name: '', amount: '', date: new Date().toISOString().slice(0, 10) 
  });

  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    id: null, name: '', teacher: '', price: '', days: '', time: '', teacherPercent: ''
  });

  useEffect(() => {
    if (!group && groups.length > 0) navigate('/groups');
  }, [group, groups, navigate]);

  if (!group) return null;

  // --- MANTIQ ---
  const filteredStudents = groupStudents.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.phone.includes(search)
  );

  const count = groupStudents.length;
  const totalRevenue = count * (parseInt(group.price) || 0);
  const teacherPercent = parseInt(group.teacherPercent) || 0; 
  const teacherSalary = (totalRevenue * teacherPercent) / 100;
  const centerProfit = totalRevenue - teacherSalary;

  // --- ACTIONS ---
  const handleEditOpen = () => { setFormData(group); setIsEditModalOpen(true); };
  const handlePreSave = (e) => { e.preventDefault(); setIsConfirmSaveOpen(true); };
  const handleFinalSave = () => { updateGroup(formData); setIsConfirmSaveOpen(false); setIsEditModalOpen(false); };
  const handleDelete = () => { deleteGroup(group.id); navigate('/groups'); };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName || newStudentPhone.length < 9) return alert("Ma'lumotlarni to'ldiring!");
    addStudent({
      name: newStudentName,
      phone: newStudentPhone,
      groupId: groupId, 
      balance: 0,
      status: 'active'
    });
    setIsAddModalOpen(false);
    setNewStudentName("");
    setNewStudentPhone("+998 ");
  };

  const openPayModal = (student) => {
    setPayData({ studentId: student.id, name: student.name, amount: '', date: new Date().toISOString().slice(0, 10) });
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

  const openSmsModal = (student) => {
    setSelectedStudent(student);
    setSmsMessage("");
    setIsSmsModalOpen(true);
  };

  // 🔥 YANGILANGAN SHABLONLAR
  const smsTemplates = {
    payment: (name) => `Hurmatli ota-ona! Farzandingiz ${name} uchun to'lov qabul qilindi. Rahmat!`,
    debt: (name) => `Hurmatli ota-ona! Farzandingiz ${name} uchun to'lov vaqti keldi. Iltimos to'lov qiling.`,
    absent: (name) => `Farzandingiz ${name} bugun darsga kelmadi.`,
    birthday: (name) => `${name}, sizni tug'ilgan kuningiz bilan chin dildan tabriklaymiz! 🎉`
  };

  const applyTemplate = (type) => {
    if (!selectedStudent) return;
    setSmsMessage(smsTemplates[type](selectedStudent.name));
  };

  // 🔥 REAL SMS (TUZATILDI: 1 soniya kutib yopiladi)
  const sendSmsReal = () => {
    if (!smsMessage) return alert("Xabar yozilmadi!");
    
    const phone = selectedStudent.phone.replace(/[^0-9]/g, '');
    
    // 1. Darhol o'tish
    window.location.href = `sms:+${phone}?body=${encodeURIComponent(smsMessage)}`;
    
    // 2. Modalni 1 soniyadan keyin yopish (shunda brauzer ulguradi)
    setTimeout(() => {
        setIsSmsModalOpen(false);
    }, 1000);
  };

  const openTelegram = (phone) => {
     const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
     window.open(`https://t.me/+${cleanPhone}`, '_blank');
  };

  const calculatePreviewDays = () => {
    if (!payData.amount) return 0;
    return Math.floor((parseInt(payData.amount) / (parseInt(group.price) || 1)) * 30);
  };

  return (
    <div className={`min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
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

        {/* JADVAL */}
        <div className={`rounded-[32px] border overflow-hidden shadow-sm ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
           <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
              <h3 className="text-xl font-bold flex items-center gap-2"><Users className="text-cyan-500"/> Guruh O'quvchilari</h3>
              <div className="flex gap-2 w-full md:w-auto">
                 <div className={`flex items-center px-4 py-2 rounded-xl border flex-1 ${isDark ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-200'}`}>
                    <Search size={18} className="text-slate-400 mr-2"/>
                    <input placeholder="Qidirish..." className="bg-transparent outline-none w-full font-medium text-sm" value={search} onChange={e => setSearch(e.target.value)}/>
                    {search && <button onClick={() => setSearch('')}><X size={14} className="text-slate-400 hover:text-rose-500"/></button>}
                 </div>
                 <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition">
                   <Plus size={20}/> <span className="hidden sm:inline">Qo'shish</span>
                 </button>
              </div>
           </div>
           
           <table className="w-full text-left">
             <thead className={`text-xs uppercase font-bold border-b ${isDark ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
               <tr>
                 <th className="p-6">O'quvchi</th>
                 <th className="p-6">Kunlar (To'lov)</th>
                 <th className="p-6 text-center">Reyting</th>
                 <th className="p-6 text-right">Amallar</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => {
                 // 🔥 REAL VAQT FUNKSIYASINI ISHLATAMIZ
                 const paidDays = getStudentDays(s.id);
                 return (
                   <tr key={s.id} className={`transition group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                     <td className="p-6 flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isDark ? 'bg-white/5' : 'bg-slate-200'}`}>{idx + 1}</span>
                        <div>
                          <p className="font-bold text-lg">{s.name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.phone}</p>
                        </div>
                     </td>
                     <td className="p-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit font-bold text-sm ${paidDays > 5 ? 'bg-emerald-500/10 text-emerald-500' : paidDays > 0 ? 'bg-orange-500/10 text-orange-500' : 'bg-rose-500/10 text-rose-500'}`}>
                           <CalendarClock size={16}/> {paidDays} kun qoldi
                        </div>
                     </td>
                     <td className="p-6 text-center">
                       <span className="px-3 py-1 rounded-full font-black bg-orange-500/10 text-orange-500 text-sm">{s.score || 0} XP</span>
                     </td>
                     <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => openTelegram(s.phone)} className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition" title="Telegram">
                              <Send size={18}/>
                           </button>
                           <button onClick={() => openSmsModal(s)} className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white transition" title="SMS">
                              <MessageCircle size={18}/>
                           </button>
                           <button onClick={() => openPayModal(s)} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold hover:bg-emerald-500 hover:text-white transition flex items-center gap-2">
                              <Wallet size={16}/> To'lov
                           </button>
                        </div>
                     </td>
                   </tr>
                 );
               }) : (
                 <tr>
                    <td colSpan="4" className="p-16 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                           <UserPlus size={40} className="text-slate-300"/>
                           <p>Bu guruhda o'quvchilar yo'q.</p>
                        </div>
                    </td>
                 </tr>
               )}
             </tbody>
           </table>
        </div>
      </div>

      {/* --- MODALLAR --- */}

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
                  {payData.amount && <div className="p-4 rounded-2xl text-center text-sm font-bold bg-emerald-500/10 text-emerald-500">+ {calculatePreviewDays()} kun qo'shiladi</div>}
                  <button type="submit" className="w-full py-4 rounded-2xl font-bold bg-emerald-500 text-white">Tasdiqlash</button>
                  <button type="button" onClick={() => setIsPayModalOpen(false)} className="w-full py-2 text-slate-500">Bekor</button>
               </form>
            </div>
         </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className={`w-full max-w-md p-8 rounded-[32px] ${isDark ? 'bg-[#161d31]' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold">O'quvchi Qo'shish</h2>
                 <button onClick={() => setIsAddModalOpen(false)}><X size={24} className="text-slate-500"/></button>
              </div>
              <form onSubmit={handleAddStudent} className="space-y-4">
                 <div>
                    <label className="text-sm font-bold text-slate-500 ml-2">F.I.SH</label>
                    <input autoFocus className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Masalan: Ali Valiyev" required />
                 </div>
                 <div>
                    <label className="text-sm font-bold text-slate-500 ml-2">Telefon</label>
                    <input className={`w-full p-4 rounded-2xl outline-none border ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`} value={newStudentPhone} onChange={e => setNewStudentPhone(e.target.value)} placeholder="+998" required />
                 </div>
                 <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold mt-4">Qo'shish</button>
              </form>
           </div>
        </div>
      )}

      {/* 4. SMS MODAL */}
      {isSmsModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg p-8 rounded-[32px] ${isDark ? 'bg-[#161d31]' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500"><MessageCircle size={24}/></div>
                   <div>
                      <h3 className="text-xl font-bold">SMS Yuborish</h3>
                      <p className="text-sm text-slate-500">{selectedStudent.name}</p>
                   </div>
                </div>
                <button onClick={() => setIsSmsModalOpen(false)}><X size={24} className="text-slate-500"/></button>
             </div>

             <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => applyTemplate('payment')} className="px-3 py-1.5 text-xs font-bold bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20">💰 To'lov</button>
                <button onClick={() => applyTemplate('debt')} className="px-3 py-1.5 text-xs font-bold bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20">⏳ Qarz</button>
                <button onClick={() => applyTemplate('absent')} className="px-3 py-1.5 text-xs font-bold bg-orange-500/10 text-orange-500 rounded-lg hover:bg-orange-500/20">🚫 Dars</button>
                <button onClick={() => applyTemplate('birthday')} className="px-3 py-1.5 text-xs font-bold bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500/20">🎂 Tabrik</button>
             </div>

             <textarea 
               value={smsMessage} 
               onChange={(e) => setSmsMessage(e.target.value)} 
               rows="4" 
               className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${isDark ? 'bg-[#0b1120] border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
             ></textarea>
             
             <button 
               onClick={sendSmsReal}
               className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold mt-4 flex items-center justify-center gap-2 hover:bg-blue-500 transition"
             >
               <Send size={18}/> SMS Ilovasida Ochish
             </button>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={isConfirmSaveOpen} onClose={() => setIsConfirmSaveOpen(false)} onConfirm={handleFinalSave} isDark={isDark} title="Saqlash" />
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} isDark={isDark} title="O'chirish" />
    </div>
  );
};