import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'https://moodster-server.vercel.app/login';
  };

  return (
    <div 
      className="flex justify-center items-center h-screen"
      style={{ backgroundColor: '#212121' }}
    >
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white py-2 px-6 rounded-full font-bold uppercase hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition duration-150 ease-in-out"
      >
        Iniciar sesión con Spotify
      </button>
    </div>
  );
}

export default Login;
