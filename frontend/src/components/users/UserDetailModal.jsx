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
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserAvatar from './UserAvatar';
import StatusBadge from './StatusBadge';

const UserDetailModal = ({ open, onClose, user }) => {
  const theme = useTheme();
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
          fontWeight: theme.custom.typography.fontWeight.semibold,
          color: theme.palette.primary.main,
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
              <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main }}>
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
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Departman
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {user.department || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Rol
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
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
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {user.totalReservations || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Kayıt Tarihi
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
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
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.darker },
          }}
        >
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;

