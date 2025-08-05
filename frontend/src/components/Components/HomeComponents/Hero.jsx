import React, { useState, useEffect } from "react";

const LanguageLimousineHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Start animations immediately
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.03}px, ${
              mousePosition.y * 0.03
            }px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * -0.02}px, ${
              mousePosition.y * -0.02
            }px)`,
            transition: "transform 0.5s ease-out",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            transform: `translate(-50%, -50%) translate(${
              mousePosition.x * 0.01
            }px, ${mousePosition.y * 0.01}px)`,
            transition: "transform 0.5s ease-out",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Brand Logo/Icon */}
        <div
          className={`mb-8 transform transition-all duration-800 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-white to-gray-100 p-4 rounded-2xl shadow-2xl">
              <svg
                className="w-12 h-12 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Language Title */}
        <div
          className={`mb-4 transform transition-all duration-800 delay-100 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-center">
            <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-500 bg-clip-text text-transparent">
              LANGUAGE
            </span>
          </h1>
        </div>

        {/* Limousine Title */}
        <div
          className={`mb-8 transform transition-all duration-800 delay-200 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-center">
            <span className="inline-block text-white drop-shadow-2xl tracking-tight">
              LIMOUSINE
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <div
          className={`mb-12 transform transition-all duration-800 delay-300 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <p className="text-gray-300 text-xl md:text-2xl lg:text-3xl text-center max-w-4xl px-4 font-light tracking-wide">
            A <span className="text-cyan-400 font-semibold">PREMIUM</span>{" "}
            WELCOME FOR YOUR{" "}
            <span className="text-cyan-400 font-semibold">GLOBAL</span> CLIENTS
          </p>
        </div>

        {/* Interactive Globe */}
        <div
          className={`mb-16 transform transition-all duration-800 delay-400 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
              {/* Globe Base */}
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-4 border-cyan-500/30 relative overflow-hidden shadow-2xl">
                {/* Continents */}
                <div className="absolute top-8 left-12 w-16 h-12 bg-gradient-to-br from-emerald-400 to-green-500 opacity-80 rounded-lg transform rotate-12"></div>
                <div className="absolute top-16 right-16 w-20 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-75 rounded-lg transform -rotate-6"></div>
                <div className="absolute bottom-16 left-16 w-18 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 opacity-70 rounded-lg transform rotate-45"></div>
                <div className="absolute bottom-12 right-12 w-14 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 opacity-65 rounded-lg transform -rotate-12"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-500/10 rounded-full"></div>

                {/* Orbit Ring */}
                <div
                  className="absolute inset-0 border-2 border-cyan-400/20 rounded-full animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>
                <div
                  className="absolute inset-4 border border-blue-400/15 rounded-full animate-spin"
                  style={{
                    animationDuration: "15s",
                    animationDirection: "reverse",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Cards Grid */}
        <div
          className={`w-full max-w-7xl mx-auto px-4 transform transition-all duration-800 delay-500 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Airport Pickup */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/30 transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">AIRPORT</h3>
                <p className="text-gray-400 font-medium">PICKUP</p>
              </div>
            </div>

            {/* International Service */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  INTERNATIONAL
                </h3>
                <p className="text-gray-400 font-medium">SERVICE</p>
              </div>
            </div>

            {/* 24/7 Support */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">24/7</h3>
                <p className="text-gray-400 font-medium">SUPPORT</p>
              </div>
            </div>

            {/* Premium Transfers */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.46 9-11V7l-10-5z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">PREMIUM</h3>
                <p className="text-gray-400 font-medium">TRANSFERS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`mt-16 transform transition-all duration-800 delay-600 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-10 opacity-0 scale-95"
          }`}
        >
          <button className="group relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10">GET STARTED</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageLimousineHero;
