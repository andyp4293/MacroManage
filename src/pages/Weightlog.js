import React, { useState, useCallback, useEffect} from 'react';
import DateSelector from '../components/DateSelector'; 
import styles from '../styles/Weightlog.module.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

// for formatting the date to MM-DD-YYYY
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const month = date.getMonth() + 1;  
    const day = date.getDate();
    const year = date.getFullYear();

    // Pad the month and day with leading zeros if necessary
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
}


function WeightLog() {
    const token = localStorage.getItem('token'); // json web token
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

    const fetchWeightLogs = useCallback(async () => {
        if (!token) return; // prevent making the request if there is no token/user isn't logged in
        try {
            const response = await fetch('http://localhost:5000/api/weight/get_weight_logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
            });

            const weightlogData = await response.json(); 
            setEntries(weightlogData.weightlogs);  

        } catch (error) {
            console.error('Error:', error);
        }
    }, [token]); // token should be included in the dependency array

    useEffect(() => {
        fetchWeightLogs();
    }, [fetchWeightLogs]); // useCallback ensures checkMealLogs doesn't change unnecessarily

    // func to add a new weight entry whenever user presses save
    const addEntry = async (addWeight) => {
        let weightValue;
        setWeight(''); 

        if (addWeight === '') {
            weightValue = 0;
        } else {
            weightValue = parseFloat(addWeight);
        }

        // Format the date to match your backend expectations (e.g., 'YYYY-MM-DD')
        const formattedDate = selectedDate.toISOString().slice(0, 10);

        try {
            const response = await fetch('http://localhost:5000/api/weight/add_weight_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt token
                },
                body: JSON.stringify({
                    weight_lbs: weightValue,
                    weight_date: formattedDate
                })
            });

            const result = await response.json(); 

            if (response.ok) {
                fetchWeightLogs(); 
            } else {
                console.error('Failed to add or update entry:', result.message);
            }
        } catch (error) {
            console.error('Error adding or updating entry:', error);
        }
    }

    
    const deleteEntry = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/weight/delete_weight_entry/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // jwt authorization
                    'Content-Type': 'application/json',  
                }
            });
            
            if (response.ok){
                fetchWeightLogs(); 
            }
            else {
                throw new Error('Failed to delete weight entry');
            }
        }
        catch(error) {
            console.error('Error deleting meal item:', error); 
        }
    }; 

    // updates the date state whenever the date selector component changes date
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    // EDIT BUTTON FUNCTIONALITY
    // state for the index to edit 
    const [editIndex, setEditIndex] = useState(null); 

    // state for the weight edit
    const [newWeight, setNewWeight] = useState('');
    // func for saving the weight edit
    const handleSaveEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/weight/edit_weight_entry/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt token
                },
                body: JSON.stringify({
                    weight: newWeight, 
                })
            });

            const result = await response.json(); 

            if (response.ok) {
                fetchWeightLogs(); 
            } else {
                console.error('Failed to edit entry:', result.message);
            }
        }
        catch (error){
            console.error('Error editing weight:', error)
        }
        finally {
            setEditIndex(null); 
        }
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
                            onClick = {() => {addEntry(weight)}}
                        >
                            Save
                        </button>
                    </div>

                    <div className = {styles['weight-entry-table']} >
                        <table 
                            style = {{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}
                        >
                            <thead style = {{backgroundColor: '#007BFF'}}>
                                <tr style={{ backgroundColor: '#00c691', color: 'white', borderCollapse: 'collapse', border: '1px solid #ddd',}}>
                                    <th style={{ padding: '10px', width: '40%', fontSize: '14px'}}>Date</th>
                                    <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Weight</th>
                                    <th style={{ padding: '10px', width: '30%', fontSize: '14px'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            
                            {entries.map((entry, index) => (
                                <tr style={{ height: '20px', border: '1px solid #ddd' }} key={index}>
                                    {/* first column with date value of entry */}
                                    <td style={{ textAlign: 'center', fontFamily: '"Roboto", sans-serif', height: '20px', fontSize: '14px', border: 'none'}}>{formatDate(entry.weight_date)}</td>
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
                                                    : <div style = {{fontSize: '14px'}}>{entry.weight_lbs} lbs</div>
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
                                                    onClick = {() => handleSaveEdit(entry.id)}
                                                >
                                                    <CheckIcon></CheckIcon>
                                                </button>
                                            </div>
                                            : // if editing index is not the index of the entry
                                            <div className = {styles['actionButtons']}> 
                                                <button 
                                                    className = {styles['actionButton']}
                                                    onClick = {() => setEditIndex(index)}
                                                >
                                                    <EditIcon style = {{fontSize: '18px'}}></EditIcon>
                                                </button>
                                                <button 
                                                    className = {styles['actionButton']}
                                                    onClick = {() => deleteEntry(entry.id)}
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
