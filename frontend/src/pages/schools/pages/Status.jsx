import { useState, useEffect } from "react";
import {
  BarChart3,
  User,
  Clock,
  Car,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Loader2,
} from "lucide-react";
import Sidebar from "../components/Siebar";
import { schoolAPI } from "@/lib/api";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StatusPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [studentsData, setStudentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusCounts, setStatusCounts] = useState({
    waiting: 0,
    inCar: 0,
    delivered: 0,
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = studentsData.slice(startIndex, endIndex);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchStudentsStatus();
  }, [currentPage, itemsPerPage, selectedDate, searchTerm]);

  // Default date to today (America/Vancouver) for input YYYY-MM-DD
  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type)?.value || "";
    setSelectedDate(`${get("year")}-${get("month")}-${get("day")}`);
  }, []);

  const fetchStudentsStatus = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      };

      if (selectedDate && selectedDate.trim() !== "") {
        params.date = selectedDate;
      }

      const response = await schoolAPI.getSchoolStudentsStatus(params);

      if (response.data.success) {
        setStudentsData(response.data.data.students);
        setTotalStudents(response.data.data.pagination.totalStudents);
        setTotalPages(response.data.data.pagination.totalPages);
        setStatusCounts(response.data.data.statusCounts);
      }
    } catch (error) {
      console.error("Error fetching students status:", error);
      toast.error("Failed to fetch students status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Car":
        return "bg-blue-100 text-blue-800";
      case "Waiting":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "In Car":
        return <Car className="h-4 w-4" />;
      case "Waiting":
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 min-h-screen w-full bg-white">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
            {/* Mobile Menu Space */}
            <div className="md:hidden w-10" />

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                  Student Status Data
                </h1>
                <p className="text-sm text-gray-500">
                  Monitor student arrival and delivery status
                </p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">School User</p>
                <p className="text-xs text-gray-500">School Administrator</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-auto"
              />
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 border border-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.waiting}
                  </p>
                  <p className="text-sm text-gray-500">Waiting</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.inCar}
                  </p>
                  <p className="text-sm text-gray-500">In Car</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statusCounts.delivered}
                  </p>
                  <p className="text-sm text-gray-500">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Card */}
          <div className="bg-white shadow-lg border border-gray-200 rounded-xl">
            <div className="pb-4 p-6 border-b border-gray-100">
              <h2 className="text-lg text-gray-900 font-semibold">
                Student Status Data
              </h2>
              <p className="text-sm text-gray-500">
                Real-time status tracking for all students
              </p>
            </div>

            <div className="p-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[40px]">
                        Excel Order
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Status
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[100px]">
                        Arrival Time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Pickup Time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Delivery Time
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Student No
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Student Name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Flight
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 border-r border-gray-200 min-w-[120px]">
                        Host Name
                      </th>
                      <th className="text-left p-3 text-xs font-medium text-gray-700 min-w-[120px]">
                        Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <Loader2 className="h-12 w-12 text-gray-300 animate-spin" />
                            <p className="text-lg font-medium">
                              Loading students...
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-8 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <AlertCircle className="h-12 w-12 text-gray-300" />
                            <p className="text-lg font-medium">
                              No students found.
                            </p>
                            <p className="text-sm">
                              Student status data will appear here when students
                              are registered and tracked.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((student, index) => (
                        <tr
                          key={student._id}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.excelOrder || startIndex + index + 1}
                          </td>
                          <td className="p-3 border-r border-gray-200">
                            <Badge className={getStatusColor(student.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(student.status)}
                                {student.status}
                              </div>
                            </Badge>
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.arrivalTime || "N/A"}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.pickupTimeFormatted || "N/A"}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.deliveryTimeFormatted || "N/A"}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.studentNo || "N/A"}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.studentGivenName}{" "}
                            {student.studentFamilyName}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.flight || "N/A"}
                          </td>
                          <td className="p-3 border-r border-gray-200 text-xs text-gray-800">
                            {student.hostGivenName || "N/A"}
                          </td>
                          <td className="p-3 text-xs text-gray-800">
                            {student.address || "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, totalStudents)} of {totalStudents} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="flex items-center px-3 py-1 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <p className="text-center text-sm text-gray-500">
              Copyright © 2024. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
