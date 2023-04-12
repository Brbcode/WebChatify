import React, { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress, Collapse,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';

function SignIn({ signUpCallback }) {
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
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
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
          <Collapse in={authError} sx={{ mt: 2, mb: 1 }}>
            <Alert severity="error">Password is incorrect.</Alert>
          </Collapse>
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
};

SignIn.defaultProps = {
  signUpCallback: (event) => { event.preventDefault(); },
};

export default SignIn;
