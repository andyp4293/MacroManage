import React from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';

function WeightLog() {
    return (
            <div>
                <div className = {styles['date-container']}>
                    <h3>Log Entry For:</h3>
                    <DateSelector/>
                </div> 
                <hr></hr>
                <div className = {styles['weight-input']}> 
                    <h4>Enter weigh-in</h4>
                    <input // input for the weight log of the day
                        name = 'weight' 
                        type = 'number' // user can only input numbers
                        placeholder = 'lbs' // displays lbs on the right side of the 
                    />
                </div>
                
            </div>

    );
}

export default WeightLog;
