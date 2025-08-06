import React, { useState } from "react";
import { Search, User, Trash2, AlertCircle } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

export default function Greeters() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    greeterID: "",
    role: "Greeter",
  });

  const [greeters, setGreeters] = useState([
    {
      id: 1,
      username: "peshan",
      email: "peshanyasas.98@gmail.com",
      gender: "Male",
      greeterID: "G1",
      status: "offduty",
    },
  ]);

  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock token - in real app, get from localStorage/context
  const [authToken] = useState("your-auth-token-here");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
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
    if (!formData.gender) {
      setError("Gender is required");
      return false;
    }
    if (!formData.greeterID.trim()) {
      setError("Greeter ID is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccess("Greeter registered successfully!");
        toast.success("Message", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const newGreeter = {
          id: Date.now(),
          username: formData.username,
          email: formData.email,
          gender: formData.gender,
          greeterID: formData.greeterID,
          status: "Active",
        };
        setGreeters((prev) => [...prev, newGreeter]);
        handleReset();
      } else {
        setError(data.message || "Registration failed");
        toast.error("Message", {
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

      // Handle axios error responses
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed");
      } else if (err.request) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      gender: "",
      greeterID: "",
      role: "Greeter",
    });
    setError("");
    setSuccess("");
  };

  const handleDelete = async (greeterId) => {
    if (!window.confirm("Are you sure you want to delete this greeter?")) {
      return;
    }

    try {
      // Mock delete - replace with actual API call
      setGreeters((prev) => prev.filter((g) => g.id !== greeterId));
      setSuccess("Greeter deleted successfully!");
    } catch (err) {
      setError("Failed to delete greeter");
    }
  };

  // Filter greeters based on search term
  const filteredGreeters = greeters.filter(
    (greeter) =>
      greeter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      greeter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      greeter.greeterID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-gray-50 text-gray-800 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3 ml-6">
              <span className="text-gray-800 font-medium">Admin User</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              Add Greeter User
            </h1>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <span className="text-green-700">{success}</span>
              </div>
            )}

            {/* Add Greeter Form */}
            <div className="bg-white border border-gray-200 rounded-lg mb-8">
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                      <label
                        htmlFor="username"
                        className="text-gray-700 text-sm font-medium block"
                      >
                        Username *
                      </label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter username"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-gray-700 text-sm font-medium block"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter email"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-gray-700 text-sm font-medium block"
                      >
                        Password *
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter password"
                        minLength={6}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm font-medium block">
                        Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleSelectChange("gender", e.target.value)
                        }
                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Greeter ID */}
                    <div className="space-y-2">
                      <label
                        htmlFor="greeterID"
                        className="text-gray-700 text-sm font-medium block"
                      >
                        Greeter ID *
                      </label>
                      <input
                        id="greeterID"
                        name="greeterID"
                        type="text"
                        value={formData.greeterID}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter greeter ID"
                        required
                      />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label
                        htmlFor="role"
                        className="text-gray-700 text-sm font-medium block"
                      >
                        Role
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        value={formData.role}
                        className="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-3 py-2"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-center space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Greeters Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Controls */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 text-sm">Show</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span className="text-gray-700 text-sm">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-gray-700 text-sm">Search:</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white text-gray-800 border border-gray-300 rounded px-3 py-1 text-sm w-48"
                      placeholder="Search greeters..."
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        #
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Username
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Email
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Gender
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Greeter ID
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Status
                      </th>
                      <th className="text-left text-gray-700 font-medium px-6 py-3 border-b border-gray-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGreeters.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center text-gray-500 py-8 px-6"
                        >
                          No greeters found
                        </td>
                      </tr>
                    ) : (
                      filteredGreeters
                        .slice(0, parseInt(entriesPerPage))
                        .map((greeter, index) => (
                          <tr
                            key={greeter.id}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="text-gray-800 px-6 py-4">
                              {index + 1}
                            </td>
                            <td className="text-gray-800 px-6 py-4">
                              {greeter.username}
                            </td>
                            <td className="text-gray-800 px-6 py-4">
                              {greeter.email}
                            </td>
                            <td className="text-gray-800 px-6 py-4">
                              {greeter.gender}
                            </td>
                            <td className="text-gray-800 px-6 py-4">
                              {greeter.greeterID}
                            </td>
                            <td className="text-gray-800 px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                  greeter.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {greeter.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDelete(greeter.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm inline-flex items-center transition-colors"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
