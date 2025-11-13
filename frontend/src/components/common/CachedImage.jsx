import { Box, CircularProgress, useTheme } from '@mui/material';
import { useImagePreloadSingle } from '../../hooks/useImagePreload';

/**
 * CachedImage - Component that preloads and displays images with caching support
 * 
 * @param {string} src - Image URL
 * @param {string} alt - Alt text for the image
 * @param {object} sx - MUI sx styling props
 * @param {object} style - Inline styles
 * @param {boolean} showLoadingPlaceholder - Whether to show loading placeholder
 * @param {string} loadingPlaceholder - Custom loading placeholder text
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails to load
 * @param {string} className - CSS class name
 * @param {object} imgProps - Additional props to pass to img element
 */
const CachedImage = ({
  src,
  alt = '',
  sx = {},
  style = {},
  showLoadingPlaceholder = true,
  loadingPlaceholder,
  onLoad,
  onError,
  className,
  ...imgProps
}) => {
  const theme = useTheme();
  const { isLoaded, error } = useImagePreloadSingle(src);

  const handleLoad = (e) => {
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleError = (e) => {
    if (onError) {
      onError(e);
    }
  };

  if (!src) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.custom?.background?.light || '#f5f5f5',
          color: theme.palette.text.secondary,
          ...sx,
        }}
        style={style}
        className={className}
      >
        {loadingPlaceholder || 'Resim Yok'}
      </Box>
    );
  }

  // Show loading placeholder while preloading
  if (showLoadingPlaceholder && !isLoaded && !error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.custom?.background?.light || '#f5f5f5',
          ...sx,
        }}
        style={style}
        className={className}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  // Show error placeholder if image failed to load
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.custom?.background?.light || '#f5f5f5',
          color: theme.palette.text.secondary,
          ...sx,
        }}
        style={style}
        className={className}
      >
        {loadingPlaceholder || 'Resim Yüklenemedi'}
      </Box>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      style={style}
      {...imgProps}
    />
  );
};

export default CachedImage;

