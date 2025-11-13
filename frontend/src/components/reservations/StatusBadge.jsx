import { Chip } from '@mui/material';

/**
 * StatusBadge - Component for displaying reservation status badges
 * @param {string} status - Reservation status (Active, Pending, Cancelled)
 */
const StatusBadge = ({ status }) => {
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
          label: String(status) || 'Bilinmiyor',
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

