import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { useEffect, useRef } from 'react';

const LineChart = () => {

    ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, ArcElement, Tooltip)


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },

        },
    };
    const labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021'];
    const lineData = {
        labels,
        datasets: [
            {
                label: 'Expected Yield',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                //data: [100, 3512, 22, 451, 4231, 534, 100],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Actual Yield',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };


    return <Line options={options} data={lineData} />


}

export default LineChart;