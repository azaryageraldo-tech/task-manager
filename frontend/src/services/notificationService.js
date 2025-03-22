import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const notificationService = {
  getAllNotifications: async () => {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
    return response.data;
  }
};