import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Api from '../api';

function SignIn({ signUpCallback, signInCallback, defaultEmail }) {
  const [busy, setBusy] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setBusy(true);
    const { email, password } = event.target;
    Api.post('login', {
      email: email.value,
      password: password.value,
    })
      .then(({ data }) => {
        const msg = `Welcome, ${data.displayName}!`;
        window.dispatchEvent(new CustomEvent('notification', {
          detail: {
            severity: 'success',
            message: msg,
          },
        }));
        console.info(msg);
        signInCallback(data);
      })
      .catch(() => { /* ignore */ })
      .finally(() => { setBusy(false); });
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                defaultValue={defaultEmail}
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
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 1, mb: 2 }}
            disabled={busy}
          >
            {busy ? <CircularProgress size={20} sx={{ m: 0.28 }} /> : 'Sign In'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/" component="button" variant="body2" onClick={signUpCallback}>
                Create an account
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

SignIn.propTypes = {
  signUpCallback: PropTypes.func,
  signInCallback: PropTypes.func,
  defaultEmail: PropTypes.string,
};

SignIn.defaultProps = {
  signUpCallback: (event) => { event.preventDefault(); },
  signInCallback: () => {},
  defaultEmail: '',
};

export default SignIn;
