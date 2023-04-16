import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { themeDark, themeWhite } from '../styles/theme';
import AppLoad from '../routes/appload';
import router from '../routes';
import AlertPortal from './AlertPortal';

function App() {
  const [theme, setTheme] = useState(themeWhite);

  function onThemeChange({ detail }) {
    setTheme(detail.theme === 'dark' ? themeDark : themeWhite);
  }

  useEffect(() => {
    const sessionTheme = sessionStorage.getItem('theme');
    setTheme(sessionTheme === 'dark' ? themeDark : themeWhite);

    window.addEventListener('themeChanged', onThemeChange);

    return () => {
      window.removeEventListener('themeChanged', onThemeChange);
    };
  }, []);

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <React.Suspense fallback={<AppLoad />}>
          <AlertPortal />
          <RouterProvider router={router} />
        </React.Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
