import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '1.3rem'
}));

const Legend = (props) => {

    const [age, setAge] = useState('crop_type');

    const handleChange = (event) => {
        console.log(event.target.value);
        setAge(event.target.value);

        props.func(event.target.value)
    };


    return (
        <Box sx={{
            width: 300,
            height: 320,
            position: 'absolute',
            bottom: 10,
            left: 20,
            zIndex: 400,
            backgroundColor: '#808080',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',

        }}>
            <FormControl sx={{ marginTop: 2, width: '80%' }}>
                <InputLabel id="demo-simple-select-label">Layer</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Layer"
                    onChange={handleChange}
                >
                    <MenuItem default value={'crop_type'}>Crop Type</MenuItem>
                    <MenuItem value={'17out'}>2017 Crop Yield</MenuItem>
                    <MenuItem value={'18out'}>2018 Crop Yield</MenuItem>
                    <MenuItem value={'19out'}>2019 Crop Yield</MenuItem>
                </Select>
            </FormControl>
            <Box sx={{ marginTop: 2, }}>
                {age === 'crop_type' ?
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Item sx={{ backgroundColor: 'yellow' }}>🌽</Item>
                        </Grid>

                        <Grid item xs={12}>
                            <Item sx={{ backgroundColor: 'red' }}>🍅</Item>
                        </Grid>

                        <Grid item xs={12}>
                            <Item sx={{ backgroundColor: 'whitesmoke' }}>🍚</Item>
                        </Grid>

                        <Grid item xs={12}>
                            <Item onClick={(e) => { console.log(e) }} sx={{ backgroundColor: 'green' }}>🌿</Item>
                        </Grid>
                    </Grid> :
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Item sx={{ backgroundColor: 'red' }}>Low Yield</Item>
                            <Item sx={{ backgroundColor: 'green' }}>High Yield </Item>
                        </Grid>
                    </Grid>

                }


            </Box>
        </Box >
    )
}


export default Legend;