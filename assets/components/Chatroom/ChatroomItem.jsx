import React from 'react';
import {
  Chip, ListItem, ListItemText, Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import { People } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(() => ({
  width: '100%',
  textDecoration: 'none',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  transition: 'background 300ms',
  padding: 7,
  '&:hover': {
    background: theme.palette.mode === 'dark' ? '#2c2c2c' : '#deeeff',
  },
}));

function ChatroomItem({ id, title, participantCount }) {
  return (
    <ListItem sx={{ paddingRight: 1 }}>
      <StyledLink to={`/c/${id}`}>
        <StyledPaper>
          <ListItemText primary={title} />
          <Chip icon={<People sx={{ fontSize: 16 }} />} label={participantCount} sx={{ ml: 'auto' }} />
        </StyledPaper>
      </StyledLink>
    </ListItem>
  );
}

ChatroomItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  participantCount: PropTypes.number.isRequired,
};

export default ChatroomItem;
