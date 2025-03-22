import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const categoryService = {
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
  }
};