import { Button, Box } from '@mui/material';

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
  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Button
        variant={variant}
        onClick={onClick}
        fullWidth={fullWidth}
        sx={{
          bgcolor: variant === "contained" ? "#0A1C59" : "transparent",
          color: "white",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          borderRadius: "12px",
          boxShadow: "none",
          textTransform: "none",
          fontSize: "0.95rem",
          border: variant === "outlined" ? "1px solid #0A1C59" : "none",
          "&:hover": {
            bgcolor: variant === "contained" ? "#0d255f" : "rgba(10, 28, 89, 0.05)",
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

