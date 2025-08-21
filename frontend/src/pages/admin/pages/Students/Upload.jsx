import React, { useState } from "react";
import {
  User,
  Upload as UploadIcon,
  FileSpreadsheet,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "react-toastify";

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState("07/24/2025");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get auth token from sessionStorage or localStorage
  const getAuthToken = () => {
    const adminToken = sessionStorage.getItem("admin_token");
    const authToken = localStorage.getItem("authToken");
    const adminTokenLocal = localStorage.getItem("admin_token");

    console.log("Available tokens:", {
      sessionStorage_admin_token: adminToken ? "present" : "missing",
      localStorage_authToken: authToken ? "present" : "missing",
      localStorage_admin_token: adminTokenLocal ? "present" : "missing",
    });

    const token = adminToken || authToken || adminTokenLocal;

    if (token) {
      console.log("Using token:", token.substring(0, 20) + "...");
    } else {
      console.log("No token found!");
    }

    return token;
  };

  // Configure axios client
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include auth token
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/octet-stream",
      ];

      const isValidType =
        allowedTypes.includes(file.type) ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls");

      if (!isValidType) {
        setError("Please select a valid Excel file (.xlsx or .xls)");
        setSelectedFile(null);
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large. Maximum size is 10MB.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    setIsUploading(true);
    setError("");
    setSuccess("");
    setUploadResult(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
        return;
      }

      const formData = new FormData();
      formData.append("excelFile", selectedFile);
      formData.append("date", date);

      console.log("Upload request details:", {
        file: selectedFile.name,
        fileSize: selectedFile.size,
        date,
        token: token ? "present" : "missing",
      });

      const response = await axios.post(
        `${API_BASE_URL}/excel-upload/students`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const result = response.data.data;
        setUploadResult(result);
        setSuccess(response.data.message);

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Reset form
        setSelectedFile(null);
        const fileInput = document.getElementById("file-upload");
        if (fileInput) fileInput.value = "";
      } else {
        setError(response.data.message || "Upload failed");
        toast.error(response.data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Access token required. Please log in again.";
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
        } else if (err.response.data) {
          errorMessage = err.response.data.message || "Upload failed";
          console.error("Server error message:", err.response.data.message);
        }
      } else if (err.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        return;
      }

      const response = await apiClient.get("/excel-upload/template");

      if (response.data.success) {
        const template = response.data.data;

        // Create CSV content
        const headers = template.headers.join(",");
        const sampleRow = Object.values(template.sampleData[0]).join(",");
        const csvContent = `${headers}\n${sampleRow}`;

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "student_upload_template.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(
          "Template downloaded successfully! School and Client will be automatically extracted from the Excel file."
        );
      }
    } catch (err) {
      console.error("Download template error:", err);
      setError("Failed to download template");
      toast.error("Failed to download template");
    }
  };

  const clearResults = () => {
    setUploadResult(null);
    setError("");
    setSuccess("");
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
        <div className="p-6 overflow-x-hidden bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-blue-500">
                Upload Student Data
              </h1>
              <Button
                onClick={downloadTemplate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </Button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                  <Button
                    onClick={() => setError("")}
                    className="text-red-500 hover:text-red-700"
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700">{success}</span>
                  </div>
                  <Button
                    onClick={() => setSuccess("")}
                    className="text-green-500 hover:text-green-700"
                    variant="ghost"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardHeader className="pb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upload Excel File
                </h2>
                <p className="text-sm text-gray-600">
                  Select an Excel file containing student data. School and
                  Client will be automatically extracted from the file.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Info Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-800">
                          Automatic Data Extraction
                        </h3>
                        <p className="text-sm text-blue-700 mt-1">
                          School and Client information will be automatically
                          extracted from your Excel file. Make sure your Excel
                          file contains "School" and "Client" columns with the
                          appropriate values.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Date *
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-white text-gray-900 px-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                    </div>

                    {/* File Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Excel File *
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
                  </div>

                  {/* Upload Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || !selectedFile || !date}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center space-x-2"
                    >
                      <UploadIcon className="h-4 w-4" />
                      <span>
                        {isUploading ? "Uploading..." : "Upload Students"}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Results */}
            {uploadResult && (
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Upload Results
                    </h2>
                    <Button
                      onClick={clearResults}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {uploadResult.totalProcessed}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Processed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {uploadResult.created}
                      </div>
                      <div className="text-sm text-gray-600">
                        Successfully Created
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {uploadResult.errorsCount ?? uploadResult.errors}
                      </div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>

                  {/* Created Students */}
                  {uploadResult.createdStudents &&
                    uploadResult.createdStudents.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">
                          Created Students
                        </h3>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                          {uploadResult.createdStudents.map(
                            (student, index) => (
                              <div
                                key={index}
                                className="text-sm text-green-700 mb-1"
                              >
                                Row {student.row}: {student.studentGivenName}{" "}
                                {student.studentFamilyName} ({student.studentNo}
                                )
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Errors */}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div>
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Errors
                      </h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                        {uploadResult.errors.map((error, index) => (
                          <div
                            key={index}
                            className="text-sm text-red-700 mb-1"
                          >
                            Row {error.row}: {error.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Upload Instructions Card */}
            <Card className="bg-white border-gray-200 shadow-sm mt-8">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileSpreadsheet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Excel Upload Instructions
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Download the template and fill in your student data, then
                    upload the Excel file.
                  </p>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>• Supported file formats: .xlsx, .xls</p>
                    <p>• Maximum file size: 10MB</p>
                    <p>
                      • Student numbers will be auto-generated if not provided
                    </p>
                    <p>• All required fields must be filled</p>
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
