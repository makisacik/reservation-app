import axiosClient from './axiosClient';

export const usersApi = {
  // Get current user
  getCurrentUser: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await axiosClient.get('/users');
    return response.data;
  },

  // Get filtered users (Admin only)
  getFilteredUsers: async (filter = {}) => {
    const response = await axiosClient.get('/admin/users', { params: filter });
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (id) => {
    const response = await axiosClient.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    const response = await axiosClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Update user role (Admin only)
  updateUserRole: async (id, roleData) => {
    const response = await axiosClient.put(`/users/${id}/role`, roleData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    const response = await axiosClient.delete(`/admin/users/${id}`);
    return response.data;
  },
};

