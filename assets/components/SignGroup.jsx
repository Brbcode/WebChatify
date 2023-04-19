import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Box } from '@mui/material';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ThemeSwitch from './ThemeSwitch';
import '../styles/transition/slide-fade.css';

function SignGroup({ mode }) {
  const [modeState, setMode] = useState(mode);
  const [email, setEmail] = useState('');
  const signUpRef = useRef(null);
  const signInRef = useRef(null);
  const nodeRef = modeState ? signUpRef : signInRef;
  const [transitionClass, setTransitionClass] = useState('slide-fade-rev');

  return (
    <>
      <ThemeSwitch sx={{
        position: 'fixed',
        top: 5,
        right: 5,
      }}
      />
      <Box sx={{ overflowX: 'hidden' }}>
        <SwitchTransition>
          <CSSTransition
            key={modeState}
            nodeRef={nodeRef}
            timeout={500}
            addEndListener={() => {
              if (nodeRef.current.classList.contains(`${transitionClass}-enter`)) {
                setTransitionClass((v) => (v === 'slide-fade' ? 'slide-fade-rev' : 'slide-fade'));
              }
            }}
            classNames={transitionClass}
            unmountOnExit
          >
            <Box ref={nodeRef}>
              {
                  (modeState === 'up')
                    ? (
                      <SignUp
                        signInCallback={() => setMode('in')}
                        signUpCallback={(data) => {
                          setEmail(data.email);
                          setMode('in');
                        }}
                      />
                    )
                    : (
                      <SignIn
                        signUpCallback={() => setMode('up')}
                        defaultEmail={email}
                      />
                    )
              }
            </Box>
          </CSSTransition>
        </SwitchTransition>
      </Box>
    </>
  );
}

SignGroup.propTypes = {
  mode: PropTypes.oneOf(['up', 'in']),
};

SignGroup.defaultProps = {
  mode: 'up',
};

export default SignGroup;
