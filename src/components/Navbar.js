import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import '../styles/Navbar.css';
import {jwtDecode} from 'jwt-decode'; 

function Navbar() {
    const token = localStorage.getItem('token');
    let username = null;
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // handle logout button open
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // handle logout button close
    const handleClose = () => {
        setAnchorEl(null);
    };

    // handle logging out
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        window.location.href = '/login';  // Redirect to the login page
        handleClose();
    };


    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; 

            // checks if token is expired
            if (decodedToken.exp > currentTime) {
                username = decodedToken.username || decodedToken.user || null;
            } else {
                localStorage.removeItem('token'); // remove token is invalid
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token'); // remove token if invalid
        }
    }

    return (
        <nav className="navigation">
            <div className="left">
                <NavLink className="home" to="/">MacroManage</NavLink>
            </div>
            <div className = 'nav-links'>
            <ul>
                <li><NavLink to="/weight-log">Weight</NavLink></li>
                <li><NavLink to="/food-log">Food</NavLink></li>
                <li><NavLink to="/calculator">Calculator</NavLink></li> 
                {username ? (
                    // if token is is valid, display profile picture rather than login button
                    <li style = {{marginRight: '1vw', marginTop: '0', marginBottom: '0', padding: '0' }} >
                        <div
                            onClick={handleClick}
                            style={{
                                width: '30px',
                                height: '30px',  
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                color: 'black',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                margin: '0',
                                marginLeft: '5px',
                            }}
                        >
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </Menu>

                    </li>
                ) : (
                    // If no token, show login button
                    <li><NavLink to="/login">Login</NavLink></li>
                )}
            </ul>
            </div>
        </nav>
    );
}

export default Navbar;
