import React from 'react';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle, Link, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { GitHub } from '@mui/icons-material';

function About({ onClose }) {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body" component="p">
            WebChatify (version: alfa)
          </Typography>
          <p>
            Developed by:
            <br />
            <Typography variant="body" component="span" sx={{ opacity: 0.7 }}>
              Bruno García Trípoli
            </Typography>
          </p>
          <p>
            Open Source App:
            {' '}
            <Link href="https://github.com/Brbcode/WebChatify" target="_blank" rel="noopener" sx={{ whiteSpace: 'nowrap' }}>
              GitHub Repo
              {' '}
              <GitHub sx={{ fontSize: 15 }} />
            </Link>
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

About.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default About;
