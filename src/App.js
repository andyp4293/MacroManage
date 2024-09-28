import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import Navbar from './components/Navbar';
import Calculator from './pages/Calculator';
import WeightLog from './pages/Weightlog';
import FoodLog from './pages/Foodlog';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 

function App() {
    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F2F2F2' }}>
                
                <div style={{ height: 'auto', backgroundColor: '#343d46', }}>
                    <Navbar />
                </div>
                
                <div style={{
                    flex: 1,                         
                    width: 'auto',              
                    display: 'flex',
                    justifyContent: 'center',
                    overflowY: 'auto',     
                    height: '100%'
                }}>
                    <Routes>  
                        <Route path="/calculator" element={<Calculator />} />
                        <Route path="/food-log" element={<FoodLog />} />
                        <Route path="/weight-log" element={<WeightLog />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
