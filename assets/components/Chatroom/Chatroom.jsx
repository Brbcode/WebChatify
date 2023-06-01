import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Container, IconButton, Stack,
} from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';

function Chatroom() {
  const { chatId } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState(location.state && location.state.title);
  const navigate = useNavigate();

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('show-chatroom-browser'));
  };

  return (
    <Box sx={{ flex: '1 0 auto' }}>
      <Container component="header" sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="go-back" onClick={handleBack}>
            <ArrowBackOutlined />
          </IconButton>
        </Stack>
      </Container>
      Chat:
      {' '}
      {chatId}
    </Box>
  );
}

export default Chatroom;
