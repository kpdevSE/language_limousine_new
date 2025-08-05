import { useState } from "react";
import {
  BarChart3,
  User,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Siebar";

export default function StatusPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample empty data to match the "No students found" state
  const studentsData = [];

  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = studentsData.slice(startIndex, endIndex);

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
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                  Student Status Data
                </h1>
                <p className="text-sm text-gray-500">
                  Monitor student arrival and delivery status
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
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 border border-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Waiting</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">In Car</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Card */}
          <div className="bg-white shadow-lg border border-gray-200 rounded-xl">
            <div className="pb-4 p-6 border-b border-gray-100">
              <h2 className="text-lg text-gray-900 font-semibold">
                Student Status Data
              </h2>
              <p className="text-sm text-gray-500">
                Real-time status tracking for all students
              </p>
            </div>

            <div className="p-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[40px]">
                        #
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Actual arrival time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[100px]">
                        Arr time
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
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[80px]">
                        Waiting
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[80px]">
                        In car
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 min-w-[80px]">
                        Delivered
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="10" className="p-8 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <AlertCircle className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">
                            No students found.
                          </p>
                          <p className="text-sm">
                            Student status data will appear here when students
                            are registered and tracked.
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
