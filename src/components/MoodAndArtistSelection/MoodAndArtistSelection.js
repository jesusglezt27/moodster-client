import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MoodAndArtistSelection.css';
const moods = ['Feliz', 'Triste', 'Energético', 'Relajado', 'Enojado'];

const MoodAndArtistSelection = () => {
  const [currentMood, setCurrentMood] = useState('');
  const [desiredMood, setDesiredMood] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [spotifyUserId, setSpotifyUserId] = useState('');
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (authToken) {
        try {
          // Obtener información del usuario de Spotify
          const userInfoResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          setSpotifyUserId(userInfoResponse.data.id); // Guardar el ID del usuario

          // Obtener los artistas más escuchados
          const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=46', {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          setTopArtists(topArtistsResponse.data.items);
        } catch (error) {
          console.error('Error fetching user data or top artists', error);
        }
      }
    };

    fetchUserData();
  }, [authToken]);

  const handleArtistSelection = (artistId) => {
    if (selectedArtists.includes(artistId)) {
      setSelectedArtists(selectedArtists.filter(id => id !== artistId));
    } else {
      if (selectedArtists.length < 5) {
        setSelectedArtists([...selectedArtists, artistId]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const artistsToUse = selectedArtists.length > 0 ? selectedArtists : topArtists.slice(0, 5).map(artist => artist.id);

    console.log('Enviando solicitud de creación de playlist con:', {
      userId: spotifyUserId,
      playlistName: `Playlist from ${currentMood} to ${desiredMood}`,
      currentMood,
      desiredMood,
      artistsToUse,
      accessToken: authToken
    });

    try {
      const response = await axios.post('http://localhost:4000/create_playlist', {
        userId: spotifyUserId, // Usar el ID del usuario obtenido
        playlistName: `Playlist from ${currentMood} to ${desiredMood}`,
        currentMood,
        desiredMood,
        artistsToUse,
        accessToken: authToken
      });

      if (response.status === 200) {
        console.log('Playlist creada con éxito:', response.data);
        navigate('/dashboard'); // Navega al dashboard después de crear la playlist
      } else {
        console.error('Error al crear playlist', response.data);
      }
    } catch (error) {
      console.error('Error al crear playlist', error);
    }
  };

  return (
    <div>
      <h1>Selecciona tu Estado de Ánimo y Artistas</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Estado de ánimo actual:
            <select value={currentMood} onChange={(e) => setCurrentMood(e.target.value)}>
              {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>
            Estado de ánimo deseado:
            <select value={desiredMood} onChange={(e) => setDesiredMood(e.target.value)}>
              {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
            </select>
          </label>
        </div>
        <div>
          <h2>Selecciona hasta 5 artistas de los 46 más escuchados:</h2>
          {topArtists.map(artist => (
            <div key={artist.id}>
              <input
                type="checkbox"
                checked={selectedArtists.includes(artist.id)}
                onChange={() => handleArtistSelection(artist.id)}
              />
              {artist.name}
            </div>
          ))}
        </div>
        <button type="submit">Crear Playlist</button>
      </form>
    </div>
  );
};

export default MoodAndArtistSelection;
