import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  LogIn,
  UserPlus,
  Shield,
  Loader2,
} from "lucide-react";

// API Configuration
const API_BASE_URL = "http://localhost:5000/api/auth";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token Management
const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";

const tokenManager = {
  setToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },
  getToken: () => {
    return sessionStorage.getItem(TOKEN_KEY);
  },
  removeToken: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
  setUser: (user) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => {
    const user = sessionStorage.getItem(USER_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
  },
};

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data for login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Form data for registration
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    role: "Admin",
  });

  // Check if user is already logged in
  useEffect(() => {
    const token = tokenManager.getToken();
    const user = tokenManager.getUser();

    if (token && user && user.role === "Admin") {
      navigate("/admin/admin-dashboard");
    }
  }, [navigate]);

  // Handle login form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Handle register form input changes
  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/login", loginData);

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token and user data
        tokenManager.setToken(token);
        tokenManager.setUser(user);

        setSuccess("Login successful! Redirecting to dashboard...");

        // Redirect to admin dashboard after 1 second
        setTimeout(() => {
          navigate("/admin/admin-dashboard");
        }, 1000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/register", registerData);

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Store token and user data
        tokenManager.setToken(token);
        tokenManager.setUser(user);

        setSuccess("Registration successful! Redirecting to dashboard...");

        // Redirect to admin dashboard after 1 second
        setTimeout(() => {
          navigate("/admin/admin-dashboard");
        }, 1000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Switch between login and register
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  // Reset forms
  const resetForms = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({
      username: "",
      email: "",
      password: "",
      gender: "",
      role: "Admin",
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? "Admin Login" : "Admin Registration"}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {isLogin
              ? "Sign in to your admin account"
              : "Create a new admin account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success Alert */}
          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    disabled={isLoading}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username" className="text-white">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="register-username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    value={registerData.username}
                    onChange={handleRegisterInputChange}
                    disabled={isLoading}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-white">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterInputChange}
                    disabled={isLoading}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={registerData.password}
                    onChange={handleRegisterInputChange}
                    disabled={isLoading}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-gender" className="text-white">
                  Gender
                </Label>
                <select
                  id="register-gender"
                  name="gender"
                  value={registerData.gender}
                  onChange={handleRegisterInputChange}
                  disabled={isLoading}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="" disabled className="bg-slate-800">
                    Select gender
                  </option>
                  <option value="Male" className="bg-slate-800">
                    Male
                  </option>
                  <option value="Female" className="bg-slate-800">
                    Female
                  </option>
                  <option value="Other" className="bg-slate-800">
                    Other
                  </option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </div>
                )}
              </Button>
            </form>
          )}

          {/* Toggle between login and register */}
          <div className="text-center pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleMode}
              disabled={isLoading}
              className="text-gray-300 hover:text-white"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>

          {/* Demo credentials */}
          {isLogin && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-xs font-medium mb-2">
                Demo Admin Credentials:
              </p>
              <p className="text-yellow-300 text-xs">
                Email: admin@example.com
              </p>
              <p className="text-yellow-300 text-xs">Password: password123</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
