import React from 'react';
import {
  alpha,
  Avatar, Box, Chip, Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import TimeParser from '../../utils/TimeParser';
import User from '../../utils/User';

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
  right: theme.spacing(0.5), // fix
}));

function Message({ data, showAvatar }) {
  const isFromOwner = data.sender.id === User.get().id;

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-bitwise
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

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

  const getAvatarProps = (displayName) => {
    const upperDisplayName = displayName.replace(/\s+/g, ' ').toUpperCase();
    const words = upperDisplayName.split(' ');
    const initials = words.map((word) => word[0].toUpperCase()).join('');

    return {
      sx: {
        bgcolor: stringToColor(displayName),
      },
      children: initials,
    };
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '70%',
      gap: 1,
      mb: 0.5,
      ml: isFromOwner && 'auto',
    }}
    >
      {
        showAvatar && isFromOwner === false && <Avatar {...getAvatarProps(data.sender.displayName)} />
      }
      <StyledContent {...getContentStyles()}>
        {
          showAvatar && (
          <DisplayName sx={{ color: stringToColor(data.sender.displayName) }}>
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
        <DateChip label={parseDate(data)} size="small" />
      </StyledContent>
      {
          showAvatar && isFromOwner && <Avatar {...getAvatarProps(data.sender.displayName)} />
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
};

Message.defaultProps = {
  showAvatar: true,
};

export default Message;