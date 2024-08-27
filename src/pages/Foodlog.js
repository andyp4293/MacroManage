import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Accordion, AccordionSummary, AccordionDetails, Typography, Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MealAccordion({title, items, nutrition}){
    return(
        <Accordion style = {{width: '75%', minWidth: '550px'}}> 
            {/*header/title on the accordian component */}
            <AccordionSummary 
                expandIcon = {<ExpandMoreIcon/>}
                aria-controls = {`${title}-log`} // name for each expandable body of each meal accordian
                id = {`${title}-header`} // name/id for each header
            > 
                <Typography style = {{justifyContent: 'space-between'}}>
                    {title} {nutrition} {/* displays meal name and its total nutritional macros */}
                </Typography>
            </AccordionSummary>

            <AccordionDetails> {/* For showing the foods loggeds and their nutrition when accordion is expanded*/}
                {items.map((item, index) => (
                    <Box
                    key = {index}
                    display = 'flex' // arrange items horizontally
                    justifyContent = 'space-between' 
                    alignItems = 'center'
                    padding = '8px 0'
                    borderBottom = '1 px solid #ddd' // border to separate items 
                    >
                        <Typography>{`${item.name}, ${item.quantity}`}</Typography> {/* display the name of the food item followed by quanitty */}
                        <Typography>{item.calories} kcal</Typography> {/* display the calorie content */}
                    </Box>
                ))}
            </AccordionDetails>

        </Accordion>
    )
}

function FoodLog() {
    const [, setSelectedDate] = useState(new Date())
    const updateDate = (newDate) => {
        setSelectedDate(newDate); 
    };

    const meals = {
        // Each meal category is an object with total nutrition info and a list of food items.
        Breakfast: {
            totalNutrition: '180 kcal • 2 g protein • 41 g carbs • 1 g fat',
            items: [
                {
                    name: 'Banana',
                    quantity: '1',
                    calories: 89.89,
                },
                {
                    name: 'man',
                    quantity: '1',
                    calories: 1000000000000000,
                },
            ],
        },
        Lunch: {
            totalNutrition: '',
            items: [],
        },
        Dinner: {
            totalNutrition: '',
            items: [],
        },
        Snacks: {
            totalNutrition: '',
            items: [],
        },
    };


    return (
        <div>
            <div className = {styles['date-container']}>
                <h3>Food Log For:</h3>
                <DateSelector onDateChange={updateDate}/>
            </div> 
            <hr></hr>

            <div>
            {/*Object.keys(meals) makes an array of the keys, ie ['Breakfast, 'Lunch", 'Dinner'...]*/}
            {Object.keys(meals).map((meal) => ( // .map makes a meal accordian for each meal key
                <MealAccordion 
                  key={meal} // A unique key for each meal category.
                  title={meal} // The meal name (e.g., Breakfast, Lunch).
                  items={meals[meal].items} // The list of food items for this meal.
                  nutrition={meals[meal].totalNutrition} // Total nutrition info for the meal.
                />
            ))}
            </div>
        </div>
    );
}

export default FoodLog