import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Search, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AssignDrivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedSubDriver, setSelectedSubDriver] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Sample student data matching the screenshot
  const studentsData = [
    {
      id: 6,
      arrivalTime: "05:27:00",
      flight: "AM 694",
      dOrI: "I",
      studentNumber: "311143",
      studentGivenName: "Maria Clara",
      hostGivenName: "Jocelyn",
      phoneNumbers: "H: 604-719-7024",
    },
    {
      id: 7,
      arrivalTime: "05:27:00",
      flight: "AM 694",
      dOrI: "I",
      studentNumber: "311144",
      studentGivenName: "Lara",
      hostGivenName: "Jocelyn",
      phoneNumbers: "H: 604-719-7024 C: 778-859-2",
    },
    {
      id: 8,
      arrivalTime: "05:27:00",
      flight: "AM 694",
      dOrI: "I",
      studentNumber: "308882",
      studentGivenName: "LUCCA",
      hostGivenName: "Donna & Alejandro",
      phoneNumbers: "H: 778-320-9131",
    },
    {
      id: 9,
      arrivalTime: "05:55:00",
      flight: "ZG 021",
      dOrI: "I",
      studentNumber: "JPT3324373",
      studentGivenName: "UNGYON",
      hostGivenName: "Fozmin",
      phoneNumbers: "778-689-4550",
    },
    {
      id: 10,
      arrivalTime: "07:40:00",
      flight: "ZG 022",
      dOrI: "I",
      studentNumber: "202401108",
      studentGivenName: "Kai",
      hostGivenName: "Gordon & Carina",
      phoneNumbers: "H: 604-374-2138",
    },
    {
      id: 11,
      arrivalTime: "08:20:00",
      flight: "AC 003",
      dOrI: "I",
      studentNumber: "310596",
      studentGivenName: "Koyo",
      hostGivenName: "Lora",
      phoneNumbers: "H: 778-628-5119 C: 604-353-0",
    },
    {
      id: 12,
      arrivalTime: "08:20:00",
      flight: "AC 306",
      dOrI: "D",
      studentNumber: "306155",
      studentGivenName: "Alexander",
      hostGivenName: "",
      phoneNumbers: "",
    },
    {
      id: 13,
      arrivalTime: "08:30:00",
      flight: "AC 003",
      dOrI: "I",
      studentNumber: "309068",
      studentGivenName: "Mio",
      hostGivenName: "Gidget",
      phoneNumbers: "H: 6049169508 C: 60491695",
    },
    {
      id: 14,
      arrivalTime: "08:35:00",
      flight: "JL 017",
      dOrI: "I",
      studentNumber: "2081052",
      studentGivenName: "Mona",
      hostGivenName: "Pinky Salinas",
      phoneNumbers: "604 779 6755",
    },
    {
      id: 15,
      arrivalTime: "08:45:00",
      flight: "AC 003",
      dOrI: "I",
      studentNumber: "311033",
      studentGivenName: "NANA",
      hostGivenName: "Leonila",
      phoneNumbers: "H: 604-722-1399 C: 778-859-1",
    },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDriverChange = (e) => {
    setSelectedDriver(e.target.value);
  };

  const handleSubDriverChange = (e) => {
    setSelectedSubDriver(e.target.value);
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
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

  // Filter students based on search term
  const filteredStudents = studentsData.filter(
    (student) =>
      student.studentGivenName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.hostGivenName.toLowerCase().includes(searchTerm.toLowerCase())
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
                Admin User
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
            {/* Driver Selection Section */}
            <div className="mb-6 flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col w-full lg:w-auto">
                <label className="text-gray-700 text-sm font-medium mb-2">
                  Select Driver
                </label>
                <select
                  value={selectedDriver}
                  onChange={handleDriverChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm w-full lg:min-w-[200px]"
                >
                  <option value="">-- Select Driver --</option>
                  <option value="driver1">Driver 1</option>
                  <option value="driver2">Driver 2</option>
                  <option value="driver3">Driver 3</option>
                </select>
              </div>
              <div className="flex flex-col w-full lg:w-auto">
                <label className="text-gray-700 text-sm font-medium mb-2">
                  Select Sub Driver
                </label>
                <select
                  value={selectedSubDriver}
                  onChange={handleSubDriverChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm w-full lg:min-w-[200px]"
                >
                  <option value="">-- Select Sub Driver --</option>
                  <option value="subdriver1">Sub Driver 1</option>
                  <option value="subdriver2">Sub Driver 2</option>
                  <option value="subdriver3">Sub Driver 3</option>
                </select>
              </div>
              <div className="flex flex-col justify-end w-full lg:w-auto">
                <Button
                  onClick={handleAssign}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded font-medium w-full lg:w-auto"
                >
                  Assign
                </Button>
              </div>
            </div>

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
                            <span className="text-xs md:text-sm">Pick</span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">ID</span>
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
                            <span className="text-xs md:text-sm">Flight</span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">D or I</span>
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
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Host Given Name
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Phone Numbers
                            </span>
                            <span className="text-gray-400 text-xs">↑↓</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.length > 0 ? (
                        currentStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-2 md:px-4 py-3 border-b border-gray-200">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.id)}
                                onChange={() =>
                                  handleCheckboxChange(student.id)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                              />
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.id}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.arrivalTime}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.flight}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.dOrI}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.studentNumber}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.studentGivenName}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.hostGivenName}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              <div className="max-w-[150px] truncate">
                                {student.phoneNumbers}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-gray-200">
                          <td
                            colSpan={9}
                            className="text-gray-700 text-center py-8 px-4 border-b border-gray-200 text-sm"
                          >
                            No students found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-700 text-sm order-2 sm:order-1">
                Showing {startIndex + 1} to {Math.min(endIndex, totalEntries)}{" "}
                of {totalEntries} entries
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm disabled:opacity-50"
                >
                  Prev
                </Button>
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber =
                    currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                  if (pageNumber > totalPages) return null;
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                        currentPage === pageNumber
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      ...
                    </span>
                    <Button
                      onClick={() => handlePageChange(totalPages)}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                        currentPage === totalPages
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
              Copyright © 2024. All right reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
