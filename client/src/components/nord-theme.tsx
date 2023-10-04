import { createTheme } from '@mui/material';

const nordTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2E3440',
      paper: '#4C566A',
    },
    primary: {
      main: '#88C0D0',
      contrastText: '#E5E9F0',
    },
    secondary: {
      main: '#8FBCBB',
      contrastText: '#ECEFF4',
    },
    error: {
      main: '#BF616A',
      contrastText: '#ECEFF4',
    },
    warning: {
      main: '#EBCB8B',
      contrastText: '#ECEFF4',
    },
    info: {
      main: '#5E81AC',
      contrastText: '#ECEFF4',
    },
    success: {
      main: '#A3BE8C',
      contrastText: '#ECEFF4',
    },
    text: {
      primary: '#ECEFF4',
      secondary: '#E5E9F0',
      disabled: '#D8DEE9',
    },
    divider: '#88C0D0',
  },
});

export default nordTheme;
