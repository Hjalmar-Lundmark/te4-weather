import { useEffect, useState } from 'react'
import '../App.css'
import Spinner from '../components/Spinner'
import Search from '../components/Search'

function Homepage() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [weatherData, setWeatherData] = useState([])
  const [newLocation, setNewLocation] = useState()
  const [search, setSearch] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      if (search) {
        return
      }

      navigator.geolocation.getCurrentPosition(function (position) {
        if (parseFloat(localStorage.getItem('lat')) !== position.coords.latitude || parseFloat(localStorage.getItem('long')) !== position.coords.longitude) {
          setLat(position.coords.latitude)
          setLong(position.coords.longitude)
          setNewLocation(true)

          localStorage.setItem('lat', position.coords.latitude)
          localStorage.setItem('long', position.coords.longitude)
        } else {
          setLat(localStorage.getItem('lat'))
          setLong(localStorage.getItem('long'))
          setNewLocation(false)
        }
      })

      if (typeof (lat) === 'object' || typeof (long) === 'object') {
        setWeatherData([])
        return
      }

      // If the data is less than 10 minutes old, don't fetch new data
      if (localStorage.getItem('fetchTime') && new Date().getTime() - localStorage.getItem('fetchTime') < 600000) {
        if (!newLocation) {
          setWeatherData(JSON.parse(localStorage.getItem('weatherData')))
          return
        }
      }

      await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setWeatherData(result);
          localStorage.setItem('weatherData', JSON.stringify(result));
          localStorage.setItem('fetchTime', new Date().getTime());
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long, search])

  // I used these for wind names and speeds: https://www.weather.gov/mfl/beaufort https://www.smhi.se/kunskapsbanken/meteorologi/vind/skalor-for-vindhastighet-1.252     
  function getWind(item) {
    if (item.wind.speed <= 0.2) {
      return 'Calm'
    } else if (item.wind.speed > 0.2 && item.wind.speed <= 3.3) {
      return 'Light Breeze'
    } else if (item.wind.speed > 3.3 && item.wind.speed <= 7.9) {
      return 'Moderate Breeze'
    } else if (item.wind.speed > 7.9 && item.wind.speed <= 13.8) {
      return 'Strong Breeze'
    } else if (item.wind.speed > 13.8 && item.wind.speed <= 24.4) {
      return 'Severe gale'
    } else if (item.wind.speed > 24.4 && item.wind.speed <= 32.6) {
      return 'Storm'
    } else if (item.wind.speed > 32.6) {
      return 'Hurricane'
    } else {
      return 'Error (wind speed not found)'
    }
  }

  function getWindDir(item) {
    if (item.wind.deg >= 22.5 && item.wind.deg < 67.5) {
      return 'Northeast'
    } else if (item.wind.deg >= 67.5 && item.wind.deg < 112.5) {
      return 'East'
    } else if (item.wind.deg >= 112.5 && item.wind.deg < 157.5) {
      return 'Southeast'
    } else if (item.wind.deg >= 157.5 && item.wind.deg < 202.5) {
      return 'South'
    } else if (item.wind.deg >= 202.5 && item.wind.deg < 247.5) {
      return 'Southwest'
    } else if (item.wind.deg >= 247.5 && item.wind.deg < 292.5) {
      return 'West'
    } else if (item.wind.deg >= 292.5 && item.wind.deg < 337.5) {
      return 'Northwest'
    } else {
      return 'North'
    }
  }

  function getPlace() {
    setSearch(true)

    const test = weatherData.name || 'test'
    if (document.getElementById('search').value === '' || document.getElementById('search').value.toLowerCase() == test.toLowerCase()) {
      return
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${document.getElementById('search').value}&appid=${import.meta.env.VITE_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod === '404') {
          return
        }
        setWeatherData(result);
        setLat(result.coord.lat)
        setLong(result.coord.lon)
      }).catch(err => {
        console.log(err)
      });
  }

  return (
    <>
      <section className='autoWidth'>
        <h1>Darth Väder</h1>
        <Search getPlace={getPlace} search={search} setSearch={setSearch} />
        {weatherData.main ? (
          <>
            <div className='grid' data-rows='masonry'>
              <div className='gridCard'>
                <h3>City:</h3>
                <h2>{weatherData.name}</h2>
              </div>
              <div className='gridCard'>
                <h3>Temperature:</h3>
                <h2>{(weatherData.main.temp - 273.15).toFixed(1) + ' °C'}</h2>
              </div>
              <div className='gridCard'>
                <h3>Feels like:</h3>
                <h2>{(weatherData.main.feels_like - 273.15).toFixed(1) + ' °C'}</h2>
              </div>
              <div className='gridCard'>
                <h3>Weather:</h3>
                {weatherData.weather[0].icon ? (
                  <img src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt={weatherData.weather[0].description} width={100} height={100} />
                ) : (
                  <></>
                )}
                <h3>{weatherData.weather[0].description}</h3>
              </div>
              {weatherData.rain ?
                (
                  <div className='gridCard'>
                    <h3>Rainfall:</h3>
                    <h2>{weatherData.rain["1h"]} mm/h</h2>
                  </div>
                ) : <></>}
              {weatherData.snow ?
                (
                  <div className='gridCard'>
                    <h3>Snowfall:</h3>
                    <h2>{weatherData.snow["1h"]} mm/h</h2>
                  </div>
                ) : <></>}
              <div className='gridCard'>
                <h3>Wind:</h3>
                <h2>
                  {getWind(weatherData)} ({weatherData.wind.speed + ' m/s'})
                </h2>
              </div>
              <div className='gridCard'>
                <h3>Wind from:</h3>
                <h2>
                  {getWindDir(weatherData)} ({weatherData.wind.deg + '°'})
                </h2>
              </div>
              <div className='gridCard'>
                <h3>Clouds:</h3>
                <h2>Sky coverage: {weatherData.clouds.all + '%'}</h2>
              </div>
              <div className='gridCard'>
                <h3>Pressure:</h3>
                <h2>{weatherData.main.pressure} hPa</h2>
              </div>
              <div className='gridCard'>
                <h3>Humidity:</h3>
                <h2>{weatherData.main.humidity + '%'}</h2>
              </div>
              <div className='gridCard'>
                <h3>Visibility:</h3>
                <h2>{weatherData.visibility} meter</h2>
              </div>
              <div className='gridCard'>
                <h3>Sunrise:</h3>
                <h2>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-GB")}</h2>
                {/* idk how Copilot got *1000 but it seems to work */}
              </div>
              <div className='gridCard'>
                <h3>Sunset:</h3>
                <h2>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-GB")}</h2>
              </div>
            </div>
            {lat && long ? (
              <>
                <iframe src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d269.27453942029365!2d${long}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ssv!2sse!4v1695801572532!5m2!1ssv!2sse'`} width="600" height="450" loading="lazy" ></iframe>
              </>
            ) : (
              <h2>Latitude and longitude not found</h2>
            )}
          </>
        ) :
          (
            <Spinner />
          )
        }
      </section>
    </>
  )
}

export default Homepage