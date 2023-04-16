import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Alert, Button, CircularProgress, Collapse,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import PropTypes from 'prop-types';

function AlertPortal({ duration }) {
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ severity: 'error', message: 'test' });
  const [progress, setProgress] = useState(100);
  let intervalId;
  let timeoutId;

  const listener = ({ detail }) => {
    const { severity, message } = detail;
    setShow(true);
    setAlert({ severity, message });
    setProgress(100);
    const deadline = Date.now() + duration;

    clearInterval(intervalId);
    clearTimeout(timeoutId);

    intervalId = setInterval(
      () => {
        const currentProgress = ((Date.now() - deadline) / duration) * -100;
        setProgress(Math.max(currentProgress, 0));
      },
      80,
    );

    timeoutId = setTimeout(
      () => {
        setShow(false);
        clearInterval(intervalId);
      },
      duration + 300,
    );
  };

  useEffect(() => {
    window.addEventListener('notification', listener);

    return () => {
      window.removeEventListener('notification', listener);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return createPortal(
    <Collapse
      in={show}
      sx={{
        position: 'fixed',
        top: 5,
        pl: '5px',
        pr: '5px',
        width: '100%',
      }}
    >
      {
        alert
          && (
            <Alert
              severity={alert.severity}
              action={(
                <Button
                  color="inherit"
                  size="small"
                  sx={{
                    borderRadius: '50%',
                    minWidth: '30px',
                    width: '30px',
                    height: '30px',
                  }}
                  onClick={() => {
                    setShow(false);
                    clearInterval(intervalId);
                  }}
                >
                  <CircularProgress
                    sx={{
                      position: 'absolute',
                    }}
                    size={30}
                    variant="determinate"
                    value={progress}
                  />
                  <Close fontSize="small" style={{ fontSize: 18 }} />
                </Button>
                )}
            >
              {alert.message}
            </Alert>
          )
      }
    </Collapse>,
    document.getElementById('notifications'),
  );
}

AlertPortal.propTypes = {
  duration: PropTypes.number,
};

AlertPortal.defaultProps = {
  duration: 3000,
};

export default AlertPortal;
