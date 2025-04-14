import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#606c38',
      contrastText: `#283618`,
    },
    secondary: {
      main: '#606c38',
      contrastText: '#283618',
    },
    text: {
        primary: "#606c38",
        secondary: '#283618',
    }
  },
  typography: {
    fontFamily: `"Gill Sans", sans-serif`,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // optional: keeps normal casing
        },
        containedPrimary: {
          backgroundColor: '#606c38',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#283618',
          },
        },
        containedSecondary: {
          backgroundColor: '#aa00aa',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#880088',
          },
        },
        outlinedPrimary: {
          backgroundColor: 'transparent',
          color: '#0044cc',
          borderColor: '#0044cc',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        },
        textPrimary: {
          backgroundColor: 'transparent',
          color: '#0044cc',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
        },
      },
    },
  },
});

export default theme;