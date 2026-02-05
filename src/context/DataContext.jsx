import React, { createContext, useState, useContext, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('educore_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('educore_theme') || 'light');
  const [storeName, setStoreName] = useState('EduCore');

  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [attendance, setAttendance] = useState([]);

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
      setLeads(load('leads'));
      setPayments(load('payments'));
      setExpenses(load('expenses'));
      setAttendance(load('attendance'));
      
      const savedName = localStorage.getItem(`${currentUser.username}_storeName`);
      if (savedName) setStoreName(savedName);
    } else {
      setStudents([]); setGroups([]); setLeads([]); setPayments([]); setExpenses([]); setAttendance([]);
    }
  }, [currentUser]);

  const saveData = (key, data) => {
    if (currentUser) {
      localStorage.setItem(`${currentUser.username}_${key}`, JSON.stringify(data));
    }
  };

  // --- CRUD FUNKSIYALARI ---

  const login = (username, password) => {
    const user = { username: username || "Admin", centerName: "EduCore" };
    localStorage.setItem('educore_current_user', JSON.stringify(user));
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('educore_current_user');
    setCurrentUser(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('educore_theme', newTheme);
  };

  const updateStoreName = (name) => {
    setStoreName(name);
    if (currentUser) localStorage.setItem(`${currentUser.username}_storeName`, name);
  };

  // 🔥 YANGI: TIZIMNI RESET QILISH
  const resetSystem = () => {
    const empty = [];
    setStudents(empty); saveData('students', empty);
    setGroups(empty); saveData('groups', empty);
    setLeads(empty); saveData('leads', empty);
    setPayments(empty); saveData('payments', empty);
    setExpenses(empty); saveData('expenses', empty);
    setAttendance(empty); saveData('attendance', empty);
  };

  // Boshqa barcha funksiyalar (Add, Delete, Update...)
  const addStudent = (s) => { const n = [...students, { ...s, id: Date.now(), score: 0, pointHistory: [], joinedDate: new Date().toISOString().slice(0,10) }]; setStudents(n); saveData('students', n); };
  const updateStudent = (u) => { const n = students.map(s => s.id === u.id ? u : s); setStudents(n); saveData('students', n); };
  const deleteStudent = (id) => { const n = students.filter(s => s.id !== id); setStudents(n); saveData('students', n); };
  
  const giveBonus = (studentId, points, reason) => {
    const pts = parseInt(points);
    const updated = students.map(s => s.id === studentId ? { ...s, score: (parseInt(s.score)||0) + pts, pointHistory: [...(s.pointHistory||[]), { date: new Date().toISOString().slice(0,10), points: pts, reason }] } : s);
    setStudents(updated); saveData('students', updated);
  };

  const addGroup = (g) => { const n = [...groups, { ...g, id: Date.now() }]; setGroups(n); saveData('groups', n); };
  const updateGroup = (u) => { const n = groups.map(g => g.id === u.id ? u : g); setGroups(n); saveData('groups', n); };
  const deleteGroup = (id) => { const n = groups.filter(g => g.id !== id); setGroups(n); saveData('groups', n); };

  const addLead = (l) => { const n = [...leads, { ...l, id: Date.now(), date: new Date().toISOString().slice(0,10) }]; setLeads(n); saveData('leads', n); };
  const deleteLead = (id) => { const n = leads.filter(l => l.id !== id); setLeads(n); saveData('leads', n); };

  const addPayment = (p) => { const n = [...payments, { ...p, id: Date.now(), type: 'income' }]; setPayments(n); saveData('payments', n); if (p.studentId) giveBonus(p.studentId, 50, "To'lov bonusi"); };
  const addExpense = (e) => { const n = [...expenses, { ...e, id: Date.now(), type: 'expense' }]; setExpenses(n); saveData('expenses', n); };

  const markAttendance = (date, groupId, studentId, status) => {
    const clean = attendance.filter(a => !(a.date === date && a.studentId === studentId && a.groupId === groupId));
    const n = [...clean, { date, groupId, studentId, status }];
    setAttendance(n); saveData('attendance', n);
    if (status === 'present') giveBonus(studentId, 5, "Davomat bonusi");
  };

  return (
    <DataContext.Provider value={{
      currentUser, login, logout,
      theme, toggleTheme, storeName, setStoreName: updateStoreName,
      resetSystem, // 👈 RESET FUNKSIYASI EXPORT QILINDI
      students, addStudent, updateStudent, deleteStudent, giveBonus,
      groups, addGroup, updateGroup, deleteGroup,
      leads, addLead, deleteLead,
      payments, addPayment, expenses, addExpense,
      attendance, markAttendance
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);