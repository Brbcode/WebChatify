import React, { useEffect, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import AppLoad from '../routes/appload';
import router from '../routes';
import AlertPortal from './AlertPortal';
import User from '../utils/User';
import SignGroup from './SignGroup';
import ChatBrowser from './ChatBrowser';
import { ThemeContextProvider } from './ThemeContextProvider';

function App() {
  const [user, setUser] = useState(null);

  const onSignIn = (data) => {
    setUser(User.save(data));
  };

  useEffect(() => {
    setUser(User.get());
  }, []);

  return (
    <React.StrictMode>
      <ThemeContextProvider>
        <CssBaseline />
        <React.Suspense fallback={<AppLoad />}>
          <AlertPortal />
          <ChatBrowser />
          {
            false && (user == null
              ? <SignGroup signInCallback={onSignIn} /> : <RouterProvider router={router} />)
          }
        </React.Suspense>
      </ThemeContextProvider>
    </React.StrictMode>
  );
}

export default App;
