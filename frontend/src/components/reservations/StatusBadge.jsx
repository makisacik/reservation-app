import { Chip } from '@mui/material';

/**
 * StatusBadge - Component for displaying reservation status badges
 * @param {string} status - Reservation status (Active, Pending, Cancelled)
 */
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return {
          label: 'Onaylandı',
          color: '#0A1C59',
          bgColor: '#0A1C59',
          textColor: '#ffffff',
        };
      case 'Pending':
        return {
          label: 'Beklemede',
          color: '#1976d2',
          bgColor: '#1976d2',
          textColor: '#ffffff',
        };
      case 'Cancelled':
        return {
          label: 'İptal',
          color: '#757575',
          bgColor: '#757575',
          textColor: '#ffffff',
        };
      default:
        return {
          label: status || 'Bilinmiyor',
          color: '#757575',
          bgColor: '#757575',
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
        fontWeight: 600,
        fontSize: '0.75rem',
        height: '28px',
        borderRadius: '20px',
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

export default StatusBadge;

