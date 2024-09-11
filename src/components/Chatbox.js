import React, {useState} from 'react';
import { Box, List, ListItem, ListItemText, TextField, Button} from '@mui/material';


const ChatBox = ({open, onClose}) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); 

  const handlePrompt = async () => {
    setMessages((prevMessages) => [...prevMessages, `You: ${prompt}`]);
    setPrompt(''); 
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify({
            prompt: prompt,
        })
    });
    const data = await response.json(); 
    setMessages((prevMessages) => [...prevMessages, `MacroManage: ${data.message}`]);

    }
    catch (error) {
      console.log('Error sending chat prompt:', error)
    }
  }

  return (
    <div>
      <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '400px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
          <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '8px',
                backgroundColor: '#f1f1f1',
              }}>
              <List>
              {messages.map((msg, index) => (
                  <ListItem key={index} sx = {{backgroundColor: '#00c691', marginBottom:'5px', borderRadius: '10px', paddingTop: '0px', paddingBottom: '0px'}}>
                    <ListItemText primary = {msg}/>
                  </ListItem>
                ))}
              </List>
              </Box>

              <Box sx={{
                display: 'flex',
                padding: '8px',
                borderTop: '1px solid #ccc',
                backgroundColor: '#fff',
              }}>
                
              <TextField placeholder="Type a message"
                variant = "outlined"
                fullWidth
                size = "small"
                value = {prompt}
                onChange = {(e) => setPrompt(e.target.value)}
                onKeyDown = {(e) => {
                  if (e.key === "Enter"){
                      handlePrompt();
                  }
                }}
                sx={{ marginRight: '8px' }}>

              </TextField>
              <Button onClick = {handlePrompt} variant="contained" color="primary">
                Send
              </Button>
            </Box>
        </Box>
    </div>
  );
};

export default ChatBox;
