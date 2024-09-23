import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { IoSend } from "react-icons/io5";



const ChatBox = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); 
  const [isOpen, setIsOpen] = useState(false); 
  const [loading, setLoading] = useState(false);  // state for whether or not the bot is loading an answer
  const [dots, setDots] = useState('•'); // state for the dots loading animation 

  const messagesEndRef = useRef(null); 

  const toggleChatBox = () => {
    setIsOpen(!isOpen); 
  }

  const handlePrompt = async () => {
    setMessages((prevMessages) => [...prevMessages, `You: ${prompt}`]);
    setLoading(true); 
    setPrompt(''); 
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify({
            history: messages, 
            prompt: prompt,
        })
    });
    const data = await response.json(); 
    setMessages((prevMessages) => [...prevMessages, `MacroManage: \n${data.message}`]);

    }
    catch (error) {
      console.log('Error sending chat prompt:', error)
    }
    finally {
      setLoading(false); 
    }
  }

  // scroll to the bottom of the conversation when the conversation is updated
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // loading animation for when the answer is waiting to be returned
  useEffect(() => {
      if (loading) {
          const interval = setInterval(() => {
              setDots((prevDots) => (prevDots.length < 3 ? prevDots + '•' : '•'));
          }, 500);
          return () => clearInterval(interval); 
      } else {
          setDots('•'); 
      }
  }, [loading]);

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
                backgroundColor: 'white',
              }}>
                  {messages.map((msg, index) => (
                    <div key={index} style={{
                      backgroundColor: '#F2F2F2',
                      borderRadius: '10px',
                      display: 'block',
                      width: 'auto', 
                      marginBottom: '2%', 
                      padding: '10px', 
                      paddingTop: '1px',
                      wordWrap: 'break-word',
                      color: 'black', 
                    }}>
                      <ReactMarkdown>{msg}</ReactMarkdown>
                    </div>
                  ))}
                {loading && (
                    <div style={{
                      backgroundColor: '#F2F2F2',
                      borderRadius: '10px',
                      display: 'block',
                      width: 'auto', 
                      marginBottom: '2%', 
                      padding: '10px', 
                      paddingTop: '1px',
                      wordWrap: 'break-word',
                      color: 'black', 
                    }}>
                        {dots}
                    </div>
                )}
                <div ref={messagesEndRef} />
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
