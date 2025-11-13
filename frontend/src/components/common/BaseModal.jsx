import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * BaseModal - Reusable modal/dialog component with consistent structure
 * 
 * @param {boolean} open - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} actions - Action buttons (usually in DialogActions)
 * @param {string} maxWidth - Modal max width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'sm')
 * @param {boolean} showCloseButton - Whether to show close button in header (default: true)
 * @param {boolean} dividers - Whether to show dividers in DialogContent (default: true)
 */
const BaseModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  showCloseButton = true,
  dividers = true,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: theme.custom.borderRadius.card,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: showCloseButton ? 1 : 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: theme.custom.typography.fontWeight.semibold,
          }}
        >
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: theme.palette.custom.text.secondary,
              '&:hover': {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers={dividers}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ p: 2, pt: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BaseModal;

