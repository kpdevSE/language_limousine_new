import React, { useState, useEffect } from "react";

const LanguageLimousineHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Parallax Background Effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${
            mousePosition.y * 0.02
          }px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full blur-2xl opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Language Title */}
        <div
          className={`mb-6 md:mb-8 transform transition-all duration-1000 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-center">
            <span className="inline-block bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent animate-pulse">
              LANGUAGE
            </span>
          </h1>
        </div>

        {/* Limousine Title */}
        <div
          className={`mb-8 md:mb-12 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-center">
            <span className="inline-block text-white drop-shadow-2xl tracking-tight">
              LIMOUSINE
            </span>
          </h2>
        </div>

        {/* Microphone Icon */}
        <div
          className={`mb-8 md:mb-12 transform transition-all duration-1000 delay-500 ${
            isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        >
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-800 to-purple-900 p-6 md:p-8 rounded-full border-2 border-purple-600 hover:border-orange-500 transition-all duration-300 transform hover:scale-110">
              <svg
                className="w-8 h-8 md:w-12 md:h-12 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <path d="M12 18v4" />
                <path d="M8 22h8" />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div
          className={`mb-12 md:mb-16 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <p className="text-white/80 text-lg md:text-xl lg:text-2xl text-center max-w-2xl px-4 font-light tracking-wide">
            A <span className="text-orange-400 font-semibold">GREAT</span>{" "}
            WELCOME FOR YOUR{" "}
            <span className="text-orange-400 font-semibold">CLIENTS</span>
          </p>
        </div>

        {/* Earth Globe - Realistic View */}
        <div
          className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="relative group mb-16 md:mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-green-500 to-blue-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative w-64 h-32 md:w-96 md:h-48 lg:w-[500px] lg:h-60 overflow-hidden">
              {/* Earth hemisphere with realistic continents */}
              <div className="w-full h-full relative">
                {/* Ocean base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 rounded-b-full"></div>

                {/* Land masses - Europe/Africa visible */}
                <div className="absolute top-4 left-8 w-20 h-16 bg-gradient-to-br from-yellow-200 via-yellow-300 to-orange-300 opacity-90 transform rotate-12 rounded-lg"></div>
                <div className="absolute top-8 left-20 w-16 h-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 opacity-85 transform -rotate-6 rounded-lg"></div>
                <div className="absolute top-12 right-20 w-24 h-12 bg-gradient-to-br from-yellow-300 via-orange-300 to-red-300 opacity-80 transform rotate-3 rounded-lg"></div>
                <div className="absolute top-6 right-8 w-18 h-14 bg-gradient-to-br from-green-300 via-green-400 to-green-500 opacity-75 transform -rotate-12 rounded-lg"></div>

                {/* Additional land details */}
                <div className="absolute top-16 left-12 w-12 h-8 bg-gradient-to-br from-orange-200 to-orange-400 opacity-70 transform rotate-45 rounded"></div>
                <div className="absolute top-20 right-16 w-14 h-10 bg-gradient-to-br from-green-200 to-green-400 opacity-65 transform -rotate-30 rounded"></div>

                {/* Atmospheric glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/20 rounded-b-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/10 to-transparent rounded-b-full"></div>

                {/* Subtle cloud layer */}
                <div className="absolute top-2 left-6 w-16 h-6 bg-white/20 rounded-full blur-sm opacity-60"></div>
                <div className="absolute top-8 right-12 w-20 h-4 bg-white/15 rounded-full blur-sm opacity-50"></div>
                <div className="absolute top-14 left-16 w-12 h-5 bg-white/20 rounded-full blur-sm opacity-40"></div>

                {/* Terminator line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent rounded-b-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards Section */}
        <div
          className={`w-full max-w-7xl mx-auto px-4 transform transition-all duration-1000 delay-1200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Airport Pick-up */}
            <div className="group relative bg-purple-900/50 border-2 border-orange-500 rounded-lg p-6 md:p-8 hover:bg-purple-800/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                  AIRPORT
                </h3>
                <p className="text-white/80 font-semibold">PICK-UP</p>
              </div>
            </div>

            {/* International Transfers */}
            <div className="group relative bg-purple-900/50 border-2 border-orange-500 rounded-lg p-6 md:p-8 hover:bg-purple-800/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                  INTERNATIONAL
                </h3>
                <p className="text-white/80 font-semibold">TRANSFERS</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="group relative bg-purple-900/50 border-2 border-orange-500 rounded-lg p-6 md:p-8 hover:bg-purple-800/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                  24/7
                </h3>
                <p className="text-white/80 font-semibold">SUPPORT</p>
              </div>
            </div>

            {/* Hostel Drop-off */}
            <div className="group relative bg-purple-900/50 border-2 border-orange-500 rounded-lg p-6 md:p-8 hover:bg-purple-800/60 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-orange-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.46 9-11V7l-10-5z" />
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg md:text-xl mb-2">
                  HOSTEL
                </h3>
                <p className="text-white/80 font-semibold">DROP-OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageLimousineHero;
