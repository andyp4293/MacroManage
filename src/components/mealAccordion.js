import {Accordion, AccordionSummary, AccordionDetails, Typography, Box} from '@mui/material';
import React from 'react';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



// accordion component for every meal, with the accordion details being the foods logged
function MealAccordion({title, items, nutrition}){
    return(
        <Accordion style = {{width: '60%', minWidth: '550px', margin: '0 auto'}}> 
            {/*header/title on the accordian component */}
            <AccordionSummary 
                expandIcon = {<ExpandMoreIcon/>}
                aria-controls = {`${title}-log`} // name for each expandable body of each meal accordian
                id = {`${title}-header`} // name/id for each header
                sx = {{
                    backgroundColor: '#00c691',
                    color: 'white',
                    height: '48px', // Fixed height
                    minHeight: '48px', // Ensures it doesn't shrink below this height
                    '&.Mui-expanded': {
                        minHeight: '48px', // Keeps height consistent when expanded
                    },
                }}
            > 
                {/* displays meal name and its total nutritional macros */}
                <Box style = {{display: 'flex', justifyContent:'space-between', width: '100%'}}>
                <Typography style = {{display: 'flex', justifyContent: 'space-between', fontFamily: '"Roboto", sans-serif', fontSize: '17px', alignItems: 'center', whiteSpace: 'nowrap'}}>
                            {title} 
                    </Typography>
                    <Typography style = {{display: 'flex', justifyContent: 'space-between', fontFamily: '"Roboto", sans-serif', fontSize: '17px', alignItems: 'center', whiteSpace: 'nowrap'}}>
                            {nutrition}
                    </Typography>
                </Box>
            </AccordionSummary>

            <AccordionDetails style = {{margin: '0', padding: '0'}}> {/* For showing the foods loggeds and their nutrition when accordion is expanded*/}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd', width: '25%'}}><DinnerDiningIcon style = {{fontSize: '25px'}}/></th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Protein</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Fats</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Carbs</th>
                            <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Calories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{`${item.foodName}, ${item.passedServingQty} ${item.servingUnit}`}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.protein} g</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.fats} g</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.carbs} g</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{item.calories} kcal</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AccordionDetails>

        </Accordion>
    )
}

export default MealAccordion