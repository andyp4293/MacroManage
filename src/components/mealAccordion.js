import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

function MealAccordion({ title, selectedDate, isFirst, isLast }) {
    const [items, setItems] = useState([]);

    const token = localStorage.getItem('token'); // json web token

    useEffect(() => {
        // fetches the meal_items associated with the correct meal (title) and selected date
        const fetchMealItems = async () => {
            try {
                const mealDate = selectedDate.toISOString().split('T')[0]; // formats the date

                // 1.) fetches meal_log_id of the meal_log with the associated selected date
                const logResponse = await fetch('http://localhost:5000/api/meals/get_log_id', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // jwt authorization
                    },
                    body: JSON.stringify({
                        meal_date: mealDate,
                    }),
                });

                const logData = await logResponse.json();
                const meal_log_id = logData.meal_log_id;

                if (!meal_log_id) {
                    throw new Error('Meal log not found for the specified date and meal type.');
                }

                // 2.) fetches meal_items based on meal_log_id and title (which is the meal_type)
                const itemsResponse = await fetch(`http://localhost:5000/api/meals/get_items?meal_log_id=${meal_log_id}&meal_type=${title}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // jwt authorization
                        'Content-Type': 'application/json',  
                    }
                });
                const itemsData = await itemsResponse.json();
                setItems(itemsData.items); // update the item state

            } catch (error) {
                console.error('Error fetching meal items:', error);
            }
        };

        fetchMealItems();
    }, [selectedDate, title, items, token]); // re-fetches the meal_items every time there is a change to the date, a change to items state, or a change to the title

    // goes through all of the items within the items array and sums up the total macros and calories 
    const totals = items.reduce(
        (totals, item) => {
            totals.calories += item.calories;
            totals.protein += item.protein;
            totals.fats += item.fats;
            totals.carbs += item.carbs;
            return totals;
        },
        { calories: 0, protein: 0, fats: 0, carbs: 0 }
    );


    // function to delete a food_items row based on the item's id 
    const deleteEntry = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/meals/delete_item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // jwt authorization
                    'Content-Type': 'application/json',  
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete meal item');
            }

        } catch (error) {
            console.error('Error deleting meal item:', error);
        }
    };


    return (
        <Accordion style={{
            width: '100%', 
            borderRadius: isFirst ? '12px 12px 0 0' : isLast ? '0 0 12px 12px' : '0',  // top corners for first, bottom corners for last
            overflow: 'hidden',  
            border: '1px solid #b0b0b0',
            borderBottom: isFirst ? '0' : isLast ? '1px solid #b0b0b0':  '0',
            borderTop: isLast ? '1px solid #b0b0b0' : '1px solid #b0b0b0'
        }}  disableGutters elevation={0}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${title}-log`} // name for each expandable body of each meal accordion
                id={`${title}-header`} // name/id for each header
                sx={{
                    backgroundColor: '#f1f1f1',
                    color: 'white',
                    height: '30px',
                    minHeight: '30px',
                    '&.Mui-expanded': { minHeight: '30px' },
                }}
            >
                <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'Manrope, sans-serif',
                            fontSize: '12px',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            color: '#4A4A4A'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'Manrope, sans-serif',
                            fontSize: '12px',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            color: '#4A4A4A'
                        }}
                    >   
                        {`${totals.calories.toFixed(1)} kcal • ${totals.protein.toFixed(1)}g protein • ${totals.fats.toFixed(1)}g fats • ${totals.carbs.toFixed(1)}g carbs`}
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails style={{ margin: '0', padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody style = {{fontSize: '10px', border: 'none', borderCollapse: 'collapse'}}>
                        {items.map((item, index) => (
                            <tr key={index} style = {{justifyContent: 'space-between', display: 'flex', alighItems: 'center',  borderBottom: '1px solid #ddd'}}>
                                <td style={{ padding: '8px'}}>
                                    <p style = {{fontSize: '10px'}}>{`${item.food_name}, ${item.quantity ? item.quantity : ''} ${item.unit ? item.unit : ''}`}</p>
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <Button
                                        disableRipple
                                        sx={{
                                            padding: '3px',
                                            margin: '3px 0',
                                            fontSize: '18px',
                                            fontWeight: 100,
                                            textTransform: 'uppercase',
                                            border: 'none',
                                            background: 'rgba(0, 198, 145, 1)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            marginBottom: '0px',
                                            borderRadius: '10px',
                                            backgroundColor: '#00c691',
                                            '&:hover': { backgroundColor: '#00a67e' },
                                        }}
                                        onClick={() => deleteEntry(item.id)}
                                    >
                                        <DeleteIcon style = {{fontSize: '17px'}} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AccordionDetails>
        </Accordion>
    );
}

export default MealAccordion;
