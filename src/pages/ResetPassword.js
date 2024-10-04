import React, { useState} from 'react';
import {Box, Button, Typography, CircularProgress} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLocation } from 'react-router-dom';


const backendUrl = process.env.REACT_APP_APIURL;

function Signup() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const query = new URLSearchParams(useLocation().search);
    const resetToken = query.get('token');  // get reset token from url 

    
    const [error, setError] = useState(''); 

    const formIsIncomplete = !password || !confirmPassword; // cannot click sign up button if all fields are not filled out

    const [loading, setLoading] = useState(false); // for when the frontend is waiting to get a response back 

    const notifySuccess = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000, // slose after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'colored',
        });
    };

    const handleReset = async () => {
        setLoading(true); 

        try {
            const response = await fetch(`${backendUrl}/api/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: password
                })
            });

            if (response.ok) {
                response.json().then(data => {
                    notifySuccess(data.message); 
                });
                setError(''); 
                navigate('/login'); // redirects to login page if no errors
            } else {
                response.json().then(data => {
                    setError(data.message); 
                });
            }

        } catch (error) {
            console.error('Error Signing up:', error);
            setError(error); 
        }
    };



    return (
        <Box sx = {{display: 'flex', justifyContent: 'center', width: 
            {
                xs: '90%',
                sm: '90%',  
                md: '90%',  
                lg: '35vw', 
            },
        }}>
        <div style={{
            width: '100%',
            backgroundColor: "white", 
            borderRadius: '20px', 
            border: '1px solid #ddd', 
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
            padding: '7%',
            paddingTop: '2%',
            height: 'fit-content',
            margin: '2vh', 
            fontFamily: 'Arial, sans-serif'
        }}>
        <div style = {{width: '100%', margin: '0', marginTop: '2%', display: 'flex', marginBottom: '0', flexDirection: 'column', alignItems: 'center'}}>
            <LockOutlinedIcon sx = {{fontSize: '30px'}}/>
            <h3 style = {{width: '100%', margin: '0', marginTop: '2%', display: 'flex', marginBottom: '0', justifyContent: 'center', alignItems: 'center'}}>Sign up</h3>
        </div>





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
        onKeyDown = {(e) => {
            if (e.key === "Enter"){
                if (!loading && !passwordError && !formIsIncomplete && !confirmPasswordError){
                    handleReset(); 
                }
        }
        }}
    
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

        <Button 
            sx={{
                width: '100%', 
                backgroundColor: '#343d46', 
                '&:hover': { backgroundColor: '#4f5b66' },
                borderRadius: '5px',
                transition: 'all 0.2s ease',
                padding: '5px',
                cursor: (formIsIncomplete || passwordError || confirmPasswordError) ? 'not-allowed' : 'pointer'
            }}
            disableRipple
            disabled = {loading}
            onClick={() => {
            if (!passwordError && !confirmPasswordError && !formIsIncomplete) { // sign up only goes through if all inputs are valid and none are empty

                handleReset();
            }
            }}
        >
        <Typography sx={{ textTransform: 'none', color: "white", fontSize: '18px', fontWeight: '500' }}>
            Reset Password
        </Typography>
        </Button>

        {/* show loading spinner when loading */}
        {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <CircularProgress sx = {{color: '#343d46'}} size={24} />
            </Box>
        )}
        {error && <Box className = 'error-message' style={{width: '100%', borderRadius: '4px', display: 'flex', justifyContent: 'center', height: '30px', border: '', color: 'red'}} >
            <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' , display: 'flex', alignItems: "center"}}><ErrorIcon style = {{fontSize: '20px'}}/> {error}</h4>
        </Box>}
    </div>
    </Box>



    );
}

export default Signup