import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';

function WeightLog() {
    const [weight, setWeight] = useState('');

    // function to handle whenever the user inputs anything
    const handleInput = (event) => {
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setWeight(value);
        }
        
    };





    return (
            <div>
                <div className = {styles['date-container']}>
                    <h3>Log Entry For:</h3>
                    <DateSelector/>
                </div> 
                <hr></hr>
                <div className = {styles['weight']}> 
                    <h4>Enter weigh-in</h4>
                    <input // input for the weight log of the day
                        name = 'weight' 
                        type = 'number' // user can only input numbers
                        className = {styles['weight-input']}
                        onChange={handleInput}
                        value={weight} // value inside the input is whatever weight value currently is
                        min = '0' // input cannot be negative

                    />
                    <span className = {styles['unit']}>lbs</span>
                    
                    <button
                        className = {styles['save-button']}
                    >
                        Save
                    </button>
                </div>
                
            </div>

    );
}

export default WeightLog;
