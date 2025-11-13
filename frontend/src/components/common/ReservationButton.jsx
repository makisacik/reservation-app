import { Button, Box, useTheme } from '@mui/material';

/**
 * ReservationButton - Reusable action button component
 * 
 * @param {string} label - Button text
 * @param {function} onClick - Click handler
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {string} variant - Button variant (default: contained)
 */
const ReservationButton = ({ 
  label = "Rezervasyon Yap", 
  onClick, 
  fullWidth = false,
  variant = "contained"
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Button
        variant={variant}
        onClick={onClick}
        fullWidth={fullWidth}
        sx={{
          bgcolor: variant === "contained" ? theme.palette.primary.main : "transparent",
          color: "white",
          fontWeight: theme.custom.typography.fontWeight.semibold,
          px: 4,
          py: 1.5,
          borderRadius: theme.custom.borderRadius.button,
          boxShadow: "none",
          textTransform: "none",
          fontSize: "0.95rem",
          border: variant === "outlined" ? `1px solid ${theme.palette.primary.main}` : "none",
          "&:hover": {
            bgcolor: variant === "contained" ? theme.palette.primary.dark : "rgba(10, 28, 89, 0.05)",
            boxShadow: "none",
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default ReservationButton;

