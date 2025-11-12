import axiosClient from './axiosClient';

export const settingsApi = {
  // Get general settings (Admin only)
  getGeneralSettings: async () => {
    const response = await axiosClient.get('/admin/settings/general');
    return response.data;
  },

  // Update general settings (Admin only)
  updateGeneralSettings: async (settings) => {
    const response = await axiosClient.put('/admin/settings/general', { settings });
    return response.data;
  },

  // Get reservation settings (Admin only)
  getReservationSettings: async () => {
    const response = await axiosClient.get('/admin/settings/reservation');
    return response.data;
  },

  // Update reservation settings (Admin only)
  updateReservationSettings: async (settings) => {
    const response = await axiosClient.put('/admin/settings/reservation', { settings });
    return response.data;
  },

  // Get notification settings (Admin only)
  getNotificationSettings: async () => {
    const response = await axiosClient.get('/admin/settings/notifications');
    return response.data;
  },

  // Update notification settings (Admin only)
  updateNotificationSettings: async (settings) => {
    const response = await axiosClient.put('/admin/settings/notifications', { settings });
    return response.data;
  },
};

