import { Chip, useTheme } from '@mui/material';

/**
 * StatusBadge - Component for displaying reservation status badges
 * @param {string} status - Reservation status (Active, Pending, Cancelled)
 */
const StatusBadge = ({ status }) => {
  const theme = useTheme();
  const getStatusConfig = (status) => {
    // Normalize status to handle both string and numeric values, and both camelCase and PascalCase
    let normalizedStatus = status;
    
    // Handle numeric values (fallback for old data)
    if (typeof status === 'number') {
      normalizedStatus = status === 1 ? 'Active' : status === 2 ? 'Cancelled' : status === 3 ? 'Pending' : String(status);
    } else if (typeof status === 'string') {
      // Normalize string to PascalCase (handle both "Active" and "active")
      normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    switch (normalizedStatus) {
      case 'Active':
        return {
          label: 'Onaylandı',
          color: theme.palette.primary.main,
          bgColor: theme.palette.primary.main,
          textColor: '#ffffff',
        };
      case 'Pending':
        return {
          label: 'Beklemede',
          color: theme.palette.info.main,
          bgColor: theme.palette.info.main,
          textColor: '#ffffff',
        };
      case 'Cancelled':
        return {
          label: 'İptal',
          color: theme.palette.custom.text.secondary,
          bgColor: theme.palette.custom.text.secondary,
          textColor: '#ffffff',
        };
      default:
        return {
          label: String(status) || 'Bilinmiyor',
          color: theme.palette.custom.text.secondary,
          bgColor: theme.palette.custom.text.secondary,
          textColor: '#ffffff',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.textColor,
        fontWeight: theme.custom.typography.fontWeight.semibold,
        fontSize: '0.75rem',
        height: '28px',
        borderRadius: theme.custom.borderRadius.card,
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

export default StatusBadge;

