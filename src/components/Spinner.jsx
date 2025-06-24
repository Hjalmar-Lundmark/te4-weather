import './Spinner.css'

function Spinner() {
    var quotes = ['Luke... I am your weather', 'I find your lack of faith disturbing', 'May the weather be with you', 'It is your destiny. Join me, and together we can view the weather, as website and user.', 'The ability to destroy a planet is insignificant next to the power of viewing the weather.', 'Anakin WeatherIgnorer was weak. I destroyed him.']

    return (
        <>
            <h2>{quotes[Math.floor(Math.random() * quotes.length)]}</h2>
            <div className='flexSpinner'>
                <div className="spinner"></div>
            </div>
        </>
    )
}

export default Spinner