import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import GetStarted from './Pages/GetStarted';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/getstarted' element={<GetStarted />}/>
          <Route path='/' element={<Dashboard />}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App