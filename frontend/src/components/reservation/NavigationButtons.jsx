import { Box, Button } from '@mui/material';

const NavigationButtons = ({ currentStep, onBack, onNext, canGoNext = true, nextLabel = 'İleri', backLabel = 'Geri' }) => {
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
            borderRadius: '12px',
            px: 4,
            py: 1.5,
            borderColor: '#E0E0E0',
            color: '#333',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#0A1C59',
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
          borderRadius: '12px',
          px: 4,
          py: 1.5,
          bgcolor: '#0A1C59',
          color: 'white',
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            bgcolor: '#0d2569',
          },
          '&:disabled': {
            bgcolor: '#E0E0E0',
            color: '#999',
          },
        }}
      >
        {nextLabel}
      </Button>
    </Box>
  );
};

export default NavigationButtons;

