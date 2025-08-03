import React, { useState } from "react";
import { Search, User, Calendar, Edit } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Sidebar from "../../components/Sidebar";

export default function Update() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Sample student data
  const [students] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      grade: "Grade 10",
      school: "Central High School",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      grade: "Grade 11",
      school: "North High School",
      startDate: "2024-01-20",
      endDate: "2024-06-20",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      grade: "Grade 9",
      school: "East High School",
      startDate: "2024-01-10",
      endDate: "2024-06-10",
      status: "Inactive",
    },
  ]);

  const [updateForm, setUpdateForm] = useState({
    name: "",
    email: "",
    grade: "",
    school: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleDateFilter = () => {
    if (selectedDate) {
      // Filter students based on selected date
      const filtered = students.filter((student) => {
        const startDate = new Date(student.startDate);
        const endDate = new Date(student.endDate);
        const filterDate = new Date(selectedDate);
        return filterDate >= startDate && filterDate <= endDate;
      });
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  };

  const handleUpdateClick = (student) => {
    setSelectedStudent(student);
    setUpdateForm({
      name: student.name,
      email: student.email,
      grade: student.grade,
      school: student.school,
      startDate: student.startDate,
      endDate: student.endDate,
      status: student.status,
    });
    setIsDialogOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    console.log("Updating student:", selectedStudent.id, updateForm);
    // Add your update logic here
    setIsDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter students based on search term
  const displayedStudents = filteredStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-gray-50 text-gray-800 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3 ml-6">
              <span className="text-gray-800 font-medium">Admin User</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              Update Student Dates
            </h1>

            {/* Date Filter Section */}
            <Card className="bg-white border-gray-200 mb-8">
              <CardContent className="p-6">
                <div className="flex items-end space-x-4">
                  <div className="space-y-2 flex-1 max-w-md">
                    <Label
                      htmlFor="date"
                      className="text-gray-700 text-sm font-medium"
                    >
                      Select Date
                    </Label>
                    <div className="relative">
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        placeholder="mm / dd / yyyy"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    </div>
                  </div>
                  <Button
                    onClick={handleDateFilter}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Filter Students
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            {filteredStudents.length > 0 && (
              <Card className="bg-white border-gray-200 overflow-hidden">
                {/* Table Controls */}
                <CardHeader className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 text-sm">Show</span>
                      <Select
                        value={entriesPerPage}
                        onValueChange={setEntriesPerPage}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-gray-700 text-sm">entries</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label className="text-gray-700 text-sm">Search:</Label>
                      <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white text-gray-800 border-gray-300 text-sm w-48"
                        placeholder="Search students..."
                      />
                    </div>
                  </div>
                </CardHeader>

                {/* Table */}
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="text-gray-700 font-medium">
                          #
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Name
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Email
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Grade
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          School
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Start Date
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          End Date
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-gray-700 font-medium">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedStudents.map((student, index) => (
                        <TableRow
                          key={student.id}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <TableCell className="text-gray-800">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.email}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.grade}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.school}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.startDate}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            {student.endDate}
                          </TableCell>
                          <TableCell className="text-gray-800">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                student.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Dialog
                              open={
                                isDialogOpen &&
                                selectedStudent?.id === student.id
                              }
                              onOpenChange={(open) => {
                                if (!open) setIsDialogOpen(false);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                                  onClick={() => handleUpdateClick(student)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px] bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-blue-500 text-xl">
                                    Update Student Details
                                  </DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={handleUpdateSubmit}
                                  className="space-y-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Start Date */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="update-start-date"
                                        className="text-gray-700 text-sm font-medium"
                                      >
                                        Start Date
                                      </Label>
                                      <Input
                                        id="update-start-date"
                                        name="startDate"
                                        type="date"
                                        value={updateForm.startDate}
                                        onChange={handleInputChange}
                                        className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>

                                    {/* End Date */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="update-end-date"
                                        className="text-gray-700 text-sm font-medium"
                                      >
                                        End Date
                                      </Label>
                                      <Input
                                        id="update-end-date"
                                        name="endDate"
                                        type="date"
                                        value={updateForm.endDate}
                                        onChange={handleInputChange}
                                        className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>

                                  {/* Dialog Buttons */}
                                  <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setIsDialogOpen(false)}
                                      className="px-6 py-2"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                                    >
                                      Update Student
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {displayedStudents.length === 0 &&
                    filteredStudents.length > 0 && (
                      <div className="p-8 text-center text-gray-500">
                        No students found matching your search criteria.
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* No Results Message */}
            {selectedDate && filteredStudents.length === 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">
                    No students found for the selected date: {selectedDate}
                  </p>
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
