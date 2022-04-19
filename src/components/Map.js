import { useRef, useEffect, useState, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import area from '@turf/area';
import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import mask from '@turf/mask';
import { colorsRgba, colors } from '../utils/colors';
import Slider from '@mui/material/Slider';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
//import gjn from './newfarms.json';
import img from './pic.JPG'
import { EditContext } from './context/EditMode';
import { Menu } from '@mui/material';
import Weather from './weather';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
mapboxgl.accessToken = "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";




const Map = (props) => {
    const { isOpen, setIsOpen } = useContext(EditContext);
    const mapContainerRef = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(20.79);
    const [lat, setLat] = useState(-34.196);
    const [zoom, setZoom] = useState(10.5);
    const [cropDrop, setCropDrop] = useState(["Lucerne/Medics", "Barley", "Small grain grazing", "Wheat", "Canola"])
    const [selectedFarm, setSelectedFarm] = useState('All')
    const [selectedYear, setSelectedYear] = useState('All')
    const [totalArea, setTotalArea] = useState();
    const [opacity, setOpacity] = useState(0.7)
    const [firstSymbol, setFirstSymbol] = useState();
    const [drawGeo, setDrawGeo] = useState();
    // Initialize map when component mounts

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

        map.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            //style: 'mapbox://styles/mapbox/streets-v11',
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        // Add navigation control (the +/- zoom buttons)
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        // class MyCustomControl {
        //     onAdd(map) {
        //         this.map = map;
        //         this.container = document.createElement('div');
        //         this.container.className = 'my-custom-control';
        //         this.container.textContent = 'My custom control';
        //         return this.container;
        //     }
        //     onRemove() {
        //         this.container.parentNode.removeChild(this.container);
        //         this.map = undefined;
        //     }
        // }

        // const myCustomControl = new MyCustomControl();

        // map.current.addControl(myCustomControl, 'top-left');

        map.current.on('load', () => {
            //props.func(map.current.getCenter().lat.toFixed(4))
            map.current.addControl(draw);
            addGeojson()


        })

        // Clean up on unmount
        return () => map.current.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const addFarmLayers = () => {

        if (!map.current.getLayer('farms')) {
            map.current.addLayer(
                {
                    id: 'farms',
                    type: 'fill',
                    source: 'farms',
                    'paint': {

                        'fill-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'crop_id'],
                            1, colors[0],
                            2, colors[1],
                            3, colors[2],
                            4, colors[3],
                            5, colors[4],
                        ],
                        'fill-opacity': opacity,

                    }
                }, firstSymbol
            );

            map.current.addLayer(
                {
                    id: 'farms-lines',
                    type: 'line',
                    source: 'farms',
                    'paint': {
                        'line-width': 1.5,
                        'line-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'crop_id'],
                            1, colors[0],
                            2, colors[1],
                            3, colors[2],
                            4, colors[3],
                            5, colors[4],
                        ],
                        'line-opacity': 1,

                    }
                }, firstSymbol
            );

        }


    }

    const removeFarmLayers = () => {
        map.current.removeLayer('farms')
        map.current.removeLayer('farms-lines')


    }

    useEffect(() => {
        //console.log('hi')

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));


            // if (map.current.getZoom() > 8) {
            //     map.current.removeLayer('clicked')
            //     map.current.removeSource('clicked')
            // }
            // const far = map.current.querySourceFeatures('farms', {
            //     filter: ['in', 'crop_id', 1]
            // })

            // console.log(far)

            //props.func(map.current.getCenter().lat.toFixed(4))

        });
    }, [zoom])


    useEffect(() => {
        map.current.on('click', 'farms', (e) => {

            setIsOpen([true, e.features[0].properties])

            console.log(e.features[0].properties)
            console.log(e.features);
            console.log(e.features[0].geometry)
            const geo = e.features[0].geometry;
            const cent = centroid(geo);
            console.log(cent);
            const bb = bbox(e.features[0].geometry)
            console.log(bb);
            map.current.fitBounds(bb, { padding: 50 });
            // draw.add(gjn);
            // console.log(map.current.getStyle().layers)
            // removeFarmLayers();
            // map.current.addControl(draw);

            //map.current.on('zoomend', () => {
            map.current.addSource('clicked', {
                type: 'geojson',
                data: geo
            })
            // map.current.addLayer(
            //     {
            //         id: 'clicked',
            //         type: 'line',
            //         source: 'clicked',
            //         'paint': {

            //             'line-color': 'yellow',
            //             'line-width': 4
            //         }
            //     }
            // );
            setDrawGeo(geo)
            draw.add(geo);
            // map.current.addLayer(
            //     {
            //         id: 'clicked',
            //         type: 'line',
            //         source: 'clicked',
            //         'paint': {

            //             'line-color': 'yellow',
            //             'line-width': 4

            //         }
            //     }
            // );

            // const popup = new mapboxgl.Popup({ closeOnClick: true })
            //     .setLngLat(cent.geometry.coordinates)
            //     .setHTML(`<img src=${img} />`)
            //     .addTo(map.current)



            //})






            // draw.add(gjnLayer)
        })
    }, [])


    const calculateTotalArea = async (gjn) => {
        let totalArea = 0
        gjn.features.forEach((x) => {
            const area1 = area(x)
            //console.log(a)
            totalArea = totalArea + area1
        })
        return await totalArea
    }

    const returnGeojsonStats = (gjn) => {
        const output = {}
        const wheat = gjn.features.filter((x) => x.properties.crop_id === 1);
        const barley = gjn.features.filter((x) => x.properties.crop_id === 2);
        const canola = gjn.features.filter((x) => x.properties.crop_id === 3);
        const lucerne = gjn.features.filter((x) => x.properties.crop_id === 4);
        const smallGrain = gjn.features.filter((x) => x.properties.crop_id === 5);
        //console.log(barley);
        // const cropName = gjn.features.map((x) => x.properties.crop_name)
        let totalWheat = 0
        let totalBarley = 0;
        let totalCanola = 0;
        let totalLucerne = 0;
        let totalGrains = 0;

        wheat.forEach((x) => {
            const area2 = area(x)
            totalWheat = totalWheat + area2;
        });
        barley.forEach((x) => {
            const area2 = area(x)
            totalBarley = totalBarley + area2;
        });
        canola.forEach((x) => {
            const area2 = area(x)
            totalCanola = totalCanola + area2;
        });
        lucerne.forEach((x) => {
            const area2 = area(x)
            totalLucerne = totalLucerne + area2;
        });
        smallGrain.forEach((x) => {
            const area2 = area(x)
            totalGrains = totalGrains + area2;
        });



        // const uni = [...new Set(cropName)];
        //setCropDrop(uni)
        //console.log(cropDrop)
        //output['wheat'] = wheat.length
        output['wheatArea'] = totalWheat.toFixed(0)
        //output['barley'] = barley.length
        output['barleyArea'] = totalBarley.toFixed(0)
        //output['canola'] = canola.length
        output['canolaArea'] = totalCanola.toFixed(0)
        //output['lucerne'] = lucerne.length
        output['lucerneArea'] = totalLucerne.toFixed(0)
        //output['grains'] = smallGrain.length
        output['grainsArea'] = totalGrains.toFixed(0)

        //console.log(output);
        const dataSet = {
            labels: ['wheat', 'barley', 'canola', 'lucerne', 'grains'],
            datasets: [
                {
                    data: [wheat.length, barley.length, canola.length, lucerne.length, smallGrain.length],
                    backgroundColor: colorsRgba,
                    borderColor: colors
                }
            ]
        }

        if (totalArea) {
            props.func([gjn.features.length, totalArea, dataSet, selectedFarm, output])
        } else {
            calculateTotalArea(gjn).then((x) => {
                console.log(x.toFixed(0));
                setTotalArea(x.toFixed(0))
                props.func([gjn.features.length, x.toFixed(0), dataSet, selectedFarm, output])
            });
        }


        //props.func([gjn.features.length, dataSet])
    }

    useEffect(() => {
        //returnGeojsonStats()
    }, [selectedFarm])


    const addGeojson = () => {

        fetch('https://undpdigitalagriculture.github.io/datastore/newfarms.json')
            .then((res) => res.json())
            .then((data) => {
                returnGeojsonStats(data);



                //returnGeojsonStats();
                const layers = map.current.getStyle().layers;
                // Find the index of the first symbol layer in the map style.
                let firstSymbolId;
                for (const layer of layers) {
                    if (layer.type === 'symbol') {
                        firstSymbolId = layer.id
                        setFirstSymbol(layer.id);
                        break;
                    }
                }
                //gjn.filter()


                map.current.addSource('farms', {
                    type: 'geojson',
                    data: data

                })

                //console.log(gjn);
                map.current.addLayer(
                    {
                        id: 'farms',
                        type: 'fill',
                        source: 'farms',
                        'paint': {

                            'fill-color': [
                                'interpolate',
                                ['linear'],
                                ['get', 'crop_id'],
                                1, colors[0],
                                2, colors[1],
                                3, colors[2],
                                4, colors[3],
                                5, colors[4],
                            ],
                            'fill-opacity': opacity,

                        }
                    }, firstSymbolId
                );

                map.current.addLayer(
                    {
                        id: 'farms-lines',
                        type: 'line',
                        source: 'farms',
                        'paint': {
                            'line-width': 1.5,
                            'line-color': [
                                'interpolate',
                                ['linear'],
                                ['get', 'crop_id'],
                                1, colors[0],
                                2, colors[1],
                                3, colors[2],
                                4, colors[3],
                                5, colors[4],
                            ],
                            'line-opacity': 1,

                        }
                    }, firstSymbolId
                );
            })
    }

    const handleChange = (e, v) => {
        //console.log(e.target.value);
        setSelectedFarm(e.target.value);
        //props.func(selectedFarm)
        if (e.target.value === 'All') {
            map.current.setFilter('farms-lines', null);
            map.current.setFilter('farms', null);
            map.current.setPaintProperty('farms-lines', 'line-color', [
                'interpolate', ['linear'], ['get', 'crop_id'], 1, colors[0],
                2, colors[1],
                3, colors[2],
                4, colors[3],
                5, colors[4],

            ])
            map.current.setPaintProperty('farms', 'fill-color', [
                'interpolate', ['linear'], ['get', 'crop_id'], 1, colors[0],
                2, colors[1],
                3, colors[2],
                4, colors[3],
                5, colors[4],

            ])
        } else {
            map.current.setFilter('farms-lines', ['==', ['get', 'crop_name'], e.target.value])
            map.current.setFilter('farms', ['==', ['get', 'crop_name'], e.target.value])

        }
    }

    const handleYearChange = (e, v) => {

        setSelectedYear(e.target.value);

        if (e.target.value === 'All') {
            map.current.setPaintProperty('farms-lines', 'line-color', [
                'interpolate', ['linear'], ['get', 'crop_id'], 1, colors[0],
                2, colors[1],
                3, colors[2],
                4, colors[3],
                5, colors[4],

            ])
            map.current.setPaintProperty('farms', 'fill-color', [
                'interpolate', ['linear'], ['get', 'crop_id'], 1, colors[0],
                2, colors[1],
                3, colors[2],
                4, colors[3],
                5, colors[4],

            ])

        } else {
            map.current.setPaintProperty('farms-lines', 'line-color', [
                'interpolate', ['linear'], ['get', e.target.value], 0, '#ff08fc', 24, 'white', 50, '#32CD32'
            ])
            map.current.setPaintProperty('farms', 'fill-color', [
                'interpolate', ['linear'], ['get', e.target.value], 0, '#ff08fc', 24, 'white', 50, '#32CD32'
            ])


        }
    }

    const slideChange = (e) => {
        //console.log(e);
        setOpacity(e.target.value)
        map.current.setPaintProperty('farms', 'fill-opacity', e.target.value)
    }

    const buttonClick = (e) => {
        e.stopPropagation()
        setIsOpen(false)
        map.current.setZoom(10.5);
        //console.log(map.current.getStyle().layers)
        map.current.removeLayer('clicked')
        map.current.removeSource('clicked')

        draw.remove(drawGeo);
        setDrawGeo()

        // addFarmLayers();

        // const layers = map.current.getStyle().layers;
        // // Find the index of the first symbol layer in the map style
        // for (const layer of layers) {
        //     if (layer.id.includes('draw')) {
        //         map.current.removeLayer(layer.id)
        //     }
        // }
        // draw.remove()
    }


    return (
        <div>
            {/* <div className='sidebarStyle'>
                <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
            </div> */}
            <Weather lng={lng} lat={lat} />
            <Box sx={{ position: 'absolute', top: 85, left: 550, zIndex: 400, backgroundColor: 'whitesmoke', padding: 1 }} width={200}>
                <Slider min={0} max={1} step={0.01} onChange={slideChange} defaultValue={0.7} aria-label="Default" valueLabelDisplay="auto" />
            </Box>
            {isOpen ? <Box sx={{ position: 'absolute', top: 145, left: 550, zIndex: 400, backgroundColor: 'whitesmoke', padding: 1 }} width={200}>
                <Button onClick={buttonClick} >Stop Edit Mode</Button>
            </Box> : <div></div>
            }
            <Box sx={{ position: 'absolute', top: 10, left: 550, zIndex: 400, backgroundColor: 'white', padding: 1 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Crop Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedFarm}
                        label="farmType"
                        onChange={handleChange}
                        autoWidth
                    >
                        <MenuItem value="All">All</MenuItem>
                        {cropDrop.map((x, index) => (
                            <MenuItem key={index} value={x}>{x}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {selectedFarm != 'All' ?
                <Box sx={{ width: 120, position: 'absolute', top: 10, left: 730, zIndex: 400, backgroundColor: 'white', padding: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Yield by Year</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedYear}
                            label="farmType"
                            onChange={handleYearChange}
                        >
                            <MenuItem value="All">Select Year</MenuItem>
                            <MenuItem value="2017">2017</MenuItem>
                            <MenuItem value="2018">2018</MenuItem>
                            <MenuItem value="2019">2019</MenuItem>
                        </Select>
                    </FormControl>
                </Box> : <div></div>}
            <div className='map-container' ref={mapContainerRef} />
        </div >
    );
};

export default Map;