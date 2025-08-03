import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Search, User, Calendar, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PrintMap() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedSubDriver, setSelectedSubDriver] = useState("");

  // Sample driver data - replace with your actual data source
  const drivers = [
    { id: 1, name: "Driver 1" },
    { id: 2, name: "Driver 2" },
    { id: 3, name: "Driver 3" },
  ];

  const subDrivers = [
    { id: 1, name: "Sub-Driver 1" },
    { id: 2, name: "Sub-Driver 2" },
    { id: 3, name: "Sub-Driver 3" },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDriverChange = (e) => {
    setSelectedDriver(e.target.value);
  };

  const handleSubDriverChange = (e) => {
    setSelectedSubDriver(e.target.value);
  };

  const handlePrint = (type) => {
    console.log(`Printing ${type} data for:`, {
      date: selectedDate,
      driver: selectedDriver,
      subDriver: selectedSubDriver,
    });
    // Add your print logic here
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
              Print Student Data
            </h1>

            {/* Driver Selection Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* First Row - Driver Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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

                    {/* Driver Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Select Driver
                      </Label>
                      <select
                        value={selectedDriver}
                        onChange={handleDriverChange}
                        className="bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full h-12 text-sm rounded-lg px-3"
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.name}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Print Button */}
                    <div>
                      <Button
                        onClick={() => handlePrint("driver")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12 flex items-center justify-center space-x-2"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sub-Driver Selection Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Second Row - Sub-Driver Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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

                    {/* Sub-Driver Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Select Sub Driver
                      </Label>
                      <select
                        value={selectedSubDriver}
                        onChange={handleSubDriverChange}
                        className="bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full h-12 text-sm rounded-lg px-3"
                      >
                        <option value="">Select Sub-Driver</option>
                        {subDrivers.map((subDriver) => (
                          <option key={subDriver.id} value={subDriver.name}>
                            {subDriver.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Print Button */}
                    <div>
                      <Button
                        onClick={() => handlePrint("subdriver")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12 flex items-center justify-center space-x-2"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty State Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Printer className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to Print Student Data
                  </h3>
                  <p className="text-gray-500">
                    Select a date and driver/sub-driver from the forms above,
                    then click the Print button to generate the report.
                  </p>
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
