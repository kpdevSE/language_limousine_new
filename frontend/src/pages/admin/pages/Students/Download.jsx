import { useState } from "react";
import { Search, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "../../components/Sidebar";

export default function Download() {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDownload = () => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    console.log("Downloading data for date:", selectedDate);
    // Handle download logic here
    alert("Download started successfully!");
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
              Download Student Data
            </h1>

            {/* Download Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Form Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
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

                    {/* Download Button */}
                    <div>
                      <Button
                        onClick={handleDownload}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12 flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Instructions Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Download Student Data
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Select a date to download the student attendance data for
                    that specific day.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Download format: Excel (.xlsx)</p>
                    <p>
                      File includes: Student names, attendance status, and
                      timestamps
                    </p>
                  </div>
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
