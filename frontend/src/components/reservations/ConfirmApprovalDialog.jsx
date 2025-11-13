import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ConfirmApprovalDialog = ({ open, onClose, onConfirm, reservationNumber, isLoading }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.custom.borderRadius.card,
          boxShadow: theme.custom.shadows.modal,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: theme.custom.typography.fontWeight.semibold, color: theme.palette.primary.main, pb: 2 }}>
        Rezervasyon Onaylama
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: theme.custom.borderRadius.circular,
              bgcolor: theme.palette.info.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 48,
                color: theme.palette.info.main,
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: theme.palette.custom.text.primary, fontWeight: theme.custom.typography.fontWeight.semibold }}>
            Rezervasyonu Onaylamak İstiyor musunuz?
          </Typography>
          {reservationNumber && (
            <Box
              sx={{
                p: 2,
                borderRadius: theme.custom.borderRadius.button,
                bgcolor: theme.palette.custom.background.page,
                mb: 2,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.custom.text.secondary, mb: 0.5 }}>
                Rezervasyon No
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.primary.main, fontWeight: theme.custom.typography.fontWeight.semibold }}>
                {reservationNumber}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: theme.palette.custom.text.secondary, textAlign: 'center' }}>
            Onaylandıktan sonra rezervasyon durumu <strong>"Onaylandı"</strong> olarak güncellenecektir.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            borderRadius: theme.custom.borderRadius.button,
            textTransform: 'none',
            px: 3,
            color: theme.palette.custom.text.secondary,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          İptal
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          startIcon={<CheckCircleIcon />}
          sx={{
            bgcolor: theme.palette.info.main,
            color: 'white',
            borderRadius: theme.custom.borderRadius.button,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: theme.palette.info.dark,
            },
          }}
        >
          {isLoading ? 'Onaylanıyor...' : 'Onayla'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmApprovalDialog;

