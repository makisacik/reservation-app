import { Box, Typography, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const steps = [
  { label: 'Tarih', number: 1 },
  { label: 'Restoran', number: 2 },
  { label: 'Menü Tipi', number: 3 },
  { label: 'Menü', number: 4 },
  { label: 'Onay', number: 5 },
];

const ReservationStepper = ({ currentStep }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
        position: 'relative',
        width: '100%',
      }}
    >
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isPending = step.number > currentStep;

        return (
          <Box
            key={step.number}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              position: 'relative',
            }}
          >
            {/* Step Circle */}
            <Box
              sx={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: isCompleted
                  ? theme.palette.primary.main
                  : isActive
                  ? theme.palette.primary.main
                  : theme.palette.custom.border.default,
                color: isCompleted || isActive ? 'white' : theme.palette.custom.text.quaternary,
                fontWeight: theme.custom.typography.fontWeight.semibold,
                fontSize: '16px',
                mb: 1,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {isCompleted ? (
                <CheckIcon sx={{ fontSize: '24px' }} />
              ) : (
                step.number
              )}
            </Box>

            {/* Step Label */}
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: isActive ? theme.custom.typography.fontWeight.semibold : theme.custom.typography.fontWeight.regular,
                color: isCompleted || isActive ? theme.palette.primary.main : theme.palette.custom.text.quaternary,
                textAlign: 'center',
              }}
            >
              {step.label}
            </Typography>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '24px',
                  left: '50%',
                  width: 'calc(100% - 48px)',
                  height: '2px',
                  bgcolor: isCompleted ? theme.palette.primary.main : theme.palette.custom.border.default,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default ReservationStepper;

