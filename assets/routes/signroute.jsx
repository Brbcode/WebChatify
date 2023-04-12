import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import ThemeSwitch from '../components/ThemeSwitch';

function SignRoute({ mode }) {
  const [modeState, setMode] = useState(mode);

  return (
    <>
      <ThemeSwitch sx={{
        position: 'fixed',
        top: 5,
        right: 5,
      }}
      />
      {
        (modeState === 'up')
          ? <SignUp signInCallback={() => setMode('in')} />
          : <SignIn signUpCallback={() => setMode('up')} />
      }
    </>
  );
}

SignRoute.propTypes = {
  mode: PropTypes.oneOf(['up', 'in']),
};

SignRoute.defaultProps = {
  mode: 'up',
};

export default SignRoute;
