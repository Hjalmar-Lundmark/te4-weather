import { useEffect, useState } from 'react'
import '../App.css'
import Spinner from '../components/Spinner'

function ForecastPage() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [forecastData, setForecastData] = useState([])

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (parseFloat(localStorage.getItem('lat')) !== position.coords.latitude || parseFloat(localStorage.getItem('long')) !== position.coords.longitude) {
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
        setForecastData([])
        return
      }

      // If the data is less than 10 minutes old, don't fetch new data
      /*if (localStorage.getItem('fetchTime') && new Date().getTime() - localStorage.getItem('fetchTime') < 600000 && newLocation !== false) {
        console.log('data is less than 10 minutes old')
        setForecastData(JSON.parse(localStorage.getItem('weatherData')))
        return
      }
      */

      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setForecastData(result);
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long])

  return (
    <>
      <section className='autoWidth'>
        <h1>Darth Väder</h1>
        {forecastData.list ? (
          <>
            <h2>{forecastData.city.name}</h2>
            {forecastData.list.map((item, index) => (
              <div key={index} className='forecastCard'>
                <h2>{item.dt_txt}</h2>
                <p>Temperature: {Math.round(item.main.temp - 273.15)}°C</p>
                <p>Feels like: {Math.round(item.main.feels_like - 273.15)}°C</p>
                <p>Chance for rain/snow: {parseFloat(item.pop) * 100}%</p>
                <p>Wind: {item.wind.speed} m/s</p>
              </div>
            ))}

          </>
        ) : (
          <>
            <h2>Darth Väder is looking into your future...</h2>
            <Spinner />
          </>
        )}
      </section>
    </>
  )
}

export default ForecastPage
