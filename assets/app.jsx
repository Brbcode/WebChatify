// start the Stimulus application
import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import router from './routes';
import { themeWhite } from './styles/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={themeWhite}>
      <CssBaseline />
      <React.Suspense fallback={<p>loading</p>}>
        <RouterProvider router={router} />
      </React.Suspense>
    </ThemeProvider>
  </React.StrictMode>,
);
