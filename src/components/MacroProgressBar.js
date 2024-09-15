import React from 'react';

const MacroProgressBar = ({ label, value, color, nutritionTarget, nutritiion}) => {

    const progressBarOuterStyle = {
        width: '100%', // Match parent width for outer bar
        backgroundColor: '#f0f0f0', // light gray
        borderRadius: '20px', 
        border: '1px solid #d0d0d0', // Subtle border for depth
        height: '12px', 
    };

    const progressBarInnerStyle = {
        height: '100%', // full height of the outter bar
        borderRadius: '20px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'white',
        fontWeight: 'bold',
        width: `${value}%`, 
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

    return (
        <div style={progressBarContainerStyle}>
            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
            <label style={labelStyle}>{label}</label>
            
            <span>{value}%</span>
            </div>
            <div style={progressBarOuterStyle}>
                <div style={progressBarInnerStyle}>
                </div>
            </div>
        </div>
    );
};

export default MacroProgressBar;
