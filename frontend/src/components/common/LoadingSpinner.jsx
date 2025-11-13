import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

/**
 * LoadingSpinner - Reusable loading component
 * 
 * @param {boolean} loading - Whether to show loading state
 * @param {ReactNode} children - Content to show when not loading
 * @param {string} message - Optional loading message
 * @param {string} size - Spinner size: 'small' | 'medium' | 'large' (default: 'medium')
 * @param {boolean} fullScreen - Whether to show full screen overlay (default: false)
 */
const LoadingSpinner = ({
  loading,
  children,
  message,
  size = 'medium',
  fullScreen = false,
}) => {
  const theme = useTheme();
  
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  if (!loading) {
    return children || null;
  }

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
        }}
      >
        <CircularProgress size={sizeMap[size]} />
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
      }}
    >
      <CircularProgress size={sizeMap[size]} />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;

