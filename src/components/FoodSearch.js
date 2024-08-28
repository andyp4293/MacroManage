import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function FoodSearchModal({ open, onClose }) {
    const [searched, setSearched] = useState(false);
    const [foods, ] = useState('');
    const [query, setQuery] = useState('');
    const [nutritionData, setNutritionData] = useState([]);

    const handleClose = () => {
        setSearched(false); // 
        setNutritionData([]); // Optionally reset other states as well
        setQuery('');
    };

    const handleSearch = () => {
        fetch('http://localhost:5000/api/nutrition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query }) // Send the food query in the request body
        })
        .then(response => response.json())
        .then(data => {
            setSearched(true); 
            setNutritionData(data.common || []);; // Store the fetched nutrition data in state
        })
        .catch(error => {
            setSearched(true); 
            console.error('Error fetching nutrition data:', error);
        });
    };
    const handleFoodClick = (foodName) => {
        // Fetch nutrition data for the clicked food item
        fetch(`http://localhost:5000/api/nutrition?query=${foodName}`)
            .then(response => response.json())
            .then(data => setNutritionData(data.common))
            .catch(error => console.error('Error fetching nutrition data:', error));
    };

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
                 {/* Display the list of foods */}
                <div style={{maxHeight: '300px', overflowY: 'auto' }}>
                    <ul>
                        {foods.length > 0 ? (
                            foods.map((food, index) => (
                                <li
                                    key={index}
                                    style={{ padding: '8px 0', borderBottom: '1px solid #ddd', cursor: 'pointer' }}
                                    onClick={() => handleFoodClick(food.food_name)} // Fetch nutrition data when a food is clicked
                                >
                                    {food.food_name}
                                </li>
                            ))
                        ) : (
                            !nutritionData && searched &&<p>No foods found. Please try a different search term.</p>
                        )}
                    </ul>
                </div>

                {/* Display the nutrition data if available */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <tbody>
                        {nutritionData.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
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
                                <td style={{ padding: '8px' }}>{item.food_name}</td>
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
