import { Box, Typography, Paper } from '@mui/material';

const Reservations = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Reservations
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Reservations management page - Coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Reservations;

