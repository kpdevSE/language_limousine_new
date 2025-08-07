import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import AdminLogin from "./AdminLogin";

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", isActive: false },
    { name: "About Us", href: "/aboutus", isActive: false },
    { name: "Tracking", href: "#tracking", isActive: false },
    { name: "Privacy & Policy", href: "/privacy", isActive: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg leading-none tracking-wide">
                LANGUAGE
              </span>
              <span className="text-white font-bold text-lg leading-none tracking-wide">
                LIMOUSINE
              </span>
              <span className="text-cyan-400 text-xs font-medium tracking-wider">
                FOR STUDENTS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative group ${
                  item.isActive
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-cyan-400"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transform transition-transform duration-300 ${
                    item.isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </a>
            ))}

            {/* Admin Login Link */}
            <Link to="/admin/login">
              <Button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium border-0 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                Admin Login
              </Button>
            </Link>

            {/* Dialog Button */}
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium border-0 shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105">
                  Log In
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border border-cyan-500/30 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Welcome to Language Limousine
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Choose your dashboard to access your account
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-6">
                  <AdminLogin />
                  <Link to="/greeter/greeter-dashboard">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105">
                      Greeter Page
                    </Button>
                  </Link>
                  <Link to="/driver/driver-dashboard">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105">
                      Driver Page
                    </Button>
                  </Link>
                  <Link to="/school/school-dashboard">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105">
                      School Page
                    </Button>
                  </Link>
                  <Link to="/subdriver/subdriver-dashboard">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 text-white font-medium py-3 transition-all duration-300 transform hover:scale-105">
                      Sub Driver Page
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog> */}
            <AdminLogin />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-cyan-400 hover:bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-3 bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/20">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                item.isActive
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                  : "text-gray-300 hover:text-cyan-400 hover:bg-slate-800/50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}

          {/* Admin Login Link (Mobile) */}
          <Link to="/admin/login">
            <Button
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium border-0 shadow-lg transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Admin Login
            </Button>
          </Link>

          {/* Dialog Button (Mobile) */}
          <div className="pt-4 border-t border-slate-700/50">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium border-0 shadow-lg transition-all duration-300">
                  Log In
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border border-cyan-500/30 text-white max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Welcome to Language Limousine
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">
                    Choose your dashboard to access your account
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 mt-4">
                  <Link to="/admin/admin-dashboard">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white font-medium py-3 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Page
                    </Button>
                  </Link>
                  <Link to="/greeter/greeter-dashboard">
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 text-white font-medium py-3 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Greeter Page
                    </Button>
                  </Link>
                  <Link to="/driver/driver-dashboard">
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 text-white font-medium py-3 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Driver Page
                    </Button>
                  </Link>
                  <Link to="/school/school-dashboard">
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0 text-white font-medium py-3 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      School Page
                    </Button>
                  </Link>
                  <Link to="/subdriver/subdriver-dashboard">
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 text-white font-medium py-3 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Sub Driver Page
                    </Button>
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
