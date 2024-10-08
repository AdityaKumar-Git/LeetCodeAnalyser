import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './components/Home.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import Contact from './components/Contact.jsx'
import About from './components/About.jsx'
import FAQs from './components/FAQ.jsx'
import Analyzer from './components/Analyzer.jsx'

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='contact' element={<Contact />} />
      <Route path='about' element={<About />} />
      <Route path='FAQs' element={<FAQs />} />
      <Route path='analyzer' element={<Analyzer />} />
      <Route path='analyzer/:ID' element={<Analyzer />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
