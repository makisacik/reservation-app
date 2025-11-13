import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ConfirmApprovalDialog = ({ open, onClose, onConfirm, reservationNumber, isLoading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: '#0A1C59', pb: 2 }}>
        Rezervasyon Onaylama
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#E3F2FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 48,
                color: '#1976d2',
              }}
            />
          </Box>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#333', fontWeight: 600 }}>
            Rezervasyonu Onaylamak İstiyor musunuz?
          </Typography>
          {reservationNumber && (
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#F6F7FB',
                mb: 2,
                width: '100%',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Rezervasyon No
              </Typography>
              <Typography variant="body1" sx={{ color: '#0A1C59', fontWeight: 600 }}>
                {reservationNumber}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
            Onaylandıktan sonra rezervasyon durumu <strong>"Onaylandı"</strong> olarak güncellenecektir.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            color: '#666',
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
            bgcolor: '#1976d2',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            px: 3,
            '&:hover': {
              bgcolor: '#1565c0',
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

