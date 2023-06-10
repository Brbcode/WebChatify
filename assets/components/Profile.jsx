import React, { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment, InputBase,
  Skeleton,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AvatarUtil from '../utils/AvatarUtil';

function Profile({
  open, onClose, user, editable,
}) {
  const [displayName, setDisplayName] = useState(user.displayName ?? null);
  const [email, setEmail] = useState(user.email ?? null);
  const [roles, setRoles] = useState(user.roles ?? null);
  const [showEmail, setEmailVisibility] = useState(false);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0] ?? null;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          minWidth: '264px',
        },
      }}
    >
      <DialogTitle>Profile</DialogTitle>
      <DialogContent sx={{
        display: 'flex', flexDirection: 'column', gap: 1, pb: 0,
      }}
      >
        <Box sx={{
          display: 'flex', flexDirection: 'row', gap: 1, pt: 1,
        }}
        >

          {
            displayName === null
              ? (
                <>
                  <Avatar />
                  <Skeleton variant="text" sx={{ flexGrow: 1 }} />
                </>
              )
              : (
                <>
                  {
                    previewImage
                      ? <Avatar alt="preview" src={previewImage} />
                      : <Avatar {...AvatarUtil.getAvatarProps(displayName)} />
                  }
                  <TextField
                    value={displayName}
                    label="Display Name"
                    disabled
                    sx={{ flexGrow: 1 }}
                    size="small"
                  />
                </>
              )
          }
        </Box>
        {
          editable && (
            <>
              <InputBase
                type="file"
                sx={{ display: 'none' }}
                inputRef={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
              />
              <Button variant="contained" size="small" onClick={handleFileSelect}>Upload Avatar</Button>
            </>
          )
        }
        {
          email === null ? <Skeleton variant="text" />
            : (
              <TextField
                value={email}
                label="Email"
                disabled
                type={showEmail ? 'text' : 'password'}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setEmailVisibility((v) => !v)}>
                        {showEmail ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )
        }
      </DialogContent>
      <DialogActions>
        <Button disabled={!editable}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    displayName: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

Profile.defaultProps = {
  user: {},
  editable: false,
};

export default Profile;
