// Asegúrate de importar los componentes y hooks necesarios de React, así como axios y cualquier otro paquete que estés utilizando.
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SpotifyPlayer from 'react-spotify-web-playback';
import BeatLoader from "react-spinners/BeatLoader";
import imagenPlaylist from '../../images/MoodsterOficial.png';

const bgColor = 'bg-darkgray'; // Color de fondo oscuro
const accentColor = 'text-spotify-green'; // Color verde de Spotify para el texto

const Playlist = () => {
  const navigate = useNavigate()
  const { authToken } = useAuth();
  const { playlistId } = useParams();
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [play, setPlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    const fetchPlaylistDetails = async () => {
      if (!authToken) return;

      try {
        const detailsResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setPlaylistDetails(detailsResponse.data);

        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
        setTracks(tracksResponse.data.items);
      } catch (error) {
        console.error('Error fetching playlist details:', error);
      }
    };

    fetchPlaylistDetails();
  }, [authToken, playlistId]);

  const handleImageError = (e) => {
    e.target.src = imagenPlaylist; // Set default image if loading fails
  };

  const selectTrack = async (uri) => {
    if (!authToken) return;
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri] },
        { headers: { 'Authorization': `Bearer ${authToken}` } }
      );
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };
  

  if (!playlistDetails) {
    return (
      <div className={`${bgColor} flex justify-center items-center h-screen`}>
        <BeatLoader color="#1DB954" size={15} />
      </div>
    );
  }

  return (
    <div className={`${bgColor} text-white min-h-screen p-4`}>
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h1 className={`${accentColor} text-5xl font-bold mb-4`}>MOOD PLAYLIST</h1>
          <h2 className="text-2xl font-bold">{playlistDetails.name}</h2>
          <img 
            src={playlistDetails?.images?.[0]?.url || imagenPlaylist} 
            onError={handleImageError} 
            alt="Playlist cover" 
            className="w-48 h-48 mt-4 mx-auto"
          />        
        </div>

        <div className="mb-10">
          <ul>
            {tracks.map((trackItem, index) => (
              <li key={index} className="flex items-center hover:bg-gray-800 px-2 py-1 cursor-pointer select-none" onClick={() => selectTrack(trackItem.track.uri)}>
                <p className="truncate">{trackItem.track.name} - {trackItem.track.artists.map(artist => artist.name).join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center space-x-4 mb-4">
          <a
          href={`https://open.spotify.com/playlist/${playlistId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-800 text-white font-bold py-2 px-6 rounded-full hover:bg-spotify-green transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green"
          >
          Listen on Spotify
          </a>
          <button
          onClick={() => navigate('/selector')}
          className="bg-gray-800 text-white font-bold py-2 px-6 rounded-full hover:bg-spotify-green transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
          >
          Make Another
          </button>
        </div>
      
        <SpotifyPlayer
          token={authToken}
          uris={[`spotify:playlist:${playlistId}`]}
          play={play}
          callback={state => { if (!state.isPlaying) setPlay(false); }}
          styles={{
            bgColor: 'black',
            color: 'white',
            loaderColor: 'white',
            sliderColor: 'spotify-green',
            savedColor: 'white',
            trackArtistColor: 'gray',
            trackNameColor: 'white',
          }}
        />
      </div>
    </div>
  );
};

export default Playlist;
