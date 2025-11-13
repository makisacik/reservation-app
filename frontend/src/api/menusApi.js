import axiosClient from './axiosClient';

export const menusApi = {
  // Get menus with optional filters
  getMenus: async (date = null, restaurantId = null) => {
    const params = {};
    if (date) params.date = date;
    if (restaurantId) params.restaurantId = restaurantId;
    const response = await axiosClient.get('/menus', { params });
    return response.data;
  },

  // Get today's menu
  getTodayMenu: async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await axiosClient.get('/menus', {
      params: { date: today },
    });
    return response.data;
  },
};

