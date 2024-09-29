import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns'; 

function WeightChart({ data }) {
    const chartRef = React.useRef(null);

    const chartData = {
        labels: data.map(item => item.weight_date), 
        datasets: [
            {
                pointRadius: 5,
                data: data.map(item => item.weight_lbs),
                borderColor: '#4BC0C0',
                tension: 0.1,
                fill: true,
            },
        ]
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                grid: {
                    display: false  
                },
                beginAtZero: true,
            },
            x: {
                type: 'time',
                grid: {
                    display: false  
                },
                time: {
                    unit: 'day',
                    tooltipFormat: 'M/dd',
                    displayFormats: {
                        day: 'M/dd'
                    }
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'black'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + ' lbs';
                        }
                        return label;
                    }
                }
            }
        }
    };

    return (
        <div style = {{height: '400px'}}>
            <h3>Weight</h3>
            <Line ref={chartRef} data={chartData} options={options} />
        </div>
    );
}


export default WeightChart;
