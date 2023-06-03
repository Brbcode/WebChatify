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
  Button, Chip,
} from '@mui/material';
import { ArrowBackOutlined, Send } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getDefaultScrollStyle } from '../ThemeContextProvider';
import Message from '../Message/Message';
import Api from '../../api';
import TimeParser from '../../utils/TimeParser';

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
            <Message data={data} showAvatar />
          </Fragment>
        );
      }

      return <Message key={data.id} data={data} showAvatar={showAvatar} />;
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

    Api.post('message', { chatroom: chatId, content: inputValue })
      .then(({ data }) => {
        setMessages((v) => [...v, data]);
        inputRef.current.value = '';
      }).catch(() => { /* Do nothing */ });
  };

  useEffect(() => {
    scrollToEnd();
    const eventSource = new EventSource('http://localhost:3000');

    Api.get(`messages/chat/${chatId}`)
      .then(({ data }) => {
        setMessages(data);
      })
      .catch(() => { setError(true); });
    return () => {

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
      </Container>
      <ScrollBox ref={scrollBoxRef} onScroll={handleScroll} {...getScrollBoxStyles()}>
        {renderScrollBox()}
        {/* <Message /> */}
      </ScrollBox>
      <Divider />
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
    </Box>
  );
}

export default Chatroom;
