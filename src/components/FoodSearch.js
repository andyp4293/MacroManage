import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Box} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/FoodSearch.module.css';

function FoodSearchModal({ open, onClose }) {
    // state for the search query that will be used for a post request to the nutritionix api
    const [query, setQuery] = useState('');
    
    // state to store the data from the response delivered from the nutritionix api
    const [nutritionData, setNutritionData] = useState([]);

    const handleClose = () => {
        setNutritionData([]); // Optionally reset other states as well
        setQuery('');
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
            fetch(`http://localhost:5000/api/nutrition/nutrients?query=${item.food_name}`)
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

        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            {foodPopup && (
                <Box>
                <p>Calories: {itemData[0].nf_calories}</p>
            </Box>
                )}
                <div>
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
                        marginTop: "3px",
                        '&:hover': {
                            backgroundColor: '#00a67e'
                        }
                    }}
                >
                    Search
                </Button>
                </div>

                {/* display foods if available*/}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <tbody>
                        {nutritionData.map((item, index) => ( // makes a table row for every food item returns with its label and its picture if it is included in the json
                            <tr className = {styles['food-results-row']}
                                key={index} 
                                style={{ borderBottom: '1px solid #ddd' }}
                                onClick={() => handleFoodSelect(item)}
                            >
                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                    {item.photo && item.photo.thumb ? (
                                        <img
                                            src={item.photo.thumb}
                                            alt={item.food_name}
                                            style={{ maxHeight: '50px', maxWidth: '50px' }}
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td style={{ padding: '8px' }}>{`${item.food_name}, ${item.serving_qty} ${item.serving_unit}`}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DialogContent>
        </Dialog>
        </div>
    );
}

export default FoodSearchModal;
