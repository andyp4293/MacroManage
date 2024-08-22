import React from 'react';
import '../styles/Weightlog.css';

function WeightLog() {
    return (
            <div className="weight-log">
                <div className="date-container">
                    <label htmlFor="date">Date: </label>
                    <input type="date" id="date-selector" defaultValue="2024-08-19" />
                </div>
            </div>
    );
}

export default WeightLog;
