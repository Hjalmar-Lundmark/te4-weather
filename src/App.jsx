import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {

    async function fetchWeather() {
      console.log('fetching weather: ' + typeof (weatherData))
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      });

      if (lat === 0 || long === 0) {
        return
      }

      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result);
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long])

  return (
    <>
      <h1>Darth Väder</h1>
      {weatherData.main ? (
        <div>
          <h1>City: {weatherData.name}</h1>
          <h1>Temperature: {(weatherData.main.temp - 273.15).toFixed(2) + ' C'}</h1>
        </div>
      ) :
        (
          <>
            <h1>Loading...</h1>
            <Spinner />
          </>
        )
      }
    </>
  )
}

export default App
