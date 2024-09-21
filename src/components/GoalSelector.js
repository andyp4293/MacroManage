import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function GoalSelector({ open, handleClose }) {
    const [calories, setCalories] = useState(3000);
    const [carbs, setCarbs] = useState(45);
    const [fat, setFat] = useState(20);
    const [protein, setProtein] = useState(35);

    const handleSave = () => {
        // Implement save logic
        console.log('Saved:', { calories, carbs, fat, protein });
        handleClose();
    };

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Daily Nutrition Goals</DialogTitle>
        <DialogContent>
            <form>
            <TextField
                margin="normal"
                label="Calories"
                type="number"
                fullWidth
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Carbohydrates (%)</InputLabel>
                <Select
                value={carbs}
                label="Carbohydrates (%)"
                onChange={(e) => setCarbs(e.target.value)}
                >
                <MenuItem value={45}>45%</MenuItem>
                <MenuItem value={50}>50%</MenuItem>
                <MenuItem value={55}>55%</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Fat (%)</InputLabel>
                <Select
                value={fat}
                label="Fat (%)"
                onChange={(e) => setFat(e.target.value)}
                >
                <MenuItem value={20}>20%</MenuItem>
                <MenuItem value={25}>25%</MenuItem>
                <MenuItem value={30}>30%</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Protein (%)</InputLabel>
                <Select
                value={protein}
                label="Protein (%)"
                onChange={(e) => setProtein(e.target.value)}
                >
                <MenuItem value={35}>35%</MenuItem>
                <MenuItem value={40}>40%</MenuItem>
                <MenuItem value={45}>45%</MenuItem>
                </Select>
            </FormControl>
            <Button onClick={handleSave} color="primary">
                Save
            </Button>
            </form>
        </DialogContent>
    </Dialog>
    );
}

export default GoalSelector;
