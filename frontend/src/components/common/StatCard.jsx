import { Card, CardContent, Typography, Box } from '@mui/material';

/**
 * StatCard - Reusable component for displaying statistics/metrics
 * 
 * @param {string} title - The title/label of the stat
 * @param {string|number} value - The value to display
 * @param {ReactNode} icon - Icon component to display
 * @param {string} color - Color for the value and icon (hex color)
 */
const StatCard = ({ title, value, icon, color = "#1665d8" }) => {
  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography color="text.secondary">{title}</Typography>
        <Box sx={{ mt: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold", color }}>
            {value}
          </Typography>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;

