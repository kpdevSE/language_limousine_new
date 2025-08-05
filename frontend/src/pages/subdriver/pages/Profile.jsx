import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SubDriverProfile() {
  const [formData, setFormData] = useState({
    username: "kpdevsubdriver",
    email: "kpdevsubdriver@gmail.com",
    driverId: "SB1",
    vehicleNo: "kl-5089",
    password: "••••••••••••",
    status: "Off Duty",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    console.log("Profile updated:", formData);
  };

  const handleReset = () => {
    // Reset form to original values
    setFormData({
      username: "kpdevsubdriver",
      email: "kpdevsubdriver@gmail.com",
      driverId: "SB1",
      vehicleNo: "kl-5089",
      password: "••••••••••••",
      status: "Off Duty",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden ml-0 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Edit Profile
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 lg:p-12 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Profile Form Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <form className="space-y-6 md:space-y-8">
                  {/* Row 1: Username and Email */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Username
                      </label>
                      <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 text-sm md:text-base font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Driver ID and Password */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Driver ID
                      </label>
                      <Input
                        type="text"
                        name="driverId"
                        value={formData.driverId}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 pr-12 text-sm md:text-base font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Vehicle No and Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Vehicle No
                      </label>
                      <Input
                        type="text"
                        name="vehicleNo"
                        value={formData.vehicleNo}
                        onChange={handleInputChange}
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-gray-700 text-sm md:text-base font-medium">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="Off Duty">Off Duty</option>
                          <option value="On Duty">On Duty</option>
                          <option value="Available">Available</option>
                          <option value="Busy">Busy</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 md:pt-8">
                    <Button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 md:py-4 rounded-lg text-sm md:text-base transition-colors duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      Update Profile
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold px-8 py-3 md:py-4 rounded-lg text-sm md:text-base transition-colors duration-200 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
