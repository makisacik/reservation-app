import axiosClient from './axiosClient';

export const reservationsApi = {
  // Get all reservations (Admin only)
  getReservations: async (queryParams = {}) => {
    const response = await axiosClient.get('/admin/reservations', { params: queryParams });
    return response.data;
  },

  // Get my reservations
  getMyReservations: async () => {
    const response = await axiosClient.get('/reservations/my');
    return response.data;
  },

  // Get reservation by ID
  getReservationById: async (id) => {
    const response = await axiosClient.get(`/reservations/${id}`);
    return response.data;
  },

  // Create reservation
  createReservation: async (reservationData) => {
    const response = await axiosClient.post('/reservations', reservationData);
    return response.data;
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    const response = await axiosClient.delete(`/reservations/${id}`);
    return response.data;
  },

  // Admin cancel reservation
  adminCancelReservation: async (id) => {
    const response = await axiosClient.put(`/admin/reservations/${id}/cancel`);
    return response.data;
  },
};

