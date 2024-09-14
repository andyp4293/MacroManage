import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';

function Signup() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [username, setUsername] = useState('');

    const [error, setError] = useState(''); 

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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' }}>
      <div style={{
        width: '35%', 
        minHeight: 'auto', 
        backgroundColor: "white", 
        minWidth: '450px', 
        borderRadius: '20px', 
        border: '1px solid #ddd', 
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}>

        <h3 style={{ marginBottom: '10px', fontWeight: '500' }}>Username</h3>
        <input style={{
          marginBottom: '20px', 
          height: '35px', 
          width: '100%', 
          padding: '8px', 
          fontSize: '16px', 
          border: '1px solid #ccc', 
          borderRadius: '5px',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          outline: 'none'
        }} 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        />


        <div className = 'email-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '10px', fontWeight: '500' }}>Email</h3>
          {emailError && <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Please enter a valid email address.</h4>}
        </div>
        <input style={{
          marginBottom: '20px',
          height: '35px', 
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
          <h3 style={{ marginBottom: '10px', fontWeight: '500' }}>Password</h3>
          {passwordError && <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Password must be at least 8 characters long.</h4>}
        </div>
        <input style={{
          marginBottom: '20px', 
          height: '35px', 
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

        <div className = 'confirm-password-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '10px', fontWeight: '500' }}>Confirm Password</h3>
          {confirmPasswordError && <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Passwords do not match.</h4>}
        </div>
        <input style={{
          marginBottom: '20px', 
          height: '35px', 
          width: '100%', 
          padding: '8px', 
          fontSize: '16px', 
          border: `1px solid ${confirmPasswordError ? 'red' : '#ccc'}`, 
          borderRadius: '5px',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          outline: 'none'
        }} 
        value={confirmPassword} 
        onChange={(e) => {
          const passwordInput = e.target.value;
          const isValidConfirmPassword = passwordInput === password || passwordInput === '';
          setConfirmPassword(passwordInput);
          setConfirmPasswordError(!isValidConfirmPassword);
          e.target.style.boxShadow = `0 0 3px ${!isValidConfirmPassword ? 'red' : '#66afe9'}`;
        }}
        onFocus={(e) => {
          const isValidPassword = password.length >= 8 || password === '';
          e.target.style.boxShadow = `0 0 3px ${!isValidPassword ? 'red' : '#66afe9'}`;
        }}
        onBlur={(e) => (e.target.style.boxShadow = 'none')} 
        />

        <div>
          <p style={{ fontSize: '14px', textAlign: 'center' }}>Already have an account? <a href="/login" style={{ color: '#007bff' }}>Sign in</a></p>
        </div>

        <Button 
          sx={{
            width: '100%', 
            backgroundColor: '#00c691', 
            '&:hover': { backgroundColor: '#00a67e' },
            borderRadius: '5px',
            transition: 'all 0.2s ease',
            padding: '10px'
          }}
          disableRipple
          onClick={handleSignup}
        >
          <Typography sx={{ textTransform: 'none', color: "white", fontSize: '18px', fontWeight: '500' }}>
            Sign up
          </Typography>
        </Button>
      </div>
    </Box>

  

    );
}

export default Signup