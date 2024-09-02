import React, { useState } from 'react';
import DateSelector from '../components/DateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Box} from '@mui/material';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import AddIcon from '@mui/icons-material/Add';
import MealAccordion from '../components/MealAccordion';
import FoodSearch from '../components/FoodSearch'; 

function FoodLog() {
    const [, setSelectedDate] = useState(new Date())
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleSearch = () => {
        setIsModalOpen(false);
    };

    const handleAddFood = (foodDetails) => { 
        switch (foodDetails.selectedMeal) {
            case 'Breakfast':
                setBreakfastItems((prevItems) => [...prevItems, foodDetails]);
                break;
            case 'Lunch':
                setLunchItems((prevItems) => [...prevItems, foodDetails]);
                break;
            case 'Dinner':
                setDinnerItems((prevItems) => [...prevItems, foodDetails]);
                break;
            case 'Snacks': 
                setSnackItems((prevItems) => [...prevItems, foodDetails])
                break;
            default:
                console.error("Invalid meal selection");
                break;
        }
    };

    const [BreakfastItems, setBreakfastItems] = useState([]);
    const [LunchItems, setLunchItems] = useState([]);
    const [DinnerItems, setDinnerItems] = useState([]);
    const [SnackItems, setSnackItems] = useState([]); 

        
    const meals = {
        // Each meal category is an object with total nutrition info and a list of food items.
        Breakfast: {
            totalNutrition: '',
            items: BreakfastItems,
        },
        Lunch: {
            totalNutrition: '',
            items: LunchItems,
        },
        Dinner: {
            totalNutrition: '',
            items: DinnerItems,
        },
        Snacks: {
            totalNutrition: '',
            items: SnackItems,
        },
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
            {Object.keys(meals).map((meal) => ( // .map makes a meal accordian for each meal key
                <MealAccordion 
                  key={meal} // A unique key for each meal category.
                  title={meal} // The meal name (e.g., Breakfast, Lunch).
                  items={meals[meal].items} // The list of food items for this meal.
                />
            ))}
            </div>
            <div>
                {/* modal is displayed when FOOD button is clicked */}
                <FoodSearch
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    onSearch={handleSearch}
                    addFood={handleAddFood}
                />
            </div>
        </div>
    );
}

export default FoodLog