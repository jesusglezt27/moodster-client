// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './components/callback/Callback';
import Login from './components/login/Login';
import MoodAndArtistSelection from './components/MoodAndArtistSelection/MoodAndArtistSelection';
import Playlist from './components/playlist/Playlist';
import { useAuth } from './components/context/AuthContext'; // Ajusta la ruta según tu estructura de archivos
import {AuthProvider} from './components/context/AuthContext';
function App() {
  // const { authToken } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/playlist/:playlistId" element={<Playlist />} />
          <Route path="/selector" element={<MoodAndArtistSelection />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
