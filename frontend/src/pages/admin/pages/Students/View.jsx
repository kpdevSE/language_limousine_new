import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import { Search, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function View() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Sample student data - replace with your actual data source
  const sampleStudents = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "Present",
      time: "09:00 AM",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "Present",
      time: "09:15 AM",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      status: "Absent",
      time: "-",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "Present",
      time: "08:45 AM",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      status: "Late",
      time: "09:30 AM",
    },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewStudents = () => {
    if (selectedDate) {
      console.log("Viewing students for date:", selectedDate);
      // Here you would typically fetch students for the selected date
      setStudents(sampleStudents);
      setShowTable(true);
    } else {
      alert("Please select a date first");
    }
  };

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-100";
      case "Absent":
        return "text-red-600 bg-red-100";
      case "Late":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
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
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              View Students
            </h1>

            {/* Search and Date Selection Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Form Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* Search Students */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Search Students
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full bg-white text-gray-900 pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Select Date
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10 w-full h-12 text-sm"
                          placeholder="mm/dd/yyyy"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                      </div>
                    </div>

                    {/* View Students Button */}
                    <div>
                      <Button
                        onClick={handleViewStudents}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12"
                      >
                        View Students
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            {showTable && selectedDate ? (
              <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
                {/* Table Header */}
                <CardHeader className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Students for{" "}
                        {new Date(selectedDate).toLocaleDateString()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {filteredStudents.length} student
                        {filteredStudents.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Table */}
                <CardContent className="p-0 overflow-x-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            #
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Student Name
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Email
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Status
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Check-in Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student, index) => (
                            <tr
                              key={student.id}
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {index + 1}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.name}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.email}
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                    student.status
                                  )}`}
                                >
                                  {student.status}
                                </span>
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.time}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-gray-200">
                            <td
                              colSpan={5}
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
            ) : (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a date to view students
                    </h3>
                    <p className="text-gray-500">
                      Choose a date from the date picker above and click "View
                      Students" to see the attendance data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
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
