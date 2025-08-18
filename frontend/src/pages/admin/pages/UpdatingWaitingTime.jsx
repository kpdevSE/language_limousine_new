import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  User,
  Clock,
  Save,
  Info,
  Timer,
  Search,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "react-toastify";

export default function UpdatingWaitingTime() {
  const [waitingTimes, setWaitingTimes] = useState({});
  const [pickupTimes, setPickupTimes] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateInputValue, setDateInputValue] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Admin token retrieval
  const getAuthToken = () => {
    return (
      sessionStorage.getItem("admin_token") ||
      localStorage.getItem("admin_token") ||
      localStorage.getItem("authToken")
    );
  };

  // Axios client
  const apiClient = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "Content-Type": "application/json" },
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
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

  // Default date -> today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    setSelectedDate(formattedDate);
    setDateInputValue(today.toISOString().split("T")[0]);
  }, []);

  // Fetch data on filters
  useEffect(() => {
    if (selectedDate) fetchWaitingTimeData();
  }, [selectedDate, currentPage, searchTerm]);

  const fetchWaitingTimeData = async () => {
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

      const response = await apiClient.get("/waiting-time", {
        params: {
          date: selectedDate,
          page: currentPage,
          limit: 10,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setStudentsData(response.data.data.waitingTimes);
        setTotalStudents(response.data.data.pagination.totalWaitingTimes);
        setTotalPages(response.data.data.pagination.totalPages);

        const initialWaiting = {};
        const initialPickup = {};
        response.data.data.waitingTimes.forEach((student) => {
          initialWaiting[student._id] = student.waitingTime || 0;
          initialPickup[student._id] = student.pickupTime || null;
        });
        setWaitingTimes(initialWaiting);
        setPickupTimes(initialPickup);
      }
    } catch (err) {
      console.error("Error fetching waiting time data:", err);
      let errorMessage = "Failed to fetch waiting time data";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaitingTimeChange = (studentId, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 120) {
      setWaitingTimes((prev) => ({ ...prev, [studentId]: numValue }));
    }
  };

  const handlePickupTimeUpdate = async (studentId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Access token required. Please log in again.");
        return;
      }

      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setPickupTimes((prev) => ({ ...prev, [studentId]: currentTime }));

      await apiClient.post("/waiting-time", {
        studentId,
        date: selectedDate,
        waitingTime: waitingTimes[studentId] || 0,
        pickupTime: currentTime,
        status: "picked_up",
      });

      toast.success("Pickup time updated successfully!");
      await fetchWaitingTimeData();
    } catch (err) {
      console.error("Error updating pickup time:", err);
      let errorMessage = "Failed to update pickup time. Please try again.";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      toast.error(errorMessage);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Access token required. Please log in again.");
        toast.error("Access token required. Please log in again.");
        return;
      }

      const changedWaiting = {};
      const changedPickup = {};
      studentsData.forEach((student) => {
        const currentWaiting = waitingTimes[student._id] || 0;
        const originalWaiting = student.waitingTime || 0;
        if (currentWaiting !== originalWaiting)
          changedWaiting[student._id] = currentWaiting;

        const currentPickup = pickupTimes[student._id];
        const originalPickup = student.pickupTime;
        if (currentPickup !== originalPickup)
          changedPickup[student._id] = currentPickup;
      });

      if (
        !Object.keys(changedWaiting).length &&
        !Object.keys(changedPickup).length
      ) {
        setSuccess("No changes to save");
        return;
      }

      const updatePromises = [];
      Object.entries(changedWaiting).forEach(([studentId, waitingTime]) => {
        updatePromises.push(
          apiClient.post("/waiting-time", {
            studentId,
            date: selectedDate,
            waitingTime,
            pickupTime: pickupTimes[studentId] || null,
          })
        );
      });

      Object.entries(changedPickup).forEach(([studentId, pickupTime]) => {
        if (!changedWaiting[studentId]) {
          updatePromises.push(
            apiClient.post("/waiting-time", {
              studentId,
              date: selectedDate,
              waitingTime: waitingTimes[studentId] || 0,
              pickupTime,
            })
          );
        }
      });

      await Promise.all(updatePromises);

      const totalChanges =
        Object.keys(changedWaiting).length + Object.keys(changedPickup).length;
      const successMessage = `Successfully updated ${totalChanges} item(s)!`;
      setSuccess(successMessage);
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });
      await fetchWaitingTimeData();
    } catch (err) {
      console.error("Error saving waiting times:", err);
      let errorMessage = "Failed to save waiting times. Please try again.";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    const inputDate = e.target.value; // YYYY-MM-DD
    setDateInputValue(inputDate);
    const [year, month, day] = inputDate.split("-");
    const formattedDate = `${month}/${day}/${year}`;
    setSelectedDate(formattedDate);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, totalStudents);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "picked_up":
        return "bg-blue-100 text-blue-800";
      case "waiting":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "picked_up":
        return "Picked Up";
      case "waiting":
      default:
        return "Waiting";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
            <div className="md:hidden w-10" />

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Update Waiting Time
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage student waiting times
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Admin</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="date" className="text-sm font-medium">
                  Select Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateChange}
                  className="w-40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-48"
                />
              </div>
              <Badge variant="secondary">{totalStudents} Students</Badge>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Error/Success */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong> Adjust waiting times (0-120
              minutes) for each student and mark pickup times. Click "Mark
              Picked Up" to record when a student is picked up. Once marked, the
              button will be disabled and show "Picked Up".
            </AlertDescription>
          </Alert>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" /> Student Waiting Times
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
                    students...
                  </div>
                ) : studentsData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead className="w-32">Waiting Time</TableHead>
                        <TableHead className="w-24">Status</TableHead>
                        <TableHead className="w-24">Flight</TableHead>
                        <TableHead className="w-32">Arrival Time</TableHead>
                        <TableHead className="w-32">Student Number</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsData.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">
                            {student._id.slice(-6)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="120"
                                value={waitingTimes[student._id] || 0}
                                onChange={(e) =>
                                  handleWaitingTimeChange(
                                    student._id,
                                    e.target.value
                                  )
                                }
                                className="w-20 text-center"
                                placeholder="0"
                                disabled={isSaving}
                              />
                              <span className="text-xs text-muted-foreground">
                                min
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(student.status)}>
                              {getStatusDisplay(student.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {student.flight}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.arrivalTime}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.studentNo}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.studentGivenName}{" "}
                            {student.studentFamilyName}
                          </TableCell>
                          <TableCell>
                            {pickupTimes[student._id] ? (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  {pickupTimes[student._id]}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs"
                                  disabled
                                >
                                  Picked Up
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handlePickupTimeUpdate(student._id)
                                }
                                className="h-6 px-2 text-xs"
                                disabled={isSaving}
                              >
                                Mark Picked Up
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <Timer className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No students found for {selectedDate}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                      No student schedules found for the selected date. Please
                      check the date or contact support.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
                  students...
                </CardContent>
              </Card>
            ) : studentsData.length > 0 ? (
              studentsData.map((student) => (
                <Card key={student._id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {student.flight}
                        </Badge>
                        <Badge className={getStatusColor(student.status)}>
                          {getStatusDisplay(student.status)}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ID: {student._id.slice(-6)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="font-medium">
                        {student.studentGivenName} {student.studentFamilyName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Student No: {student.studentNo}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Arrival: {student.arrivalTime}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Waiting Time
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="120"
                          value={waitingTimes[student._id] || 0}
                          onChange={(e) =>
                            handleWaitingTimeChange(student._id, e.target.value)
                          }
                          className="w-24 text-center"
                          placeholder="0"
                          disabled={isSaving}
                        />
                        <span className="text-sm text-muted-foreground">
                          minutes
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Actions</Label>
                      <div className="flex items-center gap-2">
                        {pickupTimes[student._id] ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              {pickupTimes[student._id]}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              disabled
                            >
                              Picked Up
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePickupTimeUpdate(student._id)}
                            className="h-6 px-2 text-xs"
                            disabled={isSaving}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Timer className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No students found for {selectedDate}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    No student schedules found for the selected date.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
        </main>

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
