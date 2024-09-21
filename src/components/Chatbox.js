import React, {useState} from 'react';
import { Box, List, ListItem, TextField, Button} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { IoSend } from "react-icons/io5";



const ChatBox = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); 
  const [isOpen, setIsOpen] = useState(false); 
  
  const toggleChatBox = () => {
    setIsOpen(!isOpen); 
  }

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
        height: isOpen ? '400px' : '37px', // changes height of the box based on whether or not the chatbox is closed
        width: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px 8px 0 0',  
        overflow: 'hidden',
        position: 'fixed', 
        bottom: 0,  
        right: 20,  
        zIndex: 1000,  
      }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px',
            backgroundColor: '#00c691',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}  onClick={toggleChatBox}>
            <Box>Chat</Box>
          </Box>

          {/* conditionally render the chat content when the box is open */}
          {isOpen && (
            <>
              <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                padding: '8px',
                backgroundColor: '#f1f1f1',
              }}>
                <List>
                  {messages.map((msg, index) => (
                    <ListItem key={index} sx={{
                      backgroundColor: '#00c691',
                      marginBottom: '1%',
                      padding: '10px 15px',
                      borderRadius: '10px',
                      display: 'block',
                      width: '100%', 
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      wordWrap: 'break-word'
                    }}>
                      <ReactMarkdown>{msg}</ReactMarkdown>
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
                <TextField
                  placeholder="Type a message"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handlePrompt();
                    }
                  }}
                  sx={{ marginRight: '8px' }}
                />
                <Button onClick={handlePrompt} variant="contained" sx={{ width: '20%', backgroundColor: '#00c691', '&:hover': {
                      backgroundColor: '#00a67e'
                  }}}>
                  <IoSend/>
                </Button>
              </Box>
            </>
          )}
        </Box>
    </div>
  );
};

export default ChatBox;
