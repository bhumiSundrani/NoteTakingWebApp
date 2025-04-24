import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Background Banner Section */}
      <div 
        className="w-full h-screen md:h-[60vh] flex flex-col justify-center items-center text-center relative bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content Box */}
        <div className="relative z-10 px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl text-white font-extrabold drop-shadow-lg">
            The Simplest Way to Keep Notes
          </h1>
          <button 
            className="mt-6 bg-amber-950 hover:bg-amber-800 text-white text-lg md:text-xl rounded-lg py-3 px-6 transition duration-300 shadow-lg"
            onClick={() => navigate('/user/signup')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
