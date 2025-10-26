

import React, { useState } from 'react';

interface LandingPageProps {
  onLoginClick: () => void;
  onGuestClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onGuestClick }) => {
  const [isLoading, setIsLoading] = useState<'login' | 'guest' | null>(null);
  const textShadowStyle = { textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' };

  const handleLogin = () => {
    setIsLoading('login');
    setTimeout(() => onLoginClick(), 750);
  };
  const handleGuest = () => {
    setIsLoading('guest');
    setTimeout(() => onGuestClick(), 750);
  };
  
  const spinner = (colorClass: string) => (
    <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${colorClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
      <video 
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop
      >
        <source src="./CVbackground.webm" type="video/webm" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10"></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-4">
        <div className="animate-fade-in-down max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={textShadowStyle}>
            Welcome to CV Constructor
          </h1>
          <p className="mt-3 text-lg md:text-xl text-white/90" style={textShadowStyle}>
            Create professional resumes with AI assistance
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleLogin}
              disabled={!!isLoading}
              className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center w-full sm:w-auto disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading === 'login' ? <>{spinner('text-white')} Loading...</> : 'Login'}
            </button>
            <button
              onClick={handleGuest}
              disabled={!!isLoading}
              className="px-10 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center w-full sm:w-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading === 'guest' ? <>{spinner('text-gray-800')} Loading...</> : 'Continue as Guest'}
            </button>
          </div>

          <div className="mt-12 text-center text-xs text-white/70">
            <p>Your data will be processed in accordance with our Privacy Policy</p>
            <p>© 2025. ResumeLeap. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};