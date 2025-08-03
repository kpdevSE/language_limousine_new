import React, { useState } from "react";
import { Search, User, Car, Users, UserCheck } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  const stats = [
    {
      id: 1,
      title: "Total Students",
      value: "101",
      icon: User,
      bgColor: "bg-emerald-500",
    },
    {
      id: 2,
      title: "Total Drivers",
      value: "0",
      icon: Car,
      bgColor: "bg-red-500",
    },
    {
      id: 3,
      title: "Total Subdrivers",
      value: "1",
      icon: Users,
      bgColor: "bg-slate-600",
    },
    {
      id: 4,
      title: "Total Greeters",
      value: "1",
      icon: UserCheck,
      bgColor: "bg-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Mobile spacing for menu button */}
            <div className="md:hidden w-12"></div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 text-sm"
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3 ml-6">
              <span className="hidden sm:block text-black font-medium">
                Admin User
              </span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`${stat.bgColor} text-white rounded-2xl p-4 md:p-6 shadow-lg`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl md:text-4xl font-bold">
                          {stat.value}
                        </p>
                      </div>
                      <div className="bg-white/20 rounded-full p-2 md:p-3">
                        <IconComponent className="h-5 w-5 md:h-7 md:w-7" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                Dashboard Overview
              </h2>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Welcome to the Admin Dashboard. Here you can monitor and manage
                all aspects of your system.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-xl p-4 md:p-5">
                  <h3 className="text-gray-800 font-medium mb-3 text-sm md:text-base">
                    Recent Activity
                  </h3>
                  <p className="text-gray-500 text-sm">
                    No recent activity to display.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 md:p-5">
                  <h3 className="text-gray-800 font-medium mb-3 text-sm md:text-base">
                    System Status
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm">
                      All systems operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-4 mt-6 md:mt-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-gray-500 text-sm">
              Copyright © 2024. All right reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
