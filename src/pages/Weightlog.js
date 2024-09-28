import React, { useState, useCallback, useEffect} from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';
import WeightChart from '../components/WeightChart'; 
import WeightTable from '../components/WeightTable'; 


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
            console.log(weightlogData.weightlogs)

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


    // updates the date state whenever the date selector component changes date
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    return (
        <div style = {{display: 'flex', width: '100%'}}> 
            <div className = {styles.weightLogContainer}
                style={{ 
                    width: 'auto',  
                    flex: 1, 
                    
                }}>

                <div className = {styles.weightTableContainer} style={{ 
                        width: '100%',  
                        padding: '1%', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                        backgroundColor: 'white',
                    
                    }} elevation = {10}>

                    <DateSelector onDateChange={updateDate}/>
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
                        <WeightTable/>
                    </div>
                </div>

                <div className = {styles.weightChartContainer} style={{ 
                        width: '100%',  
                        padding: '1%', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                        backgroundColor: 'white',
                    
                    }} elevation = {10}>
                    <WeightChart data = {entries}/>
                </div>



            </div>

    </div>
    );
}

export default WeightLog;
