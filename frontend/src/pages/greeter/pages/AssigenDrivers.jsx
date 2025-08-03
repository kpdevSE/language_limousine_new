import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Search, User, Menu } from "lucide-react";

export default function AssignDrivers() {
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedSubDriver, setSelectedSubDriver] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Sample student data - empty for "No records found" state
  const studentsData = [];

  const handleDriverChange = (e) => {
    setSelectedDriver(e.target.value);
  };

  const handleSubDriverChange = (e) => {
    setSelectedSubDriver(e.target.value);
  };

  const handleAssign = () => {
    if (selectedStudents.length > 0 && selectedDriver) {
      console.log(
        "Assigning students:",
        selectedStudents,
        "to driver:",
        selectedDriver
      );
      // Handle assignment logic here
    } else {
      alert("Please select a driver and at least one student");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 min-h-screen w-full bg-white">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Mobile Menu Space */}
            <div className="md:hidden w-10"></div>

            {/* Title - Hidden on mobile, shown on larger screens */}
            <h1 className="hidden md:block text-xl font-semibold text-gray-900">
              Assign Drivers
            </h1>

            {/* Admin User */}
            <div className="flex items-center space-x-3">
              <span className="hidden sm:block text-gray-900 font-medium text-sm">
                Admin User
              </span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 bg-white min-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            {/* Driver Selection Section */}
            <div className="mb-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                {/* Select Driver */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Driver
                  </label>
                  <select
                    value={selectedDriver}
                    onChange={handleDriverChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select Driver --</option>
                    <option value="driver1">Driver 1</option>
                    <option value="driver2">Driver 2</option>
                    <option value="driver3">Driver 3</option>
                  </select>
                </div>

                {/* Select Sub Driver */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Sub Driver
                  </label>
                  <select
                    value={selectedSubDriver}
                    onChange={handleSubDriverChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select Sub Driver --</option>
                    <option value="subdriver1">Sub Driver 1</option>
                    <option value="subdriver2">Sub Driver 2</option>
                    <option value="subdriver3">Sub Driver 3</option>
                  </select>
                </div>

                {/* Assign Button */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-transparent md:text-gray-700">
                    Action
                  </label>
                  <button
                    onClick={handleAssign}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Table Header - Always visible */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-1 p-4">
                  <div className="text-xs font-medium text-gray-700 text-center">
                    Pick
                  </div>
                  <div className="text-xs font-medium text-gray-700 text-center">
                    ID
                  </div>
                  <div className="text-xs font-medium text-gray-700 text-center">
                    Arrival Time
                  </div>
                  <div className="hidden md:block text-xs font-medium text-gray-700 text-center">
                    Flight
                  </div>
                  <div className="hidden md:block text-xs font-medium text-gray-700 text-center">
                    D or I
                  </div>
                  <div className="hidden md:block text-xs font-medium text-gray-700 text-center">
                    Student Number
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    Student Given Name
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    Host Given Name
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    Phone Numbers
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    Address
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    City
                  </div>
                  <div className="hidden lg:block text-xs font-medium text-gray-700 text-center">
                    School
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-white">
                {studentsData.length > 0 ? (
                  // If there are students, show them
                  studentsData.map((student) => (
                    <div
                      key={student.id}
                      className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-1 p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="text-xs text-gray-700 text-center">
                        {student.id}
                      </div>
                      <div className="text-xs text-gray-700 text-center">
                        {student.arrivalTime}
                      </div>
                      <div className="hidden md:block text-xs text-gray-700 text-center">
                        {student.flight}
                      </div>
                      <div className="hidden md:block text-xs text-gray-700 text-center">
                        {student.dOrI}
                      </div>
                      <div className="hidden md:block text-xs text-gray-700 text-center">
                        {student.studentNumber}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.studentGivenName}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.hostGivenName}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.phoneNumbers}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.address}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.city}
                      </div>
                      <div className="hidden lg:block text-xs text-gray-700 text-center">
                        {student.school}
                      </div>
                    </div>
                  ))
                ) : (
                  // No records found state
                  <div className="p-12 text-center">
                    <div className="text-gray-500 text-sm">
                      No records found for today
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile-Friendly Info Cards - Only show on small screens when table is too cramped */}
            <div className="md:hidden mt-6 space-y-4">
              {studentsData.length > 0 ? (
                studentsData.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">
                        {student.studentGivenName}
                      </h3>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">ID:</span> {student.id}
                      </div>
                      <div>
                        <span className="font-medium">Arrival:</span>{" "}
                        {student.arrivalTime}
                      </div>
                      <div>
                        <span className="font-medium">Flight:</span>{" "}
                        {student.flight}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span>{" "}
                        {student.dOrI}
                      </div>
                    </div>
                    {student.hostGivenName && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Host:</span>{" "}
                        {student.hostGivenName}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-gray-500 text-sm">
                    No records found for today
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-gray-500 text-sm">
              Copyright © 2024. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
