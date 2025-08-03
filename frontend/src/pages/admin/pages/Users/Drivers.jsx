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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Sidebar from "../../components/Sidebar";

export default function Drivers() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    driverId: "",
    vehicleNo: "",
    status: "",
    role: "Driver",
  });

  const [drivers] = useState([
    // Empty array since screenshot shows "No Driver users found."
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
      driverId: "",
      vehicleNo: "",
      status: "",
      role: "Driver",
    });
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden  md:ml-64 min-h-screen w-full ">
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
              Add Driver User
            </h1>

            {/* Add Driver Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        placeholder="Enter username"
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
                        placeholder="Enter password"
                      />
                    </div>

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
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Driver ID */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="driverId"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Driver ID
                      </Label>
                      <Input
                        id="driverId"
                        name="driverId"
                        type="text"
                        value={formData.driverId}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter driver ID"
                      />
                    </div>

                    {/* Vehicle No */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="vehicleNo"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Vehicle No
                      </Label>
                      <Input
                        id="vehicleNo"
                        name="vehicleNo"
                        type="text"
                        value={formData.vehicleNo}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter vehicle number"
                      />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem
                            value="active"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Active
                          </SelectItem>
                          <SelectItem
                            value="inactive"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Inactive
                          </SelectItem>
                          <SelectItem
                            value="onduty"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            On Duty
                          </SelectItem>
                          <SelectItem
                            value="offduty"
                            className="text-gray-900 hover:bg-gray-100"
                          >
                            Off Duty
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                </form>
              </CardContent>
            </Card>

            {/* Drivers Table */}
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
                      placeholder="Search drivers..."
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
                        Username
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Email
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Gender
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Driver ID
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Vehicle No
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
                    {drivers.length === 0 ? (
                      <TableRow className="border-gray-200">
                        <TableCell
                          colSpan={8}
                          className="text-gray-700 text-center py-8"
                        >
                          No Driver users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      drivers.map((driver, index) => (
                        <TableRow
                          key={driver.id}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <TableCell className="text-gray-700">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.username}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.email}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.gender}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.driverId}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.vehicleNo}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {driver.status}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
