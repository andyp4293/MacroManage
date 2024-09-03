import React, { useState } from 'react';
import DateSelector from '../components/DateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Box} from '@mui/material';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import AddIcon from '@mui/icons-material/Add';
import MealAccordion from '../components/MealAccordion';
import FoodSearch from '../components/FoodSearch'; 

function FoodLog() {
    const [selectedDate, setSelectedDate] = useState(new Date()) // state to keep track of the date 

    const updateDate = (newDate) => { // wheneveer the date selector is changed, the state is assigned its value
        setSelectedDate(newDate); 
    };

    const [isModalOpen, setIsModalOpen] = useState(false); // state to open or close the modal 

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const [mealLogs, setMealLogs] = useState({}); 
    // function to handle when the user adds a food item from the food search modal 
    const handleAddFood = (foodDetails) => { 
        const dateKey = selectedDate; 
        
        const prevMeals = mealLogs[dateKey] || { // makes an object of the previously logged meals of the specific day, if no meals have been made before for that day, it's just blank meals
            Breakfast: { totalNutrition: '', items: {} },
            Lunch: { totalNutrition: '', items: {} },
            Dinner: { totalNutrition: '', items: {} },
            Snacks: { totalNutrition: '', items: {} },
        }

        switch (foodDetails.selectedMeal) {
            case 'Breakfast':
                prevMeals.Breakfast.items = {
                    ...prevMeals.Breakfast.items,
                    [Date.now().toString()]: foodDetails, // adds the food item details to the breakfast property's item proprty, with the time in ms as a unique key for the item 
                    // it makes a copy of the meals for the selected date before adding the new item's details
                };
                break;
            case 'Lunch':
                prevMeals.Lunch.items = {
                    ...prevMeals.Lunch.items,
                    [Date.now().toString()]: foodDetails, // adds the food item details to the lunch property's item proprty, with the time in ms as a unique key for the item 
                    // it makes a copy of the meals for the selected date before adding the new item's details
                };
                break;
            case 'Dinner':
                prevMeals.Dinner.items = {
                    ...prevMeals.Dinner.items,
                    [Date.now().toString()]: foodDetails, // adds the food item details to the dinner property's item proprty, with the time in ms as a unique key for the item 
                    // it makes a copy of the meals for the selected date before adding the new item's details
                };
                break;
            case 'Snacks': 
                prevMeals.Snacks.items = {
                    ...prevMeals.Snacks.items,
                    [Date.now().toString()]: foodDetails, // adds the food item details to the snacks property's item proprty, with the time in ms as a unique key for the item 
                    // it makes a copy of the meals for the selected date before adding the new item's details
                };
                break;
            default:
                console.error("Invalid meal selection");
                break;
        }
        
        // for a the selected date by the date selected, copy the previous meal logs, and add any meal updates for the date
        setMealLogs({
            ...mealLogs, 
            [dateKey]: prevMeals, 
        })
    };

        
    const mealLogForSelectedDate = mealLogs[selectedDate] || { // 
        Breakfast: { totalNutrition: '', items: {} },
        Lunch: { totalNutrition: '', items: {} },
        Dinner: { totalNutrition: '', items: {} },
        Snacks: { totalNutrition: '', items: {} },
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

            <div>
            {/*Object.keys(meals) makes an array of the keys, ie ['Breakfast, 'Lunch", 'Dinner'...]*/}
            {Object.keys(mealLogForSelectedDate).map((meal) => ( // .map makes a meal accordian for each meal key
                <MealAccordion 
                key={meal} // A unique key for each meal category.
                title={meal} // The meal name (e.g., Breakfast, Lunch).
                items={Object.values(mealLogForSelectedDate[meal].items)} // Convert items object to an array of food items
                />
            ))}
            </div>
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