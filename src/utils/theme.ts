import { createTheme, Theme } from '@mui/material/styles';

// Custom color palette
const colors = {
  primary: '#ff1e00', // Brightly Orange
  secondary: '#e8f9fd', // Dimly Blue
  success: '#59ce8f', // Alert/Highlight Green
};

// Light theme
export const lightTheme: Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary,
      contrastText: '#000000',
    },
    success: {
      main: colors.success,
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Dark theme
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary,
      contrastText: '#000000',
    },
    success: {
      main: colors.success,
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};