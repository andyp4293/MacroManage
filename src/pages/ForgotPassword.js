import React, { useState, useEffect} from 'react';
import {Box, Button, Typography, CircularProgress} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";


const backendUrl = process.env.REACT_APP_APIURL;

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); // for when the frontend is waiting to get a response back 

    const notifySuccess = () => {
        toast.success('A password reset link has been sent to your email.', {
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

    const checkEmail = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/users/forgotpassword`, { // checks if email is registered
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({
                    email: email,  
                })
            });

            const data = await response.json(); 
            if (response.ok) { // triggers if the status response is not 200-299, 
                notifySuccess(); 
            }
                
            else {
                setError(data.message); 
            }
        }
        catch(error){
            console.error('Error finding email:', error);
        }
        finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        setError(''); 
    }, [email])

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
                    <h3 style = {{width: '100%', margin: '0', marginTop: '2%', display: 'flex', marginBottom: '0', justifyContent: 'center', alignItems: 'center'}}>Forgot Password</h3>
                </div>
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
                    onKeyDown = {(e) => {
                        if (e.key === "Enter"){
                            if (!loading && !emailError){
                                checkEmail();
                            }
                        }
                    }}
                    />


                <div>

                <Button sx={{
                                width: '100%', 
                                backgroundColor: '#343d46', 
                                '&:hover': { backgroundColor: '#4f5b66' },
                                borderRadius: '5px',
                                transition: 'all 0.2s ease',
                                padding: '5px',
                                marginTop: "2vh", 
                                cursor: (emailError)  ? 'not-allowed' : 'pointer'
                            }}
                                disableRipple
                                onClick={() => {
                                    if (!emailError ) { // submit email only if it is a valid email format

                                        checkEmail();
                                    }
                                }}
                                disabled = {loading}
                        >
                        <Typography sx = {{textTransform: 'none', color: "white", fontSize: '20px'}}>
                            Submit
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
                </>
            </div>
        </Box>

    );
}

export default ForgotPassword