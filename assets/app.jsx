// start the Stimulus application
import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import router from './routes';
import { themeWhite } from './styles/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<p>loading</p>}>
      <ThemeProvider theme={themeWhite}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>,
);
