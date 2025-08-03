import React from "react";
import {
  Truck,
  HandHeart,
  Building,
  Clock,
  Package,
  ArrowUp,
} from "lucide-react";

const StudentTransportService = () => {
  return (
    <div className="relative bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
          STUDENT TRANSPORT SERVICE
        </h2>
        <div className="w-16 h-1 bg-orange-500 mx-auto mb-8"></div>
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed">
          Language Limousine provides reliable and efficient transportation
          solutions for students arriving from both domestic and international
          locations. Our service includes safe transfers from the airport to
          student hostels, ensuring a seamless and stress-free start to their
          journey.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-12">
            {/* Airport Transfers */}
            <div className="text-center lg:text-right">
              <div className="flex justify-center lg:justify-end mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                AIRPORT TRANSFERS
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Safe and timely airport pick-ups and drop-offs for all students.
              </p>
            </div>

            {/* International Student Assistance */}
            <div className="text-center lg:text-right">
              <div className="flex justify-center lg:justify-end mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <HandHeart className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                INTERNATIONAL STUDENT
                <br />
                ASSISTANCE
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Personalized service to assist students with their travel needs.
              </p>
            </div>

            {/* Comfortable and Secure Rides */}
            <div className="text-center lg:text-right">
              <div className="flex justify-center lg:justify-end mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                COMFORTABLE AND
                <br />
                SECURE RIDES
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Well-maintained vehicles ensuring comfort and security.
              </p>
            </div>
          </div>

          {/* Center Column - Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="skyBg" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#B0C4DE;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <!-- Sky background -->
                      <rect width="100%" height="200" fill="url(#skyBg)"/>
                      <!-- Road -->
                      <rect x="0" y="200" width="100%" height="200" fill="#374151"/>
                      <rect x="0" y="280" width="100%" height="10" fill="#6B7280"/>
                      <!-- Buildings in background -->
                      <rect x="50" y="120" width="40" height="80" fill="#4B5563"/>
                      <rect x="100" y="100" width="50" height="100" fill="#374151"/>
                      <rect x="160" y="130" width="35" height="70" fill="#4B5563"/>
                      <rect x="300" y="110" width="45" height="90" fill="#374151"/>
                      <!-- Car -->
                      <rect x="150" y="240" width="100" height="40" fill="#1F2937" rx="5"/>
                      <circle cx="170" cy="285" r="12" fill="#000"/>
                      <circle cx="230" cy="285" r="12" fill="#000"/>
                      <rect x="160" y="220" width="80" height="20" fill="#4A90E2" rx="3"/>
                      <!-- Person with Canadian flag -->
                      <circle cx="120" cy="250" r="15" fill="#F4A460"/>
                      <rect x="110" y="265" width="20" height="30" fill="#8B4513"/>
                      <!-- Canadian flag -->
                      <rect x="95" y="235" width="20" height="15" fill="#FF0000"/>
                      <polygon points="100,240 105,242 105,245 100,247 95,245 95,242" fill="#FF0000"/>
                      <!-- Street elements -->
                      <rect x="50" y="310" width="15" height="60" fill="#654321"/>
                      <circle cx="57" cy="305" r="8" fill="#228B22"/>
                      <rect x="320" y="315" width="12" height="50" fill="#696969"/>
                      <circle cx="326" cy="310" r="6" fill="#FFD700"/>
                    </svg>
                  `)}')`,
                }}
              >
                {/* Overlay for better text visibility if needed */}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-12">
            {/* Door-to-Door Service */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                DOOR-TO-DOOR SERVICE
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Convenient drop-off at the student's exact hostel location.
              </p>
            </div>

            {/* 24/7 Availability */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                24/7 AVAILABILITY
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Flexible service times to accommodate all flight schedules.
              </p>
            </div>

            {/* Student Tracker */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 border-2 border-orange-400 border-dashed rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                STUDENT TRACKER
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                You can see if a student has been greeted, is in a car, or has
                been delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTransportService;
