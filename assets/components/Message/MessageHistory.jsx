import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  CircularProgress, Dialog, DialogContent, DialogTitle, Divider,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  Timeline, TimelineConnector,
  TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator,
} from '@mui/lab';
import { styled } from '@mui/material/styles';
import Api from '../../api';
import TimeParser from '../../utils/TimeParser';

const StyledMessage = styled(Box)(({ theme }) => {
  const addStyle = theme.palette.mode === 'dark' ? ({})
    : ({ boxShadow: '0px 0px 2px 0px #444' });

  return ({
    position: 'relative',
    padding: theme.spacing(1),
    borderRadius: 20,
    background: theme.palette.mode === 'dark' ? '#dadada' : theme.palette.background.default,
    color: '#000',
    overflow: 'hidden',
    minWidth: 100,
    ...addStyle,
  });
});

function MessageHistory({ id, open, onClose }) {
  const [records, setRecords] = useState(null);

  const getContentStyles = () => (records === null
    ? ({
      minWidth: 250,
      minHeight: 250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    })
    : ({
      minWidth: 250,
      minHeight: 250,
    }));
  const renderTimeline = () => (
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent
          sx={{
            width: '90px',
            paddingRight: '6px',
            flex: 'unset',
          }}
        >
          <Chip label="original" />
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot variant="outlined" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <StyledMessage>
            {records[0].from}
          </StyledMessage>
        </TimelineContent>
      </TimelineItem>
      {
        records.map(({ editAt, to }, index, array) => {
          const isLast = index === (array.length - 1);
          const dotColor = isLast ? 'primary' : 'grey';

          return (
            <TimelineItem key={editAt}>
              <TimelineOppositeContent
                sx={{
                  width: '90px',
                  flex: 'unset',
                }}
              >
                <Chip
                  label={
                        TimeParser.parseDateToTimeString(
                          TimeParser.getDateFromMessageData({ editAt }),
                        )
                      }
                />
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={dotColor} />
                {
                  !isLast && <TimelineConnector />
                }
              </TimelineSeparator>
              <TimelineContent>
                <StyledMessage>
                  {to}
                </StyledMessage>
              </TimelineContent>
            </TimelineItem>
          );
        })
      }
    </Timeline>
  );

  useEffect(() => {
    Api.get(`message/records/${id}`)
      .then(({ data }) => {
        setRecords(data);
      })
      .catch(() => { /* Do nothing */ });
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
    >
      <DialogTitle>History</DialogTitle>
      <Divider />
      <DialogContent
        sx={{ ...getContentStyles() }}
      >
        {
          records === null ? <CircularProgress />
            : renderTimeline()
        }
      </DialogContent>
    </Dialog>
  );
}

MessageHistory.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
};

MessageHistory.defaultProps = {
  onClose: () => {},
};

export default MessageHistory;
