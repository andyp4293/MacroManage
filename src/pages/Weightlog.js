import React from 'react';
import DateSelector from '../components/dateSelector'; 
import '../styles/Weightlog.css';

function WeightLog() {
    return (
            <div>
                <h2>Weight Entry For:</h2>
                <DateSelector/>
            </div>
    );
}

export default WeightLog;
