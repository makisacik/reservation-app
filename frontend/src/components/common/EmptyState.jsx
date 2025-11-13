import { Paper, Typography, Box, useTheme } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * EmptyState - Reusable empty state component
 * 
 * @param {string} message - Message to display (default: 'No data available')
 * @param {string} icon - Optional icon component
 * @param {ReactNode} action - Optional action button/element
 */
const EmptyState = ({
  message = 'No data available',
  icon,
  action,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: theme.custom.borderRadius.card,
        boxShadow: theme.custom.shadows.card,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {icon || (
          <InboxIcon
            sx={{
              fontSize: 64,
              color: theme.palette.custom.text.secondary,
              opacity: 0.5,
            }}
          />
        )}
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        {action && <Box sx={{ mt: 1 }}>{action}</Box>}
      </Box>
    </Paper>
  );
};

export default EmptyState;

