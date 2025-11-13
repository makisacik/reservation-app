import { Box, Typography, useTheme } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * AlertBanner - Reusable alert/notification banner component
 * 
 * @param {string} title - The alert title
 * @param {string} message - The alert message
 * @param {string} bgColor - Background color (default: yellow)
 * @param {string} textColor - Text color (default: black)
 */
const AlertBanner = ({ 
  title, 
  message, 
  bgColor, 
  textColor 
}) => {
  const theme = useTheme();
  const defaultBgColor = bgColor || theme.palette.warning.main;
  const defaultTextColor = textColor || theme.palette.custom.text.primary;
  
  return (
    <Box
      sx={{
        bgcolor: defaultBgColor,
        color: defaultTextColor,
        p: 2,
        px: 3,
        borderRadius: theme.custom.borderRadius.card,
        maxWidth: "450px",
        boxShadow: theme.custom.shadows.button,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <WarningAmberIcon sx={{ mt: 0.5 }} />
        <Box>
          <Typography sx={{ fontWeight: theme.custom.typography.fontWeight.bold }}>{title}</Typography>
          <Typography>{message}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertBanner;

