import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Start from './components/Start';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/" element={<Start/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
