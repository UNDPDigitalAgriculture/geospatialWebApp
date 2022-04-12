import { useEffect, useState, useRef, useContext } from 'react';
import Legend from './Legend';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';
import { SidebarContext } from '../context/sidebar';
import { getDatabase, ref, onValue } from "firebase/database";
import gjn from '../final1.json'
import centers from '../centers.geojson'
import lg from './lg.jpg'
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import StyleSwitcherControl from '@wabson/mapbox-gl-style-switcher';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'


const Map = () => {

    mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0b3NoaWRnIiwiYSI6ImNrdmFqaWRrbzA0d2EycHM0dHZlbDd4YWwifQ.UcAHP1-_ElK4XZaVNPuvdg';
    const { isOpen, setIsOpen } = useContext(SidebarContext);
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(25.51);
    const [lat, setLat] = useState(-28.95);
    const [zoom, setZoom] = useState(5.5);
    const [fbData, setFbData] = useState();
    const [location, setLocation] = useState('');
    const [openModal, setOpenModal] = useState(false);



    const zoomObj = {
        "Nkomazi": [31.572, -25.668],
        "Orania": [24.563, -29.869],
        "Cape Town": [18.552, -34.030]
    }

    const zoomToLocation = (event) => {


        setLocation(event.target.value);

        console.log(event.target.value);
        //setLat(ev)

        //setLat(zoomObj[event.target.value][1])
        //setLng(zoomObj[event.target.value][0])
        //map.current.panTo(zoomObj[event.target.value])
        map.current.flyTo({

            //curve: 0.3,
            center: zoomObj[event.target.value],
            zoom: 13,
            speed: 1.3,
            essential: true
        })

    }
    const draw = new MapboxDraw({
        userProperties: true,
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
            polygon: true,
            trash: true
        },
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        // defaultMode: 'draw_polygon'
    });

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            //style: 'mapbox://styles/mapbox/dark-v10',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [lng, lat],
            zoom: zoom,
            maxBounds: [6.899414, -37.456374, 44.494629, -18.915435]
        });

        //callDb()

        map.current.on('load', () => {

            const layers = map.current.getStyle().layers;
            // Find the index of the first symbol layer in the map style.
            let firstSymbolId;
            for (const layer of layers) {
                if (layer.type === 'symbol') {
                    firstSymbolId = layer.id;
                    break;
                }
            }
            map.current.addControl(draw);
            callDb(firstSymbolId)
            //addGeojson(gjn, firstSymbolId);
            // map.current.addControl(new StyleSwitcherControl());
            map.current.on('click', 'farms', (e) => {
                console.log(e);
                const coordinates = e.features[0].geometry.coordinates[0][0];
                let description = e.features[0].properties.crop_type;
                if (description === 0) {
                    description = 'Corn 🌽'
                } else if (description === 3) {
                    description = 'Tomato 🍅'
                } else if (description === 2) {
                    description = 'Lettuce 🌿'
                } else {
                    description = 'Rice 🍚'
                }
                console.log(coordinates);

                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`Crop Type: ${description} <br />Total Acreage: xxx <br /> Boundary added by: Admin <br/> Last Edit: 4/11/2022 <br /><img width='200' src={${lg}} />`)
                    .addTo(map.current);
            })

            map.current.on('draw.create', () => {
                console.log('create');
                setOpenModal(true);
            });
            //map.on('draw.delete', updateArea);
            //map.on('draw.update', updateArea);
        })

        //console.log(gjn);

    }, []);

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });




    const callDb = (symbolLayer) => {
        const database = getDatabase();
        const dbref = ref(database, '/features/');
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            setFbData(data);
            //console.log(data);
            addGeojson(data, symbolLayer);
        })
    }

    const addGeojson = (data, symbolLayer) => {
        //console.log(data);
        // console.log(data[0])
        //console.log(data);

        map.current.addSource('farms', {
            type: 'geojson',
            //data: data
            data: {
                'type': 'FeatureCollection',
                'features': data
            }
        })
        map.current.addLayer(
            {
                id: 'farms',
                type: 'fill',
                source: 'farms',
                'paint': {

                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'crop_type'],
                        0, 'yellow',
                        1, 'whitesmoke',
                        2, 'green',
                        3, 'red'
                    ],
                    'fill-opacity': 0.7,

                }
            }, symbolLayer
        );

        map.current.addLayer(
            {
                id: 'farms-lines',
                type: 'line',
                source: 'farms',
                'paint': {
                    'line-width': 1.5,
                    'line-color': 'black',
                    'line-opacity': 1,

                }
            }, symbolLayer
        );


        // map.current.addSource('center-labels', {
        //     'type': 'geojson',
        //     'data': centers
        // });
        // map.current.addLayer({
        //     'id': 'center-labels',
        //     'type': 'symbol',
        //     'source': 'center-labels',
        //     'layout': {
        //         'text-field': [
        //             'literal',
        //             ['get', 'crop_type'],
        //             0, 'yellow',
        //             1, 'whitesmoke',
        //             2, 'green',
        //             3, 'red'
        //         ],
        //     }




        // })

        // if (data) {

        //     var source = map.current.addSource('farms', {
        //         type: 'geojson',
        //         data: {
        //             'type': 'FeatureCollection',
        //             'features': data
        //         }
        //     })
        //     map.current.addLayer(
        //         {
        //             id: 'farms',
        //             type: 'fill',
        //             source: 'farms',
        //             'paint': {

        //                 'fill-color': 'red',
        //                 'fill-opacity': 0.5
        //             }
        //         }
        //     );
        // }
    }

    const pull_data = (data) => {
        console.log(data);
        if (data !== 'crop_type') {

            map.current.setPaintProperty('farms', 'fill-color', [
                'interpolate',
                ['linear'],
                ['get', data],
                0, 'red',
                50, 'white',
                100, 'green'
            ]);
        } else {
            map.current.setPaintProperty('farms', 'fill-color', [
                'interpolate',
                ['linear'],
                ['get', 'crop_type'],
                0, 'yellow',
                1, 'whitesmoke',
                2, 'green',
                3, 'red'
            ]);

        }
    }


    return (
        <div>

            {/* <Button variant='contained' sx={{ position: 'absolute', zIndex: 400 }} onClick={() => { setIsOpen(true) }}>Click me!</Button> */}
            <IconButton sx={{ position: 'absolute', right: 0, top: 400, zIndex: 100 }} size="large" onClick={() => { setIsOpen(true) }}><AddBoxIcon fontSize='large' /></IconButton>
            <Box sx={{ padding: 2, backgroundColor: '#808080', position: 'absolute', left: 20, top: 120, width: 180, zIndex: 400 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Locations</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={location}
                        label="Location"
                        onChange={zoomToLocation}
                    >
                        <MenuItem value="Nkomazi">Nkomazi</MenuItem>
                        <MenuItem value="Orania">Orania</MenuItem>
                        <MenuItem value="Cape Town">Cape Town</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Modal
                open={openModal}
                onClose={() => { setOpenModal(false) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <TextField id="outlined-basic" label="Crop Type" variant="outlined" /><br />
                    <Button onClick={() => { setOpenModal(false) }} sx={{ marginTop: 1 }} variant='outlined'>Add To Map </Button>
                </Box>


            </Modal>
            <Legend func={pull_data} />
            <div ref={mapContainer} className="map-container" />
        </div >
    );
}
export default Map;
