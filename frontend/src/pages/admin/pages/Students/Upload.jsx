import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import {
  User,
  Upload as UploadIcon,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Upload() {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSchoolChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedSchool) {
      alert("Please select a school first");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    console.log(
      "Uploading file:",
      selectedFile.name,
      "for school:",
      selectedSchool
    );
    // Handle upload logic here
    alert("File uploaded successfully!");
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
              Upload Student Data
            </h1>

            {/* Upload Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Form Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* School Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        School Name
                      </Label>
                      <select
                        value={selectedSchool}
                        onChange={handleSchoolChange}
                        className="w-full bg-white text-gray-900 px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                      >
                        <option value="">Select School</option>
                        <option value="school1">
                          Lincoln Elementary School
                        </option>
                        <option value="school2">
                          Washington Middle School
                        </option>
                        <option value="school3">Jefferson High School</option>
                        <option value="school4">Roosevelt Academy</option>
                      </select>
                    </div>

                    {/* File Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Choose Excel File
                      </Label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="file-upload"
                        />
                        <div className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 text-sm h-12 flex items-center justify-between cursor-pointer">
                          <span
                            className={
                              selectedFile ? "text-gray-900" : "text-gray-400"
                            }
                          >
                            {selectedFile
                              ? selectedFile.name
                              : "No file selected"}
                          </span>
                          <div className="flex items-center space-x-2">
                            <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                            <span className="bg-gray-200 px-3 py-1 rounded text-xs text-gray-600">
                              Browse...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload Button */}
                    <div>
                      <Button
                        onClick={handleUpload}
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
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span>Upload</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Instructions Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Student Data
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Select a school and choose an Excel file containing student
                    data to upload.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>Supported file formats: .xlsx, .xls</p>
                    <p>Maximum file size: 10MB</p>
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
