import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import Chart from '../components/Chart';
import { formatDate } from '../utils/helpers';

const Dashboard = () => {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });

  const { data: weeklyTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ['dashboard', 'weekly'],
    queryFn: () => dashboardApi.getWeeklyTrends(),
  });

  // Transform weekly trends data for chart
  const chartData = weeklyTrends?.map((trend) => ({
    name: formatDate(trend.weekStart, 'MMM DD'),
    value: trend.reservationCount,
    weekStart: trend.weekStart,
    weekEnd: trend.weekEnd,
  })) || [];

  const StatCard = ({ title, value, loading }) => (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom variant="body2">
          {title}
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4" component="div">
            {value || 0}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reservations"
            value={summary?.totalReservations}
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={summary?.totalUsers}
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Meals"
            value={summary?.totalMeals}
            loading={summaryLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Restaurants"
            value={summary?.totalRestaurants}
            loading={summaryLoading}
          />
        </Grid>

        {/* Weekly Trends Chart */}
        <Grid item xs={12} md={8}>
          <Chart
            title="Weekly Reservation Trends"
            data={chartData}
            type="line"
            dataKey="value"
            xAxisKey="name"
            loading={trendsLoading}
            height={400}
          />
        </Grid>

        {/* Popular Meals */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popular Meals
              </Typography>
              {summaryLoading ? (
                <CircularProgress />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Coming soon
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

