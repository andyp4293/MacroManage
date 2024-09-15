import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const formIsIncomplete = !password || !email; // cannot click sign in button if all fields are not filled out

    const [loginError, setLoginError] = useState(false); 

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
                <div style={{
                    width: '35%', 
                    minHeight: 'auto', 
                    backgroundColor: "white", 
                    minWidth: '450px', 
                    borderRadius: '20px', 
                    border: '1px solid #ddd', 
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
                    padding: '30px',
                    fontFamily: 'Arial, sans-serif'
                }}>
                
                <>
                <div className = 'email-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ marginBottom: '5px', fontWeight: '500' }}>Email</h5>
                    {emailError && <h5 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Please enter a valid email address.</h5>}
                </div>
                    <input style={{
                        marginBottom: '0px',
                        height: '25px', 
                        width: '100%', 
                        padding: '8px', 
                        fontSize: '16px', 
                        border: `1px solid ${emailError ? 'red' : '#ccc'}`, 
                        borderRadius: '5px',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                    }} 
                    value={email} 
                    onChange={(e) => {
                        const emailInput = e.target.value;
                        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput) || e.target.value === '';
                        setEmail(emailInput);
                        setEmailError(!isValidEmail);
                        e.target.style.boxShadow = `0 0 3px ${!isValidEmail ? 'red' : '#66afe9'}`;
                    }}
                    onFocus={(e) => {
                        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value) || email === '';
                        e.target.style.boxShadow = `0 0 3px ${!isValidEmail ? 'red' : '#66afe9'}`;
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = 'none')} 
                    />

                    <div className = 'password-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h5 style={{ marginBottom: '5px', fontWeight: '500' }}>Password</h5>
                        {passwordError && <h5 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Password must be at least 8 characters long.</h5>}
                    </div>
                    <input style={{
                        marginBottom: '0px', 
                        height: '25px', 
                        width: '100%', 
                        padding: '8px', 
                        fontSize: '16px', 
                        border: `1px solid ${passwordError ? 'red' : '#ccc'}`, 
                        borderRadius: '5px',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                    }} 
                    value={password} 
                    onChange={(e) => {
                        const passwordInput = e.target.value;
                        const isValidPassword = passwordInput.length >= 8 || passwordInput === '';
                        setPassword(passwordInput);
                        setPasswordError(!isValidPassword);
                        e.target.style.boxShadow = `0 0 3px ${!isValidPassword ? 'red' : '#66afe9'}`;
                    }}
                    onFocus={(e) => {
                        const isValidPassword = password.length >= 8 || password === '';
                        e.target.style.boxShadow = `0 0 3px ${!isValidPassword ? 'red' : '#66afe9'}`;
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = 'none')} 
                    />

                <div>
                <p style={{ fontSize: '14px', textAlign: 'center' }}>Don't have an account? <a href="/signup">Sign up</a></p>
                <Button sx={{
                                width: '100%', 
                                backgroundColor: '#00c691', 
                                '&:hover': { backgroundColor: '#00a67e' },
                                borderRadius: '5px',
                                transition: 'all 0.2s ease',
                                padding: '10px',
                                cursor: formIsIncomplete ? 'not-allowed' : 'pointer'
                            }}
                                disableRipple
                                onClick={() => {
                                    if (!passwordError && !emailError && !formIsIncomplete) { // sign up only goes through if all inputs are valid and none are empty

                                        handleSignin();
                                    }
                                }}
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