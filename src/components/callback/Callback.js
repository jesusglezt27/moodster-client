// En Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        console.log('aqui esta el codgio', code)
      axios.post('http://localhost:4000/exchange_code', { code })
        .then(response => {
          const { accessToken } = response.data;
          localStorage.setItem('spotifyAuthToken', accessToken);
          navigate('/dashboard');
        })
        .catch(error => {
          console.error('Error exchanging code for token', error);
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Cargando...</div>;
};

export default Callback;
