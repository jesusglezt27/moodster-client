import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { css } from "@emotion/react";
import BeatLoader from "react-spinners/BeatLoader";
import './MoodAndArtistSelection.css';

const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Angry'];

const MoodAndArtistSelection = () => {
  const [currentMood, setCurrentMood] = useState('');
  const [desiredMood, setDesiredMood] = useState('');
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [spotifyUserId, setSpotifyUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); // Detiene la animación de carga
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
    return selectedArtists.includes(artistId) ? 'text-white' : 'text-gray-400';
  };

const override = css`
  display: block;
  margin: 0 auto;
`;

if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-darkgray">
      <div className="flex flex-col justify-center items-center p-10 rounded-lg">
        <BeatLoader color="#1DB954" loading={isLoading} css={override} size={15} />
        <p className="text-spotify-green font-sans mt-4 text-lg">
          Loading your playlist...
        </p>
      </div>
    </div>
  );
}

  return (
    <div style={{ backgroundColor: '#212121' }} className="text-white min-h-screen p-8 flex flex-col items-center">
    <h1 className="text-4xl font-bold mb-8 text-center px-4">CHOOSE 5 ARTISTS TO MATCH YOUR MOOD</h1>
  
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="current-mood" className="block text-sm font-medium text-gray-200 mb-1">
            Current Mood:
          </label>
          <select id="current-mood" 
            value={currentMood}
            onChange={(e) => setCurrentMood(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">--Select--</option>
            {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
          </select>
        </div>
  
        <div className="mb-6">
        <label htmlFor="desired-mood" className="block text-sm font-medium text-gray-200 mb-1">
          Desired Mood:
          </label>
          <select id="desired-mood" 
            value={desiredMood}
            onChange={(e) => setDesiredMood(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">--Select--</option>
            {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
          </select>
        </div>
      </div>
  
      <button
      type="submit"
      className={`mt-4 mb-8 w-64 px-6 py-3 text-white font-bold text-lg rounded-full 
        ${selectedArtists.length === 5 ? 'bg-spotify-green hover:bg-spotify-green focus:ring-spotify-green' : 'bg-gray-700 hover:bg-gray-600 focus:ring-gray-500'}
        focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
      disabled={selectedArtists.length !== 5}
      onClick={handleSubmit}
    >
      {selectedArtists.length === 5 ? 'Create Playlist' : 'Select 5 Artists'}
    </button>

  
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
                <div className="absolute inset-0 bg-spotify-green opacity-75"></div>
              )}
            </div>
            <p className={`mt-2 ${getArtistNameClass(artist.id)}`}>{artist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}  

export default MoodAndArtistSelection;
