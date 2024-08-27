import React, { useState } from 'react';
import DateSelector from '../components/dateSelector'; 
import styles from '../styles/Foodlog.module.css';
import {Accordion, AccordionSummary, AccordionDetails, Typography, Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import RiceBowlIcon from '@mui/icons-material/RiceBowl';
import AddIcon from '@mui/icons-material/Add';

function MealAccordion({title, items, nutrition}){
    return(
        <Accordion style = {{width: '60%', minWidth: '550px', margin: '0'}}> 
            {/*header/title on the accordian component */}
            <AccordionSummary 
                expandIcon = {<ExpandMoreIcon/>}
                aria-controls = {`${title}-log`} // name for each expandable body of each meal accordian
                id = {`${title}-header`} // name/id for each header
                sx = {{
                    backgroundColor: '#00c691',
                    color: 'white',
                }}
            > 
                {/* displays meal name and its total nutritional macros */}
                <Box style = {{display: 'flex', justifyContent:'space-between', width: '97%'}}>
                <Typography style = {{display: 'flex', justifyContent: 'space-between', fontFamily: '"Roboto", sans-serif', fontSize: '17px', alignItems: 'center'}}>
                            {title} 
                    </Typography>
                    <Typography style = {{display: 'flex', justifyContent: 'space-between', fontFamily: '"Roboto", sans-serif', fontSize: '17px', alignItems: 'center'}}>
                            {nutrition}
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails style = {{margin: '0', padding: '0'}}> {/* For showing the foods loggeds and their nutrition when accordion is expanded*/}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}><DinnerDiningIcon style = {{fontSize: '25px'}}/></th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{`${item.name}, ${item.quantity}`}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.calories} kcal</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                <button style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
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
                                border: '1px solid white', 
                            }}
                        />
                    </Box>
                    <h3>FOOD</h3>
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
                  nutrition={meals[meal].totalNutrition} // Total nutrition info for the meal.
                />
            ))}
            </div>
        </div>
    );
}

export default FoodLog