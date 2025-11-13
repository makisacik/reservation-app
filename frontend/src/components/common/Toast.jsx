import { Snackbar, Alert } from '@mui/material';

/**
 * Toast - Reusable notification/toast component
 * 
 * @param {boolean} open - Whether the toast is open
 * @param {string} message - Message to display
 * @param {string} severity - Alert severity: 'success' | 'error' | 'warning' | 'info'
 * @param {function} onClose - Close handler
 * @param {number} autoHideDuration - Auto hide duration in ms (default: 6000)
 * @param {string} anchorVertical - Vertical position: 'top' | 'bottom' (default: 'bottom')
 * @param {string} anchorHorizontal - Horizontal position: 'left' | 'center' | 'right' (default: 'right')
 */
const Toast = ({
  open,
  message,
  severity = 'info',
  onClose,
  autoHideDuration = 6000,
  anchorVertical = 'bottom',
  anchorHorizontal = 'right',
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: anchorVertical, horizontal: anchorHorizontal }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

