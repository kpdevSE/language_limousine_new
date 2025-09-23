import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Trash2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
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
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "react-toastify";

export default function Schools() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    schoolID: "",
    role: "School",
  });

  const [schools, setSchools] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSchools, setIsFetchingSchools] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Get auth token from sessionStorage (matching your sidebar logout function)
  const getAuthToken = () => {
    return (
      sessionStorage.getItem("admin_token") || localStorage.getItem("authToken")
    );
  };

  // Configure axios defaults
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

  // Fetch schools on component mount and when search/pagination changes
  useEffect(() => {
    fetchSchools();
  }, [currentPage, searchTerm, entriesPerPage]);

  const fetchSchools = async () => {
    setIsFetchingSchools(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        window.location.href = "/admin/login";
        return;
      }

      const response = await apiClient.get("/users/role/School", {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setSchools(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
        setTotalUsers(response.data.data.pagination.totalUsers);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);
      let errorMessage = "Failed to fetch schools";

      if (err.response?.status === 401) {
        errorMessage = "Access token required. Please log in again.";
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsFetchingSchools(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSelectChange = () => {};

  const validateForm = () => {
    // Reset previous errors
    setError("");

    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.schoolID.trim()) {
      setError("School ID is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Access token required. Please log in again.");
      toast.error("Access token required. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.post("/users", formData);

      const data = response.data;

      if (data.success) {
        const successMessage =
          data.message || "School registered successfully!";
        setSuccess(successMessage);
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            borderRadius: "10px",
            background: "#4BB543",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "15px",
          },
          icon: "✅",
        });

        // Refresh the schools list
        await fetchSchools();
        handleReset();
      } else {
        const errorMessage = data.message || "Registration failed";
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "An unexpected error occurred. Please try again.";

      // Handle axios error responses
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Access token required. Please log in again.";
          // Redirect to login on unauthorized
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else if (err.response.data) {
          errorMessage = err.response.data.message || "Registration failed";

          // Handle validation errors
          if (
            err.response.data.errors &&
            Array.isArray(err.response.data.errors)
          ) {
            errorMessage = err.response.data.errors
              .map((error) => error.msg)
              .join(", ");
          }
        }
      } else if (err.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      schoolID: "",
      role: "School",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (schoolId) => {
    if (!window.confirm("Are you sure you want to delete this school?")) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        window.location.href = "/admin/login";
        return;
      }

      const response = await apiClient.delete(`/users/${schoolId}`);

      if (response.data.success) {
        const successMessage = "School deleted successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);

        // Refresh the schools list
        await fetchSchools();
      }
    } catch (err) {
      console.error("Delete error:", err);
      let errorMessage = "Failed to delete school";

      if (err.response?.status === 401) {
        errorMessage = "Access token required. Please log in again.";
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEntriesPerPageChange = (value) => {
    setEntriesPerPage(value);
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              Add School User
            </h1>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Add School Form */}
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
                        Username *
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter username"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter email"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 text-sm font-medium"
                      >
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          placeholder="Enter password"
                          disabled={isLoading}
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* School ID */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="schoolID"
                        className="text-gray-700 text-sm font-medium"
                      >
                        School ID *
                      </Label>
                      <Input
                        id="schoolID"
                        name="schoolID"
                        type="text"
                        value={formData.schoolID}
                        onChange={handleInputChange}
                        className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter school ID"
                        disabled={isLoading}
                        required
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
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
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
                      onValueChange={handleEntriesPerPageChange}
                      disabled={isFetchingSchools}
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
                    <span className="text-gray-500 text-sm ml-4">
                      (Total: {totalUsers} schools)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-gray-700 text-sm">Search:</Label>
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="bg-white text-gray-900 border-gray-300 text-sm w-48"
                      placeholder="Search schools..."
                      disabled={isFetchingSchools}
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
                        School ID
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
                    {isFetchingSchools ? (
                      <TableRow className="border-gray-200">
                        <TableCell
                          colSpan={7}
                          className="text-gray-700 text-center py-8"
                        >
                          Loading schools...
                        </TableCell>
                      </TableRow>
                    ) : schools.length === 0 ? (
                      <TableRow className="border-gray-200">
                        <TableCell
                          colSpan={7}
                          className="text-gray-700 text-center py-8"
                        >
                          No School users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      schools.map((school, index) => (
                        <TableRow
                          key={school._id}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <TableCell className="text-gray-700">
                            {(currentPage - 1) * parseInt(entriesPerPage) +
                              index +
                              1}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {school.username}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {school.email}
                          </TableCell>

                          <TableCell className="text-gray-700">
                            {school.schoolID}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                school.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {school.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(school._id)}
                              className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                              disabled={isFetchingSchools}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isFetchingSchools}
                        variant="outline"
                        size="sm"
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage === totalPages || isFetchingSchools
                        }
                        variant="outline"
                        size="sm"
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
