import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Car,
  Users,
  UserCheck,
  LogOut,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { userAPI, studentAPI, assignmentAPI } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: { total: 0, active: 0, inactive: 0 },
    drivers: { total: 0, active: 0, inactive: 0 },
    subdrivers: { total: 0, active: 0, inactive: 0 },
    greeters: { total: 0, active: 0, inactive: 0 },
    schools: { total: 0, active: 0, inactive: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    database: "operational",
    api: "operational",
    frontend: "operational",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    role: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch user statistics
      const userStatsResponse = await userAPI.getUserStats();
      const userStatsData = userStatsResponse.data.data;

      // Fetch student count
      const studentsResponse = await studentAPI.getAllStudents({ limit: 1 });
      const totalStudents = studentsResponse.data.total || 0;

      // Fetch recent assignments
      const assignmentsResponse = await assignmentAPI.getAssignments({
        limit: 5,
      });
      const recentAssignments = assignmentsResponse.data.assignments || [];

      // Update stats
      setStats({
        students: { total: totalStudents, active: totalStudents, inactive: 0 },
        drivers: userStatsData.stats?.Driver || {
          total: 0,
          active: 0,
          inactive: 0,
        },
        subdrivers: userStatsData.stats?.Subdriver || {
          total: 0,
          active: 0,
          inactive: 0,
        },
        greeters: userStatsData.stats?.Greeter || {
          total: 0,
          active: 0,
          inactive: 0,
        },
        schools: userStatsData.stats?.School || {
          total: 0,
          active: 0,
          inactive: 0,
        },
      });

      // Update recent activity
      const activity = recentAssignments.map((assignment) => ({
        id: assignment._id,
        type: "assignment",
        message: `Student ${
          assignment.student?.name || "Unknown"
        } assigned to ${assignment.driver?.username || "Unknown"}`,
        timestamp: new Date(assignment.createdAt),
        status: assignment.status,
      }));
      setRecentActivity(activity);

      // Check system status
      try {
        await fetch("http://localhost:5000/api/health");
        setSystemStatus((prev) => ({ ...prev, api: "operational" }));
      } catch (err) {
        setSystemStatus((prev) => ({ ...prev, api: "error" }));
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    window.location.href = "/";
  };

  const handleRegisterInput = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    if (registerError) setRegisterError("");
    if (registerSuccess) setRegisterSuccess("");
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const token = sessionStorage.getItem("admin_token");
      if (!token) throw new Error("Admin token not found. Please login again.");
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setRegisterSuccess("User registered successfully!");
      setRegisterData({
        username: "",
        email: "",
        password: "",
        gender: "",
        role: "",
      });
      // Refresh dashboard data after successful registration
      fetchDashboardData();
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const statsCards = [
    {
      id: 1,
      title: "Total Schools",
      value: stats.schools.total.toString(),
      icon: User,
      bgColor: "bg-emerald-500",
      trend: "+5%",
      trendUp: true,
    },
    {
      id: 2,
      title: "Total Drivers",
      value: stats.drivers.total.toString(),
      icon: Car,
      bgColor: "bg-blue-500",
      trend: "+2%",
      trendUp: true,
    },
    {
      id: 3,
      title: "Total Subdrivers",
      value: stats.subdrivers.total.toString(),
      icon: Users,
      bgColor: "bg-purple-500",
      trend: "+1%",
      trendUp: true,
    },
    {
      id: 4,
      title: "Total Greeters",
      value: stats.greeters.total.toString(),
      icon: UserCheck,
      bgColor: "bg-orange-500",
      trend: "0%",
      trendUp: false,
    },
  ];

  const getStatusIcon = (status) => {
    return status === "operational" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status) => {
    return status === "operational" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="md:hidden w-12"></div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 text-sm"
              />
            </div>

            {/* Admin User + Refresh + Logout */}
            <div className="flex items-center space-x-3 ml-6">
              <span className="hidden sm:block text-black font-medium">
                Admin User
              </span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>

              {/* Refresh Button */}
              <Button
                onClick={fetchDashboardData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Last Updated Info */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {statsCards.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`${stat.bgColor} text-white rounded-2xl p-4 md:p-6 shadow-lg relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium mb-1">
                          {stat.title}
                        </p>
                        <p className="text-2xl md:text-4xl font-bold">
                          {loading ? "..." : stat.value}
                        </p>
                        <div className="flex items-center mt-2">
                          <TrendingUp
                            className={`h-3 w-3 mr-1 ${
                              stat.trendUp ? "text-green-300" : "text-gray-300"
                            }`}
                          />
                          <span className="text-xs text-white/80">
                            {stat.trend}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/20 rounded-full p-2 md:p-3">
                        <IconComponent className="h-5 w-5 md:h-7 md:w-7" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h2>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            activity.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No recent activity to display.
                  </p>
                )}
              </div>

              {/* System Status */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                  System Status
                </h2>
                <div className="space-y-4">
                  {Object.entries(systemStatus).map(([service, status]) => (
                    <div
                      key={service}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status)}
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {service}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${getStatusColor(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Quick Stats
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Users:</span>
                      <span className="font-medium">
                        {stats.drivers.active +
                          stats.subdrivers.active +
                          stats.greeters.active}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Schools:</span>
                      <span className="font-medium">{stats.schools.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending Tasks:</span>
                      <span className="font-medium text-orange-600">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Dashboard Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
                Dashboard Overview
              </h2>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                Welcome to the Admin Dashboard. Here you can monitor and manage
                all aspects of your transportation system in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4">
                  <h3 className="font-medium mb-2">Today's Assignments</h3>
                  <p className="text-2xl font-bold">{recentActivity.length}</p>
                  <p className="text-blue-100 text-sm">Active routes</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4">
                  <h3 className="font-medium mb-2">Completed Today</h3>
                  <p className="text-2xl font-bold">
                    {
                      recentActivity.filter((a) => a.status === "completed")
                        .length
                    }
                  </p>
                  <p className="text-green-100 text-sm">
                    Successful deliveries
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4">
                  <h3 className="font-medium mb-2">System Health</h3>
                  <p className="text-2xl font-bold">
                    {
                      Object.values(systemStatus).filter(
                        (s) => s === "operational"
                      ).length
                    }
                    /{Object.keys(systemStatus).length}
                  </p>
                  <p className="text-purple-100 text-sm">
                    Services operational
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4">
                  <h3 className="font-medium mb-2">Response Time</h3>
                  <p className="text-2xl font-bold">~2s</p>
                  <p className="text-orange-100 text-sm">
                    Average API response
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-4 mt-6 md:mt-8">
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
