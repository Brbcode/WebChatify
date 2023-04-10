import React, { useState } from 'react';
import {
  Avatar, Box, Button, Container, Grid, TextField,
  Typography, Link, InputAdornment, CircularProgress, Alert, Collapse,
} from '@mui/material';
import { CancelTwoTone, CheckCircleTwoTone, LockOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';

function SignUp({ signInCallback, pwdRegex }) {
  const [busy, setBusy] = useState(false);
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState(pwd);
  const [pwdError, setPwdError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!pwdRegex.test(pwd) || pwd !== confirmPwd) {
      setPwdError(true);
      return;
    }
    setPwdError(false);
    setBusy(true);
    // TODO fetch
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="displayName"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={({ target }) => setPwd(target.value)}
                InputProps={{
                  endAdornment:
  <InputAdornment position="end" sx={{ opacity: 0.5 }}>
    {pwdRegex.test(pwd) ? <CheckCircleTwoTone color="success" /> : <CancelTwoTone color="error" />}
  </InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={({ target }) => setConfirmPwd(target.value)}
                InputProps={{
                  endAdornment:
  <InputAdornment position="end" sx={{ opacity: 0.5 }}>
    {pwdRegex.test(pwd) && pwd === confirmPwd ? <CheckCircleTwoTone color="success" /> : <CancelTwoTone color="error" />}
  </InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
          <Collapse in={pwdError} sx={{ mt: 2, mb: 1 }}>
            <Alert severity="error">Password is incorrect.</Alert>
          </Collapse>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disabled={busy}
          >
            {busy ? <CircularProgress size={20} sx={{ m: 0.28 }} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" component="button" variant="body2" onClick={signInCallback}>
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

SignUp.propTypes = {
  signInCallback: PropTypes.func,
  pwdRegex: PropTypes.shape(RegExp),
};

SignUp.defaultProps = {
  signInCallback: (event) => { event.preventDefault(); },
  pwdRegex: /.{6,}/,
};

export default SignUp;
