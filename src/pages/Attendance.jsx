import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  CalendarCheck, Check, X, Users, Calendar 
} from 'lucide-react';

export const Attendance = () => {
  const { groups, students, markAttendance, attendance, theme } = useData();
  const isDark = theme === 'dark';
  
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const safeGroups = groups || [];
  const safeStudents = students || [];

  // Tanlangan guruh o'quvchilari
  const groupStudents = safeStudents.filter(s => s.groupIds && s.groupIds.includes(parseInt(selectedGroup)));

  // Davomatni belgilash
  const handleMark = (studentId, status) => {
    markAttendance(selectedDate, parseInt(selectedGroup), studentId, status);
  };

  // O'quvchining holatini olish
  const getStatus = (studentId) => {
    const record = attendance?.find(a => a.date === selectedDate && a.studentId === studentId && a.groupId === parseInt(selectedGroup));
    return record ? record.status : null;
  };

  // Statistika (Nechta keldi, nechta kelmadi)
  const presentCount = groupStudents.filter(s => getStatus(s.id) === 'present').length;
  const absentCount = groupStudents.filter(s => getStatus(s.id) === 'absent').length;

  return (
    <div className={`p-10 min-h-screen pb-24 transition-all duration-300 ${isDark ? 'bg-[#0b1120] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Davomat <span className="text-sm font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">{selectedDate}</span>
          </h1>
          <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            O'quvchilarning darsga qatnashishini nazorat qiling
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-4 w-full md:w-auto">
           {/* Guruh Tanlash */}
           <div className={`flex items-center px-4 py-3 rounded-2xl border w-full md:w-64 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
              <Users size={20} className="text-slate-400 mr-2"/>
              <select 
                className={`bg-transparent outline-none w-full font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
              >
                <option value="" className="text-black">Guruhni tanlang...</option>
                {safeGroups.map(g => <option key={g.id} value={g.id} className="text-black">{g.name}</option>)}
              </select>
           </div>

           {/* Sana Tanlash */}
           <div className={`flex items-center px-4 py-3 rounded-2xl border w-full md:w-48 ${isDark ? 'bg-[#161d31] border-white/10' : 'bg-white border-slate-200'}`}>
              <Calendar size={20} className="text-slate-400 mr-2"/>
              <input 
                type="date"
                className={`bg-transparent outline-none w-full font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
           </div>
        </div>
      </div>

      {selectedGroup ? (
        <>
          {/* STATISTIKA BAR */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className={`p-4 rounded-2xl flex items-center justify-between border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                <span className="font-bold">Kelganlar</span>
                <span className="text-2xl font-black">{presentCount}</span>
             </div>
             <div className={`p-4 rounded-2xl flex items-center justify-between border ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <span className="font-bold">Kelmaganlar</span>
                <span className="text-2xl font-black">{absentCount}</span>
             </div>
          </div>

          {/* O'QUVCHILAR RO'YXATI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupStudents.length > 0 ? groupStudents.map(s => {
              const status = getStatus(s.id);
              return (
                <div key={s.id} className={`p-5 rounded-[24px] border flex items-center justify-between transition-all hover:shadow-lg ${isDark ? 'bg-[#161d31] border-white/5' : 'bg-white border-slate-200'}`}>
                   
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                        {s.name.charAt(0)}
                      </div>
                      <p className="font-bold truncate max-w-[120px]">{s.name}</p>
                   </div>

                   <div className="flex gap-2">
                      <button 
                         onClick={() => handleMark(s.id, 'present')}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                           status === 'present' 
                             ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                             : isDark ? 'bg-white/5 text-slate-500 hover:bg-emerald-500/20' : 'bg-slate-100 text-slate-400 hover:bg-emerald-100'
                         }`}
                      >
                         <Check size={20} strokeWidth={3}/>
                      </button>
                      <button 
                         onClick={() => handleMark(s.id, 'absent')}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                           status === 'absent' 
                             ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                             : isDark ? 'bg-white/5 text-slate-500 hover:bg-rose-500/20' : 'bg-slate-100 text-slate-400 hover:bg-rose-100'
                         }`}
                      >
                         <X size={20} strokeWidth={3}/>
                      </button>
                   </div>
                </div>
              )
            }) : (
              <div className="col-span-full py-20 text-center opacity-50">
                 <Users size={48} className="mx-auto mb-4"/>
                 <p>Bu guruhda o'quvchi yo'q</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-50">
           <CalendarCheck size={80} className="mb-4 text-slate-300"/>
           <p className="text-xl font-bold">Guruhni tanlang</p>
        </div>
      )}
    </div>
  );
};