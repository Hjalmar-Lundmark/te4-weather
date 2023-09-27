import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {

    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude)
        setLong(position.coords.longitude)
      });

      console.log(lat, long)
      console.log(typeof (lat), typeof (long))
      if (typeof (lat) === 'object' || typeof (long) === 'object') {
        console.log('lat or long is 0')
        setWeatherData([])
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
          <h2>City: {weatherData.name}</h2>
          <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2) + ' C'}</h2>
          <h2>Feels like: {(weatherData.main.feels_like - 273.15).toFixed(2) + ' C'}</h2>
          <h2>Weather: {weatherData.weather[0].description}</h2>
          <h2>Humidity: {weatherData.main.humidity + '%'}</h2>
          <h2>Wind: {weatherData.wind.speed + ' m/s'} from
            {/* I think this works, maybe I'll add southwest, northeast, etc */}
            {weatherData.wind.deg >= 135 && weatherData.wind.deg < 225 ? (
              <> South</>
            ) : weatherData.wind.deg >= 225 && weatherData.wind.deg < 315 ? (
              <> West</>
            ) : weatherData.wind.deg >= 315 && weatherData.wind.deg < 360 || weatherData.wind.deg >= 0 && weatherData.wind.deg < 45 ? (
              <> North</>
            ) : weatherData.wind.deg >= 45 && weatherData.wind.deg < 135 ? (
              <> East</>
            ) : (
              <> Error (wind direction not found)</>
            )}
          </h2>
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
