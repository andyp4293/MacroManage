import React, { useState, useEffect, useCallback } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Box, Typography} from '@mui/material';
import MealAccordion from '../components/mealAccordion';
import FoodSearch from '../components/FoodSearch'; 
import ChatBox from '../components/Chatbox';
import MacroProgressBar from '../components/MacroProgressBar'; 
import GoalSelector from '../components/GoalSelector'; 

function FoodLog() {
    const [selectedDate, setSelectedDate] = useState(new Date()) // state to keep track of the date 

    const token = localStorage.getItem('token'); // json web token
    const [isFoodSearchOpen, setIsFoodSearchOpen] = useState(false); // state to open or close the modal 

    const [totalNutrition, setTotalNutrition] = useState({});

    const [isGoalsOpen, setIsGoalsOpen] = useState(false); 

    const handleCloseFoodSearch = () => {
        setIsFoodSearchOpen(false);
    };

    const handleCloseGoals = () => {
        setIsGoalsOpen(false); 
    };

    const handleOpenFoodSearch = () => {
        setIsFoodSearchOpen(true);
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

            fetchTotalNutrition(); 
            checkMealLogs(selectedDate.toISOString().split('T')[0])



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

    const [nutritionGoals, setNutritionGoals] = useState({});

    const fetchNutritionGoals =  useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/nutrition/get_nutrition_goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
            });


            const goals = await response.json(); 
            setNutritionGoals(goals); 

        } catch (error) {
            console.error('Error:', error);
        }
    }, [token]); // token should be included in the dependency array



    // fetch the current calories and macros of all the food for the date
    const fetchTotalNutrition = useCallback(async() =>{
        const mealDate = selectedDate.toISOString().split('T')[0]
        try{
            const totalNutritionResponse = await fetch('http://localhost:5000/api/nutrition/total_nutrition', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({
                    meal_date: mealDate
                })
            });

            const totals = await totalNutritionResponse.json(); 
            setTotalNutrition(totals); 
        }
        
        catch (error) {
            console.error('Error:', error);
        }
            
    }, [token, selectedDate]); 


    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // get the current date
        checkMealLogs(today); // check if today's date already has a meal_log associated with it
        fetchNutritionGoals();
        fetchTotalNutrition(); 
    }, [checkMealLogs, fetchNutritionGoals, fetchTotalNutrition, isGoalsOpen]); // useCallback ensures checkMealLogs doesn't change unnecessarily

    const updateDate = (newDate) => { // triggers every time there is a change to the selected date
        setSelectedDate(newDate); // changes the selected date to the current date displayed on the date selector
        checkMealLogs(newDate); // checks if a meal_log has already been created with the selected date, makes a new one if it hasn't 
    };



    return (
        <div style = {{ display: 'flex', backgroundColor: '#F2F2F2', minWidth: '100%', flexDirection: 'column', flex: 1,}}>



            {/* container that holds the nutrition goals and food log */}
            <div style={{ width: '100%', backgroundColor: '#F2F2F2', display: 'flex', flex: 1, }}> 
            {/* container that holds the nutrition goals and food log */}
            <Box className={styles.foodLogContainer}
            style={{ width: '100%', padding: '1%'}}>

                {/*box that holds the food log */}
                <div className = {styles.mealLog} style = {{width: '100%', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', padding: '1%', borderRadius: '8px', backgroundColor: 'white', }} elevation = {10}> 
                    <div className = {styles['date-container']}>
                        <DateSelector onDateChange={updateDate}/>
                    </div> 
                    <MealAccordion title="Breakfast" selectedDate = {selectedDate} isFirst = {true} onDelete = {fetchTotalNutrition} />
                    <MealAccordion title="Lunch" selectedDate = {selectedDate} onDelete = {fetchTotalNutrition}/>
                    <MealAccordion title="Dinner" selectedDate = {selectedDate} onDelete = {fetchTotalNutrition}/>
                    <MealAccordion title="Snacks" selectedDate = {selectedDate} isLast = {true} onDelete = {fetchTotalNutrition}/>
                    <button className = {styles['add-food']} onClick = {() => {handleOpenFoodSearch()}} >
                        <Box // Stack an add icon to the bottom right of food icon
                            sx={{
                                display: 'fit-content'       
                            }}
                        
                        >
                            <h5>Add Food Item</h5>
                        
                        </Box>
                    </button>
                </div>


                <Box className = {styles.progressBarContainer} sx = {{ width: '70%', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', padding: '1%', borderRadius: '8px', backgroundColor: 'white',}}  elevation = {10}> 
                    <div style = {{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography style = {{marginLeft: '7px'}}>Macronutrient Targets</Typography>
                        <button className = {styles['add-food']} onClick = {() => {setIsGoalsOpen(true)}} >
                            <Box // Stack an add icon to the bottom right of food icon
                                sx={{
                                    display: 'fit-content'       
                                }}
                        
                            >
                                <h5>Edit Goals</h5>
                        
                            </Box>
                        </button>
                    </div>
                    <MacroProgressBar label="Energy" color="#4CAF50" unit = ' kcal' nutritionTarget = {nutritionGoals.calories} nutrition = {totalNutrition.total_calories}/>
                    <MacroProgressBar label="Protein" value={90} color="#2196F3" unit = 'g'  nutritionTarget = {Math.round((nutritionGoals.protein_percent*nutritionGoals.calories*0.01)/4)} nutrition = {totalNutrition.total_protein} />
                    <MacroProgressBar label="Fat" value={75} color="#00BCD4" unit = 'g'  nutritionTarget = {Math.round((nutritionGoals.fat_percent*nutritionGoals.calories*0.01)/9)} nutrition = {totalNutrition.total_fats} />
                    <MacroProgressBar label="Carbs" value={60} color="#FF5722" unit = 'g' nutritionTarget = {Math.round((nutritionGoals.carbohydrate_percent*nutritionGoals.calories*0.01)/4)} nutrition = {totalNutrition.total_carbs} />
                </Box>
            </Box>


            </div>


            <ChatBox/>
            <div style = {{backgroundColor: 'black'}}>
                {/* modal is displayed when FOOD button is clicked */}
                <FoodSearch
                    open={isFoodSearchOpen}
                    onClose={handleCloseFoodSearch}
                    addFood={handleAddFood}
                />
            </div>
            <GoalSelector open = {isGoalsOpen} onClose = {handleCloseGoals} goals = {nutritionGoals}/>
        </div>
    );
}

export default FoodLog