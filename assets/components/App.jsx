import React, { useEffect, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { themeDark, themeWhite } from '../styles/theme';
import AppLoad from '../routes/appload';
import router from '../routes';
import AlertPortal from './AlertPortal';
import User from '../utils/User';
import SignGroup from './SignGroup';

function App() {
  const [theme, setTheme] = useState(themeWhite);
  const [user, setUser] = useState(null);

  function onThemeChange({ detail }) {
    setTheme(detail.theme === 'dark' ? themeDark : themeWhite);
  }

  const onSignIn = (data) => {
    setUser(User.save(data));
  };

  useEffect(() => {
    const sessionTheme = sessionStorage.getItem('theme');
    setTheme(sessionTheme === 'dark' ? themeDark : themeWhite);

    window.addEventListener('themeChanged', onThemeChange);

    setUser(User.get());

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
          {
            user == null
              ? <SignGroup signInCallback={onSignIn} /> : <RouterProvider router={router} />
          }
        </React.Suspense>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
