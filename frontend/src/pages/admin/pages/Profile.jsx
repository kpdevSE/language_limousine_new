import React, { useState, useEffect } from "react";
import { Search, User, Save, RefreshCw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Fetch admin profile data on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setIsLoading(true);
      // Get admin data from sessionStorage or localStorage
      const adminData = JSON.parse(sessionStorage.getItem("user") || "{}");

      if (adminData.username && adminData.email) {
        setFormData((prev) => ({
          ...prev,
          username: adminData.username || "",
          email: adminData.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      toast.error("Failed to fetch admin profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsUpdating(true);

      // Here you would typically make an API call to update the profile
      // For now, we'll simulate the update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update sessionStorage
      const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const updatedUser = {
        ...currentUser,
        username: formData.username,
        email: formData.email,
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        currentPassword: "",
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    fetchAdminProfile();
    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
      currentPassword: "",
    }));
    toast.info("Profile data reset");
  };

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
              <Input
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
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-blue-500">
                Admin Profile Management
              </h1>
              <Button
                onClick={handleReset}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Reset
              </Button>
            </div>

            {/* Profile Form */}
            <Card className="bg-white border-gray-200 mb-8">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <p className="text-sm text-gray-600">
                  Update your profile information and change your password
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter username"
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
                        className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      Change Password
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-gray-700 text-sm font-medium"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-gray-700 text-sm font-medium"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Enter new password"
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-gray-700 text-sm font-medium"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                            placeholder="Confirm new password"
                            minLength={6}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Password Requirements */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 text-sm font-medium">
                          Password Requirements
                        </Label>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div
                            className={`flex items-center gap-2 ${
                              formData.password.length >= 6
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                formData.password.length >= 6
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            At least 6 characters
                          </div>
                          <div
                            className={`flex items-center gap-2 ${
                              formData.password === formData.confirmPassword &&
                              formData.password
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                formData.password ===
                                  formData.confirmPassword && formData.password
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            Passwords match
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading || isUpdating}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-12 py-3 rounded-lg font-medium w-full max-w-md flex items-center justify-center gap-2"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
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
