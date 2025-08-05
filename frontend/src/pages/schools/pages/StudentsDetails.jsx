import { useState } from "react";
import {
  Search,
  User,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Siebar";

export default function StudentDetails() {
  const [selectedDate, setSelectedDate] = useState("08/04/2025");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample empty data to match the "No students found" state
  const studentsData = [];

  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = studentsData.slice(startIndex, endIndex);

  const handleFilter = () => {
    console.log("Filter applied for date:", selectedDate);
    // Add filter logic here
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 min-h-screen w-full bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
            {/* Mobile Menu Space */}
            <div className="md:hidden w-10" />

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                  Student Details
                </h1>
                <p className="text-sm text-gray-500">
                  Search and view student information by date
                </p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
          {/* Filter Card */}
          <div className="bg-white shadow-lg border border-gray-200 rounded-xl mb-6">
            <div className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-gray-100 p-6">
              <h2 className="flex items-center gap-3 text-gray-900 text-lg font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <Filter className="h-4 w-4 text-blue-600" />
                </div>
                Filter Students
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Select the Date
                  </label>
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleFilter}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-2 h-10 rounded-md transition-colors"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Results Table Card */}
          <div className="bg-white shadow-lg border border-gray-200 rounded-xl">
            <div className="pb-4 p-6 border-b border-gray-100">
              <h2 className="text-lg text-gray-900 font-semibold">
                Student Results
              </h2>
              <p className="text-sm text-gray-500">
                Search results for {selectedDate}
              </p>
            </div>

            <div className="p-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[80px]">
                        Action
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[40px]">
                        #
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Actual arrival time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[100px]">
                        Arr time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[80px]">
                        Flight
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[60px]">
                        D or I
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[60px]">
                        M or F
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        student number
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        student given name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        student family name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        host given name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        host family name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[100px]">
                        Phone
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[150px]">
                        Address
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 min-w-[80px]">
                        City
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="15" className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Search className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">
                            No students found.
                          </p>
                          <p className="text-sm">
                            Try selecting a different date or check if students
                            are registered for this date.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing 0 to 0 of 0 entries
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={true}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    disabled={true}
                    className="w-8 h-8 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
                  >
                    1
                  </button>

                  <button
                    disabled={true}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <p className="text-center text-sm text-gray-500">
              Copyright © 2024. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
