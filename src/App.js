import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './components/callback/Callback';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Reciber from './components/reciber';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />        
        <Route path="/reciber" element={<Reciber />} />        
      </Routes>
    </Router>
  );
}

export default App;
