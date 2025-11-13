import axiosClient from './axiosClient';

export const mealsApi = {
  // Get all meals with optional filters
  getMeals: async (restaurantId = null, categoryId = null) => {
    const params = {};
    if (restaurantId) params.restaurantId = restaurantId;
    if (categoryId) params.categoryId = categoryId;
    const response = await axiosClient.get('/meals', { params });
    return response.data;
  },
};

