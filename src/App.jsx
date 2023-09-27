import { useEffect, useState } from 'react'
import './App.css'
import Spinner from './components/Spinner'
import Footer from './components/Footer'

function App() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [weatherData, setWeatherData] = useState([])

  useEffect(() => {

    async function fetchWeather() {
      // If lat and long are not in local storage, get them from the browser
      navigator.geolocation.getCurrentPosition(function (position) {
        if (localStorage.getItem('lat') !== position.coords.latitude || localStorage.getItem('long') !== position.coords.longitude) {
          setLat(position.coords.latitude)
          setLong(position.coords.longitude)
        } else {
          setLat(localStorage.getItem('lat'))
          setLong(localStorage.getItem('long'))
        }

        localStorage.setItem('lat', position.coords.latitude)
        localStorage.setItem('long', position.coords.longitude)
      });

      console.log(lat, long)
      if (typeof (lat) === 'object' || typeof (long) === 'object') {
        console.log('lat or long is 0')
        setWeatherData([])
        return
      }

      // If the data is less than 10 minutes old, don't fetch new data
      if (localStorage.getItem('fetchTime') && new Date().getTime() - localStorage.getItem('fetchTime') < 600000) {
        console.log('data is less than 10 minutes old')
        setWeatherData(JSON.parse(localStorage.getItem('weatherData')))
        return
      }

      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setWeatherData(result);
          localStorage.setItem('weatherData', JSON.stringify(result));
          localStorage.setItem('fetchTime', new Date().getTime());
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long])

  return (
    <>
      <main className='autoWidth'>
        <h1>Darth Väder</h1>
        {weatherData.main ? (
          <div className='grid'>
            <h2>City: {weatherData.name}</h2>
            <h2>Temperature: {(weatherData.main.temp - 273.15).toFixed(2) + ' C°'}</h2>
            <h2>Feels like: {(weatherData.main.feels_like - 273.15).toFixed(2) + ' C°'}</h2>
            <h2>Weather: {weatherData.weather[0].description}
              {weatherData.weather[0].icon ? (
                <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description} />
              ) : (
                <></>
              )}
            </h2>
            {weatherData.rain ? (
              <h2>Rain: {weatherData.rain["1h"] + ' mm/h'}</h2>
            ) : (
              <></>
            )}
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
              <h2>Checking if Darth Väder deems you worthy...</h2>
              <Spinner />
            </>
          )
        }
      </main>
      <Footer />
    </>
  )
}

export default App
