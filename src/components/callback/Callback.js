// Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      axios.post('https://moodster-server.vercel.app/exchange_code', { code })
        .then(response => {
          const { accessToken, refreshToken, expiresIn } = response.data;
          login(accessToken, refreshToken, expiresIn);
          navigate('/selector');
        })
        .catch(error => {
          console.error('Error exchanging code for token', error);
          navigate('/');
        });
        window.history.pushState({}, document.title, "/callback");
    }
  }, [navigate, login]);

  return <div>Cargando...</div>;
};

export default Callback;
