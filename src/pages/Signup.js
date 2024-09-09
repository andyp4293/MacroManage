import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/signup', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({
                    email: email, 
                    password: password, 
                    username: username, 
                })
            });

            if (!response.ok) { // triggers if the status response is not 200-299, 
                throw new Error(response.json().message); 
            }
            window.location.href = '/login'; // redirects to login page
        }

        catch(error){
            console.error('Error Signing up:', error);
        }
    }

    return (
        <Box sx = {{display: 'flex', justifyContent: 'center'}}>
            <div style = {{width: '35%', height: '275px', backgroundColor: "white", minWidth: '450px', borderRadius: '20px', outline: 'solid 1px black', padding: '40px'}}>

                <h3 style = {{marginBottom: '0px'}}>Username</h3>
                <input style = {{marginBottom: '10px', height: '30px', width: '98%'}} value = {username} onChange = {(e) => setUsername(e.target.value)}>

                </input>

                <h3 style = {{marginBottom: '0px', marginTop: '-15px'}}>Email</h3>
                <input style = {{marginBottom: '20px', height: '30px', width: '98%'}} value = {email} onChange = {(e) => setEmail(e.target.value)}>

                </input>
                <h3 style = {{marginBottom: '0px'}}>Password</h3>
                <input style = {{marginBottom: '10px', height: '30px', width: '98%'}} value = {password} onChange = {(e) => setPassword(e.target.value)}>

                </input>
                <h3 style = {{marginBottom: '0px'}}>Confirm Password</h3>
                <input style = {{marginBottom: '10px', height: '30px', width: '98%'}}>
                </input>

                <div>
                <p>Already have an account? <a href="/login">Sign in</a></p>
                <Button sx = {{width: '100%', backgroundColor: '#00c691', '&:hover': {
                            backgroundColor: '#00a67e'
                        }}}
                        disableRipple
                        onClick = {handleSignup}
                        >
                        <Typography sx = {{textTransform: 'none', color: "white", fontSize: '20px'}}>
                            Sign up
                        </Typography>
                </Button>
                </div>
            </div>
        </Box>

    );
}

export default Signup