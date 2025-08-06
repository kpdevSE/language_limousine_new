import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import AdminDashboard from "./pages/admin/pages/Dashboard";
import Greeters from "./pages/admin/pages/Users/Greeters";
import Drivers from "./pages/admin/pages/Users/Drivers";
import Schools from "./pages/admin/pages/Users/Schools";
import SubDrivers from "./pages/admin/pages/Users/Subdrivers";
import Add from "./pages/admin/pages/Students/Add";
import Download from "./pages/admin/pages/Students/Download";
import Upload from "./pages/admin/pages/Students/Upload";
import View from "./pages/admin/pages/Students/View";
import Update from "./pages/admin/pages/Students/Update";
import UpdatingWaitingTime from "./pages/admin/pages/UpdatingWaitingTime";
import AssignDrivers from "./pages/admin/pages/AssignDrivers";
import Map from "./pages/admin/pages/Map";
import Profile from "./pages/admin/pages/Profile";
import PrintMap from "./pages/admin/pages/PrintMap";
import AssigenDrivers from "./pages/greeter/pages/AssigenDrivers";
import AbsentFeedback from "./pages/greeter/pages/AbsentFeedback";
import UpdatingWaitingTimeGreeters from "./pages/greeter/pages/UpdatingWaitingTime";
import Dashboard from "./pages/driver/pages/Dashboard";
import DriverProfile from "./pages/driver/pages/Profile";
import SchoolDashboard from "./pages/schools/pages/Dashboard";
import AddStudentsPage from "./pages/schools/pages/AddStudents";
import StudentDetails from "./pages/schools/pages/StudentsDetails";
import StatusPage from "./pages/schools/pages/Status";
import SubDriverDashboard from "./pages/subdriver/pages/Dashboard";
import SubDriverProfile from "./pages/subdriver/pages/Profile";
import AboutUs from "./aboutus/aboutus";
import Privacy from "./privacy/privacy";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Home Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Admin Pages */}
          <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
          {/* Admin Users */}
          <Route path="/admin/admin-users/greeters" element={<Greeters />} />
          <Route path="/admin/admin-users/drivers" element={<Drivers />} />
          <Route path="/admin/admin-users/school" element={<Schools />} />
          <Route
            path="/admin/admin-users/subdrivers"
            element={<SubDrivers />}
          />
          {/* Admin Students */}
          <Route path="/admin/admin-students/add" element={<Add />} />
          <Route path="/admin/admin-students/download" element={<Download />} />
          <Route path="/admin/admin-students/upload" element={<Upload />} />
          <Route path="/admin/admin-students/update" element={<Update />} />
          <Route path="/admin/admin-students/view" element={<View />} />
          <Route
            path="/admin/admin-waitingtime"
            element={<UpdatingWaitingTime />}
          />
          <Route path="/admin/assigndrivers" element={<AssignDrivers />} />
          <Route path="/admin/map" element={<Map />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/printmap" element={<PrintMap />} />
          {/* Greeter Pages */}
          <Route
            path="/greeter/greeter-dashboard"
            element={<AssigenDrivers />}
          />
          <Route path="/greeter/absentfeedback" element={<AbsentFeedback />} />
          <Route
            path="/greeter/updatingwaitingtime"
            element={<UpdatingWaitingTimeGreeters />}
          />
          {/* Driver Pages */}
          <Route path="/driver/driver-dashboard" element={<Dashboard />} />
          <Route path="/driver/driver-profile" element={<DriverProfile />} />
          {/* School Pages */}
          <Route
            path="/school/school-dashboard"
            element={<SchoolDashboard />}
          />
          <Route
            path="/school/school-addstudents"
            element={<AddStudentsPage />}
          />
          <Route
            path="/school/school-studentsdetails"
            element={<StudentDetails />}
          />
          <Route path="/school/school-status" element={<StatusPage />} />
          {/* Sub Driver Pages */}
          <Route
            path="/subdriver/subdriver-dashboard"
            element={<SubDriverDashboard />}
          />
          <Route
            path="/subdriver/subdriver-profile"
            element={<SubDriverProfile />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
