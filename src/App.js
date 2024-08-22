import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes
import Navbar from './components/Navbar';
import Calculator from './pages/Calculator';
import Weightlog from './pages/Weightlog';


function App() {
    return (
        // Uses router react component for page navigation
        <Router>
            <div>
                <Navbar />
                <Routes>  
                    {/*Displays pages depending on the link */}
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/weight-log" element={<Weightlog />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
