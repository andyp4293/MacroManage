import React, { useState} from 'react';
import {Box, Button, Typography} from '@mui/material';

function Login() {

    return (
        <Box sx = {{display: 'flex', justifyContent: 'center'}}>
            <div style = {{width: '35%', height: '200px', backgroundColor: "white", minWidth: '450px', borderRadius: '20px', outline: 'solid 1px black', padding: '40px'}}>
            <h3>Email</h3>
            <input>

            </input>
            <h3>Password</h3>
            <input>

            </input>
            <div>
            <Button sx = {{width: '100%'}}>
                    <Typography sx = {{textTransform: 'none'}}>
                        {'Sign in'}
                    </Typography>
            </Button>
            </div>
            </div>
        </Box>

    );
}

export default Login