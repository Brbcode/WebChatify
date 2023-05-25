import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Paper,
  TextField,
} from '@mui/material';
import { AddBox, Person } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Api from '../../api';

function CreateChatroom({ onCreate, onClose }) {
  const [chat, setChat] = useState(null);
  const [participants, setParticipants] = useState([]);
  const participantInputRef = useRef(null);

  const addParticipant = () => {
    const component = participantInputRef.current.firstChild;
    const participant = component.value;

    if (participant === '') {
      return;
    }

    setParticipants((prev) => [...prev, { status: 'waiting', label: participant }]);
    component.value = '';
  };

  const handleJoin = async (chatData) => {
    const promises = participants.filter((p) => p.status !== 'success').map(
      (p, index) => Api.post('join/chat', { user: p.label, chatroom: chatData.id })
        .then((res) => {
          setParticipants((prev) => {
            const updatedParticipants = [...prev];
            updatedParticipants[index] = { status: 'success', label: prev[index].label };
            return [...prev];
          });

          return res;
        })
        .catch((res) => {
          setParticipants((prev) => {
            const updatedParticipants = [...prev];
            updatedParticipants[index] = { status: 'error', label: prev[index].label };
            return updatedParticipants;
          });

          return res;
        }),
    );

    const responses = await Promise.all(promises);

    return promises.length === 0
      ? false
      : responses.some((response) => response.name === 'AxiosError');
  };

  const handleCreate = async () => {
    const chatroomTitle = document.getElementById('chatroom-title').value;

    if (chatroomTitle === '') {
      return;
    }

    if (chat !== null) {
      const hasBadResponse = await handleJoin(chat);

      if (!hasBadResponse) {
        window.dispatchEvent(new CustomEvent('notification', {
          detail: {
            severity: 'success',
            message: 'Chat created successfully',
          },
        }));
        onCreate(chat);
        onClose();
      }
      return;
    }

    Api.post(`chat/${chatroomTitle}`)
      .then(async ({ data }) => {
        setChat(data);

        const hasBadResponse = await handleJoin(data);

        if (!hasBadResponse) {
          window.dispatchEvent(new CustomEvent('notification', {
            detail: {
              severity: 'success',
              message: 'Chat created successfully',
            },
          }));
          onCreate(data);
          onClose();
        }
      })
      .catch(() => { /* ignore */ });
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <DialogTitle>New Chatroom</DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Box
          component="form"
          sx={{
            pt: 0.5, display: 'flex', flexDirection: 'column', gap: 1,
          }}
        >
          <TextField id="chatroom-title" label="Title" variant="outlined" size="small" disabled={chat !== null} />
          <Paper
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              ref={participantInputRef}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Add participant"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  addParticipant();
                }
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="button" aria-label="add" sx={{ p: '5px' }} onClick={() => addParticipant()}>
              <AddBox color="primary" />
            </IconButton>
          </Paper>
          <Paper
            component="ul"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              listStyle: 'none',
              p: 0.5,
              m: 0,
              minHeight: '90px',
            }}
          >
            {
              participants.map(({ status, label }) => (
                <Chip
                  icon={<Person color={status === 'waiting' ? undefined : status} />}
                  key={label}
                  label={label}
                  onDelete={() => {
                    setParticipants((prev) => prev.filter((p) => p.label !== label));
                  }}
                />
              ))
            }
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

CreateChatroom.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
};

CreateChatroom.defaultProps = {
  onClose: () => {},
  onCreate: () => {},
};

export default CreateChatroom;
