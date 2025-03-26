import api from './api';

export const taskService = {
  getAllTasks: () => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // Debug token
    return api.get('/tasks');
  },
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`)
};