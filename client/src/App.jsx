import React from 'react'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import NotFound from './Pages/NotFound'
import Person from './Components/person/Person.jsx'
import About from './Pages/About'
// import { Route } from 'lucide-react'
// import { Routes, Route } from "react-router";
import { Routes, Route } from "react-router-dom"
// import ReactDOM from "react-dom/client";
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="About" element={<About />} />
        <Route path="Person" element={<Person />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App