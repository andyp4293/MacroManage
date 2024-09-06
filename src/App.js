import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes
import Navbar from './components/Navbar';
import Calculator from './pages/Calculator';
import WeightLog from './pages/Weightlog';
import FoodLog from './pages/Foodlog';
import Login from './pages/Login'; 


function App() {
    return (
        // Uses router react component for page navigation
        <Router>
            <div>
                <Navbar />
                <Routes>  
                    {/*Displays pages depending on the link */}
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/food-log" element={<FoodLog />} />
                    <Route path="/weight-log" element={<WeightLog />} />
                    <Route path ='/login' element = {<Login/>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
