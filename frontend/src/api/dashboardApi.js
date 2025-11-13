import axiosClient from './axiosClient';

export const dashboardApi = {
  // Get dashboard summary (Admin only)
  getSummary: async () => {
    const response = await axiosClient.get('/admin/dashboard/summary');
    return response.data;
  },

  // Get popular meals (Admin only)
  getPopularMeals: async (count = 10) => {
    const response = await axiosClient.get('/admin/dashboard/popular-meals', {
      params: { count },
    });
    return response.data;
  },

  // Get weekly trends (Admin only)
  getWeeklyTrends: async (startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await axiosClient.get('/admin/dashboard/weekly', { params });
    return response.data;
  },

  // Get today's reservations grouped by time slot (Admin only)
  getTodayReservations: async () => {
    const response = await axiosClient.get('/admin/dashboard/today-reservations');
    return response.data;
  },

  // Get daily summary for current week (Admin only)
  getDailySummary: async () => {
    const response = await axiosClient.get('/admin/dashboard/daily-summary');
    return response.data;
  },
};

