import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { typography as typographyConfig } from './typography';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
    },
    error: {
      main: colors.error.main,
    },
    warning: {
      main: colors.warning.main,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    // Extend palette with custom colors
    custom: {
      background: colors.background,
      text: colors.text,
      border: colors.border,
      gradients: colors.gradients,
      onboarding: colors.onboarding,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.tight,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.normal,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.relaxed,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.relaxed,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.loose,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: typographyConfig.fontWeight.semibold,
      lineHeight: typographyConfig.lineHeight.loose,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: typographyConfig.lineHeight.loose,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: typographyConfig.fontWeight.medium,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    shadows.card,
    shadows.cardElevated,
    shadows.button,
    shadows.input,
    shadows.modal,
    shadows.cardHover,
    shadows.buttonHover,
    shadows.inputHover,
    shadows.buttonActive,
    shadows.onboardingCard,
    shadows.onboardingCardHover,
    shadows.icon,
    // ... add more shadow levels as needed
    ...Array(11).fill('none'), // Fill remaining shadow slots
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.button,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.card,
          boxShadow: shadows.card,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.large,
        },
      },
    },
  },
  // Extend theme with custom properties
  custom: {
    borderRadius,
    shadows,
    typography: typographyConfig,
  },
});

export default theme;

