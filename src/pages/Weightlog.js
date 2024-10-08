import React, { useState, useCallback, useEffect} from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Weightlog.module.css';
import WeightChart from '../components/WeightChart'; 
import WeightTable from '../components/WeightTable'; 
import {CircularProgress} from '@mui/material';
import ChatBox from '../components/Chatbox';
import WeightStats from '../components/WeightStats';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_APIURL;


function WeightLog() {
    const token = localStorage.getItem('token'); // json web token
    // setting the weight value in the weight input box
    const [weight, setWeight] = useState('');
    // setting the data for the weight entry
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [loading, setLoading] = useState(false); 

    // entries is an array for objects that will hold each entry's date and weight
    const [entries, setEntries] = useState([]); 
    const navigate = useNavigate();
    const notifyError = () => {
        toast.error('Please log in before adding a weight entry.', {
            position: "top-right",
            autoClose: 3000, // slose after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'colored',
        });
    };


    const fetchWeightLogs = useCallback(async () => {
        if (!token) return; // prevent making the request if there is no token/user isn't logged in
        try {
            const response = await fetch(`${backendUrl}/api/weight/get_weight_logs`, {
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
        if(!token) {
            navigate('/login'); ;// prompts the user to login if they aren't and they try to add an entry
            notifyError(); 
        }
        setLoading(true); 
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
            const response = await fetch(`${backendUrl}/api/weight/add_weight_log`, {
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
        finally {
            setLoading(false); 
        }
    }


    // updates the date state whenever the date selector component changes date
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    return (
        <div style = {{width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column'}}> 
            <div className = {styles.weightLogContainer}>
                <div className = {styles.leftContainer}>
                <div className = {styles.dateContainer} style={{ 
                        width: 'auto',  
                        padding: '1vh', 
                        border: '1px solid #f0f0f0',
                        display: 'flex', 
                        borderRadius: '8px',
                        justifyContent: 'space-between',
                        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                        backgroundColor: 'white',
                    
                    }} elevation = {10}>
                    
                    <div style = {{display: 'flex'}}>
                        <DateSelector onDateChange={updateDate}/>
                    </div>
                    
                    
                    <div className = {styles['weight']} > 
                        {loading && (
                            <CircularProgress style = {{color: '#343d46'}}size = {22}/>
                        )}
                        
                        <input // input for the weight log of the day
                            name = 'weight' 
                            type = 'text'
                            className = {styles['weight-input']}
                            onChange={(e) => {
                                const newWeight = e.target.value;
                                const regex = /^\d+(\.\d{0,2})?$/;

                                if (newWeight === '') {
                                    setWeight('');
                                } 
                                else if (regex.test(newWeight) && parseFloat(newWeight) <= 999.99) {
                                    setWeight(newWeight);
                                }
                            }}
                            value={weight} // value inside the input is whatever weight value currently is
                            onKeyDown = {(e) => {
                                if (e.key === "Enter"){
                                    if (!loading){
                                        addEntry(weight); 
                                    }
                                }
                            }}


                        />
                        <h5>lbs</h5>
                        <button
                            className = {styles['save-button']}
                            onClick = {() => {addEntry(weight)}}
                        >
                            <h5 style = {{margin:'0'}}>Add Entry</h5>
                        </button>
                    </div>
                </div>
                
                <div className = {styles['weight-entry-table']} style={{ 
                        width: 'auto',  
                        padding: '3%', 
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                        backgroundColor: 'white',
                    
                    }} elevation = {10}>
                    <WeightTable data ={entries} onChange = {fetchWeightLogs}/>
                </div>
                </div>
                
                <div className = {styles.rightContainer} >
                <div className = {styles.weightChartContainer} style={{  
                        display: 'flex', 
                        alignItems:'center', 
                        flexDirection: 'column',

                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',  
                        backgroundColor: 'white',
                    
                    }} elevation = {10}>
                    <WeightChart data = {entries}/>

                </div>
                    <WeightStats data = {entries}/>
                </div>

                <ChatBox/>

            </div>
            </div>

    );
}

export default WeightLog;
