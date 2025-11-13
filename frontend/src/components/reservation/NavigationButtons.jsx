import { Box, Button, useTheme } from '@mui/material';

const NavigationButtons = ({ currentStep, onBack, onNext, canGoNext = true, nextLabel = 'İleri', backLabel = 'Geri' }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 4,
        gap: 2,
      }}
    >
      {currentStep > 1 && (
        <Button
          onClick={onBack}
          variant="outlined"
          sx={{
            borderRadius: theme.custom.borderRadius.button,
            px: 4,
            py: 1.5,
            borderColor: theme.palette.custom.border.default,
            color: theme.palette.custom.text.primary,
            textTransform: 'none',
            fontWeight: theme.custom.typography.fontWeight.medium,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              bgcolor: 'rgba(10, 28, 89, 0.04)',
            },
          }}
        >
          {backLabel}
        </Button>
      )}
      <Box sx={{ flex: 1 }} />
      <Button
        onClick={onNext}
        disabled={!canGoNext}
        variant="contained"
        sx={{
          borderRadius: theme.custom.borderRadius.button,
          px: 4,
          py: 1.5,
          bgcolor: theme.palette.primary.main,
          color: 'white',
          textTransform: 'none',
          fontWeight: theme.custom.typography.fontWeight.medium,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
          '&:disabled': {
            bgcolor: theme.palette.custom.border.default,
            color: theme.palette.custom.text.quaternary,
          },
        }}
      >
        {nextLabel}
      </Button>
    </Box>
  );
};

export default NavigationButtons;

