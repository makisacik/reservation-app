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
    console.log('=== API CALL: createReservation ===');
    console.log('Request URL:', '/api/reservations');
    console.log('Request Method:', 'POST');
    console.log('Request Data:', reservationData);
    console.log('Date field details:', {
      value: reservationData.date,
      type: typeof reservationData.date,
      isString: typeof reservationData.date === 'string',
      length: reservationData.date?.length,
      isoFormat: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(reservationData.date),
    });
    
    try {
      const response = await axiosClient.post('/reservations', reservationData);
      console.log('=== API CALL SUCCESS ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== API CALL ERROR ===');
      console.error('Error Status:', error.response?.status);
      console.error('Error Data:', error.response?.data);
      console.error('Error Message:', error.message);
      throw error;
    }
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

  // Admin approve reservation
  approveReservation: async (id) => {
    const response = await axiosClient.put(`/admin/reservations/${id}/approve`);
    return response.data;
  },

  // Get reservation summary statistics
  getReservationSummary: async () => {
    const response = await axiosClient.get('/admin/reservations/summary');
    return response.data;
  },
};

