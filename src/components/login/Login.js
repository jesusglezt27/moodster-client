import React from 'react';
import './Login.css';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/login';
  };

  return (
    <div>
      <button className='login-button' onClick={handleLogin}>Iniciar sesión con Spotify</button>
    </div>
  );
}

export default Login;
