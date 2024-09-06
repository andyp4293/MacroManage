import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navigation">
            <Link className="home" to="/">MacroManage</Link>
            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
            <ul className="nav-links">
                {/*Link element creates link to different pages*/}
                    <li><Link to="/weight-log">Weight Log</Link></li>
                    <li><Link to="/food-log">Food Log</Link></li>
                    <li><Link to="/calculator">Calculator</Link></li> 
            </ul>
            <ul>
                <li><Link to="/login">Login</Link></li> 
            </ul>
            </div>
        </nav>
    );
}

export default Navbar;
