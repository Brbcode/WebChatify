import React, { useState } from 'react';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import {
  DarkModeOutlined, HelpOutline, LogoutOutlined, SettingsOutlined,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import ThemeSwitch from './ThemeSwitch';
import User from '../utils/User';
import About from './About';

function AppMenu({ anchorEl, onClose }) {
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          style: {
            minWidth: '264px',
          },
        }}
      >
        <MenuItem>
          <ListItemIcon><DarkModeOutlined /></ListItemIcon>
          Night Mode
          <ThemeSwitch sx={{ ml: 'auto' }} />
        </MenuItem>
        <MenuItem onClick={() => setAboutModalOpen(true)}>
          <ListItemIcon><HelpOutline /></ListItemIcon>
          About
        </MenuItem>
        <MenuItem onClick={() => User.logout()}>
          <ListItemIcon><LogoutOutlined /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      {isAboutModalOpen && <About onClose={() => setAboutModalOpen(false)} />}
    </>
  );
}

AppMenu.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func,
};

AppMenu.defaultProps = {
  anchorEl: null,
  onClose: () => {},
};

export default AppMenu;
