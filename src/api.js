// API helper for backend communication
const API_URL = '/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('educore_token');

// Generic fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: (username, password) => 
    apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  
  register: (username, password, storeName) => 
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ username, password, storeName }) }),
  
  getMe: () => apiFetch('/auth/me'),
  
  updateSettings: (storeName, theme) => 
    apiFetch('/auth/settings', { method: 'PUT', body: JSON.stringify({ storeName, theme }) })
};

// Students API
export const studentsAPI = {
  getAll: () => apiFetch('/students'),
  getById: (id) => apiFetch(`/students/${id}`),
  create: (data) => apiFetch('/students', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/students/${id}`, { method: 'DELETE' })
};

// Teachers API
export const teachersAPI = {
  getAll: () => apiFetch('/teachers'),
  create: (data) => apiFetch('/teachers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/teachers/${id}`, { method: 'DELETE' })
};

// Groups API
export const groupsAPI = {
  getAll: () => apiFetch('/groups'),
  getById: (id) => apiFetch(`/groups/${id}`),
  create: (data) => apiFetch('/groups', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/groups/${id}`, { method: 'DELETE' })
};

// Payments API
export const paymentsAPI = {
  getAll: () => apiFetch('/payments'),
  create: (data) => apiFetch('/payments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/payments/${id}`, { method: 'DELETE' })
};

// Leads API
export const leadsAPI = {
  getAll: () => apiFetch('/leads'),
  create: (data) => apiFetch('/leads', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/leads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/leads/${id}`, { method: 'DELETE' })
};

// Licenses API
export const licensesAPI = {
  getAll: () => apiFetch('/licenses'),
  create: (plan, type) => apiFetch('/licenses', { method: 'POST', body: JSON.stringify({ plan, type }) }),
  activate: (code) => apiFetch('/licenses/activate', { method: 'POST', body: JSON.stringify({ code }) }),
  delete: (id) => apiFetch(`/licenses/${id}`, { method: 'DELETE' })
};

// Attendance API
export const attendanceAPI = {
  getAll: () => apiFetch('/attendance'),
  create: (data) => apiFetch('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  getByGroup: (groupId) => apiFetch(`/attendance/group/${groupId}`)
};

export default API_URL;
