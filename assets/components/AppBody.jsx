import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { Transition } from 'react-transition-group';
import ChatBrowser from './ChatBrowser';
import { baseTheme } from './ThemeContextProvider';

function AppBody() {
  const { chatId } = useParams();
  const [isOutletVisible, setOutletVisible] = useState(!!chatId);
  const transitionNodeRef = useRef(null);
  const [defaultTransform, setDefaultTransform] = useState(isOutletVisible ? -window.innerWidth : 0);
  const duration = 300;
  const navigate = useNavigate();
  const [navigateOnEnd, setNavigation] = useState(false);

  const onShowChatroom = () => {
    setOutletVisible(true);
  };

  const handleTransitionEnd = () => {
    if (navigateOnEnd) {
      navigate('/');
      setNavigation(false);
    }
  };

  const transitionStyles = {
    entering: { transform: `translateX(${window.innerWidth >= 600 ? 0 : -window.innerWidth}px)` },
    entered: { transform: `translateX(${window.innerWidth >= 600 ? 0 : -window.innerWidth}px)` },
    exiting: { transform: 'translateX(0px)' },
    exited: { transform: 'translateX(0px)' },
  };

  const onHideChatroom = () => {
    setOutletVisible(false);
    setNavigation(true);
  };

  const handleResize = () => {
    setDefaultTransform(isOutletVisible ? -window.innerWidth : 0);
  };

  useEffect(() => {
    window.addEventListener('show-chatroom', onShowChatroom);
    window.addEventListener('show-chatroom-browser', onHideChatroom);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('show-chatroom', onShowChatroom);
      window.removeEventListener('show-chatroom', onHideChatroom);
      window.removeEventListener('resize', handleResize);
    };
  }, [defaultTransform]);

  return (
    <Transition
      nodeRef={transitionNodeRef}
      in={isOutletVisible}
      timeout={300}
      onEntered={handleTransitionEnd}
      onExited={handleTransitionEnd}
    >
      {
        (transitionStatus) => (
          <Box
            component="main"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '200vw',
              transition: `transform ${duration}ms ease-in-out`,
              [baseTheme.breakpoints.up('sm')]: {
                width: '100vw',
              },
            }}
            style={{
              transform: `translateX(${window.innerWidth >= 600 ? 0 : defaultTransform}px)`,
              ...transitionStyles[transitionStatus],
            }}
          >
            <ChatBrowser />
            <Outlet />
          </Box>
        )
      }
    </Transition>
  );
}

export default AppBody;
