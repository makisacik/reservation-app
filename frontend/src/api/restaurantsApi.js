import axiosClient from './axiosClient';

export const restaurantsApi = {
  // Get all restaurants
  getRestaurants: async () => {
    const response = await axiosClient.get('/restaurants');
    return response.data;
  },
};

