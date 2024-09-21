import React, {useState} from 'react';
import { Link } from 'react-router-dom';
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
            <Link className="home" to="/">MacroManage</Link>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <ul className="nav-links">
                    <li><Link to="/weight-log">Weight Log</Link></li>
                    <li><Link to="/food-log">Food Log</Link></li>
                    <li><Link to="/calculator">Calculator</Link></li> 
                </ul>
                <ul>
                    {username ? (
                        // if token is is valid, display profile picture rather than login button
                        <li style={{ marginRight: '10px', marginBottom: '-15px' }}>
                            <div
                                onClick={handleClick}
                                style={{
                                    width: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white', 
                                    color: 'black',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    marginTop: '-25px',
                                    marginBottm: '-20px',
                                    cursor: 'pointer'
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
                        <li><Link to="/login">Login</Link></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
