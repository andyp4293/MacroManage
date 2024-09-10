import React, {useState} from 'react';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';


const ChatBox = ({open, onClose}) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); 

  const handlePrompt = async () => {
    setMessages((prevMessages) => [...prevMessages, `You: ${prompt}`]);
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
    setMessages((prevMessages) => [...prevMessages, `Bot: ${data.message}`]);
    setPrompt(''); 

    }
    catch (error) {
      console.log('Error sending chat prompt:', error)
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>
              hello
          </DialogTitle>
          <DialogContent sx = {{display: 'flex',  flexDirection: 'column', alignItems: 'center'}}>
              <div>
              {messages.map((msg, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    {msg}
                  </div>
                ))}
              </div>

              <div style = {{display: 'flex', justifyContent: 'center', width: '70%'}}>
              <input style = {{width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center'}} value = {prompt} onChange ={(e) => setPrompt(e.target.value)} placeholder="Type a message...">

              </input>
              <Button onClick = {handlePrompt}>
                Send
              </Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatBox;
