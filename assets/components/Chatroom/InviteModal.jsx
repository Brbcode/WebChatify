import React, { useRef, useState } from 'react';
import {
  Button,
  Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputBase, Paper,
} from '@mui/material';
import PropTypes from 'prop-types';
import { AddBox, Person } from '@mui/icons-material';
import Api from '../../api';

function InviteModal({ open, onClose, chatId }) {
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

  const handleJoin = async () => {
    const promises = participants.filter((p) => p.status !== 'success').map(
      (p, index) => Api.post('join/chat', { user: p.label, chatroom: chatId })
        .then((res) => {
          setParticipants((prev) => {
            const updatedParticipants = [...prev];
            updatedParticipants[index] = { status: 'success', label: prev[index].label };

            return [...updatedParticipants];
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Invite your friends</DialogTitle>
      <DialogContent>
        <Paper
          sx={{
            p: '2px 4px', display: 'flex', alignItems: 'center', mb: 1,
          }}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleJoin}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

InviteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
};

export default InviteModal;
