import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

    // func to add a new weight entry whenever user presses save
    const addEntry = () => {
        const newEntry = {
            weight: parseFloat(weight), 
            date: selectedDate.toLocaleDateString()
        }
        setEntry([...entries, newEntry]); 
        setWeight('');
    }
    
    const deleteEntry = (key) => {
        const updatedEntries = [...entries];
        updatedEntries.splice(key,1);
        setEntry(updatedEntries);
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
                                {/* first column with date value of entry */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{entry.date}</td>
                                {/* second column with weight value of entry */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center'  }}>{entry.weight} lbs</td>
                                {/* third column with action options of editing or deleting the entry */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }} className = {styles['actionButtons']}>
                                    
                                        <button className = {styles['actionButton']}>
                                            <EditIcon></EditIcon>
                                        </button>
                                        <button 
                                        className = {styles['actionButton']}
                                        onClick = {() => deleteEntry(index)}
                                        >
                                            <DeleteIcon></DeleteIcon>
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
