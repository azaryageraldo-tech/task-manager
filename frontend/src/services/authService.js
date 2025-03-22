import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Tambahkan di bagian atas file, setelah import
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    // Gunakan data dari localStorage sebagai gantinya
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Tambah ini
    delete axios.defaults.headers.common['Authorization'];
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  setAuthToken: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`); // Ubah dari /auth/me ke /auth/profile
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};