// SpotifyPlayer.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SpotifyPlayer = () => {
  const { authToken } = useAuth();
  const [player, setPlayer] = useState(null);

  // Cargar el SDK de Spotify
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(authToken); },
        volume: 0.5
      });

      // Event handling
      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      newPlayer.connect();

      // Setting player state
      setPlayer(newPlayer);
    };

    return () => {
      // Cleanup
      if (player) {
        player.disconnect();
      }
      document.body.removeChild(script);
    };
  }, [authToken]); // Asegúrate de que authToken se encuentra en la lista de dependencias

  if (!authToken) return null;

  return (
    <div>
      {/* Aquí puedes añadir controles para play, pause, next, previous, etc. */}
      <p>Player controls</p>
    </div>
  );
};

export default SpotifyPlayer;
