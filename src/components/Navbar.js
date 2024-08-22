import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    return (
        <nav className="navigation">
            <Link className="home" to="/">MacroManage</Link>
            <ul className="nav-links">
                {/*Link element creates link to different pages*/}
                <li><Link to="/calculator">Calculator</Link></li> 
                <li><Link to="/food-log">Food Log</Link></li>
                <li><Link to="/weight-log">Weight Log</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
