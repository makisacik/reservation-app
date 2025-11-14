import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Box,
  Typography,
  Autocomplete,
  useTheme,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/usersApi';
import { restaurantsApi } from '../../api/restaurantsApi';
import { menusApi } from '../../api/menusApi';
import { mealTimeSlotsApi } from '../../api/mealTimeSlotsApi';
import { reservationsApi } from '../../api/reservationsApi';

const CreateReservationModal = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    userId: '',
    restaurantId: '',
    menuId: '',
    mealTimeSlotId: '',
    date: '',
    appetizer: false,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-list'],
    queryFn: () => usersApi.getFilteredUsers({ page: 1, pageSize: 1000 }),
    enabled: open,
  });

  const { data: restaurants = [], isLoading: restaurantsLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: () => restaurantsApi.getRestaurants(),
    enabled: open,
  });

  const { data: mealTimeSlots = [], isLoading: mealTimeSlotsLoading } = useQuery({
    queryKey: ['meal-time-slots'],
    queryFn: () => mealTimeSlotsApi.getMealTimeSlots(),
    enabled: open,
  });

  const { data: menus = [], isLoading: menusLoading } = useQuery({
    queryKey: ['menus', formData.restaurantId, formData.date],
    queryFn: () => {
      if (!formData.restaurantId || !formData.date) return [];
      return menusApi.getMenus(formData.date, formData.restaurantId);
    },
    enabled: open && !!formData.restaurantId && !!formData.date,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => reservationsApi.adminCreateReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-reservations']);
      queryClient.invalidateQueries(['reservation-summary']);
      setFormData({
        userId: '',
        restaurantId: '',
        menuId: '',
        mealTimeSlotId: '',
        date: '',
        appetizer: false,
      });
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    },
    onError: (error) => {
      console.error('Error creating reservation:', error);
    },
  });

  const users = usersData?.data || [];

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'restaurantId') {
        updated.menuId = '';
      }
      if (field === 'date') {
        updated.menuId = '';
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    if (!formData.userId || !formData.restaurantId || !formData.menuId || !formData.mealTimeSlotId || !formData.date) {
      return;
    }

    const date = new Date(formData.date);
    const formattedDate = date.toISOString();

    const reservationData = {
      userId: formData.userId,
      restaurantId: formData.restaurantId,
      menuId: formData.menuId,
      mealTimeSlotId: parseInt(formData.mealTimeSlotId),
      date: formattedDate,
      appetizer: formData.appetizer,
    };

    createMutation.mutate(reservationData);
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      setFormData({
        userId: '',
        restaurantId: '',
        menuId: '',
        mealTimeSlotId: '',
        date: '',
        appetizer: false,
      });
      onClose();
    }
  };

  const isLoading = usersLoading || restaurantsLoading || mealTimeSlotsLoading || menusLoading || createMutation.isPending;
  const isFormValid = formData.userId && formData.restaurantId && formData.menuId && formData.mealTimeSlotId && formData.date;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main, pb: 2 }}>
        Yeni Rezervasyon Oluştur
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={users.find((u) => u.id === formData.userId) || null}
              onChange={(event, newValue) => handleChange('userId', newValue?.id || '')}
              loading={usersLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Kullanıcı"
                  required
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Tarih"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Restoran</InputLabel>
              <Select
                value={formData.restaurantId}
                onChange={(e) => handleChange('restaurantId', e.target.value)}
                label="Restoran"
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {restaurants.map((restaurant) => (
                  <MenuItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Öğün</InputLabel>
              <Select
                value={formData.mealTimeSlotId}
                onChange={(e) => handleChange('mealTimeSlotId', e.target.value)}
                label="Öğün"
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {mealTimeSlots.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    {slot.turkishName || slot.name} {slot.formattedTimeRange && `(${slot.formattedTimeRange})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Menü</InputLabel>
              <Select
                value={formData.menuId}
                onChange={(e) => handleChange('menuId', e.target.value)}
                label="Menü"
                disabled={!formData.restaurantId || !formData.date || menus.length === 0}
              >
                <MenuItem value="">Seçiniz</MenuItem>
                {menus.map((menu) => (
                  <MenuItem key={menu.id} value={menu.id}>
                    {menu.meals?.map((meal) => meal.name).join(' & ') || `Menü - ${menu.date}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={formData.appetizer}
                  onChange={(e) => handleChange('appetizer', e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <Typography variant="body2">Çorba İstiyorum</Typography>
              </label>
            </FormControl>
          </Grid>
        </Grid>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {createMutation.isError && (
          <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.custom.background.errorLight, borderRadius: theme.custom.borderRadius.input }}>
            <Typography color="error" variant="body2">
              {createMutation.error?.response?.data?.message || 'Rezervasyon oluşturulurken bir hata oluştu'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={createMutation.isPending}>
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || createMutation.isPending}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              bgcolor: theme.palette.primary.darker,
            },
          }}
        >
          {createMutation.isPending ? <CircularProgress size={20} /> : 'Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReservationModal;

