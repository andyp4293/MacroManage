import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes
import Navbar from './Navbar';
import Calculator from './Calculator';


function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>  
                    <Route path="/" element={<Calculator />} />
                    <Route path="/calculator" element={<Calculator />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
