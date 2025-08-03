import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Clock,
  UserPlus,
  Printer,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  Upload,
  RotateCcw,
  Download,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import ModeToggle from "@/components/mode-toggle";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState();
  const [expandedSections, setExpandedSections] = useState({
    users: false,
    students: false, // Changed from true to false
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // Always expanded on mobile when open
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Set active item based on current path
  useEffect(() => {
    const currentPath = location.pathname;

    // Check main menu items
    const mainItem = menuItems.find((item) => item.path === currentPath);
    if (mainItem) {
      setActiveItem(mainItem.id);
      return;
    }

    // Check submenu items
    for (const item of menuItems) {
      if (item.children) {
        const childItem = item.children.find(
          (child) => child.path === currentPath
        );
        if (childItem) {
          setActiveItem(childItem.id);
          // Auto-expand parent section when child is active
          setExpandedSections((prev) => ({
            ...prev,
            [item.id]: true,
          }));
          return;
        }
      }
    }

    // Check bottom menu items
    const bottomItem = bottomMenuItems.find(
      (item) => item.path === currentPath
    );
    if (bottomItem) {
      setActiveItem(bottomItem.id);
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
      if (!isCollapsed) {
        setExpandedSections({
          users: false,
          students: false,
        });
      }
    }
  };

  const toggleSection = (section) => {
    if (!isCollapsed || isMobile) {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  const handleNavigation = (itemId, path) => {
    setActiveItem(itemId);

    if (itemId === "logout") {
      // Note: localStorage usage removed for Claude.ai compatibility
      // localStorage.removeItem("authToken");
      // localStorage.removeItem("userData");

      navigate("/login");
      return;
    }

    try {
      navigate(path);
      console.log(`Successfully navigated to: ${path}`);
      // Close mobile menu after navigation
      if (isMobile) {
        setIsMobileOpen(false);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      console.log(`Failed to navigate to: ${path}`);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      path: "/admin/admin-dashboard",
    },
    {
      id: "users",
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      path: "/admin/admin-users",
      expandable: true,
      expanded: expandedSections.users,
      children: [
        {
          label: "Greeters",
          icon: <ChevronRight className="w-3 h-3" />,
          path: "/admin/admin-users/greeters",
          id: "greeters",
        },
        {
          label: "Drivers",
          icon: <ChevronRight className="w-3 h-3" />,
          path: "/admin/admin-users/drivers",
          id: "drivers",
        },
        {
          label: "School",
          icon: <ChevronRight className="w-3 h-3" />,
          path: "/admin/admin-users/school",
          id: "school",
        },
        {
          label: "Sub Drivers",
          icon: <ChevronRight className="w-3 h-3" />,
          path: "/admin/admin-users/subdrivers",
          id: "sub-drivers",
        },
      ],
    },
    {
      id: "students",
      label: "Students",
      icon: <GraduationCap className="w-4 h-4" />,
      path: "/students",
      expandable: true,
      expanded: expandedSections.students,
      children: [
        {
          label: "Add",
          icon: <Plus className="w-3 h-3" />,
          path: "/admin/admin-students/add",
          id: "students-add",
        },
        {
          label: "View",
          icon: <Eye className="w-3 h-3" />,
          path: "/admin/admin-students/view",
          id: "students-view",
        },
        {
          label: "Upload",
          icon: <Upload className="w-3 h-3" />,
          path: "/admin/admin-students/upload",
          id: "students-upload",
        },
        {
          label: "Update",
          icon: <RotateCcw className="w-3 h-3" />,
          path: "/admin/admin-students/update",
          id: "students-update",
        },
        {
          label: "Download",
          icon: <Download className="w-3 h-3" />,
          path: "/admin/admin-students/download",
          id: "students-download",
        },
      ],
    },
    {
      id: "waiting-time",
      label: "Update Waiting Time",
      icon: <Clock className="w-4 h-4" />,
      path: "/admin/admin-waitingtime",
    },
    {
      id: "assign-drivers",
      label: "Assign Drivers",
      icon: <UserPlus className="w-4 h-4" />,
      path: "/admin/assigndrivers",
    },
    {
      id: "print",
      label: "Print",
      icon: <Printer className="w-4 h-4" />,
      path: "/admin/printmap",
    },
    {
      id: "map",
      label: "Map",
      icon: <MapPin className="w-4 h-4" />,
      path: "/admin/map",
    },
  ];

  const bottomMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-4 h-4" />,
      path: "/admin/profile",
    },
    {
      id: "logout",
      label: "Logout",
      icon: <LogOut className="w-4 h-4" />,
      path: "/logout",
    },
  ];

  const SidebarButton = ({ item, children, onClick, className = "" }) => {
    const shouldShowTooltip = !isMobile && isCollapsed;
    const isActive = activeItem === item.id;

    return (
      <div className="group relative">
        <button
          className={`w-full flex items-center ${
            !isMobile && isCollapsed
              ? "justify-center px-2"
              : "justify-between px-3"
          } py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          } ${className}`}
          onClick={onClick}
        >
          <div
            className={`flex items-center ${
              !isMobile && isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className={isActive ? "text-white" : ""}>{item.icon}</div>
            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
          </div>
          {children}
        </button>

        {/* Tooltip for collapsed state on desktop */}
        {shouldShowTooltip && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out z-40 ${
          isMobile
            ? `fixed left-0 top-0 w-64 transform ${
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `fixed left-0 top-0 ${isCollapsed ? "w-16" : "w-64"}`
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${
                !isMobile && isCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="transition-opacity duration-200">
                  <h1 className="font-semibold text-blue-500">Language</h1>
                  <h2 className="font-semibold text-blue-500">Limousine</h2>
                </div>
              )}
            </div>
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight
                  className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                    isCollapsed ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation - Scrollable */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <div key={item.id} className="space-y-1">
                <SidebarButton
                  item={item}
                  onClick={() => {
                    if (item.expandable) {
                      toggleSection(item.id);
                    } else {
                      handleNavigation(item.id, item.path);
                    }
                  }}
                >
                  {item.expandable && (!isCollapsed || isMobile) && (
                    <div className="transition-transform duration-200 ease-in-out">
                      {item.expanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  )}
                </SidebarButton>

                {/* Submenu */}
                {item.expandable && (!isCollapsed || isMobile) && (
                  <div
                    className={`ml-6 overflow-hidden transition-all duration-300 ease-in-out ${
                      item.expanded
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-1 pt-1">
                      {item.children.map((child, index) => {
                        const isChildActive = activeItem === child.id;
                        return (
                          <div key={child.id} className="group relative">
                            <button
                              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                                isChildActive
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                              style={{
                                transitionDelay: item.expanded
                                  ? `${index * 50}ms`
                                  : "0ms",
                              }}
                              onClick={() =>
                                handleNavigation(child.id, child.path)
                              }
                            >
                              <div
                                className={isChildActive ? "text-white" : ""}
                              >
                                {child.icon}
                              </div>
                              <span>{child.label}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 mx-3 flex-shrink-0"></div>

        {/* Bottom Navigation */}
        <div className="p-3 space-y-1 flex-shrink-0">
          {bottomMenuItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              onClick={() => handleNavigation(item.id, item.path)}
            />
          ))}
        </div>

        {/* Footer */}
        {(!isCollapsed || isMobile) && (
          <>
            <div className="border-t border-gray-200 mx-3 flex-shrink-0"></div>
            <div className="p-4 transition-opacity duration-200 flex-shrink-0">
              <p className="text-xs text-gray-500 text-center">
                Copyright © 2024. All rights reserved.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
