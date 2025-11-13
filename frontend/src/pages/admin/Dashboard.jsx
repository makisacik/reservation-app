import { Box, Grid, Typography, CircularProgress, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api/dashboardApi';
import StatCard from '../../components/common/StatCard';
import TodayReservations from '../../components/dashboard/TodayReservations';
import PopularMenus from '../../components/dashboard/PopularMenus';
import WeeklySummary from '../../components/dashboard/WeeklySummary';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const theme = useTheme();
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });

  const { data: todayReservations, isLoading: todayReservationsLoading } = useQuery({
    queryKey: ['dashboard', 'today-reservations'],
    queryFn: () => dashboardApi.getTodayReservations(),
  });

  const { data: popularMeals, isLoading: popularMealsLoading } = useQuery({
    queryKey: ['dashboard', 'popular-meals'],
    queryFn: () => dashboardApi.getPopularMeals(4),
  });

  const { data: dailySummary, isLoading: dailySummaryLoading } = useQuery({
    queryKey: ['dashboard', 'daily-summary'],
    queryFn: () => dashboardApi.getDailySummary(),
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.custom.background.page, minHeight: 'calc(100vh - 64px)' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.custom.text.primary, mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yemek rezervasyon sistemi genel bakış
        </Typography>
      </Box>

      {/* Top Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Rezervasyon"
            value={summary?.totalReservations || 0}
            icon={<CalendarTodayIcon />}
            color={theme.palette.primary.light}
            changePercent={summary?.totalReservationsChangePercent}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Kullanıcı"
            value={summary?.activeUsers || 0}
            icon={<PeopleIcon />}
            color={theme.palette.primary.light}
            changePercent={summary?.activeUsersChangePercent}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Bugünkü Yemek"
            value={summary?.todayMeals || 0}
            icon={<RestaurantIcon />}
            color={theme.palette.primary.light}
            changePercent={summary?.todayMealsChangePercent}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aylık Maliyet"
            value={summary?.monthlyCost || 0}
            icon={<AttachMoneyIcon />}
            color={theme.palette.primary.light}
            changePercent={summary?.monthlyCostChangePercent}
          />
        </Grid>
      </Grid>

      {/* Middle Row: Today's Reservations and Popular Menus */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TodayReservations
            reservations={todayReservations || []}
            isLoading={todayReservationsLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PopularMenus
            popularMeals={popularMeals || []}
            isLoading={popularMealsLoading}
          />
        </Grid>
      </Grid>

      {/* Bottom Row: Weekly Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WeeklySummary
            dailyData={dailySummary || []}
            isLoading={dailySummaryLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
