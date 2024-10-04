import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import EditNoteSharpIcon from '@mui/icons-material/EditNoteSharp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function WeightStats({ data }) {

    const weightStats = useMemo(() => {
        if (!data || data.length === 0) return { avgLast7: 'N/A', avgLast30: 'N/A', lastWeighIn: 'N/A', firstWeighIn: 'N/A' };
        
        const last7Entries = data.slice(-7);
        const last30Entries = data.slice(-30);
        
        const avgLast7 = last7Entries.reduce((sum, entry) => sum + entry.weight_lbs, 0) / last7Entries.length;
        const avgLast30 = last30Entries.reduce((sum, entry) => sum + entry.weight_lbs, 0) / last30Entries.length;

        const lastWeighIn = data[data.length - 1].weight_lbs;
        const firstWeighIn = data[0].weight_lbs;

    return {
        avgLast7: avgLast7.toFixed(2),
        avgLast30: avgLast30.toFixed(2),
        lastWeighIn,
        firstWeighIn
        };
    }, [data]);


    const containerStyle = {
        width: 'auto', 
        padding: '15px',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.3)',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const statItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '20%',
        textAlign: 'center',
        fontSize: '1em'
    };

    const iconStyle = {
        fontSize: '2.5rem',
        color: '#343d46',
        marginBottom: '5px',
    };

    const statTitleStyle = {
        fontWeight: 'bold',
        fontSize: '1.1em',
        margin: '0 0 5px',
    };

    const statValueStyle = {
        fontSize: '1.2em',
        margin: '0',
    };

    return (
        <Box style={containerStyle}>
            <div style={statItemStyle}>
                <CalendarViewWeekIcon style={iconStyle} />
                <p style={statTitleStyle}>Avg Last 7 Days</p>
                <h3 style={statValueStyle}>{weightStats.avgLast7} lbs</h3>
            </div>
            <div style={statItemStyle}>
                <CalendarMonthIcon style={iconStyle} />
                <p style={statTitleStyle}>Avg Last 30 Days</p>
                <h3 style={statValueStyle}>{weightStats.avgLast30} lbs</h3>
            </div>
            <div style={statItemStyle}>
                <AccessTimeIcon style={iconStyle} />
                <p style={statTitleStyle}>Last Weigh-in</p>
                <h3 style={statValueStyle}>{weightStats.lastWeighIn} lbs</h3>
            </div>
            <div style={statItemStyle}>
                <EditNoteSharpIcon style={iconStyle} />
                <p style={statTitleStyle}>First Weigh-in</p>
                <h3 style={statValueStyle}>{weightStats.firstWeighIn} lbs</h3>
            </div>
        </Box>
    );
}

export default WeightStats;
