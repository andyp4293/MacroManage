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

    // function to change the status of the calender open or closed
    const dateClick = () => {
        setOpenCal(!openCal); // every time this function is called, the state of the calender is switched
                            // ie if the calender wasn't visible before, it will be after
    }
    
    return (
            <Box
            sx = {{
                position: 'relative', // relative for positioning context of the date picker component
                backgroundColor: '#00c691',
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between', 
                borderRadius: '10px', 
                padding: '0px 0px',
                width: '350px',
                height: '45px'
            }}
            >
            
            {/*Left arrow button */}
            <IconButton
                disableRipple
                onClick = {prevDay} // when left arrow clicked the date is decremented by 1 day
                sx = {{
                    color: 'white', 
                    borderRadius: '10px 0 0 10px',
                    borderRight: '3px solid white', 
                    height: '45px', 
                    width: '45px',  
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
                cursor: 'pointer',
                fontSize: '20px',
            }}
            onClick = {dateClick}
            >
            {format(date, 'EEE, MMM d, yyyy')}
            </Typography>

            {/*Right arrow button */}
            <IconButton
            onClick = {nextDay} // when right arrow is clicked, the date is incremented by 1 day
            disableRipple
            sx={{ 
                color: 'white',
                borderRadius: '0 10px 10px 0',
                borderLeft: '3px solid white',
                height: '45px', 
                width: '45px',
                '&:hover':{
                    backgroundColor: '#00a67e',
                },
            }}
            >
                <KeyboardArrowRightIcon />
            </IconButton>
            {openCal && ( // everything within this bracket is rendered only if openCal is true
                         // so if openCal is true, the date picker component is visible 
                <Box // the date picker component is rendered within a box component
                    sx = {{
                        position: 'absolute',
                        top: '110%',
                        right: '0', 
                        zIndex: 1000,
                    }}

                >
                <DatePicker
                    selected={date}
                    onChange={(newDate) => {
                        setDate(newDate);
                        setOpenCal(false); // closes calendar when a day date is picked
        
                    }}
                    inline
                    onClickOutside={() => setOpenCal(false)} // closes calender if user clicks anywhere outside of i
            />
            </Box>
        )}
            </Box> 
            
    )

};

export default DateSelector;
