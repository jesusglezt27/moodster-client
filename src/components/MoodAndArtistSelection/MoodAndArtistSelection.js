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
  console.log("AuthToken al cargar MoodAndArtistSelection:", authToken);


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
      const response = await axios.post('https://moodster-server.vercel.app/create_playlist', {
        userId: spotifyUserId, // Usar el ID del usuario obtenido
        playlistName: `Playlist from ${currentMood} to ${desiredMood}`,
        currentMood,
        desiredMood,
        artistsToUse,
        accessToken: authToken
      });

      if (response.status === 200) {
        console.log('Playlist creada con éxito:', response.data);
        navigate(`/playlist/${response.data.playlistId}`);
      } else {
        console.error('Error al crear playlist', response.data);
      }
    } catch (error) {
      console.error('Error al crear playlist', error);
    }
  };

  const getArtistSelectionClass = (artistId) => {
    const baseClasses = "relative rounded-full w-24 h-24 overflow-hidden";
    if (selectedArtists.includes(artistId)) {
      return `${baseClasses} border-4 border-pink-500`;
    }
    return baseClasses;
  };

  const getArtistNameClass = (artistId) => {
    return selectedArtists.includes(artistId) ? 'text-white' : 'text-gray-700';
  };

  return (
    <div className="bg-gray-1000 min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">CHOOSE 5 ARTISTS TO MATCH YOUR MOOD</h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Estado de ánimo actual:
          </label>
          <select
            value={currentMood}
            onChange={(e) => setCurrentMood(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">--Selecciona--</option>
            {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Estado de ánimo deseado:
          </label>
          <select
            value={desiredMood}
            onChange={(e) => setDesiredMood(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">--Selecciona--</option>
            {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 mb-8">
        {topArtists.map((artist, index) => (
          <div key={artist.id} className="text-center">
            <div
              className={getArtistSelectionClass(artist.id)}
              onClick={() => handleArtistSelection(artist.id)}
              style={{
                backgroundImage: `url(${artist.images[0].url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {selectedArtists.includes(artist.id) && (
                <div className="absolute inset-0 bg-pink-500 opacity-75"></div>
              )}
            </div>
            <p className={`mt-2 ${getArtistNameClass(artist.id)}`}>{artist.name}</p>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-64 p-3 bg-pink-500 text-white font-bold rounded-full"
        disabled={selectedArtists.length !== 5}
        onClick={handleSubmit}
      >
        {selectedArtists.length === 5 ? 'CREATE PLAYLIST' : 'SELECT 5 ARTISTS'}
      </button>
    </div>
  );
};

export default MoodAndArtistSelection;
