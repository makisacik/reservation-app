import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  Divider,
  Paper,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { reservationsApi } from '../../api/reservationsApi';
import StatusBadge from './StatusBadge';

// Turkish day names and months
const TURKISH_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const formatDateTurkish = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateTimeTurkish = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = TURKISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const ReservationDetailModal = ({ open, onClose, reservationId }) => {
  const theme = useTheme();
  const { data: reservation, isLoading } = useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: () => reservationsApi.getReservationById(reservationId),
    enabled: open && !!reservationId,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main, pb: 2 }}>
        Rezervasyon Detayları
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : reservation ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: theme.custom.borderRadius.button,
                  bgcolor: theme.palette.custom.background.page,
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Rezervasyon No
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main }}>
                  {reservation.reservationNumber}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Kullanıcı
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {reservation.userName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Durum
              </Typography>
              <StatusBadge status={reservation.status} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Tarih
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {formatDateTurkish(reservation.date)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Öğün
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {reservation.mealTimeSlotName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Restoran
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {reservation.restaurantName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Menü
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {reservation.menuName || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Çorba
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: theme.custom.typography.fontWeight.medium }}>
                {reservation.appetizer ? 'Evet' : 'Hayır'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Oluşturulma Tarihi
              </Typography>
              <Typography variant="body2">
                {formatDateTimeTurkish(reservation.createdAt)}
              </Typography>
            </Grid>
            {reservation.updatedAt && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Güncellenme Tarihi
                </Typography>
                <Typography variant="body2">
                  {formatDateTimeTurkish(reservation.updatedAt)}
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <Typography color="text.secondary">Rezervasyon bulunamadı</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: theme.palette.primary.main }}>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDetailModal;

