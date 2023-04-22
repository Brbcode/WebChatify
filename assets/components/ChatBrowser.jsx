import React from 'react';
import {
  Autocomplete,
  Box, Container, IconButton, InputAdornment, Stack, TextField,
} from '@mui/material';
import { MenuRounded, SearchRounded } from '@mui/icons-material';
import { baseTheme as theme } from '../styles/theme';

function ChatBrowser() {
  return (
    <Box
      sx={{
        height: '100vh',
        [theme.breakpoints.up('sm')]: {
          maxWidth: '424px',
          borderRight: 1,
          borderColor: 'grey.500',
        },
      }}
    >
      <Container component="header" sx={{ py: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton sx={{ p: '10px' }} aria-label="menu">
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
    </Box>
  );
}

export default ChatBrowser;
