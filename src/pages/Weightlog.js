import React, { useState, useCallback, useEffect} from 'react';
import DateSelector from '../components/DateSelector'; 
import styles from '../styles/Weightlog.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';


function WeightLog() {
    const token = localStorage.getItem('token'); // json web token
    // setting the weight value in the weight input box
    const [weight, setWeight] = useState('');
    // setting the data for the weight entry
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [weightLogs, setWeightlogs] = useState([]);



    
    // entries is an array for objects that will hold each entry's date and weight
    const [entries, setEntries] = useState([
        { date: '8/24/2024', weight: 150 },
        { date: '8/23/2024', weight: 152 },
        { date: '8/22/2024', weight: 148 },
        { date: '8/21/2024', weight: 151 },
    ]); 

    // function to handle whenever the user inputs anything
    const handleInput = (event) => {
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8 && value >= 0){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setWeight(value);
        }
    };

    const fetchWeightLogs = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/meals/get_weight_logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
            });

            const weightlogData = await response.json(); 
            setWeightlogs(weightlogData.weightlogs); 

        } catch (error) {
            console.error('Error:', error);
        }
    }, [token]); // token should be included in the dependency array

    useEffect(() => {
        fetchWeightLogs();
    }, [fetchWeightLogs]); // useCallback ensures checkMealLogs doesn't change unnecessarily

    // func to add a new weight entry whenever user presses save
    const addEntry = () => {
        // taken is true if the date selected already has a weight entry associated with it
        const taken = entries.some(entry => entry.date === selectedDate.toLocaleDateString());
        let weightValue;

        if (weight === ''){
            weightValue = 0; 
        }
        else {
            weightValue = parseFloat(weight)
        }

        if (!taken){  // if the date selected isn't taken, just make a new entry
            
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

        else { // if the date is taken, just update the weight on the entry associated with that date
            const index = entries.findIndex(entry => entry.date === selectedDate.toLocaleDateString());
            const updatedEntries = [...entries];
            updatedEntries[index] = {
                ...updatedEntries[index],
                weight: weightValue
            }
            setEntries(updatedEntries);
            setWeight('');
        }   
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
    // ensure the user cannot type a number greater 999.999 or less than 0  
    const handleEditInput = (event) =>{
        let value = event.target.value; // Get the current value of the input
        
        // the weight value inside the input only changes as long as it is below 1000
        // the input also cannot have more than 7 digits, highest possible input is 999.999
        if (value < 1000 && value.length < 8 && value >= 0){ // if the current value is 999, if a user tries typing another 9 the value won't change
            setNewWeight(value);
        }
    }


    return (
            <div 
                style={{ 
                    width: '100%',  
                    padding: '1%', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                    display: 'flex', 
                    marginLeft: '10px',
                    marginRight: '10px',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    flex: 1,
                    marginBottom: '3vh'
                    
                }} elevation = {10}>

                <div className = 'weight-table-and-date-container' style = {{width: '50%'}}>
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
                                width: 'auto',
                                borderCollapse: 'collapse'
                            }}
                        >
                            <thead style = {{backgroundColor: '#007BFF'}}>
                                <tr style={{ backgroundColor: '#00c691', color: 'white', borderCollapse: 'collapse', border: '1px solid #ddd'}}>
                                    <th style={{ padding: '10px', width: '40%', fontSize: '14px'}}>Date</th>
                                    <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Weight</th>
                                    <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {entries.map((entry, index) => (
                                <tr style={{ height: '20px', border: '1px solid #ddd' }} key={index}>
                                    {/* first column with date value of entry */}
                                    <td style={{ textAlign: 'center', fontFamily: '"Roboto", sans-serif', height: '20px', fontSize: '14px', border: 'none'}}>{entry.date}</td>
                                    {/* second column with weight value of entry */}
                                    <td style={{ textAlign: 'center', fontFamily: '"Roboto", sans-serif', height: '20px'}}> 
                                        {editIndex === index 
                                                ? 
                                                <div>
                                                    <input // if the index of the entry is the one being edited, its weight column becomes an input element
                                                    className = {styles['weight-edit-input']}
                                                    type="number"
                                                    value={newWeight}
                                                    onChange={handleEditInput}
                                                    //onChange={(e) => setNewWeight(e.target.value)}
                                                    style={{ width: '80px' }}
                                                    max = '1000'
                                                    min = '0'
                                                    />
                                                    <span className = {styles['edit-unit']}>lbs</span>
                                                </div>
                                                :
                                                <div>
                                                    {entry.weight === '' 
                                                    ? '0 lbs' // display 0 lbs if the input is empty
                                                    : <div style = {{fontSize: '14px'}}>{entry.weight} lbs</div>
                                                    }
                                                    
                                                </div>
                                        }
                                    </td>
                                    {/* third column with action options of editing or deleting the entry */}
                                    <td style={{ padding: '10px', textAlign: 'center' }} className = {styles['actionButtons']}>
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
                                                    <EditIcon style = {{fontSize: '18px'}}></EditIcon>
                                                </button>
                                                <button 
                                                    className = {styles['actionButton']}
                                                    onClick = {() => deleteEntry(index)}
                                                >
                                                    <DeleteIcon style = {{fontSize: '18px'}}></DeleteIcon>
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

                <div>
                    <DateSelector onDateChange={updateDate}/>
                </div>



            </div>

    );
}

export default WeightLog;
