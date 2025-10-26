import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginAttempt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      onLogin();
    }, 750);
  };

  const spinner = (
     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-900">
      <video 
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay 
        muted 
        loop
      >
        <source src="./CVbackground.webm" type="video/webm" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      <div className="relative z-20 w-full max-w-sm p-8 space-y-6 bg-white/10 dark:bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-white text-center">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-300 text-center">Sign in to sync your resumes.</p>
        </div>
        
        <button 
          onClick={() => handleLoginAttempt()} 
          className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-gray-800 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSigningIn}
        >
          {isSigningIn ? (
             <>
               {spinner} Signing In...
             </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.7 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 76.4c-24.1-23.4-58.2-38.2-96.5-38.2-76.3 0-138.5 61.5-138.5 137.2s62.2 137.2 138.5 137.2c85.4 0 114.7-62.4 118.8-93.7H248v-96.2h239.1c1.2 12.8 2.6 25.5 3.9 38.2z"></path></svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <form className="space-y-4" onSubmit={handleLoginAttempt}>
            <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 text-white bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSigningIn}
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-3 py-2 text-white bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSigningIn}
                />
            </div>
            <button 
                type="submit" 
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSigningIn}
            >
                {isSigningIn ? 'Signing In...' : 'Sign In with Email'}
            </button>
        </form>

      </div>
    </div>
  );
};
