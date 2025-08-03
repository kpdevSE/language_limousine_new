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
import { ThemeProvider } from "./components/theme-provider";
import ModeToggle from "./components/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}
      >
        <ModeToggle />
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/admin/map" element={<Map />} />\
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/printmap" element={<PrintMap />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
