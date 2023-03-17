import { createTheme, ThemeProvider as MaterialThemeProvider } from '@material-ui/core';
import React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      light: '#8657df',
      main: '#682ED8',
      dark: '#482097',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e38760',
      main: '#DD6939',
      dark: '#9a4927',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: 'Source Sans Pro, sans-serif',
  },
});

const ThemeProvider: React.FC = ({ children }) => {
  return <MaterialThemeProvider theme={theme}>{children}</MaterialThemeProvider>;
};
export default ThemeProvider;
