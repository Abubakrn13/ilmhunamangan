import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // --- USER STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('educore_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('educore_theme') || 'light');
  const [storeName, setStoreName] = useState('EduCore');

  // --- MA'LUMOTLAR ---
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // --- 🔥 TARIF REJALARI (PLANS) ---
  const PLANS = {
    trial: { name: "Sinov Davri", price: 0, limitStudents: 1000, limitGroups: 2 },
    start: { name: "Start ($15)", price: 15, limitStudents: 50, limitGroups: 5 },
    growth: { name: "Pro ($25)", price: 25, limitStudents: 200, limitGroups: 15 },
    scale: { name: "Business ($50)", price: 50, limitStudents: 9999, limitGroups: 9999 }
  };

  // --- YUKLASH (INIT) ---
  useEffect(() => {
    if (currentUser) {
      const load = (key) => {
        try {
          const item = localStorage.getItem(`${currentUser.username}_${key}`);
          return item ? JSON.parse(item) : [];
        } catch { return []; }
      };

      setStudents(load('students'));
      setGroups(load('groups'));
      setTeachers(load('teachers'));
      setLeads(load('leads'));
      setPayments(load('payments'));
      setExpenses(load('expenses'));
      setAttendance(load('attendance'));
      
      const savedName = localStorage.getItem(`${currentUser.username}_storeName`);
      if (savedName) setStoreName(savedName);
      else if (currentUser.centerName) setStoreName(currentUser.centerName);
    } else {
      // Agar user chiqib ketgan bo'lsa, ma'lumotlarni tozalaymiz
      setStudents([]); setGroups([]); setTeachers([]); setLeads([]); setPayments([]); setExpenses([]); setAttendance([]);
    }
  }, [currentUser]);

  // --- YORDAMCHI: LOCALSTORAGEGA SAQLASH ---
  const saveData = (key, data) => {
    if (currentUser) localStorage.setItem(`${currentUser.username}_${key}`, JSON.stringify(data));
  };

  // --- 🔥 1. OBUNA HOLATINI TEKSHIRISH ---
  const checkSubscription = () => {
    if (!currentUser) return { active: false, reason: 'not_logged' };

    const today = new Date();
    const endDate = new Date(currentUser.subscriptionEnd);

    // Agar bugungi sana tugash sanasidan katta bo'lsa -> Obuna o'lgan
    if (today > endDate) {
      return { active: false, reason: 'expired' };
    }
    
    return { active: true, plan: currentUser.plan };
  };

  // --- 🔥 2. RUXSATNI TEKSHIRISH (GATEKEEPER) ---
  // Har qanday ma'lumot qo'shish yoki o'zgartirishdan oldin shu funksiya ishlaydi
  const checkAccess = () => {
    const sub = checkSubscription();
    
    // Agar obuna tugagan bo'lsa
    if (!sub.active) {
       // Tasdiqlash oynasi chiqadi
       if(confirm("⛔️ DIQQAT: Obuna vaqtingiz tugagan!\n\nMa'lumot qo'shish yoki o'zgartirish uchun hisobni to'ldiring.\n\nTo'lov sahifasiga o'tasizmi?")) {
          // "Ha" desa to'lovga otamiz
          window.location.href = '/subscription';
       }
       return false; // Amalni to'xtatamiz
    }
    return true; // Ruxsat beramiz
  };

  // --- 🔥 3. LIMITLARNI TEKSHIRISH ---
  const checkLimit = (type) => {
    // Avval ruxsat bormi tekshiramiz
    if (!checkAccess()) return false;

    const currentPlan = PLANS[currentUser.plan] || PLANS.trial;

    if (type === 'student') {
      if (students.length >= currentPlan.limitStudents) {
        alert(`Sizning tarifingizda maksimum ${currentPlan.limitStudents} ta o'quvchi qo'shish mumkin.\nCheklovni olish uchun tarifni oshiring!`);
        return false;
      }
    }
    if (type === 'group') {
      if (groups.length >= currentPlan.limitGroups) {
        alert(`Sizning tarifingizda maksimum ${currentPlan.limitGroups} ta guruh ochish mumkin.\nCheklovni olish uchun tarifni oshiring!`);
        return false;
      }
    }
    return true;
  };

  // --- 🔥 4. PLANNI YANGILASH (OYLIK / YILLIK) ---
  const upgradePlan = (planKey, billingType = 'month') => {
    const today = new Date();
    const endDate = new Date(); // Hozirgi vaqt

    if (billingType === 'year') {
       // Yillik bo'lsa: +1 yil qo'shamiz
       endDate.setFullYear(today.getFullYear() + 1);
    } else {
       // Oylik bo'lsa: +30 kun qo'shamiz
       endDate.setDate(today.getDate() + 30);
    }

    const updatedUser = { 
      ...currentUser, 
      plan: planKey,
      subscriptionEnd: endDate.toISOString(),
      billingType: billingType 
    };

    localStorage.setItem('educore_current_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return true;
  };

  // --- 🔥 5. USER MA'LUMOTLARINI YANGILASH (Parol va h.k) ---
  const updateUserData = (newData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...newData };
    localStorage.setItem('educore_current_user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // --- AUTH (LOGIN / REGISTER / LOGOUT) ---
  const login = (username, password) => {
    // Simulyatsiya: Haqiqiy user tekshiruvi backendda bo'ladi
    const savedUserStr = localStorage.getItem('educore_current_user');
    
    // Agar oldin kirgan bo'lsa o'sha userni olamiz, bo'lmasa default
    let user = { 
      username, 
      centerName: "Markaz", 
      plan: 'trial', 
      subscriptionEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() 
    };
    
    if(savedUserStr) {
       const saved = JSON.parse(savedUserStr);
       // Agar username to'g'ri kelsa
       if(saved.username === username) user = saved;
    }

    localStorage.setItem('educore_current_user', JSON.stringify(user));
    setCurrentUser(user);
    return true;
  };

  const register = (username, password, centerName) => {
    // 🔥 YANGI USERGA 5 KUN SINOV BERAMIZ
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 5); 

    const user = { 
      username, 
      centerName,
      plan: 'trial', // Reja: Sinov
      subscriptionEnd: trialEnd.toISOString() // Tugash vaqti
    };
    
    localStorage.setItem(`${username}_storeName`, centerName);
    localStorage.setItem('educore_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setStoreName(centerName);
    return true;
  };

  const logout = () => { localStorage.removeItem('educore_current_user'); setCurrentUser(null); };

  // --- SYSTEM UTILS ---
  const toggleTheme = () => { const n = theme==='light'?'dark':'light'; setTheme(n); localStorage.setItem('educore_theme', n); };
  
  const updateStoreName = (n) => { setStoreName(n); if(currentUser) localStorage.setItem(`${currentUser.username}_storeName`, n); };
  
  const resetSystem = () => {
    if(!checkAccess()) return; // Reset qilish uchun ham ruxsat kerak
    const e=[]; setStudents(e); saveData('students',e); setGroups(e); saveData('groups',e); 
    setTeachers(e); saveData('teachers',e); setLeads(e); saveData('leads',e); 
    setPayments(e); saveData('payments',e); setExpenses(e); saveData('expenses',e); 
    setAttendance(e); saveData('attendance',e);
  };

  // --- CALCULATIONS ---
  const getStudentDays = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return 0;
    let targetGroupId = student.groupId || (student.groupIds && student.groupIds[0]);
    const group = groups.find(g => parseInt(g.id) === parseInt(targetGroupId));
    if (!group || !group.price) return 0;
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const totalPaid = studentPayments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
    const monthlyPrice = parseInt(group.price);
    const purchasedDays = (totalPaid / monthlyPrice) * 30;
    const joinedDate = new Date(student.joinedDate || new Date()); 
    const today = new Date();
    const diffTime = Math.abs(today - joinedDate);
    const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return Math.ceil(purchasedDays - daysPassed);
  };

  const getLowBalanceStudents = () => {
    return students.map(s => ({ ...s, daysLeft: getStudentDays(s.id) })).filter(s => s.daysLeft <= 3);
  };

  // --- 🔥 CRUD FUNKSIYALARI (QULF VA LIMIT BILAN) ---

  const addStudent = (s) => { 
    if(!checkLimit('student')) return; // 1. Limit tekshirish (+Access)
    const n = [...students, { ...s, id: Date.now(), balance: 0, score: 0, pointHistory: [], joinedDate: new Date().toISOString().slice(0,10) }]; 
    setStudents(n); saveData('students', n); 
  };
  const updateStudent = (u) => { 
    if(!checkAccess()) return; // 2. Faqat Access
    const n = students.map(s => s.id === u.id ? u : s); setStudents(n); saveData('students', n); 
  };
  const deleteStudent = (id) => { 
    if(!checkAccess()) return; 
    const n = students.filter(s => s.id !== id); setStudents(n); saveData('students', n); 
  };
  const giveBonus = (id, points, reason) => {
    // Bonus berishni bloklamadik (avtomatik tizim)
    const pts = parseInt(points); const updated = students.map(s => s.id === id ? { ...s, score: (parseInt(s.score)||0)+pts, pointHistory: [...(s.pointHistory||[]), {date:new Date().toISOString().slice(0,10), points:pts, reason}] } : s); setStudents(updated); saveData('students', updated); 
  };

  const addGroup = (g) => { 
    if(!checkLimit('group')) return; 
    const n = [...groups, { ...g, id: Date.now() }]; setGroups(n); saveData('groups', n); 
  };
  const updateGroup = (u) => { if(!checkAccess()) return; const n = groups.map(g => g.id === u.id ? u : g); setGroups(n); saveData('groups', n); };
  const deleteGroup = (id) => { if(!checkAccess()) return; const n = groups.filter(g => g.id !== id); setGroups(n); saveData('groups', n); };

  const addTeacher = (t) => { if(!checkAccess()) return; const n = [...teachers, { ...t, id: Date.now() }]; setTeachers(n); saveData('teachers', n); };
  const updateTeacher = (u) => { if(!checkAccess()) return; const n = teachers.map(t => t.id === u.id ? u : t); setTeachers(n); saveData('teachers', n); };
  const deleteTeacher = (id) => { if(!checkAccess()) return; const n = teachers.filter(t => t.id !== id); setTeachers(n); saveData('teachers', n); };

  const addLead = (l) => { if(!checkAccess()) return; const n = [...leads, { ...l, id: Date.now(), date: new Date().toISOString().slice(0,10) }]; setLeads(n); saveData('leads', n); };
  const deleteLead = (id) => { if(!checkAccess()) return; const n = leads.filter(l => l.id !== id); setLeads(n); saveData('leads', n); };

  const addPayment = (p) => { 
    if(!checkAccess()) return; 
    const n = [...payments, { ...p, id: Date.now(), type: 'income', date: new Date().toISOString().slice(0,10) }]; setPayments(n); saveData('payments', n); 
    if (p.studentId) { const updated = students.map(s => s.id === p.studentId ? { ...s, balance: (parseInt(s.balance)||0) + parseInt(p.amount) } : s); setStudents(updated); saveData('students', updated); giveBonus(p.studentId, 50, "To'lov bonusi"); } 
  };

  const addExpense = (e) => { if(!checkAccess()) return; const n = [...expenses, { ...e, id: Date.now(), type: 'expense' }]; setExpenses(n); saveData('expenses', n); };

  const markAttendance = (date, groupId, studentId, status) => { 
    if(!checkAccess()) return; 
    const clean = attendance.filter(a => !(a.date === date && a.studentId === studentId && a.groupId === groupId)); const n = [...clean, { date, groupId, studentId, status }]; setAttendance(n); saveData('attendance', n); if (status === 'present') giveBonus(studentId, 5, "Davomat bonusi"); 
  };

  return (
    <DataContext.Provider value={{
      // State
      currentUser, theme, storeName, 
      students, groups, teachers, leads, payments, expenses, attendance,
      PLANS, // <-- Export qilindi

      // System Actions
      login, register, logout, toggleTheme, setStoreName: updateStoreName, resetSystem,
      checkSubscription, upgradePlan, updateUserData, // <-- Export qilindi

      // Calculations
      getStudentDays, getLowBalanceStudents,

      // CRUD (Protected)
      addStudent, updateStudent, deleteStudent, giveBonus,
      addTeacher, updateTeacher, deleteTeacher,
      addGroup, updateGroup, deleteGroup,
      addLead, deleteLead,
      addPayment, addExpense,
      markAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);