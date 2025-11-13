import { Grid } from '@mui/material';
import StatCard from '../common/StatCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

/**
 * StatsSection - Component for displaying statistics cards
 * 
 * @param {Object} stats - Stats object with totalMeals, mostPopular, preferenceRate, aperatifCount
 */
const StatsSection = ({ stats }) => {
  const { totalMeals, mostPopular, preferenceRate, aperatifCount } = stats;

  const statItems = [
    { 
      title: "Toplam Yemek", 
      value: totalMeals.toString(), 
      icon: <TrendingUpIcon />, 
      color: "#4caf50" 
    },
    { 
      title: "En Popüler", 
      value: mostPopular, 
      icon: <PeopleIcon />, 
      color: "#1665d8" 
    },
    { 
      title: "Tercih Oranı", 
      value: `${preferenceRate}%`, 
      icon: <FavoriteIcon />, 
      color: "#e53935" 
    },
    { 
      title: "Aperatif", 
      value: aperatifCount.toString(), 
      icon: <CalendarTodayIcon />, 
      color: "#fb8c00" 
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

