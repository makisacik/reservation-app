import { Grid, useTheme } from '@mui/material';
import StatCard from '../common/StatCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * StatsSection - Component for displaying statistics cards
 * 
 * @param {Object} stats - Stats object with totalMeals, mostPopular, preferenceRate, aperatifCount
 * @param {boolean} isLoading - Loading state
 */
const StatsSection = ({ stats, isLoading = false }) => {
  const theme = useTheme();
  const { totalMeals = 0, mostPopular = "", preferenceRate = 0, aperatifCount = 0 } = stats || {};
  
  // Display "N/A" if mostPopular is empty (no reservations yet)
  const displayMostPopular = mostPopular || "N/A";

  const statItems = [
    { 
      title: "Toplam Yemek", 
      value: totalMeals.toString(), 
      icon: <TrendingUpIcon />, 
      color: theme.palette.success.main
    },
    { 
      title: "En Popüler", 
      value: displayMostPopular, 
      icon: <PeopleIcon />, 
      color: theme.palette.primary.light
    },
    { 
      title: "Tercih Oranı", 
      value: `${preferenceRate}%`, 
      icon: <FavoriteIcon />, 
      color: theme.palette.error.main
    },
    { 
      title: "Aperatif", 
      value: aperatifCount.toString(), 
      icon: <CalendarTodayIcon />, 
      color: theme.palette.warning.main
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statItems.map((item, idx) => (
        <Grid item xs={6} md={3} key={idx}>
          <StatCard
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSection;

