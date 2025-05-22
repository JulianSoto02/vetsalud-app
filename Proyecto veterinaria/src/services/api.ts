import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const appointments = {
  getAll: () => api.get('/appointments'),
  create: (data: any) => api.post('/appointments', data),
  update: (id: number, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};

export const medicalRecords = {
  getAll: () => api.get('/medical-records'),
  create: (data: any) => api.post('/medical-records', data),
  update: (id: number, data: any) => api.put(`/medical-records/${id}`, data),
  delete: (id: number) => api.delete(`/medical-records/${id}`),
};

export const vaccinations = {
  getAll: () => api.get('/vaccinations'),
  create: (data: any) => api.post('/vaccinations', data),
  update: (id: number, data: any) => api.put(`/vaccinations/${id}`, data),
  delete: (id: number) => api.delete(`/vaccinations/${id}`),
};

export const users = {
  getAll: () => api.get('/users'),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
};

export const notifications = {
  getAll: () => api.get('/notifications'),
  create: (data: any) => api.post('/notifications', data),
  update: (id: number, data: any) => api.put(`/notifications/${id}`, data),
  delete: (id: number) => api.delete(`/notifications/${id}`),
};

export default api;