import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Add timeout
});

// Modify interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const taskService = {
  getAllTasks: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.get('/tasks');
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      if (error.response?.status === 500) {
        console.error('Server Error:', error.response.data);
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskById: (id) => api.get(`/tasks/${id}`)
};

export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  createCategory: (category) => api.post('/categories', category),
  updateCategory: (id, category) => api.put(`/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

export default api;