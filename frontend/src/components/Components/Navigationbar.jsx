import React, { useState } from "react";
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

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "#home", isActive: true },
    { name: "About Us", href: "#about", isActive: false },
    { name: "Tracking", href: "#tracking", isActive: false },
    { name: "Privacy & Policy", href: "#privacy", isActive: false },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-600 font-bold text-lg leading-none">
                LANGUAGE
              </span>
              <span className="text-blue-600 font-bold text-lg leading-none">
                LIMOUSINE
              </span>
              <span className="text-gray-500 text-xs">FOR STUDENTS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  item.isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-700 hover:text-orange-500 hover:border-b-2 hover:border-orange-500"
                }`}
              >
                {item.name}
              </a>
            ))}

            {/* Admin Page Button */}

            {/* Dialog Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Log In</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Welcome to Language Limousine</DialogTitle>
                  <DialogDescription>
                    <Link to="/admin/admin-dashboard">
                      <Button variant="default">Admin Page</Button>
                    </Link>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors duration-200"
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
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                item.isActive
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-700 hover:text-orange-500 hover:bg-gray-100"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}

          {/* Dialog Button (Mobile) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Log In</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Welcome to Language Limousine</DialogTitle>
                <DialogDescription>
                  <Link to="/admin/admin-dashboard">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Admin Page
                    </Button>
                  </Link>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
