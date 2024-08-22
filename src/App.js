import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes
import Navbar from './Navbar';
import Calculator from './Calculator';
import Weightlog from './Weightlog';


function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>  
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/weight-log" element={<Weightlog />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
