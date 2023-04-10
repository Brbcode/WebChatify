// start the Stimulus application
import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import router from './routes';
import { themeWhite } from './styles/theme';
import AppLoad from './routes/appload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={themeWhite}>
      <CssBaseline />
      <React.Suspense fallback={<AppLoad />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </ThemeProvider>
  </React.StrictMode>,
);
