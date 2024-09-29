import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns'; // You can use date-fns for date formatting

function WeightChart({ data }) {
    // Transform your data from the Chart.js format to the Recharts format
    const chartData = data.map(item => ({
        weight_date: new Date(item.weight_date).getTime(), // ensure weight_date is in the correct format
        weight_lbs: item.weight_lbs
    }));


    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Weight</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    {/* CartesianGrid can be removed if you don't want the grid lines */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    {/* XAxis with time formatting */}
                    <XAxis 
                        dataKey="weight_date" 
                        tickFormatter={(tick) => format(new Date(tick), 'MM/dd')} // Format the dates
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                        interval="preserveStartEnd"
                    />
                    
                    <YAxis allowDecimals={false} domain={['auto', 'auto']} />

                    <Tooltip labelFormatter={(value) => format(new Date(value), 'MM/dd/yyyy')} />

                    {/* Line settings */}
                    <Line 
                        type="monotone" // Tension equivalent for smoothing the line
                        dataKey="weight_lbs" 
                        stroke="#4BC0C0" 
                        strokeWidth={2}
                        dot={{ r: 5 }} // Dot (point) radius equivalent
                        activeDot={{ r: 8 }} // Active dot size
                        fillOpacity={0.3} 
                        fill="#4BC0C0" // Fill color under the line
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default WeightChart;
