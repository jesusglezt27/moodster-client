import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SpotifyPlayer from 'react-spotify-web-playback';
import './Playlist.css';

const Playlist = () => {
  const { authToken } = useAuth();
  const { playlistId } = useParams();
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [play, setPlay] = useState(false);

  useEffect(() => {
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

  return (
    <div className="bg-black text-white p-4">
      {playlistDetails && (
        <div>
          <div className="flex items-center mb-4">
            <div className="flex-none">
              <img src={playlistDetails.images[0].url} alt="Playlist cover" className="w-16 h-16"/>
            </div>
            <div className="flex-grow ml-4">
              <h2 className="text-lg font-bold">{playlistDetails.name}</h2>
              <p className="text-sm">{playlistDetails.description}</p>
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "50vh" }}>
            <ul>
              {tracks.map((trackItem, index) => (
                <li key={index} className="flex items-center hover:bg-gray-800 px-2 py-1">
                  <p className="truncate">{trackItem.track.name} - {trackItem.track.artists.map(artist => artist.name).join(', ')}</p>
                </li>
              ))}
            </ul>
          </div>
          <SpotifyPlayer
            token={authToken}
            uris={playlistDetails ? [`spotify:playlist:${playlistId}`] : []}
            play={play}
            callback={state => {
              if (!state.isPlaying) setPlay(false);
            }}
            showSaveIcon
            styles={{
              bgColor: 'black',
              color: '#fff',
              loaderColor: '#fff',
              sliderColor: '#1cb954',
              savedColor: '#fff',
              trackArtistColor: '#ccc',
              trackNameColor: '#fff',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Playlist;
