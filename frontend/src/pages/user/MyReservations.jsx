import { useState, useMemo } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Alert, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservationsApi';
import { menusApi } from '../../api/menusApi';
import ReservationCard from '../../components/reservations/ReservationCard';
import { convertUtcToLocal, isPast } from '../../utils/timezone';

const MyReservations = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('active');

  const { data: reservations = [], isLoading, error } = useQuery({
    queryKey: ['myReservations'],
    queryFn: () => reservationsApi.getMyReservations(),
  });

  const enrichedReservations = useMemo(() => {
    if (!reservations || reservations.length === 0) return [];

    return reservations.map((reservation) => {
      const localDate = convertUtcToLocal(reservation.date);
      const menuDate = convertUtcToLocal(reservation.menuDate || reservation.date);

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

  const uniqueMenuKeys = useMemo(() => {
    const keys = new Set();
    enrichedReservations.forEach((reservation) => {
      if (reservation.menuDate && reservation.menuDate.isValid() && reservation.restaurantId) {
        const dateStr = reservation.menuDate.format('YYYY-MM-DD');
        if (dateStr && dateStr !== 'Invalid Date' && dateStr.includes('-')) {
          keys.add(`${dateStr}|${reservation.restaurantId}`);
        }
      }
    });
    return Array.from(keys);
  }, [enrichedReservations]);

  const menuQueries = useQuery({
    queryKey: ['reservationMenus', uniqueMenuKeys],
    queryFn: async () => {
      const menuPromises = uniqueMenuKeys.map(async (key) => {
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
          menuMap.set(key, menu);
        }
      });

      return menuMap;
    },
    enabled: uniqueMenuKeys.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes - extend cache for menu data
    gcTime: 60 * 60 * 1000, // 1 hour - keep in cache for 1 hour
  });

  // Create a map of menuId to menu data for quick lookup
  const menuMap = useMemo(() => {
    if (!menuQueries.data) return new Map();
    return menuQueries.data;
  }, [menuQueries.data]);

  const getMealName = (reservation) => {
    let menu = menuMap.get(reservation.menuId);
    
    if (!menu && reservation.menuDate && reservation.restaurantId) {
      const dateStr = reservation.menuDate.format('YYYY-MM-DD');
      const key = `${dateStr}|${reservation.restaurantId}`;
      menu = menuMap.get(key);
    }
    
    if (!menu || !menu.meals || menu.meals.length === 0) {
      return 'Menü';
    }
    
    const mealNames = menu.meals.map(meal => meal.name).filter(Boolean);
    return mealNames.length > 0 ? mealNames.join(' & ') : 'Menü';
  };

  const filteredReservations = useMemo(() => {
    let filtered = enrichedReservations.filter((reservation) => {
      if (activeTab === 'active') {
        const isPending = reservation.status === 3 || reservation.status === 'Pending';
        const isActive = reservation.status === 1 || reservation.status === 'Active';
        const isCancelled = reservation.status === 2 || reservation.status === 'Cancelled';
        
        return (isPending || isActive) && !isCancelled && !reservation.isPastReservation;
      } else {
        const isCancelled = reservation.status === 2 || reservation.status === 'Cancelled';
        return isCancelled || reservation.isPastReservation;
      }
    });

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
          fontWeight: theme.custom.typography.fontWeight.semibold,
          color: theme.palette.primary.main,
          mb: 1,
          fontSize: '2rem',
        }}
      >
        Rezervasyonlarım
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.custom.text.tertiary,
          mb: 4,
          fontSize: '0.875rem',
        }}
      >
        Geçmiş ve aktif rezervasyonlarınız
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button
          onClick={() => setActiveTab('active')}
          sx={{
            bgcolor: activeTab === 'active' ? theme.palette.custom.background.activeTab : 'white',
            color: activeTab === 'active' ? theme.palette.primary.main : theme.palette.custom.text.secondary,
            border: activeTab === 'active' ? 'none' : `1px solid ${theme.palette.custom.border.default}`,
            borderRadius: theme.custom.borderRadius.button,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: activeTab === 'active' ? theme.custom.typography.fontWeight.semibold : theme.custom.typography.fontWeight.regular,
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: activeTab === 'active' ? theme.palette.custom.background.activeTab : theme.palette.custom.background.inactiveTab,
            },
          }}
        >
          Aktif Rezervasyonlar
        </Button>
        <Button
          onClick={() => setActiveTab('past')}
          sx={{
            bgcolor: activeTab === 'past' ? theme.palette.custom.background.activeTab : 'white',
            color: activeTab === 'past' ? theme.palette.primary.main : theme.palette.custom.text.secondary,
            border: activeTab === 'past' ? 'none' : `1px solid ${theme.palette.custom.border.default}`,
            borderRadius: theme.custom.borderRadius.button,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: activeTab === 'past' ? theme.custom.typography.fontWeight.semibold : theme.custom.typography.fontWeight.regular,
            fontSize: '0.95rem',
            '&:hover': {
              bgcolor: activeTab === 'past' ? theme.palette.custom.background.activeTab : theme.palette.custom.background.inactiveTab,
            },
          }}
        >
          Geçmiş Rezervasyonlar
        </Button>
      </Box>

      {isOverallLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Rezervasyonlar yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
        </Alert>
      )}

      {!isOverallLoading && !error && filteredReservations.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: theme.palette.custom.text.tertiary,
          }}
        >
          <Typography variant="body1">
            {activeTab === 'active'
              ? 'Aktif rezervasyonunuz bulunmamaktadır.'
              : 'Geçmiş rezervasyonunuz bulunmamaktadır.'}
          </Typography>
        </Box>
      )}

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
