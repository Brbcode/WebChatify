import React, { useRef, useState } from 'react';
import {
  alpha,
  Avatar, Box, Chip, ListItemIcon, ListItemText, Menu, MenuItem, Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Edit, Visibility } from '@mui/icons-material';
import TimeParser from '../../utils/TimeParser';
import User from '../../utils/User';
import MessageHistory from './MessageHistory';
import AvatarUtil from '../../utils/AvatarUtil';

const StyledContent = styled(Box)(({ theme }) => {
  const addStyle = theme.palette.mode === 'dark' ? ({})
    : ({ boxShadow: '0px 0px 2px 0px #444' });

  return ({
    position: 'relative',
    padding: theme.spacing(1),
    borderRadius: 20,
    background: theme.palette.mode === 'dark' ? '#dadada' : theme.palette.background.default,
    color: '#000',
    paddingBottom: theme.spacing(4),
    overflow: 'hidden',
    minWidth: 100,
    ...addStyle,
  });
});

const DisplayName = styled(Typography)(({ theme }) => ({
  ...theme.typography.body,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontWeight: 700,
}));

const DateChip = styled(Chip)(({ theme }) => ({
  color: '#000',
  background: theme.palette.mode === 'dark' && alpha(theme.palette.background.default, 0.7),
  fontSize: '8pt',
  position: 'absolute',
  bottom: theme.spacing(0.5),
}));

function Message({
  data, showAvatar, onEditStart, selected,
}) {
  const isFromOwner = data.sender.id === User.get().id;
  const ref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHistory, setHistoryVisibility] = useState(false);

  const parseDate = (data) => {
    const date = TimeParser.getDateFromMessageData(data);

    const formattedDate = TimeParser.parseDateToTimeString(date);

    return `${data.editAt ? 'Edit at ' : ''}${formattedDate}`;
  };

  const getContentStyles = () => (showAvatar ? ({}) : ({
    sx: {
      ml: isFromOwner === false && '48px',
      mr: isFromOwner && '48px',
    },
  }));

  const handleContextMenu = (event) => {
    event.preventDefault();

    setMenuOpen(true);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    onEditStart(data.id);
  };

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '70%',
        gap: 1,
        mb: 0.5,
        ml: isFromOwner && 'auto',
        opacity: selected && 0.5,
      }}
    >
      {
        showAvatar && isFromOwner === false
          && <Avatar {...AvatarUtil.getAvatarProps(data.sender)} />
      }
      <StyledContent
        {...getContentStyles()}
        onContextMenu={handleContextMenu}
        onTouchStart={handleContextMenu}
      >
        {
          showAvatar && (
          <DisplayName sx={{ color: AvatarUtil.stringToColor(data.sender.displayName) }}>
            {data.sender.displayName}
          </DisplayName>
          )
        }
        {
          data.content.split('\n')
            .map(
              (content, i) => (
                <Typography key={i} variant="body" component="p">
                  {content}
                </Typography>
              ),
            )
        }
        <DateChip
          label={parseDate(data)}
          size="small"
          sx={{
            right: isFromOwner && 4,
            left: !isFromOwner && 4,
          }}
        />
      </StyledContent>
      {
          showAvatar && isFromOwner && <Avatar {...AvatarUtil.getAvatarProps(data.sender)} />
      }
      <Menu
        open={menuOpen}
        anchorEl={ref.current}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          style: {
            minWidth: 150,
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText onClick={handleEdit}>Edit</ListItemText>
        </MenuItem>
        {
          User.get().roles.includes('ROLE_ADMIN')
            && (
            <MenuItem disabled={!data.editAt} onClick={() => setHistoryVisibility(true)}>
              <ListItemIcon>
                <Visibility />
              </ListItemIcon>
              Show history
            </MenuItem>
            )
        }
      </Menu>
      {
        User.get().roles.includes('ROLE_ADMIN')
          && (
          <MessageHistory
            id={data.id}
            open={showHistory}
            onClose={() => {
              setHistoryVisibility(false);
              setMenuOpen(false);
            }}
          />
          )
      }
    </Box>
  );
}

Message.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    chatroom: PropTypes.string.isRequired,
    sender: PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    editAt: PropTypes.string,
    content: PropTypes.string.isRequired,
  }).isRequired,
  showAvatar: PropTypes.bool,
  onEditStart: PropTypes.func,
  selected: PropTypes.bool,
};

Message.defaultProps = {
  showAvatar: true,
  onEditStart: () => {},
  selected: false,
};

export default Message;
