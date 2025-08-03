import React, { useState } from "react";
import { Search, User, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Sidebar from "../../components/Sidebar";

export default function Schools() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    schoolId: "",
    role: "School",
  });

  const [schools, setSchools] = useState([
    {
      id: 1,
      username: "UBC",
      email: "ubc@gmail.com",
      gender: "Male",
      schoolId: "UBC",
    },
    {
      id: 2,
      username: "ISBS",
      email: "isbs@gmail.com",
      gender: "Male",
      schoolId: "ISBS",
    },
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submit logic here
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      gender: "",
      schoolId: "",
      role: "School",
    });
  };

  const handleDelete = (id) => {
    setSchools(schools.filter((school) => school.id !== id));
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.schoolId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden  md:ml-64 min-h-screen w-full">
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
              Add School
            </h1>

            {/* Add School Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Language.admin@gmail.com"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter email"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Gender
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          handleSelectChange("gender", value)
                        }
                      >
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem
                            value="Male"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Male
                          </SelectItem>
                          <SelectItem
                            value="Female"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Female
                          </SelectItem>
                          <SelectItem
                            value="Other"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* School ID */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="schoolId"
                        className="text-gray-700 text-sm font-medium"
                      >
                        School ID
                      </Label>
                      <Input
                        id="schoolId"
                        name="schoolId"
                        type="text"
                        value={formData.schoolId}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter school ID"
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="role"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Role
                      </Label>
                      <Input
                        id="role"
                        name="role"
                        type="text"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="bg-gray-100 text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schools Table */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
              {/* Table Controls */}
              <CardHeader className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-sm">Show</span>
                    <Select
                      value={entriesPerPage}
                      onValueChange={setEntriesPerPage}
                    >
                      <SelectTrigger className="w-20 bg-white text-gray-900 border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
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
                    <span className="text-gray-700 text-sm">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-gray-700 text-sm">Search:</Label>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white text-gray-900 border-gray-300 text-sm w-48"
                      placeholder="Search schools..."
                    />
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
                          Username
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                          Email
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                          Gender
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                          School ID
                        </th>
                        <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchools.length === 0 ? (
                        <tr className="border-gray-200">
                          <td
                            colSpan={6}
                            className="text-gray-700 text-center py-8 px-4 border-b border-gray-200"
                          >
                            No School users found.
                          </td>
                        </tr>
                      ) : (
                        filteredSchools.map((school, index) => (
                          <tr
                            key={school.id}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {index + 1}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {school.username}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {school.email}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {school.gender}
                            </td>
                            <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                              {school.schoolId}
                            </td>
                            <td className="px-4 py-3 border-b border-gray-200">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(school.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination Info */}
            <div className="mt-4 flex justify-between items-center text-gray-700 text-sm">
              <span>
                Showing 1 to {filteredSchools.length} of {schools.length}{" "}
                entries
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  disabled
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  disabled
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
