import { useState, useMemo } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../api/reservationsApi';
import { menusApi } from '../api/menusApi';
import ReservationCard from '../components/reservations/ReservationCard';
import { convertUtcToLocal, isPast } from '../utils/timezone';

const MyReservations = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'

  // Fetch reservations
  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['myReservations'],
    queryFn: () => reservationsApi.getMyReservations(),
  });

  // Convert all reservation dates to local timezone and enrich with meal data
  const enrichedReservations = useMemo(() => {
    if (!reservations || reservations.length === 0) return [];

    return reservations.map((reservation) => {
      // Convert UTC date to local timezone
      const localDate = convertUtcToLocal(reservation.date);
      const menuDate = convertUtcToLocal(reservation.menuDate || reservation.date);

      // Validate dates
      if (!localDate || !localDate.isValid()) {
        console.warn('Invalid localDate for reservation:', reservation.id, reservation.date);
      }
      if (!menuDate || !menuDate.isValid()) {
        console.warn('Invalid menuDate for reservation:', reservation.id, reservation.menuDate || reservation.date);
      }

      return {
        ...reservation,
        localDate: localDate && localDate.isValid() ? localDate : null,
        menuDate: menuDate && menuDate.isValid() ? menuDate : null,
        isPastReservation: isPast(reservation.date),
      };
    });
  }, [reservations]);

  // Fetch menus for all reservations to get meal names
  // Group by date and restaurant to minimize API calls
  const uniqueMenuKeys = useMemo(() => {
    const keys = new Set();
    enrichedReservations.forEach((reservation) => {
      if (reservation.menuDate && reservation.menuDate.isValid() && reservation.restaurantId) {
        const dateStr = reservation.menuDate.format('YYYY-MM-DD');
        // Only add if date string is valid (not "Invalid Date")
        if (dateStr && dateStr !== 'Invalid Date' && dateStr.includes('-')) {
          // Use '|' as separator to avoid conflicts with date dashes and GUID dashes
          keys.add(`${dateStr}|${reservation.restaurantId}`);
        }
      }
    });
    return Array.from(keys);
  }, [enrichedReservations]);

  const menuQueries = useQuery({
    queryKey: ['reservationMenus', uniqueMenuKeys],
    queryFn: async () => {
      // Fetch all unique menus in parallel
      const menuPromises = uniqueMenuKeys.map(async (key) => {
        // Split by '|' separator (date|restaurantId)
        const [dateStr, restaurantId] = key.split('|');
        try {
          const menus = await menusApi.getMenus(dateStr, restaurantId);
          return { key, menu: menus[0] || null };
        } catch (error) {
          console.error(`Error fetching menu for ${key}:`, error);
          return { key, menu: null };
        }
      });

      const results = await Promise.all(menuPromises);
      const menuMap = new Map();
      
      results.forEach(({ key, menu }) => {
        if (menu) {
          menuMap.set(menu.id, menu);
          // Also store by key for lookup
          menuMap.set(key, menu);
        }
      });

      return menuMap;
    },
    enabled: uniqueMenuKeys.length > 0,
  });

  // Create a map of menuId to menu data for quick lookup
  const menuMap = useMemo(() => {
    if (!menuQueries.data) return new Map();
    return menuQueries.data;
  }, [menuQueries.data]);

  // Get meal name for a reservation
  const getMealName = (reservation) => {
    // Try to get menu by menuId first
    let menu = menuMap.get(reservation.menuId);
    
    // If not found, try to get by date and restaurant key
    if (!menu && reservation.menuDate && reservation.restaurantId) {
      const dateStr = reservation.menuDate.format('YYYY-MM-DD');
      const key = `${dateStr}|${reservation.restaurantId}`;
      menu = menuMap.get(key);
    }
    
    if (!menu || !menu.meals || menu.meals.length === 0) {
      return 'Menü';
    }
    
    // Combine meal names if multiple meals
    const mealNames = menu.meals.map(meal => meal.name).filter(Boolean);
    return mealNames.length > 0 ? mealNames.join(' & ') : 'Menü';
  };

  // Filter and sort reservations based on active tab
  const filteredReservations = useMemo(() => {
    let filtered = enrichedReservations.filter((reservation) => {
      if (activeTab === 'active') {
        // Active: Status is Active (1) AND date is today or future
        return reservation.status === 1 && !reservation.isPastReservation;
      } else {
        // Past: Status is Cancelled (2) OR date is in the past
        return reservation.status === 2 || reservation.isPastReservation;
      }
    });

    // Sort: active by date ascending, past by date descending
    filtered.sort((a, b) => {
      const dateA = a.localDate;
      const dateB = b.localDate;
      
      if (activeTab === 'active') {
        return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
      } else {
        return dateB.isBefore(dateA) ? -1 : dateB.isAfter(dateA) ? 1 : 0;
      }
    });

    return filtered;
  }, [enrichedReservations, activeTab]);

  const isLoadingMenus = menuQueries.isLoading;
  const isOverallLoading = isLoading || isLoadingMenus;

  return (
    <Box sx={{ flexGrow: 1, p: 4, bgcolor: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: '#0A1C59',
          mb: 1,
          fontSize: '2rem',
        }}
      >
        Rezervasyonlarım
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#9E9E9E',
          mb: 4,
          fontSize: '0.875rem',
        }}
      >
        Geçmiş ve aktif rezervasyonlarınız
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          onClick={() => setActiveTab('active')}
          sx={{
            bgcolor: activeTab === 'active' ? '#F5F2EF' : 'white',
            color: activeTab === 'active' ? '#0A1C59' : '#666',
            border: activeTab === 'active' ? 'none' : '1px solid #E0E0E0',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: activeTab === 'active' ? 600 : 400,
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: activeTab === 'active' ? '#F5F2EF' : '#F8F9FA',
            },
          }}
        >
          Aktif Rezervasyonlar
        </Button>
        <Button
          onClick={() => setActiveTab('past')}
          sx={{
            bgcolor: activeTab === 'past' ? '#F5F2EF' : 'white',
            color: activeTab === 'past' ? '#0A1C59' : '#666',
            border: activeTab === 'past' ? 'none' : '1px solid #E0E0E0',
            borderRadius: '12px',
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: activeTab === 'past' ? 600 : 400,
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: activeTab === 'past' ? '#F5F2EF' : '#F8F9FA',
            },
          }}
        >
          Geçmiş Rezervasyonlar
        </Button>
      </Box>

      {/* Loading State */}
      {isOverallLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#0A1C59' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Rezervasyonlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      )}

      {/* Empty State */}
      {!isOverallLoading && !error && filteredReservations.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: '#9E9E9E',
          }}
        >
          <Typography variant="body1">
            {activeTab === 'active'
              ? 'Aktif rezervasyonunuz bulunmamaktadır.'
              : 'Geçmiş rezervasyonunuz bulunmamaktadır.'}
          </Typography>
        </Box>
      )}

      {/* Reservations Grid */}
      {!isOverallLoading && !error && filteredReservations.length > 0 && (
        <Grid container spacing={3}>
          {filteredReservations.map((reservation) => (
            <Grid item xs={12} sm={6} key={reservation.id}>
              <ReservationCard
                reservation={reservation}
                mealName={getMealName(reservation)}
                isPast={reservation.isPastReservation}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyReservations;
