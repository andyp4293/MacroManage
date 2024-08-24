import React, { useState } from 'react';
import {IconButton, Typography, Box} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { format, addDays, subDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/dateSelector.css';


function DateSelector(){
    // state for the selected date
    const [date, setDate] = useState(new Date()); // starts off with the current date

    // state to turn the calendar visibility on or off
    const[openCal, setOpenCal] = useState(false); 

    // function to go to the previous day
    const prevDay = () => {
        setDate(subDays(date, 1)); 
    };

    // function go to to the next day
    const nextDay = () => {
        setDate(addDays(date, 1)); 
    };

    // function to open the calendar when the date is clicked
    const dateClick = () => {
        setOpenCal(!openCal); 
    }
    
    return (
            <Box
            sx = {{
                position: 'relative',
                backgroundColor: '#00c691',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between', 
                borderRadius: '10px', 
                padding: '0px 0px',
                width: '300px',
            }}
            >
            
            {/*Left arrow button */}
            <IconButton
                disableRipple
                onClick = {prevDay}
                sx = {{
                    color: 'white', 
                    borderRadius: '10px 0 0 10px',
                    borderRight: '3px solid white', 
                    '&:hover':{
                    backgroundColor: '#00a67e',
                },

                }}
                
            >
                <KeyboardArrowLeftIcon />
            </IconButton>

            <Typography //
            variant="body1" 
            sx={{ 
                color: 'white',
                textAlign: 'center', 
                flexGrow: 1,
                cursor: 'pointer'

            }}
            onClick = {dateClick}
            >
            {format(date, 'EEE, MMM d, yyyy')}
            </Typography>

            {/*Right arrow button */}
            <IconButton
            onClick = {nextDay}
            disableRipple
            sx={{ 
                color: 'white',
                borderRadius: '0 10px 10px 0',
                borderLeft: '3px solid white', 
                '&:hover':{
                    backgroundColor: '#00a67e',
                },
            }}
            >
                <KeyboardArrowRightIcon />
            </IconButton>
            {openCal && (
                <Box
                    sx = {{
                        position: 'absolute',
                        top: '110%',
                        right: '0', 
                    }}

                >
                <DatePicker
                    selected={date}
                    onChange={(newDate) => {
                        setDate(newDate);
                        setOpenCal(false);
            }}
                inline
                onClickOutside={() => setOpenCal(false)}
            />
            </Box>
        )}
            </Box> 
            
    )

};

export default DateSelector;
