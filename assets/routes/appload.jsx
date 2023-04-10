import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

function AppLoad() {
  return (
    <Backdrop open>
      <CircularProgress />
    </Backdrop>
  );
}

export default AppLoad;
