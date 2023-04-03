import { createTheme } from '@mui/material';

const themeWhite = createTheme();

const themeDark = createTheme({
  palette: {
    mode: 'dark',
  },
});

export { themeWhite, themeDark };
