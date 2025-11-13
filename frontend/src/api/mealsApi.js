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

  // Admin CRUD operations
  // Get all meals (admin endpoint with filters)
  getAdminMeals: async (restaurantId = null, categoryId = null) => {
    const params = {};
    if (restaurantId) params.restaurantId = restaurantId;
    if (categoryId) params.categoryId = categoryId;
    const response = await axiosClient.get('/admin/meals', { params });
    return response.data;
  },

  // Get single meal by ID
  getMealById: async (id) => {
    const response = await axiosClient.get(`/admin/meals/${id}`);
    return response.data;
  },

  // Create a new meal
  createMeal: async (mealData) => {
    const response = await axiosClient.post('/admin/meals', mealData);
    return response.data;
  },

  // Update an existing meal
  updateMeal: async (id, mealData) => {
    const response = await axiosClient.put(`/admin/meals/${id}`, mealData);
    return response.data;
  },

  // Delete a meal
  deleteMeal: async (id) => {
    await axiosClient.delete(`/admin/meals/${id}`);
  },
};

