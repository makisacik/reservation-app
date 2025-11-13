import { Box, useTheme } from '@mui/material';

/**
 * PageContainer - Reusable page container with consistent spacing and layout
 * 
 * @param {ReactNode} children - Page content
 * @param {number} maxWidth - Max width in pixels (default: 1300)
 * @param {string} bgColor - Background color (default: theme background)
 * @param {boolean} padding - Whether to add padding (default: true)
 */
const PageContainer = ({
  children,
  maxWidth = 1300,
  bgColor,
  padding = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: bgColor || theme.palette.custom.background.page,
        minHeight: '100vh',
        p: padding ? 3 : 0,
      }}
    >
      <Box
        sx={{
          maxWidth: `${maxWidth}px`,
          margin: '0 auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;

