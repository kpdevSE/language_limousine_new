import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { assignmentAPI } from "@/lib/api";
import axios from "axios";
import { toast } from "react-toastify";

export default function AssignDrivers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedSubDriver, setSelectedSubDriver] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [studentsData, setStudentsData] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [subdrivers, setSubdrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notes, setNotes] = useState("");

  // Get auth token from sessionStorage (matching your sidebar logout function)
  const getAuthToken = () => {
    return (
      sessionStorage.getItem("admin_token") || localStorage.getItem("authToken")
    );
  };

  // Configure axios defaults
  const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
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

  // Add response interceptor to handle auth errors
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        setError("Access token required. Please log in again.");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      }
      return Promise.reject(error);
    }
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [currentPage, entriesPerPage, searchTerm]);

  const fetchData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
        return;
      }

      // Fetch unassigned students
      const studentsResponse = await apiClient.get(
        "/assignments/unassigned-students",
        {
          params: {
            page: currentPage,
            limit: entriesPerPage,
            search: searchTerm,
          },
        }
      );

      if (studentsResponse.data.success) {
        setStudentsData(studentsResponse.data.data.students);
        setTotalStudents(studentsResponse.data.data.pagination.totalStudents);
        setTotalPages(studentsResponse.data.data.pagination.totalPages);
      }

      // Fetch drivers and subdrivers
      const driversResponse = await apiClient.get("/assignments/drivers");
      if (driversResponse.data.success) {
        setDrivers(driversResponse.data.data.drivers);
        setSubdrivers(driversResponse.data.data.subdrivers);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      let errorMessage = "Failed to fetch data";

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
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDriverChange = (e) => {
    setSelectedDriver(e.target.value);
    if (e.target.value) {
      setSelectedSubDriver(""); // Clear subdriver when driver is selected
    }
    // Clear messages when selection changes
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubDriverChange = (e) => {
    setSelectedSubDriver(e.target.value);
    if (e.target.value) {
      setSelectedDriver(""); // Clear driver when subdriver is selected
    }
    // Clear messages when selection changes
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
    // Clear messages when selection changes
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      const allStudentIds = studentsData.map((student) => student._id);
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const validateAssignment = () => {
    setError("");
    setSuccess("");

    if (selectedStudents.length === 0) {
      setError("Please select at least one student");
      return false;
    }

    if (!selectedDriver && !selectedSubDriver) {
      setError("Please select either a driver or subdriver");
      return false;
    }

    if (selectedDriver && selectedSubDriver) {
      setError("Please select either a driver OR subdriver, not both");
      return false;
    }

    return true;
  };

  const handleAssign = async () => {
    if (!validateAssignment()) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError("Access token required. Please log in again.");
      toast.error("Access token required. Please log in again.");
      return;
    }

    setIsAssigning(true);
    setError("");
    setSuccess("");

    try {
      const assignmentData = {
        studentIds: selectedStudents,
        driverId: selectedDriver || null,
        subdriverId: selectedSubDriver || null,
        notes: notes.trim(),
      };

      const response = await apiClient.post("/assignments", assignmentData);

      if (response.data.success) {
        const successMessage =
          response.data.message ||
          `Successfully assigned ${selectedStudents.length} student(s)!`;
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

        // Clear selections and refresh data
        setSelectedStudents([]);
        setSelectedDriver("");
        setSelectedSubDriver("");
        setNotes("");

        // Refresh the list to remove assigned students
        await fetchData();
      }
    } catch (err) {
      console.error("Error assigning students:", err);
      let errorMessage = "Failed to assign students. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Access token required. Please log in again.";
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
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
      setIsAssigning(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Calculate pagination info
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalStudents);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden ml-0 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 font-medium text-sm md:text-base">
                Admin User
              </span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6 overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              Assign Students to Drivers
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

            {/* Driver Selection Section */}
            <Card className="bg-white border-gray-200 mb-6 shadow-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium mb-2">
                      Select Driver
                    </label>
                    <select
                      value={selectedDriver}
                      onChange={handleDriverChange}
                      className="bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading || isAssigning}
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.username} ({driver.driverID}) -{" "}
                          {driver.vehicleNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium mb-2">
                      Select Sub Driver
                    </label>
                    <select
                      value={selectedSubDriver}
                      onChange={handleSubDriverChange}
                      className="bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading || isAssigning}
                    >
                      <option value="">-- Select Sub Driver --</option>
                      {subdrivers.map((subdriver) => (
                        <option key={subdriver._id} value={subdriver._id}>
                          {subdriver.username} ({subdriver.subdriverID}) -{" "}
                          {subdriver.vehicleNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-medium mb-2">
                      Notes (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Add assignment notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading || isAssigning}
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <Button
                      onClick={handleAssign}
                      disabled={
                        isAssigning ||
                        isLoading ||
                        selectedStudents.length === 0
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAssigning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        `Assign ${
                          selectedStudents.length > 0
                            ? `(${selectedStudents.length})`
                            : ""
                        }`
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Control Section */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 text-sm">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesPerPageChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm"
                  disabled={isLoading}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-900 text-sm">entries</span>
                <span className="text-gray-500 text-sm ml-4">
                  (Total: {totalStudents} unassigned students)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 text-sm">Search:</span>
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-1 text-sm w-full sm:w-48"
                  placeholder="Search students..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Students Table */}
            <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              onChange={handleSelectAllStudents}
                              checked={
                                studentsData.length > 0 &&
                                selectedStudents.length === studentsData.length
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
                              disabled={isLoading || studentsData.length === 0}
                            />
                            <span className="text-xs md:text-sm">
                              Select All
                            </span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">ID</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Arrival Time
                            </span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">Flight</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">D or I</span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Student Number
                            </span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Student Given Name
                            </span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Host Given Name
                            </span>
                          </div>
                        </th>
                        <th className="text-gray-700 font-medium text-left px-2 md:px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm">
                              Phone Numbers
                            </span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr className="border-gray-200">
                          <td
                            colSpan={9}
                            className="text-gray-700 text-center py-8 px-4 border-b border-gray-200 text-sm"
                          >
                            <div className="flex items-center justify-center">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading students...
                            </div>
                          </td>
                        </tr>
                      ) : studentsData.length > 0 ? (
                        studentsData.map((student) => (
                          <tr
                            key={student._id}
                            className="border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-2 md:px-4 py-3 border-b border-gray-200">
                              <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() =>
                                  handleCheckboxChange(student._id)
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                disabled={isAssigning}
                              />
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student._id}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.arrivalTime}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.flight}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.dOrI}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.studentNo}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.studentGivenName}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              {student.hostGivenName}
                            </td>
                            <td className="text-gray-700 px-2 md:px-4 py-3 border-b border-gray-200 text-xs md:text-sm">
                              <div className="max-w-[150px] truncate">
                                {student.phone}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-gray-200">
                          <td
                            colSpan={9}
                            className="text-gray-700 text-center py-8 px-4 border-b border-gray-200 text-sm"
                          >
                            {totalStudents === 0
                              ? "No unassigned students found."
                              : "No students found matching your search criteria."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-gray-700 text-sm order-2 sm:order-1">
                  Showing {startIndex + 1} to {endIndex} of {totalStudents}{" "}
                  entries
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm disabled:opacity-50"
                  >
                    Prev
                  </Button>
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const pageNumber =
                      currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                    if (pageNumber > totalPages || pageNumber < 1) return null;
                    return (
                      <Button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        disabled={isLoading}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        ...
                      </span>
                      <Button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={isLoading}
                        className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm ${
                          currentPage === totalPages
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
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
