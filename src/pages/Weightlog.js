import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

function WeightLog() {
    // setting the weight value in the weight input box
    const [weight, setWeight] = useState('');
    // setting the data for the weight entry
    const [selectedDate, setSelectedDate] = useState(new Date())
    
    // entries is an array for objects that will hold each entry's date and weight
    const [entries, setEntries] = useState([]); 

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
        let weightValue;
        if (weight === ''){
            weightValue = 0; 
        }
        else {
            weightValue = parseFloat(weight)
        }
        

        const newEntry = {
            weight: weightValue, 
            date: selectedDate.toLocaleDateString()
        }
        let newEntries = [...entries, newEntry]; // entries with the new entry added
        
        // sort the entries by most recent, ie most recent date is at index 0 of entries
        newEntries = newEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        setEntries(newEntries); 
        setWeight('');
    }
    
    const deleteEntry = (index) => {
        let updatedEntries = [...entries];
        updatedEntries.splice(index,1);

        // sort the entries by most recent, ie most recent date is at index 0 of entries
        updatedEntries = updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setEntries(updatedEntries);
    }

    // updates the date state whenever the date selector component changes date
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    // EDIT BUTTON FUNCTIONALITY
    // state for the index to edit 
    const [editIndex, setEditIndex] = useState(null); 

    // function to handle if the user clicks the edit button
    const handleEdit = (index, weight) => {
        setEditIndex(index); 
        setNewWeight(weight); 
    }
    // state for the weight edit
    const [newWeight, setNewWeight] = useState('');
    // func for saving the weight edit
    const handleSaveEdit = (index) => {
        const updatedEntries = [...entries]; 
        updatedEntries[index] = {
            ...updatedEntries[index], // specific entry we're editing
            weight: newWeight // updates the weight at the entry to the one in the input box
        }
        setEntries(updatedEntries); 
        setEditIndex(null); 
    }


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
                    <h1>Weight Entries</h1>
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
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center'  }}> 
                                    {editIndex === index 
                                            ? 
                                            <input // if the index of the entry is the one being edited, its weight column becomes an input element
                                                type="number"
                                                value={newWeight}
                                                onChange={(e) => setNewWeight(e.target.value)}
                                                style={{ width: '80px' }}
                                                max = '1000'
                                                min = '0'
                                            />
                                            :
                                            <div>
                                                {entry.weight === '' 
                                                ? '0 lbs' // display 0 lbs if the input is empty
                                                : <div>{entry.weight} lbs</div>
                                                }
                                                
                                            </div>
                                    }
                                </td>
                                {/* third column with action options of editing or deleting the entry */}
                                <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }} className = {styles['actionButtons']}>
                                        {editIndex === index 
                                        ? // if editng index is the index of entry
                                        <div> 
                                            <button 
                                                className = {styles['actionButton']}
                                                onClick = {() => handleSaveEdit(index)}
                                            >
                                                <CheckIcon></CheckIcon>
                                            </button>
                                        </div>
                                        : // if editing index is not the index of the entry
                                        <div className = {styles['actionButtons']}> 
                                            <button 
                                                className = {styles['actionButton']}
                                                onClick = {() => handleEdit(index, entry.weight)}
                                            >
                                                <EditIcon></EditIcon>
                                            </button>
                                            <button 
                                                className = {styles['actionButton']}
                                                onClick = {() => deleteEntry(index)}
                                            >
                                                <DeleteIcon></DeleteIcon>
                                            </button>
                                        </div>
                                        
                                        
                                        }
                                        
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
