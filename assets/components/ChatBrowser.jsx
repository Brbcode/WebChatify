import React, { useEffect, useRef, useState } from 'react';
import {
  Autocomplete, Box, Button, CircularProgress, Container,
  IconButton, InputAdornment, List, Stack, TextField, Typography,
} from '@mui/material';
import {
  MenuRounded, SearchRounded,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { baseTheme, getDefaultScrollStyle } from './ThemeContextProvider';
import AppMenu from './AppMenu';
import Api from '../api';
import ChatroomItem from './Chatroom/ChatroomItem';
import CreateChatroom from './Chatroom/CreateChatroom';

const ScrollList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflowY: 'auto',
  ...getDefaultScrollStyle(theme.palette.mode),
}));

function ChatBrowser() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [chats, setChats] = useState(null);
  const [isCreateChatroomModalOpen, setCreateChatroomModalOpen] = useState(false);
  const [searchFilter, setFilter] = useState([]);
  const inputRef = useRef();
  let searchDebounce = null;

  const reloadChats = () => {
    Api.get('chat')
      .then(({ data }) => {
        setChats(data.chatrooms);
      })
      .catch(() => { /* ignore */ });
  };

  const applyFilter = () => {
    const { value } = inputRef.current;
    const regexGroups = [...value.matchAll(/([A-Z][^A-Z]*)/g)].map((match) => match[0]);

    setFilter(regexGroups);
  };

  const handleInputChange = () => {
    const delay = 300;

    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    searchDebounce = setTimeout(applyFilter, delay);
  };

  useEffect(() => {
    window.addEventListener('new-chatroom', reloadChats);

    reloadChats();

    return () => {
      window.removeEventListener('new-chatroom', reloadChats);

      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, []);

  const isCentered = () => {
    if (chats === null) {
      return true;
    }

    return chats.length === 0;
  };

  const renderChatrooms = () => {
    if (chats === null) {
      return <CircularProgress />;
    }

    if (chats.length === 0) {
      return (
        <Box sx={{ mt: '-70px' }}>
          <Typography variant="body" component="p" sx={{ opacity: 0.7, pointerEvents: 'none', textAlign: 'center' }}>
            No chatrooms
          </Typography>
          <Button variant="outlined" sx={{ mt: 1 }} onClick={() => setCreateChatroomModalOpen(true)}>Create new Chatroom</Button>
        </Box>
      );
    }

    return chats
      .filter(({ title }) => {
        if (searchFilter.length === 0) {
          return true;
        }

        const regex = new RegExp(`.*${searchFilter.join('.*')}.*`, 'g');
        return regex.test(title);
      })
      .map(({ id, title, participantsCount }) => (
        <ChatroomItem
          key={id}
          id={id}
          title={title}
          participantCount={participantsCount}
        />
      ));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        [baseTheme.breakpoints.up('sm')]: {
          maxWidth: '424px',
          borderRight: 1,
          borderColor: 'grey.500',
        },
      }}
    >
      <Container component="header" sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton sx={{ p: '10px' }} aria-label="menu" onClick={(e) => { setAnchorEl(e.target); }}>
            <MenuRounded />
          </IconButton>
          <Autocomplete
            freeSolo
            fullWidth
            size="small"
            disableClearable
            options={[]}
            renderInput={
            (params) => (
              <TextField
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...params}
                placeholder="Search"
                onChange={handleInputChange}
                inputRef={inputRef}
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                  style: { borderRadius: 50 },
                  startAdornment: <InputAdornment position="start" sx={{ pl: 1 }}><SearchRounded /></InputAdornment>,
                }}
              />
            )
          }
          />
        </Stack>
      </Container>
      <AppMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
      <ScrollList
        sx={{
          alignItems: isCentered() ? 'center' : 'unset',
          justifyContent: isCentered() ? 'center' : 'unset',
        }}
      >
        {renderChatrooms()}
        {isCreateChatroomModalOpen && (
        <CreateChatroom
          onClose={() => setCreateChatroomModalOpen(false)}
          onCreate={(chat) => {
            window.dispatchEvent(new CustomEvent('new-chatroom', { detail: chat }));
          }}
        />
        )}
      </ScrollList>
    </Box>
  );
}

export default ChatBrowser;
