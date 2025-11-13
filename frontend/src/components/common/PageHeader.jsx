import { Box, Typography, Button, useTheme } from '@mui/material';

/**
 * PageHeader - Reusable page header component
 * 
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle
 * @param {ReactNode} action - Optional action button/element
 * @param {string} variant - Typography variant (default: 'h4')
 */
const PageHeader = ({
  title,
  subtitle,
  action,
  variant = 'h4',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: subtitle ? 'flex-start' : 'center',
        mb: 3,
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant={variant}
          sx={{
            fontWeight: theme.custom.typography.fontWeight.semibold,
            color: theme.palette.primary.main,
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default PageHeader;

