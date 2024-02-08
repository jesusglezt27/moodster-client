import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'https://moodster-server.vercel.app/login';
  };

  return (
    <div className="flex justify-center items-center h-screen bg-darkgray"> 
      <div className="text-center p-8 bg-darkgray"> 
        <h1 className="text-4xl text-white font-bold bg-darkgray mb-6">MOODSTER</h1>
        <p className="text-white text-xl bg-darkgray mb-7">Swipe Your Mood, Play Your Tune!</p>
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white py-2 px-6 rounded-full font-bold uppercase hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition duration-150 ease-in-out"
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Login;
