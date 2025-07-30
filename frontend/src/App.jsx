import React from 'react';
import Dashboard from './Dashboard'; // adjust path if different
import './index.css';
import Home from './Home'; // adjust path if different
import { Routes,Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
    
    </Routes>
  );
}

export default App;