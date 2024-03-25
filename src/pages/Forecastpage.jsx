import { useEffect, useState } from 'react'
import '../App.css'
import Spinner from '../components/Spinner'
import Search from '../components/Search'

function ForecastPage() {
  const [lat, setLat] = useState({})
  const [long, setLong] = useState({})
  const [forecastData, setForecastData] = useState([])
  var newLocation;
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
          newLocation = true
        } else {
          setLat(localStorage.getItem('lat'))
          setLong(localStorage.getItem('long'))
          newLocation = false
        }

        localStorage.setItem('lat', position.coords.latitude)
        localStorage.setItem('long', position.coords.longitude)
      });

      if (typeof (lat) === 'object' || typeof (long) === 'object') {
        setForecastData([])
        return
      }

      // If the data is less than 10 minutes old, don't fetch new data
      if (localStorage.getItem('forecastTime') && new Date().getTime() - localStorage.getItem('forecastTime') < 600000 && newLocation !== false) {
        setForecastData(JSON.parse(localStorage.getItem('forecastData')))
        return
      }


      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(res => res.json())
        .then(result => {
          setForecastData(result);
          localStorage.setItem('forecastData', JSON.stringify(result));
          localStorage.setItem('forecastTime', new Date().getTime());
        }).catch(err => {
          console.log(err)
        });
    }

    fetchWeather()
  }, [lat, long, search])

  function open(index) {
    if (document.getElementById('test' + index).style.display === 'none') {
      // open
      document.getElementById('test' + index).style.display = 'grid'
    } else {
      // close
      document.getElementById('test' + index).style.display = 'none'
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

    // if (item.wind.deg >= 135 && item.wind.deg < 225) {
    //   return 'South'
    // } else if (item.wind.deg >= 225 && item.wind.deg < 315) {
    //   return 'West'
    // } else if (item.wind.deg >= 315 && item.wind.deg <= 360 || item.wind.deg >= 0 && item.wind.deg < 45) {
    //   return 'North'
    // } else if (item.wind.deg >= 45 && item.wind.deg < 135) {
    //   return 'East'
    // } else {
    //   return 'Error (wind direction not found)'
    // }
  }

  function getPlace() {
    if (document.getElementById('search').value === '' || document.getElementById('search').value.toLowerCase() == forecastData.city.name.toLowerCase()) {
      return
    }
    setSearch(true)

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${document.getElementById('search').value}&appid=${import.meta.env.VITE_API_KEY}`)
      .then(res => res.json())
      .then(result => {
        if (result.cod === '404') {
          return
        }
        setForecastData(result);
      }).catch(err => {
        console.log(err)
      });
  }

  return (
    <>
      <section className='autoWidth'>
        <h1>Darth Väder&apos;s Forecast</h1>
        {forecastData.list ? (
          <>
            <Search getPlace={getPlace} search={search} setSearch={setSearch} />
            <h2>{forecastData.city.name}</h2>
            <p className='expl'>* Pop stands for &quot;Probability of precipitation&quot;, meaning chance for rain or snow</p>
            {forecastData.list.map((item, index) => (
              <div onClick={() => (open(index))} key={index} className={`forecastCard ${item.sys.pod}`}>
                <div className='forecastCardInner'>
                  <h2>{new Date(item.dt * 1000).toDateString() + ' ' + new Date(item.dt * 1000).getHours()}.00</h2>
                  <p>Temperature: <br />{(item.main.temp - 273.15).toFixed(1)}°C</p>
                  <p className='pop' title='Pop stands for "Probability of precipitation", meaning chance for rain or snow'>Pop: <br />{(parseFloat(item.pop) * 100).toFixed(0)}%</p>
                  <p>Wind: <br />{(item.wind.speed).toFixed(1)} m/s</p>
                  {item.weather[0].icon ? (
                    <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt={item.weather[0].description} width={80} height={80} />
                  ) : (
                    <></>
                  )}
                </div>

                <div className='forecastCardLower' data-rows='masonry' id={'test' + index} style={{ display: 'none' }}>
                  <p>Wind from {getWindDir(item)} ({item.wind.deg}°)</p>
                  <p>Gusts up to {(item.wind.gust).toFixed(1)} m/s</p>
                  <p>Feels like {(item.main.feels_like - 273.15).toFixed(1) + ' °C'}</p>
                  <p>Cloud coverage: {item.clouds.all + '%'}</p>
                  {item.rain ?
                    (
                      <p>Rainfall: {item.rain["3h"]} mm across 3h</p>
                    ) : <></>}
                  {item.snow ?
                    (
                      <p>Snowfall: {item.snow["3h"]} mm across 3h</p>
                    ) : <></>}
                </div>
              </div>
            ))}

          </>
        ) : (
          <>
            <Spinner />
          </>
        )}
      </section >
    </>
  )
}

export default ForecastPage
