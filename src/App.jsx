import { useState } from 'react'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default App
