import { Box, Typography, Paper } from '@mui/material';

const MyReservations = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Rezervasyonlarım
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Rezervasyonlarım sayfası - Yakında
        </Typography>
      </Paper>
    </Box>
  );
};

export default MyReservations;

