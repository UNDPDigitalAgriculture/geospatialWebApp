import { useEffect, useState } from 'react';

const Weather = (props) => {

    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [currentTemp, setCurrentTemp] = useState();
    const [humidity, setHumidity] = useState()
    const key = '75bdccd35fdd4183b3cb8025b4bd4ffe'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${key}`

    useEffect(() => {

        console.log(props);
        setLat(props.lat);
        setLng(props.lng);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lng}&units=imperial&appid=${key}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setCurrentTemp(data.main.temp)
                setHumidity(data.main.humidity)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])


    useEffect(() => {

        if (lat && lng) {

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setCurrentTemp(data.main.temp)
                    setHumidity(data.main.humidity)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [])







    return (
        <div style={{ fontSize: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '550px', bottom: '5px', zIndex: 600, backgroundColor: 'whitesmoke', width: '250px', height: '70px' }}>Current Temp: {currentTemp}°F<br /> Humidity: {humidity}%</div>
    )
}

export default Weather;