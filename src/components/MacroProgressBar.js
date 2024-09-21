import React from 'react';

const MacroProgressBar = ({ label, color, unit,  nutritionTarget, nutrition }) => {

    // function to round numbers to the nearest tenth
    const roundToNearestTenth = (num) => {
        return Math.round(num * 10) / 10;
    };
    
    nutrition = roundToNearestTenth(nutrition); 
    const progressBarOuterStyle = {
        width: '100%', 
        backgroundColor: '#f0f0f0', // light gray
        borderRadius: '20px', 
        border: '1px solid #d0d0d0', // Subtle border for depth
        height: '12px', 
    };

    const progressBarInnerStyle = {
        height: '100%', // full height of the outer bar
        borderRadius: '20px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'white',
        fontWeight: 'bold',
        width: `${Math.min((nutrition / nutritionTarget) * 100, 100)}%`, // caps at 100% 
        backgroundColor: color, // solid color fill
        transition: 'width 0.3s ease-in-out',
    };

    const labelStyle = {
        fontSize: '10px',
        color: '#333',
        marginBottom: '2px', 
        display: 'block',
    };

    const progressBarContainerStyle = {
        marginLeft: '10px',
        margin: '7px', 
    };



    // calculating the percentage and rounding it
    const percentage = roundToNearestTenth((nutrition / nutritionTarget) * 100);

    return (
        <div style={progressBarContainerStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <label style={labelStyle}>{label} ({nutrition}{unit}/{nutritionTarget}{unit})</label>
                <span>{percentage}%</span> {/* Updated to use the rounded percentage */}
            </div>
            <div style={progressBarOuterStyle}>
                <div style={progressBarInnerStyle}></div>
            </div>
        </div>
    );
};

export default MacroProgressBar;
