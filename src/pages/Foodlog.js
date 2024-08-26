import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Foodlog.module.css';

function FoodLog() {
    const [, setSelectedDate] = useState(new Date())
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };



    return (
        <div>
            <div className = {styles['date-container']}>
                <h3>Food Log Entry For:</h3>
                <DateSelector onDateChange={updateDate}/>
            </div> 
            <hr></hr>
        </div>
    );
}

export default FoodLog