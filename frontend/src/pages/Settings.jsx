import { Box, Typography, Paper } from '@mui/material';

const Settings = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Settings
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Settings page - Coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;

