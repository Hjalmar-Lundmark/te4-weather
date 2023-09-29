import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import Forecastpage from './pages/Forecastpage'

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/forecast" element={<Forecastpage />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App