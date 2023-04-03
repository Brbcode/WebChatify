import { createTheme } from '@mui/material';

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

const baseTheme = createTheme({
  breakpoints,
});

const themeWhite = createTheme({}, baseTheme);

const themeDark = createTheme({
  palette: {
    mode: 'dark',
  },
}, baseTheme);

export { themeWhite, themeDark, baseTheme };
