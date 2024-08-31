import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Box, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/FoodSearch.module.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip,Legend, } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

function FoodSearchModal({ open, onClose }) {
    // state for the search query that will be used for a post request to the nutritionix api
    const [query, setQuery] = useState('');
    
    // state to store the data from the response delivered from the nutritionix api
    const [nutritionData, setNutritionData] = useState([]);

    const [searched, setSearched] = useState(false); 

    const handleClose = () => {
        setNutritionData([]); // Optionally reset other states as well
        setQuery('');
        setItemData(''); 
        setSearched(false); 
    };

    const handleSearch = () => {
        fetch('http://localhost:5000/api/nutrition', { // fetch initiates a request to the nutritionix api
            method: 'post', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query }) // sends a request where the search query (ie "banana") is sent 
        })
        .then(response => response.json()) // parses the json from the api's response
        .then(data => {
            setNutritionData(data.common || []); // store the fetched nutrition data in state
            setSearched(true); 
        }) 
        .catch(error => { // handles if an error occurs
            console.error('Error fetching nutrition data:', error);
        });

    };

    const [itemData, setItemData] = useState(null);
    const [foodPopup, setFoodPopup] = useState(false); 

    const handleFoodSelect = (item) => {
        if (item.nix_item_id != null)
        {
            fetch(`http://localhost:5000/api/nutrition/item?nix_item_id=${item.nix_item_id}`)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                setItemData(data);  // Store the fetched data in state
                setFoodPopup(true); // Open the food popup after data is fetched
            })
            .catch(error => console.error('Error fetching item data:', error)); // Handle errors
        }
        else {
            fetch(`http://localhost:5000/api/nutrition/nutrients?query=${item.food_name.replace(/%/g, '')}`)
                .then(response => response.json()) // Parse the JSON response
                .then(data => {
                    setItemData(data.foods);  // Store the fetched data in state
                    setFoodPopup(true); // Open the food popup after data is fetched
                })
                .catch(error => console.error('Error fetching item data:', error)); // Handle errors
            }
    }

    return (
        <div>

        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Add Food to Log
                <IconButton // close button to close modal
                    aria-label="close"
                    onClick={() => { onClose(); handleClose(); }} // when button is clicked, the modal will be closed
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style = {{display: 'flex'}}>


                <div>
                <div style = {{display: 'flex', justifyContent: 'space-between', width: '95%'}}>
                    <div style = {{position: 'sticky', top: 0, backgroundColor: 'white', marginBottom: '10px'}}>
                        <TextField
                            autoFocus
                            margin = 'dense'
                            id="search"
                            label="Search foods"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            sx={{
                            '& .MuiInputLabel-root.Mui-focused': {
                            color: '#00c691', // Label color when focused
                            },
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#00c691', // Border color when focused
                                },
                            },
                        }}
                        
                        />
                        <Button
                            disableRipple
                            variant="contained"
                            onClick={handleSearch}
                            startIcon={<SearchIcon />}
                            sx={{
                                background: '#00c691',
                                marginBottom: '10px',
                                marginTop: "3px",
                                '&:hover': {
                                    backgroundColor: '#00a67e'
                                }
                            }}
                        >
                            Search
                        </Button>
                        </div>
                        </div>
                    
                    {searched &&
                        <div className = {styles['food-table-container']}>
                        {/* display foods if available*/}
                        <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden'}}>
                            <tbody>
                                {nutritionData.map((item, index) => ( // makes a table row for every food item returns with its label and its picture if it is included in the json
                                    <tr className = {styles['food-results-row'] }
                                        key={index} 
                                        style={{ borderBottom: '1px solid #ddd' }}
                                        onClick={() => handleFoodSelect(item)}
                                    >
                                        <td style={{ padding: '8px' }}>{`${item.food_name}, ${item.serving_qty} ${item.serving_unit}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    }
                    </div>

                    <div style = {{width: '50%'}}>
                        {foodPopup && itemData !== '' && (
                            <div>
                                <Box>
                                <Typography variant="h6" component="div" gutterBottom sx = {{textAlign: 'center'}}>
                                    {itemData[0].nf_calories} kcal
                                </Typography>
                                <div style = {{display: 'flex'}}>
                                <div style = {{height: '100px', width: '100px'}}>
                                <Pie 
                                    data = {{
                                        datasets: [
                                            {
                                            data: [
                                              itemData[0].nf_protein * 4,
                                              itemData[0].nf_total_fat * 9,
                                              itemData[0].nf_total_carbohydrate * 4,
                                            ],
                                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                            },
                                        ],
                                        }}
                                    options = {{
                                        responsive: true,
                                        plugins: {
                                            tooltip: {
                                            callbacks: {
                                                label: function (tooltipItem) {
                                                return tooltipItem.label + ': ' + tooltipItem.raw + ' calories';
                                                },
                                            },
                                            },
                                        },
                                    }}
                                    style = {{width: '50px', height: '50px'}}
                                />
                                </div>
                                <div style = {{marginTop: '-15px'}}>
                                    <p>Protein: {itemData[0].nf_protein}g</p>
                                    <p>Fats: {itemData[0].nf_total_fat}g</p>
                                    <p>Carbs: {itemData[0].nf_total_carbohydrate}g</p>
                                </div>  
                                </div>
                                </Box>

                            </div>
                            )}
                        </div>

                    </div>
                    

            </DialogContent>
        </Dialog>
        </div>
    );
}

export default FoodSearchModal;