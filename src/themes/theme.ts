import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1A4F85',
    },
    secondary: {
      main: '#E41E3F',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#18214D',
      secondary: '#5F6B7A',
    },
  },

  typography: {
    fontFamily: 'Inter, Arial, sans-serif',

    h1: {
      fontSize: '48px',
      lineHeight: 1.17,
      fontWeight: 700,
    },

    h2: {
      fontSize: '36px',
      lineHeight: 1.22,
      fontWeight: 700,
    },

    h3: {
      fontSize: '28px',
      lineHeight: 1.29,
      fontWeight: 700,
    },

    h4: {
      fontSize: '22px',
      lineHeight: 1.27,
      fontWeight: 600,
    },

    h5: {
      fontSize: '18px',
      lineHeight: 1.33,
      fontWeight: 600,
    },

    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
    },

    body2: {
      fontSize: '14px',
      lineHeight: 1.43,
    },

    button: {
      fontSize: '14px',
      lineHeight: 1.43,
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width:600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
          '@media (min-width:900px)': {
            paddingLeft: '48px',
            paddingRight: '48px',
          },
          // ~2cm de margen lateral en escritorio (equivalente visual a la
          // referencia institucional), manteniendo el contenedor responsive.
          '@media (min-width:1200px)': {
            paddingLeft: '76px',
            paddingRight: '76px',
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
