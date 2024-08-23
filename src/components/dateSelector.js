import React, { useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addDays, subDays } from 'date-fns';

function DateSelector(){
    // state for the selected date
    const [date, setDate] = useState(new Date()); // starts off with the current date

    // function to go to the previous day
    const prevDay = () => {
        setDate(subDays(date, 1)); 
    };

    // function go to to the next day
    const nextDay = () => {
        setDate(addDays(date, 1)); 
    };
    
    return (
        <Button
        variant = "contained"
        sx = {{
            backgroundColor: '#00c691',
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between', 
            borderRadius: '20px', 
            padding: '10px 20px',
            minWidth: '250px',
            '&:hover':{
                backgroundColor: '#00a67e',
            }
        }}
        >

        <IconButton
            color = "inherent"
            onClick = {prevDay}
            sx = {{
                padding: '0', 
                marginRight: '10px'
            }}
        >
            <ArrowBackIosIcon />
        </IconButton>

        <Typography variant="body1" sx={{ color: 'white' }}>
        {format(date, 'EEEE, MMM d, yyyy')}
        </Typography>

        <IconButton
        color = 'white'
        onClick={nextDay}
        sx={{ padding: '0', marginLeft: '10px' }}
        >
            <ArrowForwardIosIcon />
        </IconButton>
        </Button> 
    )

};

export default DateSelector;
