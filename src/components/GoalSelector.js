import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function GoalSelector({ open, onClose, goals }) {
    const token = localStorage.getItem('token'); // json web token
    const [calories, setCalories] = useState(null);
    const [carbs, setCarbs] = useState(null);
    const [fat, setFat] = useState(null);
    const [protein, setProtein] = useState(null);
    const [totalPercent, setTotalPercent] = useState(null); 
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        if (goals !== undefined) {
            setCalories(parseInt(goals.calories, 10));
            setCarbs(parseInt(goals.carbohydrate_percent, 10));
            setFat(parseInt(goals.fat_percent, 10));
            setProtein(parseInt(goals.protein_percent, 10)); 
            setTotalPercent(parseInt(goals.protein_percent, 10) + parseInt(goals.carbohydrate_percent, 10)+ parseInt(goals.fat_percent, 10)); 
        }
    }, [goals]);

    useEffect(() => {
        setTotalPercent(carbs + fat + protein); 
    }, [carbs, fat, protein])



    const handleSave = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/nutrition/set_nutrition_goals', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`, // jwt authorization
                },
                body: JSON.stringify({
                    protein: protein,
                    carb: carbs, 
                    fat: fat,
                    calories: calories
                })
            });

            if(response.ok){
                setMessage('Nutrition goals have been successfully updated.');
            }
            else {
                response.json().then(data => {
                    setMessage(data.message); 
                })
            }


        }

        catch (error) {
            console.error(error); 
        }
        finally {
            onClose();
        }
    };

    return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth style = {{borderRadius: '20px'}}>
        <DialogTitle>
            Daily Nutrition Goals
            <IconButton
                aria-label="close"
                onClick ={onClose}
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
            <form>
            <TextField
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
                inputProps={{style: {fontSize: 14}}} 
                margin="normal"
                label="Calories"
                pattern="[0-9]"
                onChange={(e) => {
                    const newCalories = e.target.value;
                    const regex = /^[0-9\b]+$/;  // only allows digits

                    if (newCalories === '' || regex.test(newCalories)) {
                        setCalories(newCalories);  
                    }
                }}
                type="text"  
                fullWidth
                value={calories}
            />


            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', borderBottom: 'solid 1px #D3D3D3'}}>
            <p style = {{width: '80%', fontSize: '14px'}}>
                Protein {Math.round((protein*calories*0.01)/4)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                style = {{height: '30px', fontSize: '14px'}}
                value={protein || 0}
                onChange={(e) => setProtein(e.target.value)}
                >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={30}>30%</MenuItem>
                    <MenuItem value={35}>35%</MenuItem>
                    <MenuItem value={40}>40%</MenuItem>
                    <MenuItem value={45}>45%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={55}>55%</MenuItem>
                    <MenuItem value={60}>60%</MenuItem>
                    <MenuItem value={65}>65%</MenuItem>
                    <MenuItem value={70}>70%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={80}>80%</MenuItem>
                    <MenuItem value={85}>85%</MenuItem>
                    <MenuItem value={90}>90%</MenuItem>
                    <MenuItem value={95}>95%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                </Select>
            </FormControl>
            </div>


            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', borderBottom: 'solid 1px #D3D3D3'}}>
            <p style = {{width: '80%', fontSize: '14px'}}>
                Fats {Math.round((fat*calories*0.01)/9)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                value={fat || 0}
                style = {{height: '30px', fontSize: '14px'}}
                onChange={(e) => setFat(e.target.value)}
                >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={30}>30%</MenuItem>
                    <MenuItem value={35}>35%</MenuItem>
                    <MenuItem value={40}>40%</MenuItem>
                    <MenuItem value={45}>45%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={55}>55%</MenuItem>
                    <MenuItem value={60}>60%</MenuItem>
                    <MenuItem value={65}>65%</MenuItem>
                    <MenuItem value={70}>70%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={80}>80%</MenuItem>
                    <MenuItem value={85}>85%</MenuItem>
                    <MenuItem value={90}>90%</MenuItem>
                    <MenuItem value={95}>95%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                </Select>
            </FormControl>
            </div>

            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', borderBottom: 'solid 1px #D3D3D3'}}>
            <p style = {{width: '80%', fontSize: '14px'}}>
                Carbs {Math.round((carbs*calories*0.01)/4)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                style = {{height: '30px', fontSize: '14px'}}
                value={carbs || 0}
                onChange={(e) => setCarbs(e.target.value)}
                >
                    <MenuItem value={0}>0%</MenuItem>
                    <MenuItem value={5}>5%</MenuItem>
                    <MenuItem value={10}>10%</MenuItem>
                    <MenuItem value={15}>15%</MenuItem>
                    <MenuItem value={20}>20%</MenuItem>
                    <MenuItem value={25}>25%</MenuItem>
                    <MenuItem value={30}>30%</MenuItem>
                    <MenuItem value={35}>35%</MenuItem>
                    <MenuItem value={40}>40%</MenuItem>
                    <MenuItem value={45}>45%</MenuItem>
                    <MenuItem value={50}>50%</MenuItem>
                    <MenuItem value={55}>55%</MenuItem>
                    <MenuItem value={60}>60%</MenuItem>
                    <MenuItem value={65}>65%</MenuItem>
                    <MenuItem value={70}>70%</MenuItem>
                    <MenuItem value={75}>75%</MenuItem>
                    <MenuItem value={80}>80%</MenuItem>
                    <MenuItem value={85}>85%</MenuItem>
                    <MenuItem value={90}>90%</MenuItem>
                    <MenuItem value={95}>95%</MenuItem>
                    <MenuItem value={100}>100%</MenuItem>
                </Select>
            </FormControl>
            </div>
            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', borderBottom: 'solid 1px #D3D3D3', marginBottom: '2%'}}>
                <p style = {{width: '80%', fontSize: '14px'}}>%Total</p> 
                <p style = {{width: '15%', fontSize: '14px', textAlign: 'right', marginRight: '2%', fontWeight: 'bold', color: totalPercent === 100 ? 'green' : 'red'}}>
                    {`${totalPercent}%`}
                </p> 
            </div>
            <Button onClick={handleSave} style = {{backgroundColor: totalPercent === 100 ? '#00c691': '#808080', color: 'white'}} disabled = {totalPercent !== 100}>
                Save
            </Button>
            </form>
        </DialogContent>
    </Dialog>
    );
}

export default GoalSelector;
