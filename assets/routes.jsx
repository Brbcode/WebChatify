import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>WWW</h1>,
    errorElement: <p>error</p>,
    children: [

    ],
  },
  {
    path: '*',
    element: <h1>Not Found</h1>,
  },
]);

export default router;
