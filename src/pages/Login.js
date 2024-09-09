import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/signin', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({
                    email: email, 
                    password: password, 
                })
            });

            const data = await response.json(); 
            if (response.ok) { // triggers if the status response is not 200-299, 
                localStorage.setItem('token', data.token);  // save the jwt token in local storage
                window.location.href = '/home'; // redirects to home page
            }
            else {
                throw new Error(data.message); 
            }
        }
        catch(error){
            console.error('Error Signing in:', error);
        }
    }

    return (
        <Box sx = {{display: 'flex', justifyContent: 'center'}}>
            <div style = {{width: '35%', height: '275px', backgroundColor: "white", minWidth: '450px', borderRadius: '20px', outline: 'solid 1px black', padding: '40px'}}>
                
                <>
                <h3 style = {{marginBottom: '0px'}}>Email</h3>
                <input style = {{marginBottom: '20px', height: '30px', width: '98%'}} value = {email} onChange = {(e) => setEmail(e.target.value)}>

                </input>
                <h3 style = {{marginBottom: '0px'}}>Password</h3>
                <input style = {{marginBottom: '10px', height: '30px', width: '98%'}} value = {password} onChange = {(e) => setPassword(e.target.value)}>

                </input>
                <div>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
                <Button sx = {{width: '100%', backgroundColor: '#00c691', '&:hover': {
                            backgroundColor: '#00a67e'
                        }}}
                        disableRipple
                        onClick = {handleSignin}
                        >
                        <Typography sx = {{textTransform: 'none', color: "white", fontSize: '20px'}}>
                            Sign in
                        </Typography>
                </Button>
                </div>
                </>
            </div>
        </Box>

    );
}

export default Login