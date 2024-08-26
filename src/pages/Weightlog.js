import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';

function WeightLog() {
    const [weight, setWeight] = useState('');

    const [entries, setEntries] = useState([]);
    // function to handle whenever the user inputs anything
    const handleInput = (event) => {
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setWeight(value);
        }

    };

    const addEntry = () => {
        if (weight !== '') {
            const newEntry = {
                weight: parseFloat(weight),
                date: new Date().toLocaleDateString(), // Get current date in a readable format
            };

            setEntries([...entries, newEntry]); // Add the new entry to the entries array
            setWeight(''); // Clear the input field after adding the entry
        }
    };

    // Function to delete an entry
    const deleteEntry = (index) => {
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);
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

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Measurement</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Amount</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Delete?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>Weight</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.date}</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.weight} lbs</td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => deleteEntry(index)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: '#007bff',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Delete?
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
                
            </div>

    );
}

export default WeightLog;
