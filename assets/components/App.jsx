import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import AppLoad from '../routes/appload';
import AlertPortal from './AlertPortal';
import User from '../utils/User';
import SignGroup from './SignGroup';
import ChatBrowser from './ChatBrowser';
import { ThemeContextProvider } from './ThemeContextProvider';
import routes from '../routes';
import AppBody from './AppBody';

function App() {
  const [user, setUser] = useState(User.get());

  const onSignIn = (data) => {
    setUser(User.save(data));
  };

  const onLogout = () => {
    setUser(User.get());
  };

  useEffect(() => {
    window.addEventListener('user-logout', onLogout);

    return () => {
      window.removeEventListener('user-logout', onLogout);
    };
  }, []);

  return (
    <React.StrictMode>
      <ThemeContextProvider>
        <CssBaseline />
        <React.Suspense fallback={<AppLoad />}>
          <AlertPortal />
          {
              user == null
                ? <SignGroup signInCallback={onSignIn} />
                : <RouterProvider router={routes} />
          }
        </React.Suspense>
      </ThemeContextProvider>
    </React.StrictMode>
  );
}

export default App;
