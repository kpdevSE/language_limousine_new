import { useState } from "react";
import { Search, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Sidebar from "../components/Sidebar";

export default function UpdatingWaitingTime() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState("07:46:06");

  // Sample student data matching the screenshot
  const studentsData = [
    {
      id: 1,
      studentNumber: "MXM3353312",
      studentGivenName: "Ruben",
      arrivalTime: "03:00:00",
      flight: "AM 695",
      waiting: true,
    },
    {
      id: 2,
      studentNumber: "202400098",
      studentGivenName: "Gabriela",
      arrivalTime: "05:25:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 3,
      studentNumber: "N/A/UBC/1",
      studentGivenName: "Renata",
      arrivalTime: "05:25:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 4,
      studentNumber: "N/A/UBC/2",
      studentGivenName: "Davi",
      arrivalTime: "05:25:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 5,
      studentNumber: "312110",
      studentGivenName: "Guilherme Yuji",
      arrivalTime: "05:25:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 6,
      studentNumber: "311143",
      studentGivenName: "Maria Clara",
      arrivalTime: "05:27:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 7,
      studentNumber: "311144",
      studentGivenName: "Lara",
      arrivalTime: "05:27:00",
      flight: "AM 694",
      waiting: true,
    },
    {
      id: 8,
      studentNumber: "308882",
      studentGivenName: "LUCCA",
      arrivalTime: "05:27:00",
      flight: "AM 694",
      waiting: true,
    },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter students based on search term
  const filteredStudents = studentsData.filter(
    (student) =>
      student.studentGivenName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
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
            <div className="flex items-center space-x-3 ml-6">
              <span className="text-gray-900 font-medium">Admin User</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Control Section */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 text-sm">Show</span>
                <select className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-gray-900 text-sm">entries</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 text-sm">Search:</span>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm w-48"
                />
              </div>
            </div>

            {/* Students Table */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
              <CardContent className="p-0 overflow-x-auto">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            Waiting
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            Student Number
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            Student Given Name
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            ID
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            Arrival Time
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            Flight
                            <span className="text-gray-400">↑↓</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <tr
                            key={student.id}
                            className="border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 border-b border-gray-200">
                              {index === 0 ? (
                                <div className="flex flex-col space-y-2">
                                  <div className="bg-blue-500 text-white px-3 py-2 rounded text-center text-sm font-medium">
                                    {currentTime}
                                  </div>
                                  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                                    Time
                                  </Button>
                                </div>
                              ) : (
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                                  Time
                                </Button>
                              )}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {student.studentNumber}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {student.studentGivenName}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {student.id}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {student.arrivalTime}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {student.flight}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-gray-200">
                          <td
                            colSpan={6}
                            className="text-gray-700 text-center py-8 px-4 border-b border-gray-200"
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
