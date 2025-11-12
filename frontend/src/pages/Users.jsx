import { Box, Typography, Paper } from '@mui/material';

const Users = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Users
      </Typography>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Users management page - Coming soon
        </Typography>
      </Paper>
    </Box>
  );
};

export default Users;

