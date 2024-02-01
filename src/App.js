// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Callback from './components/callback/Callback';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import MoodAndArtistSelection from './components/MoodAndArtistSelection/MoodAndArtistSelection';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/selector" element={<MoodAndArtistSelection />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
