import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'

function App() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [weatherData, setWeatherData] = useState([])
  const [counter, setCounter] = useState(60);

  useEffect(() => {

    async function fetchWeather() {
      // If lat and long are not in local storage, get them from the browser
      if (false) {
        // Todo: add timer
        setLat(localStorage.getItem('lat'))
        setLong(localStorage.getItem('long'))
      } else {
        navigator.geolocation.getCurrentPosition(function (position) {
          setLat(position.coords.latitude)
          setLong(position.coords.longitude)

          localStorage.setItem('lat', position.coords.latitude)
          localStorage.setItem('long', position.coords.longitude)
        });
      }

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

  useEffect(() => {
    console.log(counter)
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <main className='autoWidth'>
      <h1>Darth Väder</h1>
      {weatherData.main ? (
        <div>
          <h2>City: {weatherData.name}</h2>
          <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2) + ' C°'}</h2>
          <h2>Feels like: {(weatherData.main.feels_like - 273.15).toFixed(2) + ' C°'}</h2>
          <h2>Weather: {weatherData.weather[0].description}</h2>
          <h2>Clouds: {weatherData.clouds.all + '%'} of the sky covered, at the height of {weatherData.cod} m</h2>
          <h2>Pressure: {weatherData.main.pressure} hPa</h2>
          <h2>Humidity: {weatherData.main.humidity + '%'}</h2>
          <h2>Wind:
            {/* Shows wind speed as a word instead of a number */}
            {/* I used these for wind names and speeds: https://www.weather.gov/mfl/beaufort https://www.smhi.se/kunskapsbanken/meteorologi/vind/skalor-for-vindhastighet-1.252 */}
            {weatherData.wind.speed <= 0.2 ? (
              <> Calm </>
            ) : weatherData.wind.speed > 0.2 && weatherData.wind.speed <= 3.3 ? (
              <> Light Breeze </>
            ) : weatherData.wind.speed > 3.3 && weatherData.wind.speed <= 7.9 ? (
              <> Moderate Breeze </>
            ) : weatherData.wind.speed > 7.9 && weatherData.wind.speed <= 13.8 ? (
              <> Strong Breeze </>
            ) : weatherData.wind.speed > 13.8 && weatherData.wind.speed <= 24.4 ? (
              <> Severe gale </>
            ) : weatherData.wind.speed > 24.4 && weatherData.wind.speed <= 32.6 ? (
              <> Storm </>
            ) : weatherData.wind.speed > 32.6 ? (
              <> Hurricane </>
            ) : (
              <> Error (wind speed not found)</>
            )}
            ({weatherData.wind.speed + ' m/s'}) from
            {/* Shows wind direction as a word instead of a number */}
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
            )} ({weatherData.wind.deg + '°'})
          </h2>
          <h2>Visibility: {weatherData.visibility} meter</h2>
          {lat && long ? (
            <>
              <h2>Latitude: {lat} Longitude: {long}</h2>
              <iframe src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d269.27453942029365!2d${long}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ssv!2sse!4v1695801572532!5m2!1ssv!2sse'`} width="600" height="450" loading="lazy" ></iframe>
            </>
          ) : (
            <h2>Latitude and longitude not found</h2>
          )}
        </div>
      ) :
        (
          <>
            <h2>Loading...</h2>
            <Spinner />
          </>
        )
      }
    </main>
  )
}

export default App
