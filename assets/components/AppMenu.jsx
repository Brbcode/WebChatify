import React, { useState } from 'react';
import {
  Avatar, ListItemIcon, Menu, MenuItem,
} from '@mui/material';
import {
  ChatOutlined,
  DarkModeOutlined, HelpOutline, LogoutOutlined,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import ThemeSwitch from './ThemeSwitch';
import User from '../utils/User';
import About from './About';
import CreateChatroom from './Chatroom/CreateChatroom';
import Profile from './Profile';
import AvatarUtil from '../utils/AvatarUtil';

function AppMenu({ anchorEl, onClose }) {
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isCreateChatModalOpen, setCreateChatModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

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
        <MenuItem onClick={() => {
          onClose();
          setProfileModalOpen(true);
        }}
        >
          <ListItemIcon>
            <Avatar {...AvatarUtil.getAvatarProps(User.get(), {
              width: 24,
              height: 24,
              fontSize: '10pt',
            })}
            />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          onClose();
          setCreateChatModalOpen(true);
        }}
        >
          <ListItemIcon><ChatOutlined /></ListItemIcon>
          New Chat
        </MenuItem>
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
      {isCreateChatModalOpen
          && (
          <CreateChatroom
            onCreate={(chat) => {
              window.dispatchEvent(new CustomEvent('new-chatroom', { detail: chat }));
            }}
            onClose={() => setCreateChatModalOpen(false)}
          />
          )}
      {
        isProfileModalOpen
          && (
          <Profile
            onClose={() => setProfileModalOpen(false)}
            open={isProfileModalOpen}
            user={User.get()}
            editable
          />
          )
      }
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
