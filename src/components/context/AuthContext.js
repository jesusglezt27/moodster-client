import React, { createContext, useState, useContext} from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('spotifyAuthToken') || null);
  const [spotifyUserId, setSpotifyUserId] = useState(localStorage.getItem('spotifyUserId') || null);

  const login = (token, userId) => {
    localStorage.setItem('spotifyAuthToken', token);
    localStorage.setItem('spotifyUserId', userId);
    setAuthToken(token);
    setSpotifyUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('spotifyAuthToken');
    localStorage.removeItem('spotifyUserId');
    setAuthToken(null);
    setSpotifyUserId(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, spotifyUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
