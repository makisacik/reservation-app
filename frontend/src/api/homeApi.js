import axiosClient from './axiosClient';

export const homeApi = {
  // Get home page statistics
  getStats: async () => {
    const response = await axiosClient.get('/home/stats');
    return response.data;
  },
};

