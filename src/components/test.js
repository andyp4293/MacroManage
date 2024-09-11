import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const Test = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Chat Messages Section */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '8px',
          backgroundColor: '#f1f1f1',
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={msg} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          display: 'flex',
          padding: '8px',
          borderTop: '1px solid #ccc',
          backgroundColor: '#fff',
        }}
      >
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ marginRight: '8px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Test;
