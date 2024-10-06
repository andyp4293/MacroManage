import React, { useState, useEffect} from 'react';
import {Box, Button, Typography, CircularProgress} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import 'react-toastify/dist/ReactToastify.css';

const backendUrl = process.env.REACT_APP_APIURL;

function Login({onLogin}) {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) { // if a user is logged in and tries to access the login page they will be redirected to food log
            navigate('/food-log');
        }
    }, [token, navigate]);  


    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false); 
    const formIsIncomplete = !password || !email; // cannot click sign in button if all fields are not filled out

    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); // for when the frontend is waiting to get a response back 

    const notifySuccess = () => {
        toast.success('Logged in successfully!', {
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

    const handleSignin = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/users/signin`, {
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
                navigate('/food-log'); // redirects to food page
                onLogin(); 
                notifySuccess(); 
            }
            else {
                setError(data.message); 
            }
        }
        catch(error){
            console.error('Error Signing in:', error);
        }
        finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        setError(''); 
    }, [email, password])

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
                    <h3 style = {{width: '100%', margin: '0', marginTop: '2%', display: 'flex', marginBottom: '0', justifyContent: 'center', alignItems: 'center'}}>Login</h3>
                </div>
                
                <>
                <div className = 'email-container' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-2%' }}>
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
                    onKeyDown = {(e) => {
                        if (e.key === "Enter"){
                            if (!loading && !passwordError && !emailError && !formIsIncomplete)
                                handleSignin();
                        }
                    }}
                    />

                <div>
                <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                    <p style={{ fontSize: '14px', textAlign: 'center' }}>Don't have an account? <a href="/signup">Sign up</a></p>
                    <p style={{ fontSize: '13px', alignItems: 'center' }}><a href="/forgot-password">Forgot Password</a></p>
                </div>

                <Button sx={{
                                width: '100%', 
                                backgroundColor: '#343d46', 
                                '&:hover': { backgroundColor: '#4f5b66' },
                                borderRadius: '5px',
                                transition: 'all 0.2s ease',
                                padding: '5px',
                                cursor: (formIsIncomplete || passwordError || emailError)  ? 'not-allowed' : 'pointer'
                            }}
                                disableRipple
                                onClick={() => {
                                    if (!passwordError && !emailError && !formIsIncomplete) { // sign up only goes through if all inputs are valid and none are empty

                                        handleSignin();
                                    }
                                }}
                                disabled = {loading}
                        >
                        <Typography sx = {{textTransform: 'none', color: "white", fontSize: '20px'}}>
                            Sign in
                        </Typography>
                </Button>
                    {/* show loading spinner when loading */}
                    {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', marginBottom: '0' }}>
                        <CircularProgress sx = {{color: '#343d46'}} size={24} /> 
                        <p>May take a while for server to respond, please wait up to 1 minute. </p>
                    </Box>
                    )}
                    {error && <Box className = 'error-message' style={{width: '100%', borderRadius: '4px', display: 'flex', justifyContent: 'center', height: '30px', border: '', color: 'red'}} >
                        <h4 style={{ color: 'red', fontSize: '12px', marginBottom: '0px' , display: 'flex', alignItems: "center"}}><ErrorIcon style = {{fontSize: '20px'}}/> {error}</h4>
                    </Box>}
                </div>
                </>
            </div>
        </Box>

    );
}

export default Login