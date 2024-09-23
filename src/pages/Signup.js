import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

function Signup() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [username, setUsername] = useState('');
    
    const [error, setError] = useState(''); 

    const formIsIncomplete = !password || !email || !confirmPassword; // cannot click sign up button if all fields are not filled out

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
              response.json().then(data => {
                  setError(data.message); 
              });
            }
            else {
              setError(''); 
              window.location.href = '/login'; // redirects to login page if no errors
            }
        }

        catch(error){
            console.error('Error Signing up:', error);
        }
    }




    return (
    <Box sx={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
      <div style={{
        width: '35vw',
        minWidth: '400px', 
        backgroundColor: "white",  
        borderRadius: '20px', 
        height: 'fit-content',
        border: '1px solid #ddd', 
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
        padding: '7%',
        fontFamily: 'Arial, sans-serif'
      }}>

        <h5 style={{ marginBottom: '5px', fontWeight: '500' , marginTop: '-5px'}}>Username</h5>
        <input style={{
          marginBottom: '0px', 
          height: '25px', 
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
        <input type = 'password'
        style={{
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

        <div className = 'confirm-password-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5 style={{ marginBottom: '5px', fontWeight: '500' }}>Confirm Password</h5>
          {confirmPasswordError && <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' }}>Passwords do not match.</h4>}
        </div>
        <input type = 'password'
        style={{
          marginBottom: '10px', 
          height: '25px', 
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
            padding: '5px',
            cursor: (formIsIncomplete || passwordError || confirmPasswordError || emailError) ? 'not-allowed' : 'pointer'
          }}
          disableRipple
          onClick={() => {
            if (!passwordError && !confirmPasswordError && !emailError && !formIsIncomplete) { // sign up only goes through if all inputs are valid and none are empty

              handleSignup();
            }
          }}
        >
          <Typography sx={{ textTransform: 'none', color: "white", fontSize: '18px', fontWeight: '500' }}>
            Sign up
          </Typography>
        </Button>
        {error && <Box className = 'error-message' style={{width: '100%', borderRadius: '4px', display: 'flex', justifyContent: 'center', height: '30px', border: '', color: 'red'}} >
          <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' , display: 'flex', alignItems: "center"}}><ErrorIcon style = {{fontSize: '20px'}}/> {error}</h4>
        </Box>}
      </div>
    </Box>

  

    );
}

export default Signup