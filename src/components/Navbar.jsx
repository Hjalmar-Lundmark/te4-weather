import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className='navbar'>
            <ul className="nav autoWidth">
                <Link to='/'><h3>Darth Väder</h3></Link>
                <div className='nav-items'>
                    <li className="nav-item">
                        <Link to='/'><p>Weather</p></Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/forecast'><p>Forecast</p></Link>
                    </li>
                </div>
            </ul>
        </nav>
    )
}

export default Navbar