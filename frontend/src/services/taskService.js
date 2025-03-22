import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const taskService = {
  // Task CRUD operations
  getAllTasks: async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  // Subtask operations
  createSubtask: async (subtaskData) => {
    const response = await axios.post(`${API_URL}/subtasks`, subtaskData);
    return response.data;
  },

  getSubtasksByTaskId: async (taskId) => {
    const response = await axios.get(`${API_URL}/subtasks/task/${taskId}`);
    return response.data;
  },

  // Task sharing
  shareTask: async (shareData) => {
    const response = await axios.post(`${API_URL}/shares`, shareData);
    return response.data;
  },

  getSharedTasks: async () => {
    const response = await axios.get(`${API_URL}/shares/shared-with-me`);
    return response.data;
  }
};