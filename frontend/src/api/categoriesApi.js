import axiosClient from './axiosClient';

export const categoriesApi = {
  // Get all menu categories
  getCategories: async () => {
    const response = await axiosClient.get('/menu-categories');
    return response.data;
  },
};



