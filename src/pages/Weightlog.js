import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';

function WeightLog() {
    // setting the weight value in the weight input box
    const [weight, setWeight] = useState('');
    // setting the data for the weight entry
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [entries, setEntry] = useState([]); 

    // function to handle whenever the user inputs anything
    const handleInput = (event) => {
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8 && value >= 0){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setWeight(value);
        }

    };

    const addEntry = () => {
        const newEntry = {
            weight: parseFloat(weight), 
            date: selectedDate.toLocaleDateString(),
        }
        setEntry([...entries, newEntry]); 
        setWeight('');
    }

    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };






    return (
            <div>
                <div className = {styles['date-container']}>
                    <h3>Log Entry For:</h3>
                    <DateSelector onDateChange={updateDate}/>
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
                        onClick = {addEntry}
                    >
                        Save
                    </button>
                </div>

                <div className = {styles['weight-entry-table']}>
                    <table 
                        style = {{
                            width: '65%'
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: '#00c691', color: 'white' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd', width: '45%'}}>Date</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd', width: '35%'}}>Weight</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd', width: '20%'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                {/* First column with a static value "Weight" */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{entry.date}</td>
                                {/* Second column with the date of the entry */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center'  }}>{entry.weight} lbs</td>
                                {/* Third column with the weight value and "lbs" unit */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>X</td>
                            </tr>
                        ))}

                        </tbody>


                    </table>
                </div>
                
            </div>

    );
}

export default WeightLog;
