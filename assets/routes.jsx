import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppBody from './components/AppBody';
import Chatroom from './components/Chatroom/Chatroom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppBody />,
    errorElement: <p>error</p>,
    children: [
      {
        path: 'c/:chatId',
        element: <Chatroom />,
      },
    ],
  },
  {
    path: '*',
    element: <h1>Not Found</h1>,
  },
]);

export default router;
