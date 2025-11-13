import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';

/**
 * StatCard - Reusable component for displaying statistics/metrics
 * 
 * @param {string} title - The title/label of the stat
 * @param {string|number} value - The value to display
 * @param {ReactNode} icon - Icon component to display
 * @param {string} color - Color for the value and icon (hex color or theme color)
 * @param {number} changePercent - Percentage change to display as badge (optional)
 */
const StatCard = ({ title, value, icon, color, changePercent }) => {
  const theme = useTheme();
  const defaultColor = theme.palette.primary.light;
  const iconColor = color || defaultColor;

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
        borderRadius: theme.custom.borderRadius.card,
        boxShadow: theme.custom.shadows.card,
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
                bgcolor: theme.palette.primary.light,
                color: 'white',
                fontSize: '0.75rem',
                height: '20px',
                fontWeight: theme.custom.typography.fontWeight.medium,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography sx={{ fontSize: "1.8rem", fontWeight: theme.custom.typography.fontWeight.bold, color: theme.palette.custom.text.primary }}>
            {displayValue}
          </Typography>
          <Box sx={{ color: iconColor, ml: 'auto' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;

