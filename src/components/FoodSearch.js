import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Box, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/FoodSearch.module.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';

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
            method: 'POST', 
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

    // state to store the selected item data and its details
    const [itemData, setItemData] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');
    const [foodPopup, setFoodPopup] = useState(false); 
    const [servingQty, setServingQty] = useState(''); // for the default serving quantity

    const handleFoodSelect = (item) => {
        const fetchData = item.nix_item_id 
            ? fetch(`http://localhost:5000/api/nutrition/item?nix_item_id=${item.nix_item_id}`)
            : fetch(`http://localhost:5000/api/nutrition/nutrients?query=${item.food_name.replace(/%/g, '')}`);
        
        fetchData
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                const fetchedItemData = item.nix_item_id ? data : data.foods[0];
                const servingWeightGrams = fetchedItemData.serving_weight_grams || 0;

                setSelectedItem({
                    ...item,
                    serving_weight_grams: servingWeightGrams
                });
                
                setItemData(fetchedItemData);
                setServingQty(itemData.serving_qty); // serving amount that will be changed by the user
                setDefaultServingQty(fetchedItemData.serving_qty); // default serving amount
                setDefaultServingQtyGrams(servingWeightGrams); // default serving amount in grams
                setCalories(fetchedItemData.nf_calories);
                setProtein(fetchedItemData.nf_protein); 
                setFats(fetchedItemData.nf_total_fat);
                setCarbs(fetchedItemData.nf_total_carbohydrate); 
                setFoodPopup(true); // Open the food popup after data is fetched
            })
            .catch(error => console.error('Error fetching item data:', error)); // Handle errors
    };

    const [defaultServingQty, setDefaultServingQty] = useState('');
    const [defaultServingQtyGrams, setDefaultServingQtyGrams] = useState('');

    const [servingUnit, setServingUnit] = useState('unit1')

    const handleServingSelect = (e) => {
        if (e.target.value.length < 15)
        {
            setServingQty(e.target.value); 
        }

        // multiply the default calories and macro amounts found in 1 serving by (default serving size/selected serving size)
        switch (servingUnit) {
            case 'unit1': // whatever the default serving unit is
                setCalories(Number((itemData.nf_calories * (e.target.value / defaultServingQty)).toFixed(1)));
                setProtein(Number((itemData.nf_protein * (e.target.value / defaultServingQty)).toFixed(1)));
                setFats(Number((itemData.nf_total_fat * (e.target.value / defaultServingQty)).toFixed(1)));
                setCarbs(Number((itemData.nf_total_carbohydrate * (e.target.value / defaultServingQty)).toFixed(1)));
            break; 

            case 'unit2': // the default serving amount but in grams, ie if the serving size of 1 oz, this will be 28g
                setCalories(Number((itemData.nf_calories * (e.target.value)).toFixed(1)));
                setProtein(Number((itemData.nf_protein * (e.target.value)).toFixed(1)));
                setFats(Number((itemData.nf_total_fat * (e.target.value)).toFixed(1)));
                setCarbs(Number((itemData.nf_total_carbohydrate * (e.target.value)).toFixed(1)));
            break; 

            case 'unit3': // grams
                setCalories(Number((itemData.nf_calories * (e.target.value/ defaultServingQtyGrams)).toFixed(1)));
                setProtein(Number((itemData.nf_protein * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
                setFats(Number((itemData.nf_total_fat * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
                setCarbs(Number((itemData.nf_total_carbohydrate * (e.target.value / defaultServingQtyGrams)).toFixed(1)));

            break; 
            default:

        }
    }

    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fats, setFats] = useState(''); 
    const [carbs, setCarbs] = useState(''); 


    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Add Food to Log
                    <IconButton
                        aria-label="close"
                        onClick={() => { onClose(); handleClose(); }}
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
                    <div style={{ display: 'flex' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '95%' }}>
                                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', marginBottom: '10px' }}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="search"
                                        label="Search foods"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        sx={{
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#00c691',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#00c691',
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
                                            marginBottom: '5px',
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
                                <div className={styles['food-table-container']}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
                                        <tbody>
                                            {nutritionData.map((item, index) => (
                                                <tr
                                                    className={styles['food-results-row']}
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
                        <div style={{ width: '50%' }}>
                            {foodPopup && itemData && (
                                <div style={{ width: '100%' }}>
                                    <Box style={{ display: 'flex', justifyContent: 'center', width: '100%', backgroundColor: 'white' }}>
                                        <Box className='macro and calorie container'>
                                            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'center' }}>
                                                {calories} kcal
                                            </Typography>
                                            <div style={{ display: 'flex', width: '100%' }}>
                                                <div style={{ height: '100px', width: '100px' }}>
                                                    <Pie
                                                        data={{
                                                            datasets: [
                                                                {
                                                                    data: [
                                                                        protein * 4,
                                                                        fats * 9,
                                                                        carbs * 4,
                                                                    ],
                                                                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                },
                                                            ],
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            plugins: {
                                                                tooltip: false
                                                            },
                                                        }}
                                                        style={{ width: '50px', height: '50px' }}
                                                    />
                                                </div>
                                                <div style={{ marginTop: '-15px' }}>
                                                    <p>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            width: '10px',
                                                            height: '10px',
                                                            backgroundColor: '#FF6384',
                                                            borderRadius: '50%',
                                                            marginRight: '8px',
                                                        }}></span>
                                                        Protein: {protein}g
                                                    </p>
                                                    <p>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            width: '10px',
                                                            height: '10px',
                                                            backgroundColor: '#36A2EB',
                                                            borderRadius: '50%',
                                                            marginRight: '8px',
                                                        }}></span>
                                                        Fats: {fats}g
                                                    </p>
                                                    <p>
                                                        <span style={{
                                                            display: 'inline-block',
                                                            width: '10px',
                                                            height: '10px',
                                                            backgroundColor: '#FFCE56',
                                                            borderRadius: '50%',
                                                            marginRight: '8px',
                                                        }}></span>
                                                        Carbs: {carbs}g
                                                    </p>
                                                </div>
                                            </div>
                                        </Box>
                                        <Box sx={{ width: "40%", backgroundColor: 'white', display: 'flex', justifyContent: 'center' }}>
                                            <Button variant="contained" startIcon = {<AddIcon/>} disableRipple 
                                            style={{ width: '50%', height: '35px', backgroundColor: '#00c691', color: 'white', position: 'relative', top: '63%'}}
                                            
                                            >
                                                ADD
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Box sx={{ backgroundColor: 'white', width: '100%', height: '240px', borderRadius: '10px', outline: '1px solid #D3D3D3', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                        <div className='quantity selection'>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                <label>
                                                    {selectedItem.food_name}
                                                </label>
                                            </Box>
                                            <Box style={{ height: '100px', width: '100%', position: 'relative' }}>
                                                <img
                                                    src={selectedItem.photo.thumb}
                                                    alt={selectedItem.food_name}
                                                    style={{ maxHeight: '100px', maxWidth: '100px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', height: '30px', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', top: '20px', position: 'relative' }}>
                                                <InputLabel sx={{ color: 'black', width: '30%', backgroundColor: 'white', marginLeft: '10px', marginRight: '-30px', fontFamily: '"Roboto", sans-serif' }}>Meal</InputLabel>
                                                <Select sx={{ width: '70%', height: '100%', marginRight: '10px' }} defaultValue={'Breakfast'}>
                                                    <MenuItem value={'Breakfast'}>Breakfast</MenuItem>
                                                    <MenuItem value={'Lunch'}>Lunch</MenuItem>
                                                    <MenuItem value={'Dinner'}>Dinner</MenuItem>
                                                    <MenuItem value={'Snacks'}>Snacks</MenuItem>
                                                </Select>
                                            </Box>
                                            <Box sx={{ display: 'flex', height: '30px', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', top: '40px', position: 'relative' }}>
                                                <input
                                                    name='weight'
                                                    type='number'
                                                    min='0'
                                                    value ={servingQty}
                                                    onChange = {handleServingSelect} 
                                                    style={{ width: '18%', position: 'relative', left: '5px' }}
                                                />
                                                <Select sx={{ width: '70%', height: '100%', marginRight: '10px' }} defaultValue={'unit1'} value = {servingUnit} onChange = {(e) => setServingUnit(e.target.value)} >
                                                    <MenuItem value={'unit1'}>{selectedItem.serving_unit}</MenuItem>
                                                    <MenuItem value={'unit2'}>{selectedItem.serving_weight_grams}g</MenuItem>
                                                    <MenuItem value={'unit3'}>g</MenuItem>
                                                </Select>
                                            </Box>
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
