import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserAvatar from './UserAvatar';
import StatusBadge from './StatusBadge';

const UserDetailModal = ({ open, onClose, user }) => {
  if (!user) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          fontWeight: 600,
          color: '#0A1C59',
        }}
      >
        Kullanıcı Detayları
        <Button
          onClick={onClose}
          sx={{ minWidth: 'auto', p: 0.5 }}
          color="inherit"
        >
          <CloseIcon />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* User Avatar and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserAvatar name={user.name} size={64} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1C59' }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* User Information */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                E-posta
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Departman
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.department || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Rol
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.role === 'Admin' ? 'Admin' : 'Kullanıcı'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Durum
              </Typography>
              <StatusBadge status={user.status} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Toplam Rezervasyon
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.totalReservations || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Kayıt Tarihi
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(user.createdAt)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#0A1C59',
            '&:hover': { bgcolor: '#0d2a7a' },
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;

