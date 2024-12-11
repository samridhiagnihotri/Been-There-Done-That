import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  shifts: {
    list: '/api/shifts',
    create: '/api/shifts',
    delete: (id) => `/api/shifts/${id}`,
    staff: (email) => `/api/shifts/staff/${email}`,
  },
  food: {
    list: '/api/food',
    create: '/api/food',
    update: (id) => `/api/food/${id}`,
    delete: (id) => `/api/food/${id}`,
  },
  users: {
    profile: '/api/users/profile',
    orders: '/api/users/profile/orders',
  },
};

export default api; 