import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Box, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/FoodSearch.module.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';

ChartJS.register(ArcElement, Tooltip, Legend);

function FoodSearchModal({ open, onClose, addFood }) {
    // state for the search query
    const [query, setQuery] = useState('');
    
    // state for holding the nutritional data from the database
    const [nutritionData, setNutritionData] = useState([]);

    // state so that only certain components will be shown after the first search
    const [searched, setSearched] = useState(false); 

    const handleClose = () => {
        setNutritionData([]);
        setQuery('');
        setItemData(''); 
        setSearched(false); 
    };

    // search for food results based on the search query 
    const handleSearch = () => {
        fetch('http://localhost:5000/api/nutrition', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query }) // sends a post request of the search query
        })
        .then(response => response.json())
        .then(data => {
            setNutritionData(data); // store data from the backend to the nutritionData state
            setSearched(true); 
        }) 
        .catch(error => { 
            console.error('Error fetching nutrition data:', error);
        });
    };

    // State to store the selected item data and its details
    const [itemData, setItemData] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');
    const [foodPopup, setFoodPopup] = useState(false); 
    const [servingQty, setServingQty] = useState(''); // For the default serving quantity
    const [foodName, setFoodName] = useState(''); 

    // select food and fetch nutritional details from the backend
    const handleFoodSelect = (item) => {
        fetch(`http://localhost:5000/api/nutrition/item?item_id=${item.id}`) // fetches nutrition details based on the food's id
            .then(response => response.json()) // parses the backend's returninto json
            .then(data => {
                const fetchedItemData = data;
                const servingWeightGrams = fetchedItemData.serving_size || 0;

                setSelectedItem({
                    ...item,
                    serving_weight_grams: servingWeightGrams
                }); 
                
                setItemData(fetchedItemData);
                setServingQty(fetchedItemData.serving_size); // Serving amount that will be changed by the user
                setDefaultServingQty(fetchedItemData.serving_size || 100); // Default serving amount
                setDefaultServingQtyGrams(servingWeightGrams); // Default serving amount in grams
                setCalories(fetchedItemData.kcal);
                setProtein(fetchedItemData.protein); 
                setFats(fetchedItemData.total_fat);
                setCarbs(fetchedItemData.total_carb); 
                setFoodName(fetchedItemData.name); 
                setServingUnit(fetchedItemData.serving_size_unit);
                setFoodPopup(true); // Open the food popup after data is fetched
                setPassedServingQty(fetchedItemData.serving_size);
                setFoodId(fetchedItemData.id)
            })
            .catch(error => console.error('Error fetching item data:', error)); // Handle errors
    };

    const [defaultServingQty, setDefaultServingQty] = useState('');
    const [defaultServingQtyGrams, setDefaultServingQtyGrams] = useState('');
    const [passedServingQty, setPassedServingQty] = useState('');

    const [selectedServingUnit, setSelectedServingUnit] = useState('unit1');

    const handleServingSelect = (e) => {
        if (e.target.value.length < 15) {
            setServingQty(e.target.value); 
        }

        // multiply the default calories and macro amounts found in 1 serving by (default serving size/selected serving size)
        switch (selectedServingUnit) {
            case 'unit1': // default serving unit
                setPassedServingQty(e.target.value || 100); 
                setCalories(Number((itemData.kcal * (e.target.value / defaultServingQty)).toFixed(1)));
                setProtein(Number((itemData.protein * (e.target.value / defaultServingQty)).toFixed(1)));
                setFats(Number((itemData.total_fat * (e.target.value / defaultServingQty)).toFixed(1)));
                setCarbs(Number((itemData.total_carb * (e.target.value / defaultServingQty)).toFixed(1)));
            break; 

            case 'unit2': // default serving amount in grams
                setServingUnit('g'); 
                setPassedServingQty(e.target.value * defaultServingQtyGrams);
                setCalories(Number((itemData.kcal * (e.target.value)).toFixed(1)));
                setProtein(Number((itemData.protein * (e.target.value)).toFixed(1)));
                setFats(Number((itemData.total_fat * (e.target.value)).toFixed(1)));
                setCarbs(Number((itemData.total_carb * (e.target.value)).toFixed(1)));
            break; 

            case 'unit3': // grams
                setServingUnit('g');
                setPassedServingQty(e.target.value); 
                setCalories(Number((itemData.kcal * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
                setProtein(Number((itemData.protein * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
                setFats(Number((itemData.total_fat * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
                setCarbs(Number((itemData.total_carb * (e.target.value / defaultServingQtyGrams)).toFixed(1)));
            break; 
            default:
        }
    };

    const [selectedMeal, setSelectedMeal] = useState('Breakfast'); 
    const [servingUnit, setServingUnit] = useState('');
    const [calories, setCalories] = useState(''); // For calories of the selected item
    const [protein, setProtein] = useState(''); // For the protein in grams of the selected item
    const [fats, setFats] = useState(''); // For the fats in grams of the selected item 
    const [carbs, setCarbs] = useState(''); // For the carbs in grams of the selected item
    const [foodId, setFoodId] = useState('');

    const handleAdd = () => {
        const foodDetails = {
            calories,
            protein, 
            fats, 
            carbs, 
            servingUnit, 
            passedServingQty, 
            foodName, 
            selectedMeal, 
            foodId, 
        };
        addFood(foodDetails); 
        handleClose(); 
        onClose(); 
    };

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
                    <div style={{ display: 'flex', width: '80%',}}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '95%'}}>
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
                                        onKeyDown = {(e) => {
                                            if (e.key === "Enter"){
                                                handleSearch();
                                            }
                                        }}
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
                                                    <td style={{ padding: '8px' }}>{`${item.name}, ${item.serving_size} ${item.serving_size_unit}`}</td>
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
                                            onClick = {handleAdd}
                                            >
                                                ADD
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Box sx={{ backgroundColor: 'white', width: '100%', height: '240px', borderRadius: '10px', outline: '1px solid #D3D3D3', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                        <div className='quantity selection'>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                                <label>
                                                    {foodName}
                                                </label>
                                            </Box>
                                            <Box sx={{ display: 'flex', height: '30px', backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center', top: '20px', position: 'relative' }}>
                                                <InputLabel sx={{ color: 'black', width: '30%', backgroundColor: 'white', marginLeft: '10px', marginRight: '-30px', fontFamily: '"Roboto", sans-serif' }}>Meal</InputLabel>
                                                <Select sx={{ width: '70%', height: '100%', marginRight: '10px' }} defaultValue={'Breakfast'} value = {selectedMeal} onChange = {(e) => setSelectedMeal(e.target.value)}>
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
                                                <Select sx={{ width: '70%', height: '100%', marginRight: '10px' }} defaultValue={'unit1'} value = {selectedServingUnit} onChange = {(e) => setSelectedServingUnit(e.target.value)} >
                                                    <MenuItem value={'unit1'}>{selectedItem.serving_size_unit}</MenuItem>
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
