import { Button, useTheme } from '@mui/material';

const StatusBadge = ({ status }) => {
  const theme = useTheme();
  const isActive = status === 'Active' || status === 1;

  return (
    <Button
      variant="contained"
      disabled
      sx={{
        bgcolor: isActive ? theme.palette.primary.main : theme.palette.info.light,
        color: 'white',
        textTransform: 'none',
        fontSize: '0.875rem',
        fontWeight: theme.custom.typography.fontWeight.medium,
        px: 2,
        py: 0.5,
        minWidth: 'auto',
        '&.Mui-disabled': {
          bgcolor: isActive ? theme.palette.primary.main : theme.palette.info.light,
          color: 'white',
        },
      }}
    >
      {isActive ? 'Aktif' : 'Pasif'}
    </Button>
  );
};

export default StatusBadge;

