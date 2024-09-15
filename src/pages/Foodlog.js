import React, { useState, useEffect, useCallback } from 'react';
import DateSelector from '../components/DateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Box} from '@mui/material';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import AddIcon from '@mui/icons-material/Add';
import MealAccordion from '../components/MealAccordion';
import FoodSearch from '../components/FoodSearch'; 
import ChatBox from '../components/Chatbox';
import MacroProgressBar from '../components/MacroProgressBar'; 

function FoodLog() {
    const [selectedDate, setSelectedDate] = useState(new Date()) // state to keep track of the date 

    const token = localStorage.getItem('token'); // json web token
    const [isModalOpen, setIsModalOpen] = useState(false); // state to open or close the modal 

    const [totalNutrition, setTotalNutrition] = useState({});
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // function to handle when the user adds a food item from the food search modal 
    const handleAddFood = async (foodDetails) => { 
        const mealType = foodDetails.selectedMeal;
        const mealDate = selectedDate.toISOString().split('T')[0]; // format the selected date as YYYY-MM-DD

        try {
            // based the current selected date, fetch the id of meal_log associated with the selected date
            const logResponse = await fetch('http://localhost:5000/api/meals/get_log_id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({
                    meal_date: mealDate,
                })
            });

            const logData = await logResponse.json();
            const meal_log_id = logData.meal_log_id;

            if (!meal_log_id) { // if no meal_log is founded
                throw new Error('Meal log not found for the specified date');
            }

            // insert the food details from the food search modal into the meal_items table, with the associated meal_log id
            await fetch('http://localhost:5000/api/meals/add_food_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({
                    meal_log_id: meal_log_id,
                    food_id: foodDetails.foodId,
                    food_name: foodDetails.foodName,
                    calories: foodDetails.calories,
                    protein: foodDetails.protein,
                    fats: foodDetails.fats,
                    carbs: foodDetails.carbs,
                    quantity: foodDetails.passedServingQty,
                    unit: foodDetails.servingUnit,
                    meal_type: mealType,
                })
            });
            
            const totalNutritionResponse = await fetch('http://localhost:5000/api/nutrition/total_nutrition', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({
                    meal_log_id: meal_log_id
                })
            });
            
            const totals = await totalNutritionResponse.json(); 
            setTotalNutrition(totals); 

        } catch (error) {
            console.error('Error adding food item:', error);
        }
    };
    
    // function to check if there's already been a meal_log row with the current selected date, and if there isn't make one
    const checkMealLogs = useCallback(async (mealDate) => {
        try {
            const response = await fetch('http://localhost:5000/api/meals/check_meal_log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({ meal_date: mealDate }), // sends the selected date to the backend
            });

            if (!response.ok) { // triggers if the status response is not 200-299
                throw new Error('Error checking/creating meal logs');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }, [token]); // token should be included in the dependency array

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // get the current date
        checkMealLogs(today); // check if today's date already has a meal_log associated with it
    }, [checkMealLogs]); // useCallback ensures checkMealLogs doesn't change unnecessarily

    const updateDate = (newDate) => { // triggers every time there is a change to the selected date
        setSelectedDate(newDate); // changes the selected date to the current date displayed on the date selector
        checkMealLogs(newDate); // checks if a meal_log has already been created with the selected date, makes a new one if it hasn't 
    };



    return (
        <div>
            <div className = {styles['date-container']}>
                <h3>Food Log For:</h3>
                <DateSelector onDateChange={updateDate}/>
                <button className = {styles['add-food']} onClick = {handleOpenModal} >
                    <Box // Stack an add icon to the bottom right of food icon
                        sx={{
                            position: 'relative',   
                            display: 'inline-block', 
                            width: '35px',          
                            height: '35px',         
                        }}
                    >
                        <RiceBowlIcon 
                            sx={{ 
                                fontSize: '35px', 
                                color: 'black'
                            }} 
                        />
                        <AddIcon
                            sx={{
                                position: 'absolute',
                                bottom: '0px',          
                                right: '0px',          
                                fontSize: '13.5px',       
                                backgroundColor: 'white', 
                                borderRadius: '50%',    
                                color: 'black',         
                                border: 'none', 
                            }}
                        />
                    </Box>
                    <h3 style= {{color: 'black'}}>FOOD</h3>
                </button>
            </div> 
            <hr></hr>


            {/* container that holds the nutrition goals and food log */}
            <div style = {{display: 'flex', justifyContent: 'center'}}>

            <div style = {{width: '100%', backgroundColor: 'white', display: 'flex'}}>
            {/* container that holds the nutrition goals and food log */}
            <Box style={{ 
                    width: '100%',  
                    padding: '10px', 
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',  
                    display: 'flex', 
                    marginLeft: '10px',
                    marginRight: '10px',
                    justifyContent: 'space-between',
                }} elevation = {10}>

                {/*box that holds the food log */}
                <div style = {{width: '60%', marginTop: '7px'}}>
                <MealAccordion title="Breakfast" selectedDate = {selectedDate} isFirst = {true} />
                <MealAccordion title="Lunch" selectedDate = {selectedDate} />
                <MealAccordion title="Dinner" selectedDate = {selectedDate} />
                <MealAccordion title="Snacks" selectedDate = {selectedDate} isLast = {true}/>
                </div>


                <Box sx = {{ width: '40%', marginLeft: '20px', height: '100%'}}>
                    <MacroProgressBar label="Energy" value={100} color="#4CAF50" />
                    <MacroProgressBar label="Protein" value={90} color="#2196F3" />
                    <MacroProgressBar label="Net Carbs" value={75} color="#00BCD4" />
                    <MacroProgressBar label="Fat" value={60} color="#FF5722" />
                </Box>
            </Box>

            </div>


            </div>





            <ChatBox/>
            <div>
                {/* modal is displayed when FOOD button is clicked */}
                <FoodSearch
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    addFood={handleAddFood}
                />
            </div>
        </div>
    );
}

export default FoodLog