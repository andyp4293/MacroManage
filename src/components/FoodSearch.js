import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, IconButton, Box, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/FoodSearch.module.css';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const backendUrl = process.env.REACT_APP_APIURL;


// function to make it so that every work is has a capitalized first letter and rest lower case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function FoodSearchModal({ open, onClose, addFood }) {
    const token = localStorage.getItem('token'); // json web token
    // state for the search query
    const [query, setQuery] = useState('');
    
    // state for holding the nutritional data from the database
    const [nutritionData, setNutritionData] = useState([]);
    // State to store the selected item data and its details
    const [itemData, setItemData] = useState({});
    const [selectedItem, setSelectedItem] = useState('');
    const [foodPopup, setFoodPopup] = useState(false); 
    const [servingQty, setServingQty] = useState(''); // For the default serving quantity
    const [foodName, setFoodName] = useState(''); 

    // state so that only certain components will be shown after the first search
    const [searched, setSearched] = useState(false); 
    const [defaultServingQty, setDefaultServingQty] = useState('');
    const [defaultServingQtyGrams, setDefaultServingQtyGrams] = useState('');
    const [passedServingQty, setPassedServingQty] = useState('');

    const [selectedServingUnit, setSelectedServingUnit] = useState('unit1');

    const navigate = useNavigate();
    const notifyError = () => {
        toast.error('Please log in before adding a weight entry.', {
            position: "top-right",
            autoClose: 3000, // slose after 3 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'colored',
        });
    };

    const handleServingSelect = (e) => {
        if (e.target.value.length < 15) {
            setServingQty(e.target.value); 
        }

    };
    const [selectedMeal, setSelectedMeal] = useState('Breakfast'); 
    const [servingUnit, setServingUnit] = useState('');
    const [calories, setCalories] = useState(''); // For calories of the selected item
    const [protein, setProtein] = useState(''); // For the protein in grams of the selected item
    const [fats, setFats] = useState(''); // For the fats in grams of the selected item 
    const [carbs, setCarbs] = useState(''); // For the carbs in grams of the selected item
    const [foodId, setFoodId] = useState('');

    const handleClose = () => {
        setNutritionData([]);
        setQuery('');
        setItemData(''); 
        setSearched(false); 
    };

    // search for food results based on the search query 
    const handleSearch = () => {
        fetch(`${backendUrl}/api/nutrition`, {
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



    // select food and fetch nutritional details from the backend
    const handleFoodSelect = (item) => {
        fetch(`${backendUrl}/api/nutrition/item?item_id=${item.id}`) // fetches nutrition details based on the food's id
            .then(response => response.json()) // parses the backend's return into json
            .then(data => {
                const fetchedItemData = data;
                const servingWeightGrams = data.serving_size || 0;

                setSelectedItem({
                    ...item,
                    serving_weight_grams: servingWeightGrams
                }); 
                setItemData(fetchedItemData);
                setServingQty(fetchedItemData.serving_size || 100)
                setDefaultServingQty(fetchedItemData.serving_size || 100); // Default serving amount
                setDefaultServingQtyGrams(servingWeightGrams||100); // Default serving amount in grams
                setCalories(Number((fetchedItemData.kcal||0).toFixed(1)));
                setProtein(Number((fetchedItemData.protein||0).toFixed(1))); 
                setFats(Number((fetchedItemData.total_fat||0).toFixed(1)));
                setCarbs(Number((fetchedItemData.total_carb||0).toFixed(1))); 
                setFoodName(fetchedItemData.name); 
                setServingUnit(fetchedItemData.serving_size_unit ? fetchedItemData.serving_size_unit: 'g');
                setFoodPopup(true); // Open the food popup after data is fetched
                setPassedServingQty(fetchedItemData.serving_size);
                setFoodId(fetchedItemData.id)
            })
            .catch(error => console.error('Error fetching item data:', error)); // Handle errors
    };

    

    // updates the nutition shown on the food search modal if the units or the serving amount changes
    useEffect(() => {
        if (itemData && itemData.kcal && servingQty && defaultServingQty) {
        // multiply the default calories and macro amounts found in 1 serving by (default serving size/selected serving size)
        switch (selectedServingUnit) {
            case 'unit1': // default serving unit
                setServingUnit('g'); 
                setPassedServingQty(servingQty || 100); 
                setCalories(Number(((itemData.kcal * (servingQty / defaultServingQty))||0).toFixed(1)));
                setProtein(Number(((itemData.protein * (servingQty / defaultServingQty))||0).toFixed(1)));
                setFats(Number((itemData.total_fat * (servingQty / defaultServingQty)||0).toFixed(1)));
                setCarbs(Number(((itemData.total_carb * (servingQty / defaultServingQty))||0).toFixed(1)));
            break; 

            case 'unit2': // default serving amount in grams or ml 
                setServingUnit((servingUnit === 'g') ? 'g': 'ml'); 
                setPassedServingQty(servingQty * defaultServingQtyGrams);
                setCalories(Number(((itemData.kcal * (servingQty))||0).toFixed(1)));
                setProtein(Number(((itemData.protein * (servingQty))||0).toFixed(1)));
                setFats(Number(((itemData.total_fat * (servingQty))||0).toFixed(1)));
                setCarbs(Number(((itemData.total_carb * (servingQty))||0).toFixed(1)));
            break; 
            default:
        }
    }
    }, [selectedServingUnit, servingQty, itemData.kcal, itemData.protein, itemData.total_carb, itemData.total_fat, defaultServingQty, defaultServingQtyGrams, servingUnit, itemData]);


    const handleAdd = () => {
        if(!token) {
            notifyError(); 
            navigate('/login');// prompts the user to login if they aren't and they try to add an entry
            return; 
        }
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

    const dataValues = [
        protein * 4,
        fats * 9,
        carbs * 4,
    ]; 
    
    // boolean in case the macros are zero, it'll just show a gray circle
    const zero = protein === 0 && carbs === 0 && fats === 0;

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
                    <div className = {styles['foodSearchContainer']} style={{ display: 'flex', width: '100%', height: 'auto', alignItems: 'stretch', backgroundColor: 'white'}}>

                        <div className = {styles['left-container']}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', marginBottom: '0' }}>
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
                                                color: '#343d46',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#343d46',
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
                                            background: '#343d46',
                                            marginBottom: '5px',
                                            marginTop: "3px",
                                            minWidth: '100px', 
                                            justifyContent: 'space-between',
                                            '&:hover': {
                                                backgroundColor: '#4f5b66'
                                            }
                                        }}
                                    >
                                        Search
                                    </Button>
                                </div>
                            </div>
                            {searched &&
                                <div className={styles['food-table-container']} >
                                    <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '10px', overflow: 'hidden' }}>
                                        <tbody>
                                            {nutritionData.map((item, index) => (
                                                <tr
                                                    className={styles['food-results-row']}
                                                    key={index}
                                                    style={{ borderBottom: '1px solid #ddd' }}
                                                    onClick={() => handleFoodSelect(item)}
                                                >
                                                    <td style={{ padding: '8px' }}>{`${toTitleCase(item.name)}, ${item.serving_size ? item.serving_size: 100} ${item.serving_size_unit ? item.serving_size_unit: 'g'}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>




                        
                        <div className = {styles['right-container']} style={{backgroundColor: 'white', }}>
                            {foodPopup && itemData && (
                                <div style={{ width: '100%' , height: '100%'}}>
                                    <Box style={{ width: '100%' }}>
                                        <Box className='macro and calorie container' sx = {{ marginTop: '3%', marginBottom: '3%', borderRadius: '10px'}}>
                                            <Typography variant="h6" component="div" gutterBottom sx={{ textAlign: 'center' }}>
                                                {calories} kcal
                                            </Typography>
                                            <div style={{ display: 'flex', width: '100%', justifyContent: 'center'}}>
                                                <div style={{ height: '100px', width: '100px', display: 'flex', alignItems: 'center', }}>
                                                    <Doughnut
                                                        data={{
                                                            datasets: [
                                                                {
                                                                    data: zero ? [1] : dataValues, 
                                                                    backgroundColor: zero? ['#D3D3D3'] : ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                    hoverBackgroundColor: zero? ['#D3D3D3'] : ['#FF6384', '#36A2EB', '#FFCE56'],
                                                                    borderWidth: 0, 
                                                                    spacing: zero ? 0 : 4, 
                                                                    borderRadius: zero ? 0 : 20,
                                                                },
                                                            ],
                                                        }}
                                                        options={{
                                                            responsive: true,
                                                            cutout: '60%',
                                                            plugins: {
                                                                tooltip: false
                                                            },
                                                            animation: {
                                                                duration: 0 // no animation
                                                            },
                                                        }}
                                                        style={{ width: '50px', height: '50px', }}
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
                                    </Box>
                                    <Box sx={{
                                        backgroundColor: 'white',
                                        width: '90%',
                                        height: 'auto',
                                        borderRadius: '10px',
                                        outline: '1px solid #D3D3D3',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        padding: '20px'

                                    }}>

                                        {/* quantity selection box */}
                                        <div className='quantity selection' style = {{height: 'auto'}}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                width: '100%',
                                                padding: '10px',
                                                backgroundColor: 'white'
                                            }}>
                                                <label style={{
                                                    fontSize: '14px',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '100%', 
                                                    textOverflow: 'ellipsis',
                                                }}>
                                                    {toTitleCase(foodName)}
                                                </label>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                height: '40px',
                                                backgroundColor: 'white',
                                                justifyContent: 'space-evenly',
                                                alignItems: 'center',
                                                marginTop: '10px'
                                            }}>
                                                <InputLabel sx={{
                                                    color: 'black',
                                                    width: '30%',
                                                    fontFamily: '"Roboto", sans-serif',
                                                    fontSize: '15px'
                                                }}>Meal</InputLabel>
                                                <Select sx={{
                                                    width: '70%',
                                                    height: '30px',
                                                    marginRight: '0px',
                                                    fontSize: '14px'
                                                }} defaultValue={'Breakfast'} value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
                                                    <MenuItem value={'Breakfast'}>Breakfast</MenuItem>
                                                    <MenuItem value={'Lunch'}>Lunch</MenuItem>
                                                    <MenuItem value={'Dinner'}>Dinner</MenuItem>
                                                    <MenuItem value={'Snacks'}>Snacks</MenuItem>
                                                </Select>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                height: '40px',
                                                backgroundColor: 'white',
                                                alignItems: 'center',
                                                marginTop: '10px'
                                            }}>
                                                <InputLabel sx={{
                                                    color: 'black',
                                                    width: '30%',
                                                    backgroundColor: 'white',
                                                    fontFamily: '"Roboto", sans-serif',
                                                    fontSize: '15px'
                                                }}>Serving Size</InputLabel>

                                                <div style = {{width: '70%', backgroundColor: 'white', display: 'flex', alignItems: 'center'}}>
                                                <input
                                                    name='weight'
                                                    type='number'
                                                    min='0'
                                                    value={servingQty}
                                                    onChange={handleServingSelect}
                                                    style={{
                                                        height: '27px', 
                                                        border: '1px solid #ccc', 
                                                        borderRadius: '4px',
                                                        fontSize: '14px', 
                                                        marginRight: '2%',
                                                        width: '18%',

                                                    }}
                                                />
                                                <Select sx={{
                                                    width: '80%',
                                                    height: '31px',
                                                    fontSize: '14px'
                                                }} defaultValue={'unit1'} value={selectedServingUnit} onChange={(e) => setSelectedServingUnit(e.target.value)}>
                                                    <MenuItem value={'unit1'}>{selectedItem.serving_size_unit|| 'g'}</MenuItem>
                                                    <MenuItem value={'unit2'}>{selectedItem.serving_weight_grams|| 100}g</MenuItem>
                                                </Select>
                                                </div>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'left',
                                                width: '100%',
                                                marginTop: '20px'
                                            }}>
                                                <Button variant="contained" startIcon={<AddIcon/>} disableRipple 
                                                    
                                                    sx={{
                                                        width: {
                                                            xs: '100%', 
                                                            sm: '100%', 
                                                            md: '50%'
                                                        },
                                                        height: '40px',
                                                        backgroundColor: '#343d46',
                                                        color: 'white',
                                                        fontSize: '16px',
                                                        textTransform: 'none',
                                                        '&:hover': { backgroundColor: '#4f5b66' },
                                                        
                                                    }}
                                                    onClick={handleAdd}
                                                >
                                                    <h5>
                                                        Add item
                                                    </h5>
                                                </Button>
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
