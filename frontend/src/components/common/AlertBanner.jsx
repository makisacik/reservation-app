import { Box, Typography } from '@mui/material';
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
  bgColor = "#ffca28", 
  textColor = "#000" 
}) => {
  return (
    <Box
      sx={{
        bgcolor: bgColor,
        color: textColor,
        p: 2,
        px: 3,
        borderRadius: "20px",
        maxWidth: "450px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <WarningAmberIcon sx={{ mt: 0.5 }} />
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
          <Typography>{message}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AlertBanner;

