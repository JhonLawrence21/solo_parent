const API_BASE = '/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      throw new Error(data.error || 'Request failed');
    }
    return data;
  },
  
  auth: {
    register: (data) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => api.request('/auth/me')
  },
  
  applicants: {
    create: (data) => api.request('/applicants', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (params) => api.request(`/applicants?${new URLSearchParams(params)}`),
    getOne: (id) => api.request(`/applicants/${id}`),
    update: (id, data) => api.request(`/applicants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => api.request(`/applicants/${id}`, { method: 'DELETE' })
  },
  
  admin: {
    getUsers: () => api.request('/admin/users'),
    createUser: (data) => api.request('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id, data) => api.request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteUser: (id) => api.request(`/admin/users/${id}`, { method: 'DELETE' }),
    updateStatus: (id, data) => api.request(`/admin/applicants/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
    exportApplicantsCSV: (params) => api.request(`/reports/export/applicants/csv?${new URLSearchParams(params || {})}`)
  },
  
  dashboard: {
    getStats: () => api.request('/dashboard')
  },
  
  notifications: {
    getAll: (params) => api.request(`/notifications?${new URLSearchParams(params)}`),
    markRead: (id) => api.request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => api.request('/notifications/read-all', { method: 'PUT' })
  },
  
  reports: {
    getDemographics: () => api.request('/reports/demographics'),
    exportExcel: (params) => api.request(`/reports/export/excel?${new URLSearchParams(params)}`)
  }
};

window.api = api;
