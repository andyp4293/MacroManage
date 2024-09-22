import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function GoalSelector({ open, onClose, goals }) {
    const [calories, setCalories] = useState(null);
    const [carbs, setCarbs] = useState(null);
    const [fat, setFat] = useState(null);
    const [protein, setProtein] = useState(null);

    useEffect(() => {
        if (goals !== undefined) {
            setCalories(parseInt(goals.calories, 10));
            setCarbs(parseInt(goals.carbohydrate_percent, 10));
            setFat(parseInt(goals.fat_percent, 10));
            setProtein(parseInt(goals.protein_percent, 10)); 
        }
    }, [goals]);



    const handleSave = () => {
        // Implement save logic
        console.log('Saved:', { calories, carbs, fat, protein });
        onClose(); 
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
                margin="normal"
                label="Calories"
                type="number"
                fullWidth
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
            />


            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', borderBottom: 'solid 1px #D3D3D3'}}>
            <p style = {{width: '80%'}}>
                Protein {Math.round((protein*calories*0.01)/4)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                value={protein}
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
            <p style = {{width: '80%'}}>
                Fats {Math.round((fat*calories*0.01)/9)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                value={fat}
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

            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between'}}>
            <p style = {{width: '80%'}}>
                Carbs {Math.round((carbs*calories*0.01)/4)}g
            </p>
            <FormControl style = {{width : '15%'}} margin="normal">
                <Select
                style = {{height: '5%'}}
                value={carbs}
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
            <div style = {{display: 'flex', alignItems: 'center',  justifyContent: 'space-between', height: '10%'}}>
                %Total 
            </div>
            <Button onClick={handleSave} style = {{backgroundColor: '#00c691', color: 'white'}}>
                Save
            </Button>
            </form>
        </DialogContent>
    </Dialog>
    );
}

export default GoalSelector;
