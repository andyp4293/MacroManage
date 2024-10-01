import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, } from 'recharts';
import { format } from 'date-fns'; // You can use date-fns for date formatting



function WeightChart({ data }) {
    // Transform your data from the Chart.js format to the Recharts format
    const chartData = data.map(item => ({
        weight_date: new Date(item.weight_date).getTime(), // ensure weight_date is in the correct format
        Weight: item.weight_lbs
    }));

    // func for making trend line
    const calculateTrendLine = (data) => {
        const N = data.length;
        const sumX = data.reduce((sum, d) => sum + d.weight_date, 0);
        const sumY = data.reduce((sum, d) => sum + d.Weight, 0);
        const sumXY = data.reduce((sum, d) => sum + d.weight_date * d.Weight, 0);
        const sumX2 = data.reduce((sum, d) => sum + d.weight_date * d.weight_date, 0);

        const m = (N * sumXY - sumX * sumY) / (N * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / N;

        return data.map(d => ({
            weight_date: d.weight_date,
            Trend: m * d.weight_date + b || 0
        }));
    };

    const trendLineData = calculateTrendLine(chartData);

    
    const maxValue = Math.max(...chartData.map(d => d.Weight));

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3>Weight</h3>
            <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="99%" height='99%'>
                <LineChart data={chartData}>

                    <XAxis 
                        dataKey="weight_date" 
                        tickFormatter={(tick) => format(new Date(tick), 'MM/dd')} 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                        interval="preserveStartEnd"
                    />
                    
                    <YAxis allowDecimals={false} domain={[0, maxValue + 50]} />

                    <Tooltip cursor={false} labelFormatter={(value) => format(new Date(value), 'MM/dd/yyyy')} />

                    {/* line graph for actual data*/}
                    <Line 
                        type="monotone" 
                        dataKey="Weight" 
                        stroke="#4BC0C0" 
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 2 }} 
                    />
                    

                    {/* trend line */}
                    <Line
                        type="monotone"
                        dataKey="Trend" // trend line data
                        data={trendLineData} 
                        stroke="gray" 
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        tooltip={false}
                        dot={false} 
                    />
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
}

export default WeightChart;
