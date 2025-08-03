import React, { useState } from "react";
import { Search, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Sidebar from "../../components/Sidebar";

export default function Add() {
  const [formData, setFormData] = useState({
    date: "07/24/2025",
    trip: "",
    actualArrivalTime: "",
    arrivalTime: "",
    flight: "",
    dOrI: "",
    mOrF: "",
    studentNo: "",
    studentGivenName: "",
    studentFamilyName: "",
    hostGivenName: "",
    hostFamilyName: "",
    phone: "",
    address: "",
    city: "",
    school: "",
    client: "",
  });

  const [students, setStudents] = useState([
    {
      id: 1,
      date: "2025-07-28",
      trip: "1",
      actualArrivalTime: "03:00:00",
      arrivalTime: "AM 695",
      flight: "I",
      dOrI: "M",
      mOrF: "MXM3353312",
      studentNumber: "Ruben",
      studentGivenName: "B",
    },
    {
      id: 2,
      date: "2025-07-28",
      trip: "2",
      actualArrivalTime: "05:25:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "F",
      mOrF: "202400098",
      studentNumber: "Gabriela",
      studentGivenName: "M",
    },
    {
      id: 3,
      date: "2025-07-28",
      trip: "3",
      actualArrivalTime: "05:25:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "F",
      mOrF: "N/A/UBC/1",
      studentNumber: "Renata",
      studentGivenName: "F",
    },
    {
      id: 4,
      date: "2025-07-28",
      trip: "4",
      actualArrivalTime: "05:25:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "M",
      mOrF: "N/A/UBC/2",
      studentNumber: "Davi",
      studentGivenName: "A",
    },
    {
      id: 5,
      date: "2025-07-28",
      trip: "5",
      actualArrivalTime: "05:25:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "M",
      mOrF: "312110",
      studentNumber: "Guilherme Yui",
      studentGivenName: "T",
    },
    {
      id: 6,
      date: "2025-07-28",
      trip: "6",
      actualArrivalTime: "05:27:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "F",
      mOrF: "311143",
      studentNumber: "Maria Clara",
      studentGivenName: "G",
    },
    {
      id: 7,
      date: "2025-07-28",
      trip: "7",
      actualArrivalTime: "05:27:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "F",
      mOrF: "311144",
      studentNumber: "Lara",
      studentGivenName: "Z",
    },
    {
      id: 8,
      date: "2025-07-28",
      trip: "8",
      actualArrivalTime: "05:27:00",
      arrivalTime: "AM 694",
      flight: "I",
      dOrI: "M",
      mOrF: "308882",
      studentNumber: "LUCCA",
      studentGivenName: "N",
    },
    {
      id: 9,
      date: "2025-07-28",
      trip: "9",
      actualArrivalTime: "05:55:00",
      arrivalTime: "ZG 021",
      flight: "I",
      dOrI: "F",
      mOrF: "JPT3324373",
      studentNumber: "UNGYON",
      studentGivenName: "C",
    },
    {
      id: 10,
      date: "2025-07-28",
      trip: "10",
      actualArrivalTime: "07:40:00",
      arrivalTime: "ZG 022",
      flight: "I",
      dOrI: "M",
      mOrF: "202401108",
      studentNumber: "Kai",
      studentGivenName: "H",
    },
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your submit logic here
  };

  const handleReset = () => {
    setFormData({
      date: "07/24/2025",
      trip: "",
      actualArrivalTime: "",
      arrivalTime: "",
      flight: "",
      dOrI: "",
      mOrF: "",
      studentNo: "",
      studentGivenName: "",
      studentFamilyName: "",
      hostGivenName: "",
      hostFamilyName: "",
      phone: "",
      address: "",
      city: "",
      school: "",
      client: "",
    });
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter(
    (student) =>
      student.trip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.arrivalTime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredStudents.length / parseInt(entriesPerPage)
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + parseInt(entriesPerPage)
  );

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content Area - Adjusted for fixed sidebar */}
      <div className="flex-1 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-white text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
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

        {/* Scrollable Main Content */}
        <div className="p-6 overflow-y-auto bg-gray-50 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Add Student Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Select the Date */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Select the Date
                      </Label>
                      <div className="relative">
                        <Input
                          name="date"
                          type="text"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          placeholder="07/24/2025"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>

                    {/* Trip */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Trip
                      </Label>
                      <Input
                        name="trip"
                        type="text"
                        value={formData.trip}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter trip"
                      />
                    </div>

                    {/* Actual Arrival Time */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Actual Arrival Time
                      </Label>
                      <Input
                        name="actualArrivalTime"
                        type="time"
                        value={formData.actualArrivalTime}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Arrival Time */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Arrival Time
                      </Label>
                      <Input
                        name="arrivalTime"
                        type="time"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Flight */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Flight
                      </Label>
                      <Input
                        name="flight"
                        type="text"
                        value={formData.flight}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter flight"
                      />
                    </div>

                    {/* D or I */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        D or I
                      </Label>
                      <Input
                        name="dOrI"
                        type="text"
                        value={formData.dOrI}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="D or I"
                      />
                    </div>

                    {/* M or F */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        M or F
                      </Label>
                      <Input
                        name="mOrF"
                        type="text"
                        value={formData.mOrF}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="M or F"
                      />
                    </div>

                    {/* Student No */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Student No
                      </Label>
                      <Input
                        name="studentNo"
                        type="text"
                        value={formData.studentNo}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter student number"
                      />
                    </div>
                  </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Student Given Name */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Student Given Name
                      </Label>
                      <Input
                        name="studentGivenName"
                        type="text"
                        value={formData.studentGivenName}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter given name"
                      />
                    </div>

                    {/* Student Family Name */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Student Family Name
                      </Label>
                      <Input
                        name="studentFamilyName"
                        type="text"
                        value={formData.studentFamilyName}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter family name"
                      />
                    </div>

                    {/* Host Given Name */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Host Given Name
                      </Label>
                      <Input
                        name="hostGivenName"
                        type="text"
                        value={formData.hostGivenName}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter host given name"
                      />
                    </div>

                    {/* Host Family Name */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Host Family Name
                      </Label>
                      <Input
                        name="hostFamilyName"
                        type="text"
                        value={formData.hostFamilyName}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter host family name"
                      />
                    </div>
                  </div>

                  {/* Fourth Row */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Phone */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter phone"
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter address"
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        City
                      </Label>
                      <Input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter city"
                      />
                    </div>

                    {/* School */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        School
                      </Label>
                      <Input
                        name="school"
                        type="text"
                        value={formData.school}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter school"
                      />
                    </div>

                    {/* Client */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 text-sm font-medium">
                        client
                      </Label>
                      <Select
                        value={formData.client}
                        onValueChange={(value) =>
                          handleSelectChange("client", value)
                        }
                      >
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select Client" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem
                            value="client1"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Client 1
                          </SelectItem>
                          <SelectItem
                            value="client2"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Client 2
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
              {/* Table Controls */}
              <CardHeader className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 text-sm">Show</span>
                    <Select
                      value={entriesPerPage}
                      onValueChange={setEntriesPerPage}
                    >
                      <SelectTrigger className="w-20 bg-white text-gray-900 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem
                          value="10"
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          10
                        </SelectItem>
                        <SelectItem
                          value="25"
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          25
                        </SelectItem>
                        <SelectItem
                          value="50"
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          50
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-gray-900 text-sm">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-gray-900 text-sm">Search:</Label>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white text-gray-900 border-gray-300 text-sm w-48"
                      placeholder="Search students..."
                    />
                  </div>
                </div>
              </CardHeader>

              {/* Table */}
              <CardContent className="p-0 overflow-x-auto">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Action
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Date
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Trip
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Actual arrival time
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Arrival Time
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          Flight
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          D or I
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          M or F
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          student number
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          student given name
                        </th>
                        <th className="text-gray-900 font-medium text-left px-3 py-2 border-b border-gray-200 text-xs">
                          s
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.length === 0 ? (
                        <tr className="border-gray-200">
                          <td
                            colSpan={11}
                            className="text-gray-900 text-center py-8 px-4 border-b border-gray-200"
                          >
                            No students found.
                          </td>
                        </tr>
                      ) : (
                        paginatedStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-3 py-2 border-b border-gray-200">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(student.id)}
                                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                              >
                                Delete
                              </Button>
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.date}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.trip}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.actualArrivalTime}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.arrivalTime}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.flight}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.dOrI}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.mOrF}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.studentNumber}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs">
                              {student.studentGivenName}
                            </td>
                            <td className="text-gray-900 px-3 py-2 border-b border-gray-200 text-xs"></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center text-gray-900 text-sm">
              <span>
                Showing {startIndex + 1} to{" "}
                {Math.min(
                  startIndex + parseInt(entriesPerPage),
                  filteredStudents.length
                )}{" "}
                of {filteredStudents.length} entries
              </span>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </Button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      page === currentPage
                        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                        : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                    }
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                >
                  ...
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                >
                  11
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-white text-gray-900 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
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
