import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, studentsAPI, teachersAPI, groupsAPI, paymentsAPI, leadsAPI, licensesAPI } from '../api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // --- MA'LUMOTLAR (Backenddan yuklanadi) ---
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [licenses, setLicenses] = useState([]);
  
  // Sozlamalar
  const [storeName, setStoreName] = useState('EduCore');
  const [theme, setTheme] = useState('light');

  // --- TARIFLAR (PLANS) ---
  const PLANS = {
    trial: { name: "Sinov", limitStudents: 10, limitGroups: 2 },
    start: { name: "Start", limitStudents: 50, limitGroups: 5 },
    pro: { name: "Pro", limitStudents: 200, limitGroups: 20 },
    business: { name: "Business", limitStudents: 1000, limitGroups: 100 }
  };

  // =========================================================================
  // 1. DASTUR OCHILGANDA (Token orqali sessionni tiklash)
  // =========================================================================
  useEffect(() => {
    const token = localStorage.getItem('educore_token');
    if (token) {
      authAPI.getMe()
        .then(user => {
          const userData = {
            id: user._id,
            username: user.username,
            plan: user.plan,
            role: user.role,
            storeName: user.storeName,
            theme: user.theme,
            subscriptionEnd: user.subscriptionEnd
          };
          localStorage.setItem('educore_active_session', JSON.stringify(userData));
          setSession({ user: userData });
          setCurrentUser(userData);
          setStoreName(user.storeName || 'EduCore');
          setTheme(user.theme || 'light');
        })
        .catch(() => {
          localStorage.removeItem('educore_token');
          localStorage.removeItem('educore_active_session');
        });
    }
  }, []);

  // =========================================================================
  // 2. MA'LUMOTLARNI BACKENDDAN YUKLASH
  // =========================================================================
  useEffect(() => {
    if (currentUser && currentUser.id) {
      Promise.all([
        studentsAPI.getAll(),
        groupsAPI.getAll(),
        teachersAPI.getAll(),
        paymentsAPI.getAll(),
        leadsAPI.getAll(),
        licensesAPI.getAll()
      ])
        .then(([studentsData, groupsData, teachersData, paymentsData, leadsData, licensesData]) => {
          setStudents(studentsData || []);
          setGroups(groupsData || []);
          setTeachers(teachersData || []);
          setPayments(paymentsData || []);
          setLeads(leadsData || []);
          setLicenses(licensesData || []);
        })
        .catch(err => console.error('Ma\'lumotlarni yuklashda xatolik:', err));
    } else {
      setStudents([]);
      setGroups([]);
      setTeachers([]);
      setPayments([]);
      setLeads([]);
      setLicenses([]);
    }
  }, [currentUser]);

  // =========================================================================
  // 3. AUTH FUNKSIYALARI (Backendga ulanish)
  // =========================================================================

  const login = async (username, password) => {
    if (!username || !password) {
      alert('Iltimos, login va parolni kiriting!');
      return false;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.login(username, password);
      
      localStorage.setItem('educore_token', response.token);
      
      const userData = {
        id: response.user.id,
        username: response.user.username,
        plan: response.user.plan,
        role: response.user.role,
        storeName: response.user.storeName,
        theme: response.user.theme,
        subscriptionEnd: response.user.subscriptionEnd
      };
      
      localStorage.setItem('educore_active_session', JSON.stringify(userData));
      setSession({ user: userData });
      setCurrentUser(userData);
      setStoreName(response.user.storeName || 'EduCore');
      setTheme(response.user.theme || 'light');
      
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      alert(err.message || 'Login xatolik!');
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('educore_token');
    localStorage.removeItem('educore_active_session');
    setSession(null);
    setCurrentUser(null);
    setStudents([]);
    setGroups([]);
    setTeachers([]);
    setPayments([]);
    setLeads([]);
    setLicenses([]);
  };

  const updateUserData = async (newData) => {
    if (!currentUser) return;
    
    try {
      if (newData.storeName || newData.theme) {
        await authAPI.updateSettings(newData.storeName, newData.theme);
      }
      
      const updated = { ...currentUser, ...newData };
      setCurrentUser(updated);
      localStorage.setItem('educore_active_session', JSON.stringify(updated));
      
      if (newData.storeName) setStoreName(newData.storeName);
      if (newData.theme) setTheme(newData.theme);
    } catch (err) {
      console.error('Sozlamalarni yangilashda xatolik:', err);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateUserData({ theme: newTheme });
  };
  
  const resetSystem = () => { 
    if (confirm('Barcha ma\'lumotlar o\'chirilsinmi?')) {
      logout();
    }
  };

  // --- LITSENZIYA LOGIKASI (Backend orqali) ---
  const createLicense = async (plan, type) => {
    try {
      const license = await licensesAPI.create(plan, type);
      setLicenses(prev => [...prev, license]);
      return license;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };

  const deleteLicense = async (id) => {
    try {
      await licensesAPI.delete(id);
      setLicenses(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const activateLicense = async (inputCode) => {
    try {
      const result = await licensesAPI.activate(inputCode);
      
      if (result.success) {
        const updatedUser = { 
          ...currentUser, 
          plan: result.user.plan, 
          subscriptionEnd: result.user.subscriptionEnd 
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('educore_active_session', JSON.stringify(updatedUser));
        
        const licensesData = await licensesAPI.getAll();
        setLicenses(licensesData || []);
        
        return { success: true, message: result.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // --- CRUD FUNKSIYALAR (Backend orqali) ---
  
  // Students
  const addStudent = async (data) => {
    try {
      const newStudent = await studentsAPI.create(data);
      setStudents(prev => [newStudent, ...prev]);
      return newStudent;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const updateStudent = async (updatedData) => {
    try {
      const updated = await studentsAPI.update(updatedData._id, updatedData);
      setStudents(prev => prev.map(s => s._id === updatedData._id ? updated : s));
      return updated;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const deleteStudent = async (id) => {
    try {
      await studentsAPI.delete(id);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Groups
  const addGroup = async (data) => {
    try {
      const newGroup = await groupsAPI.create(data);
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const deleteGroup = async (id) => {
    try {
      await groupsAPI.delete(id);
      setGroups(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Teachers
  const addTeacher = async (data) => {
    try {
      const newTeacher = await teachersAPI.create(data);
      setTeachers(prev => [newTeacher, ...prev]);
      return newTeacher;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const deleteTeacher = async (id) => {
    try {
      await teachersAPI.delete(id);
      setTeachers(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Payments
  const addPayment = async (data) => {
    try {
      const newPayment = await paymentsAPI.create(data);
      setPayments(prev => [newPayment, ...prev]);
      return newPayment;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };

  // Leads
  const addLead = async (data) => {
    try {
      const newLead = await leadsAPI.create(data);
      setLeads(prev => [newLead, ...prev]);
      return newLead;
    } catch (err) {
      alert(err.message);
      return null;
    }
  };
  
  const deleteLead = async (id) => {
    try {
      await leadsAPI.delete(id);
      setLeads(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const giveBonus = async (studentId, points, reason) => {
    const student = students.find(s => s._id === studentId);
    if (student) {
      const newScore = (parseInt(student.score) || 0) + parseInt(points);
      await updateStudent({ ...student, score: newScore });
    }
  };

  return (
    <DataContext.Provider value={{
      session, loading, currentUser, storeName, theme, PLANS, licenses,
      students, groups, teachers, payments, leads,
      login, logout, setStoreName, toggleTheme, updateUserData, resetSystem,
      createLicense, deleteLicense, activateLicense,
      addStudent, updateStudent, deleteStudent,
      addGroup, deleteGroup,
      addTeacher, deleteTeacher, 
      addLead, deleteLead, 
      addPayment, giveBonus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
