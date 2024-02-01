// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [topTracks, setTopTracks] = useState([]); // Declaración aquí
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const { authToken, spotifyUserId } = useAuth(); // Asegúrate de que spotifyUserId esté disponible en tu contexto

  useEffect(() => {
    if (authToken && spotifyUserId) {
      // Obtener información de la playlist creada
      axios.get(`http://localhost:4000/get_playlist_info?userId=${spotifyUserId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      .then(response => {
        setPlaylistInfo(response.data);
      })
      .catch(error => {
        console.error('Error fetching playlist info', error);
      });
    }
  }, [authToken, spotifyUserId]);

  return (
    <div>
    <h1>Mis Canciones Más Escuchadas</h1>
    {topTracks.length > 0 ? (
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    ) : (
      <p>No se encontraron canciones.</p>
    )}

    {playlistInfo ? (
      <div>
        <h2>{playlistInfo.playlistName}</h2>
        <a href={playlistInfo.playlistUrl} target="_blank" rel="noopener noreferrer">Abrir Playlist en Spotify</a>
      </div>
    ) : (
      <p>No se encontró información de la playlist.</p>
    )}
  </div>
);
}

export default Dashboard;
