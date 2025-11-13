import { Button } from '@mui/material';

const StatusBadge = ({ status }) => {
  const isActive = status === 'Active' || status === 1;

  return (
    <Button
      variant="contained"
      disabled
      sx={{
        bgcolor: isActive ? '#0A1C59' : '#4A90E2',
        color: 'white',
        textTransform: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        px: 2,
        py: 0.5,
        minWidth: 'auto',
        '&.Mui-disabled': {
          bgcolor: isActive ? '#0A1C59' : '#4A90E2',
          color: 'white',
        },
      }}
    >
      {isActive ? 'Aktif' : 'Pasif'}
    </Button>
  );
};

export default StatusBadge;

