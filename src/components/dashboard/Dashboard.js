// En Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('spotifyAuthToken');
  
    if (token) {
      axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setTopTracks(response.data.items);
      })
      .catch(error => {
        console.error('Error fetching top tracks', error);
      });
    }
  }, []);

  return (
    <div>
      <h1>Mis Canciones Más Escuchadas</h1>
      <ul>
        {topTracks.map(track => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
