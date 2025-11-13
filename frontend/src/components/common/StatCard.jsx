import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

/**
 * StatCard - Reusable component for displaying statistics/metrics
 * 
 * @param {string} title - The title/label of the stat
 * @param {string|number} value - The value to display
 * @param {ReactNode} icon - Icon component to display
 * @param {string} color - Color for the value and icon (hex color)
 * @param {number} changePercent - Percentage change to display as badge (optional)
 */
const StatCard = ({ title, value, icon, color = "#1665d8", changePercent }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString('tr-TR');
    }
    return val;
  };

  const formatCurrency = (val) => {
    if (typeof val === 'number') {
      return `₺${val.toLocaleString('tr-TR')}`;
    }
    return val;
  };

  const displayValue = title.includes('Maliyet') || title.includes('Cost') 
    ? formatCurrency(value) 
    : formatValue(value);

  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        bgcolor: 'white',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            color="text.secondary" 
            variant="body2"
            sx={{ fontSize: '0.875rem' }}
          >
            {title}
          </Typography>
          {changePercent !== undefined && (
            <Chip
              label={`${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(0)}%`}
              size="small"
              sx={{
                bgcolor: '#1665d8',
                color: 'white',
                fontSize: '0.75rem',
                height: '20px',
                fontWeight: 500,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold", color: '#333' }}>
            {displayValue}
          </Typography>
          <Box sx={{ color, ml: 'auto' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;

