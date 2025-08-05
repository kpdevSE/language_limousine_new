import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Search, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SubDriverDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Empty data to show "No records found" state
  const studentsData = [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = studentsData.filter(
    (student) =>
      student.studentGivenName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.flight.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalEntries = filteredStudents.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden ml-0 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Sub Driver Dashboard
            </h1>

            {/* Search Bar */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 font-medium text-sm md:text-base">
                Sub Driver
              </span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Control Section */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 text-sm">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesPerPageChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-900 text-sm">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 text-sm">Search:</span>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-48"
                />
              </div>
            </div>

            {/* Students Table */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">ID</span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">Pick Up</span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Delivered
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">Flight</span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Arrival Time
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Student Number
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Student Given Name
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-gray-200">
                        <td
                          colSpan={7}
                          className="text-gray-700 text-center py-8 px-4 border-b border-gray-200 text-sm"
                        >
                          No records found for today.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Cards - Show detailed info on small screens */}
            <div className="md:hidden mt-6 space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="text-gray-500 text-sm">
                  No records found for today.
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-700 text-sm order-2 sm:order-1">
                Showing 0 to 0 of 0 entries
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={true}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm disabled:opacity-50"
                >
                  Prev
                </Button>
                <Button
                  onClick={() => handlePageChange(1)}
                  className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm opacity-50"
                >
                  1
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={true}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
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
