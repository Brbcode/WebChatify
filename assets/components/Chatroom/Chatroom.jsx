import React, {
  useRef, useState, useEffect, Fragment,
} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Divider,
  TextareaAutosize,
  InputBase,
  CircularProgress,
  Button, Chip, Menu, MenuItem, ListItemIcon,
} from '@mui/material';
import {
  ArrowBackOutlined, MoreVert, PersonAdd, Send,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getDefaultScrollStyle } from '../ThemeContextProvider';
import Message from '../Message/Message';
import Api from '../../api';
import TimeParser from '../../utils/TimeParser';
import Mercure from '../../utils/Mercure';
import User from '../../utils/User';
import InviteModal from './InviteModal';

const MultilineInputBase = styled(InputBase)(({ theme }) => ({
  '& textarea': {
    maxHeight: `calc(${theme.spacing(3)} * 4)`,
  },
}));

const ScrollBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  paddingTop: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  overflowY: 'auto',
  marginBottom: 5,
  ...getDefaultScrollStyle(theme.palette.mode),
}));

function Chatroom() {
  const { chatId } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState(location.state && location.state.title);
  const [isScrolledToBottom, setScrolledToBottom] = useState(false);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState(false);
  const scrollBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [editMessage, setEditMessage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isMenuOpen = Boolean(menuAnchor);
  const [isInviteModalOpen, setInviteModal] = useState(false);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('show-chatroom-browser'));
  };

  const handleScroll = () => {
    const { current } = scrollBoxRef;
    const newValue = (current.scrollHeight - current.scrollTop) === current.clientHeight;
    setScrolledToBottom(newValue);
  };

  const scrollToEnd = () => {
    const { current } = scrollBoxRef;
    if (current) {
      current.scrollTop = current.scrollHeight;
      setScrolledToBottom(true);
    }
  };

  const handleEditMessageSelect = (id) => {
    setEditMessage(id);
    const input = inputRef.current;
    input.focus();
    input.value = messages.find((m) => m.id === id).content;
  };

  const needDateChip = (prevDate, currentDate) => {
    if (prevDate === null) {
      return true;
    }

    const timeDiff = Math.abs(currentDate.getTime() - prevDate.getTime());
    const oneDayMS = 24 * 60 * 60 * 1000;

    return timeDiff >= oneDayMS;
  };

  const renderScrollBox = () => {
    if (error) {
      return (
        <Typography
          variant="body"
          component="p"
          sx={{ opacity: 0.7, userSelect: 'none' }}
        >
          Error. Go
          {' '}
          <Button onClick={handleBack}>Back</Button>
        </Typography>
      );
    }

    if (messages === false) {
      return <CircularProgress />;
    }

    if (messages.length === 0) {
      return (
        <Typography
          variant="body"
          component="p"
          sx={{ opacity: 0.7, userSelect: 'none' }}
        >
          No messages yet.
        </Typography>
      );
    }

    return messages.map((data, index, array) => {
      const prevData = index === 0 ? null : array[index - 1];
      const prevSender = prevData ? prevData.sender.id : null;
      const showAvatar = prevSender === null || prevSender !== data.sender.id;

      const prevDate = prevData ? TimeParser.getDateFromMessageData(prevData) : null;
      const currentDate = TimeParser.getDateFromMessageData(data);

      if (needDateChip(prevDate, currentDate)) {
        const label = TimeParser.parseDateToDateString(currentDate);

        return (
          <Fragment key={data.id}>
            <Chip
              label={label}
              sx={{
                width: 'fit-content', mx: 'auto', mb: 1, mt: 0.5,
              }}
              size="small"
            />
            <Message
              data={data}
              showAvatar
              onEditStart={handleEditMessageSelect}
              selected={data.id === editMessage}
            />
          </Fragment>
        );
      }

      return (
        <Message
          key={data.id}
          data={data}
          showAvatar={showAvatar}
          onEditStart={handleEditMessageSelect}
          selected={data.id === editMessage}
        />
      );
    });
  };

  const getScrollBoxStyles = () => {
    if (messages === false || messages.length === 0) {
      return ({
        sx: {
          alignItems: 'center',
          justifyContent: 'center',
        },
      });
    }

    return ({});
  };

  const sendMessage = () => {
    const inputValue = inputRef.current.value;
    if (inputValue === null || inputValue.replace(/\s+/g, ' ') === '') {
      return;
    }

    if (editMessage) {
      Api.patch(`message/${editMessage}`, { content: inputValue })
        .then(() => {
          inputRef.current.value = '';
          setEditMessage(null);
        }).catch(() => { /* Do nothing */ });
    } else {
      Api.post('message', { chatroom: chatId, content: inputValue })
        .then(() => {
          inputRef.current.value = '';
        }).catch(() => { /* Do nothing */ });
    }
  };

  const handleSubscriber = (event) => {
    const data = JSON.parse(event.data);
    setMessages(data.map((m) => ({
      ...m,
      createdAt: m.createdAt.date,
      editAt: m.editAt && m.editAt.date,
    })));

    const sliceLast = data.slice(-1);
    const lastMsg = sliceLast.lenght === 0 ? null : sliceLast[0];

    if (lastMsg && lastMsg.sender.id === User.get().id) {
      setTimeout(scrollToEnd, 200);
    }
  };

  useEffect(() => {
    const subscriber = Mercure.createSubscriber(`sse:chat:${chatId}`);
    subscriber.onmessage = handleSubscriber;

    Api.get(`messages/chat/${chatId}`)
      .then(({ data }) => {
        setMessages(data);
        scrollToEnd();
      })
      .catch(() => { setError(true); });
    return () => {
      subscriber.close();
    };
  }, []);

  return (
    <Box
      sx={{
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
      }}
    >
      <Container
        component="header"
        sx={
        {
          py: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }
      }
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="go-back" onClick={handleBack}>
            <ArrowBackOutlined />
          </IconButton>
        </Stack>
        {
          title !== null
            ? (
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  whiteSpace: 'nowrap',
                  width: '70%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
            )
            : <Skeleton variant="text" width="70%" />
        }
        <IconButton onClick={(e) => setMenuAnchor(e.target)} sx={{ ml: 'auto' }}>
          <MoreVert />
        </IconButton>
      </Container>
      <ScrollBox ref={scrollBoxRef} onScroll={handleScroll} {...getScrollBoxStyles()}>
        {renderScrollBox()}
        {/* <Message /> */}
      </ScrollBox>
      <Divider />
      { editMessage && <Typography variant="caption">Editing...</Typography> }
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          px: 1,
        }}
      >
        <MultilineInputBase
          multiline
          maxRows={4}
          inputComponent={TextareaAutosize}
          placeholder="Message"
          sx={{ flexGrow: 1 }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              inputRef.current.value = '';
              setEditMessage(null);
              return;
            }

            if (e.ctrlKey && e.key === 'Enter') {
              sendMessage();
            }
          }}
          inputRef={inputRef}
        />
        <IconButton onClick={sendMessage}>
          <Send color="primary" />
        </IconButton>
      </Box>
      <Menu open={isMenuOpen} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setInviteModal(true);
          }}
        >
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          Add new participant
        </MenuItem>
      </Menu>
      <InviteModal
        chatId={chatId}
        onClose={() => setInviteModal(false)}
        open={isInviteModalOpen}
      />
    </Box>
  );
}

export default Chatroom;
