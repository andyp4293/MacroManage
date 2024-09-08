import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import {jwtDecode} from 'jwt-decode'; // Correct import

function Navbar() {
    const token = localStorage.getItem('token');
    let username = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);  // Check token structure
            const currentTime = Date.now() / 1000; // Current time in seconds

            // Check if the token is expired
            if (decodedToken.exp > currentTime) {
                username = decodedToken.username || decodedToken.user || null; // Adjust based on token structure
                console.log('Token is valid, username:', username);
            } else {
                localStorage.removeItem('token'); // Remove token if expired
                console.log('Token expired');
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            localStorage.removeItem('token'); // Remove token if invalid
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
                        // If token is valid, show a circle with the first letter of the username
                        <li style={{ marginRight: '10px', marginBottom: '-15px' }}>
                            <div
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white', // Adjust the color as needed
                                    color: 'black',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    marginTop: '-25px',
                                    marginBottm: '-20px'
                                }}
                            >
                                {username.charAt(0).toUpperCase()}
                            </div>
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
