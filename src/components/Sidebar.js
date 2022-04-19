import { useEffect, useState, useRef, useContext } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LineChart from './lineChart';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend
} from 'chart.js';
import { faker } from '@faker-js/faker';
import { Doughnut } from 'react-chartjs-2';
import { colors } from '../utils/colors';
import { EditContext } from './context/EditMode';


const Sidebar = (props) => {
    const { data } = props;
    const [lat, setLat] = useState('')
    const [farmAmount, setFarmAmount] = useState('loading..')
    const [farmSize, setFarmSize] = useState('loading..')
    const [pieData, setPieData] = useState();
    const [selFarm, setSelFarm] = useState()
    const [allAreas, setAllAreas] = useState();
    const { isOpen, setIsOpen } = useContext(EditContext);

    const pieRef = useRef();

    ChartJS.register(ArcElement, Tooltip, Legend)


    useEffect(() => {
        //console.log(props.data);
        setFarmAmount(props.data[0])
        // setLat(data)
        //setPieData(props.data.data)
        setFarmSize(props.data[1])
        setPieData(props.data[2])
        setSelFarm(props.data[3])
        setAllAreas(props.data[4])
    })

    useEffect(() => {
        console.log(isOpen[1])
    })

    const handleClick = (e, legendItem) => {
        // console.log(legendItem);
    }


    return (
        <div className='sidebar'>
            <h2>UNDP Digital Agriculture</h2>
            <h3>{lat}</h3>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>

                    {!isOpen ?
                        <>
                            <Grid item xs={6}>
                                <Box>Total Farms</Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box>{Number(farmAmount).toLocaleString('en-US')}</Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box>Total m<sup>2</sup> of Farmland</Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box>{Number(farmSize).toLocaleString('en-US')} m<sup>2</sup></Box>
                            </Grid>
                            {allAreas ?
                                <>

                                    <Grid item xs={6}>
                                        <Box color={colors[0]}>Wheat Area</Box>
                                    </Grid><Grid item xs={6}>
                                        <Box color={colors[0]}>{Number(allAreas['wheatArea']).toLocaleString('en-US')} m<sup>2</sup></Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box color={colors[1]}>Barley Area</Box>
                                    </Grid><Grid item xs={6}>
                                        <Box color={colors[1]}>{Number(allAreas['barleyArea']).toLocaleString('en-US')} m<sup>2</sup></Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box color={colors[2]}>Canola Area</Box>
                                    </Grid><Grid item xs={6}>
                                        <Box color={colors[2]}>{Number(allAreas['canolaArea']).toLocaleString('en-US')} m<sup>2</sup></Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box color={colors[3]}>Lucerne Area</Box>
                                    </Grid><Grid item xs={6}>
                                        <Box color={colors[3]}>{Number(allAreas['lucerneArea']).toLocaleString('en-US')} m<sup>2</sup></Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box color={colors[4]}>Grains Area</Box>
                                    </Grid><Grid item xs={6}>
                                        <Box color={colors[4]}>{Number(allAreas['grainsArea']).toLocaleString('en-US')} m<sup>2</sup></Box>
                                    </Grid>



                                </> : 'loading'

                            }



                            <Grid item xs={12}>
                                <h3>Farm Type Distribution</h3>
                            </Grid><Grid item xs={12}>
                                {pieData ? <Doughnut
                                    width={110}
                                    ref={pieRef}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'bottom',
                                                onClick: handleClick
                                            },
                                        }
                                    }} data={pieData} /> : <div>'loading...' </div>}
                            </Grid></> : <>
                            <Grid item xs={6}>
                                <h3>Selected Farm Area:</h3>
                            </Grid>
                            <Grid item xs={6}><h3>300m<sup>2</sup></h3></Grid>
                            <Grid item xs={12}><h3>Farm Yield</h3></Grid>
                            <LineChart />
                            <Grid item xs={12}><h3>Crop Type: {isOpen[1].crop_name}</h3></Grid>
                            <Grid item xs={12}><h3>45th out of 1163 in productivity</h3></Grid>
                            <Grid item xs={12}><h3>NDVI Value: 0.4</h3></Grid>
                        </>
                    }

                    {selFarm != 'All' ?
                        <Grid item xs={12}>
                            <h3>{selFarm}</h3>
                            <h4>Average NDVI for {selFarm} farms: {faker.datatype.number(100)}</h4>
                            <LineChart />
                        </Grid> : <Grid />
                    }
                </Grid>
            </Box>
        </div >
    )
}

export default Sidebar