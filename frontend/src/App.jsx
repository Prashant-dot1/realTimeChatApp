import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Start from './components/Start';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/" element={<Start/>}/>
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/chats" element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
