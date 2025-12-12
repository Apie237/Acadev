import React from 'react';

const AcadevoLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#409891] to-[#48ADB7] flex items-center justify-center z-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated book icon */}
        <div className="mb-8 relative">
          {/* Outer rotating circle */}
          <svg className="w-32 h-32 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeDasharray="10 5"
            />
          </svg>

          {/* Inner rotating circle */}
          <svg 
            className="absolute inset-0 w-32 h-32 animate-spin" 
            style={{ animationDuration: '2s', animationDirection: 'reverse' }} 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="5 10"
            />
          </svg>

          {/* Book icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-16 h-16 text-white animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                    opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
          </div>

          {/* Orbiting dots */}
          <svg className="absolute inset-0 w-32 h-32" viewBox="0 0 100 100">
            <circle cx="50" cy="5" r="3" fill="white" opacity="0.8">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="5" r="3" fill="white" opacity="0.6">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="120 50 50"
                to="480 50 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="50" cy="5" r="3" fill="white" opacity="0.4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="240 50 50"
                to="600 50 50"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Brand name with animation */}
        <div className="mb-6 overflow-hidden">
          <h1 className="text-5xl font-bold text-white tracking-wider">
            {'Acadevo'.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-bounce"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: '1s',
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Loading text */}
        <div className="text-white text-lg font-medium mb-4">
          Preparing your learning experience
        </div>

        {/* Progress bar */}
        <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full animate-pulse"
            style={{
              animation: 'loading 2s ease-in-out infinite',
            }}
          ></div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mt-4">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: '0.6s',
              }}
            ></div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-white/80 text-sm mt-8 animate-pulse">
          Empowering learners, one course at a time
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0%, 100% {
            width: 0%;
          }
          50% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AcadevoLoader;