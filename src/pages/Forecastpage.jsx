import { useEffect, useState } from 'react'
import '../App.css'
import Spinner from '../components/Spinner'

function ForecastPage() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [forecastData, setForecastData] = useState([])
  var newLocation;

  useEffect(() => {
    async function fetchWeather() {
      navigator.geolocation.getCurrentPosition(function (position) {
        if (parseFloat(localStorage.getItem('lat')) !== position.coords.latitude || parseFloat(localStorage.getItem('long')) !== position.coords.longitude) {
          setLat(position.coords.latitude)
          setLong(position.coords.longitude)
          newLocation = true
        } else {
          setLat(localStorage.getItem('lat'))
          setLong(localStorage.getItem('long'))
          newLocation = false
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
      if (localStorage.getItem('forecastTime') && new Date().getTime() - localStorage.getItem('forecastTime') < 600000 && newLocation !== false) {
        console.log('data is less than 10 minutes old')
        setForecastData(JSON.parse(localStorage.getItem('forecastData')))
        return
      }


      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          console.log(result)
          setForecastData(result);
          localStorage.setItem('forecastData', JSON.stringify(result));
          localStorage.setItem('forecastTime', new Date().getTime());
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long])

  return (
    <>
      <section className='autoWidth'>
        <h1>Darth Väders forecast</h1>
        {forecastData.list ? (
          <>
            <h2>{forecastData.city.name}</h2>
            {forecastData.list.map((item, index) => (
              <div key={index} className='forecastCard'>
                <h2>{new Date(item.dt * 1000).toDateString() + ' ' + new Date(item.dt * 1000).getHours()}.00</h2>
                <p>Temperature: {Math.round(item.main.temp - 273.15)}°C</p>
                <p>Chance for rain: {(parseFloat(item.pop) * 100).toFixed(0)}%</p>
                <p>Wind: {item.wind.speed} m/s</p>
                {item.weather[0].icon ? (
                  <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt={item.weather[0].description} width={80} height={80} />
                ) : (
                  <></>
                )}
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
