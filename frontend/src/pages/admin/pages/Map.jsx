import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { Search, User, Calendar, MapPin, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Map() {
  const [studentNumber, setStudentNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Sample student data with locations
  const sampleStudents = [
    {
      id: 1,
      studentNumber: "STU001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St, New York, NY",
      status: "Present",
      time: "09:00 AM",
      location: {
        lat: 40.7128,
        lng: -74.006,
        address: "123 Main St, New York, NY",
      },
    },
    {
      id: 2,
      studentNumber: "STU002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      address: "456 Oak Ave, Brooklyn, NY",
      status: "Present",
      time: "09:15 AM",
      location: {
        lat: 40.6782,
        lng: -73.9442,
        address: "456 Oak Ave, Brooklyn, NY",
      },
    },
    {
      id: 3,
      studentNumber: "STU003",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567892",
      address: "789 Pine Rd, Queens, NY",
      status: "Present",
      time: "08:45 AM",
      location: {
        lat: 40.7282,
        lng: -73.7949,
        address: "789 Pine Rd, Queens, NY",
      },
    },
    {
      id: 4,
      studentNumber: "STU004",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1234567893",
      address: "321 Elm St, Manhattan, NY",
      status: "Present",
      time: "09:30 AM",
      location: {
        lat: 40.7831,
        lng: -73.9712,
        address: "321 Elm St, Manhattan, NY",
      },
    },
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Load Leaflet CSS and JS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => {
        // Initialize the map
        map.current = window.L.map(mapContainer.current).setView(
          [40.7128, -74.006],
          10
        );

        // Add OpenStreetMap tiles (free)
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(map.current);
      };
      document.head.appendChild(script);
    }
  }, []);

  // Add markers when students are loaded or student is selected
  useEffect(() => {
    if (map.current && window.L && students.length > 0) {
      // Clear existing markers
      map.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          map.current.removeLayer(layer);
        }
      });

      // Add markers for all students
      students.forEach((student) => {
        const marker = window.L.marker([
          student.location.lat,
          student.location.lng,
        ]).addTo(map.current).bindPopup(`
            <div>
              <h3><strong>${student.name}</strong></h3>
              <p><strong>Student Number:</strong> ${student.studentNumber}</p>
              <p><strong>Address:</strong> ${student.location.address}</p>
              <p><strong>Status:</strong> ${student.status}</p>
              <p><strong>Check-in:</strong> ${student.time}</p>
            </div>
          `);
      });

      // If there's a selected student, center on them
      if (selectedStudent) {
        map.current.setView(
          [selectedStudent.location.lat, selectedStudent.location.lng],
          15
        );
      }
    }
  }, [students, selectedStudent]);

  const handleStudentNumberChange = (e) => {
    setStudentNumber(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSearch = () => {
    if (selectedDate) {
      console.log("Searching students for date:", selectedDate);
      let filteredStudents = sampleStudents;

      if (studentNumber) {
        filteredStudents = sampleStudents.filter(
          (student) =>
            student.studentNumber
              .toLowerCase()
              .includes(studentNumber.toLowerCase()) ||
            student.name.toLowerCase().includes(studentNumber.toLowerCase())
        );
      }

      setStudents(filteredStudents);
      setShowStudents(true);
    } else {
      alert("Please select a date first");
    }
  };

  // Enhanced print function that opens a new window with only map and student details
  const handlePrintMap = (student) => {
    setSelectedStudent(student);
    console.log(
      "Printing map for student:",
      student.name,
      "at location:",
      student.location
    );

    // Center map on selected student
    if (map.current && window.L) {
      map.current.setView([student.location.lat, student.location.lng], 16);
    }

    // Wait a moment for the map to update, then create print window
    setTimeout(() => {
      createPrintWindow(student);
    }, 1000);
  };

  // Function to create a new window with only map and student details
  const createPrintWindow = (student) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Location Map - ${student.name}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            background: white;
            padding: 20px;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
          }
          
          .print-header h1 {
            color: #3b82f6;
            font-size: 24px;
            margin-bottom: 5px;
          }
          
          .print-header p {
            color: #6b7280;
            font-size: 14px;
          }
          
          .student-details {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          
          .student-details h2 {
            color: #1f2937;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          
          .detail-label {
            font-weight: bold;
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .detail-value {
            color: #1f2937;
            font-size: 14px;
          }
          
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          .status-present {
            background-color: #dcfce7;
            color: #166534;
          }
          
          .status-absent {
            background-color: #fee2e2;
            color: #991b1b;
          }
          
          .status-late {
            background-color: #fef3c7;
            color: #92400e;
          }
          
          .map-container {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            height: 450px;
            margin-bottom: 20px;
            position: relative;
          }
          
          #printMap {
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 1;
          }
          
          .loading-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.9);
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 1000;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #6b7280;
            font-size: 12px;
          }
          
          @media print {
            body {
              padding: 10px;
            }
            
            .print-header h1 {
              font-size: 20px;
            }
            
            .student-details {
              break-inside: avoid;
            }
            
            .map-container {
              height: 400px;
              break-inside: avoid;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            .loading-message {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>Student Location Map</h1>
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div class="student-details">
          <h2>Student Information</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Student Number</span>
              <span class="detail-value">${student.studentNumber}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Full Name</span>
              <span class="detail-value">${student.name}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email Address</span>
              <span class="detail-value">${student.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phone Number</span>
              <span class="detail-value">${student.phone}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Address</span>
              <span class="detail-value">${student.address}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Check-in Time</span>
              <span class="detail-value">${student.time}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <span class="status-badge status-${student.status.toLowerCase()}">${
      student.status
    }</span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date</span>
              <span class="detail-value">${
                selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : new Date().toLocaleDateString()
              }</span>
            </div>
          </div>
        </div>
        
        <div class="map-container">
          <div class="loading-message" id="loadingMessage">
            <h3>Loading Map...</h3>
            <p>Please wait while the map loads</p>
          </div>
          <div id="printMap"></div>
        </div>
        
        <div class="print-footer">
          <p>Student Location Map Report | ${student.location.address}</p>
          <p>Coordinates: ${student.location.lat.toFixed(
            6
          )}, ${student.location.lng.toFixed(6)}</p>
        </div>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
        <script>
          let printMap = null;
          let mapLoaded = false;
          
          function initializeMap() {
            try {
              // Initialize map in the print window
              printMap = L.map('printMap', {
                preferCanvas: true,
                attributionControl: true
              }).setView([${student.location.lat}, ${
      student.location.lng
    }], 16);
              
              // Add OpenStreetMap tiles
              const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
              });
              
              tileLayer.addTo(printMap);
              
              // Wait for tiles to load
              tileLayer.on('load', function() {
                // Hide loading message
                document.getElementById('loadingMessage').style.display = 'none';
                
                // Add marker for the student
                const marker = L.marker([${student.location.lat}, ${
      student.location.lng
    }])
                  .addTo(printMap)
                  .bindPopup(\`
                    <div style="text-align: center;">
                      <h3><strong>${student.name}</strong></h3>
                      <p><strong>Student ID:</strong> ${
                        student.studentNumber
                      }</p>
                      <p><strong>Status:</strong> ${student.status}</p>
                      <p><strong>Time:</strong> ${student.time}</p>
                    </div>
                  \`)
                  .openPopup();
                
                mapLoaded = true;
                
                // Force map to resize and redraw
                setTimeout(() => {
                  printMap.invalidateSize();
                  // Auto-print after map is fully loaded
                  setTimeout(() => {
                    window.print();
                  }, 1000);
                }, 500);
              });
              
              // Fallback in case load event doesn't fire
              setTimeout(() => {
                if (!mapLoaded) {
                  document.getElementById('loadingMessage').style.display = 'none';
                  
                  const marker = L.marker([${student.location.lat}, ${
      student.location.lng
    }])
                    .addTo(printMap)
                    .bindPopup(\`
                      <div style="text-align: center;">
                        <h3><strong>${student.name}</strong></h3>
                        <p><strong>Student ID:</strong> ${
                          student.studentNumber
                        }</p>
                        <p><strong>Status:</strong> ${student.status}</p>
                        <p><strong>Time:</strong> ${student.time}</p>
                      </div>
                    \`)
                    .openPopup();
                  
                  printMap.invalidateSize();
                  mapLoaded = true;
                  
                  setTimeout(() => {
                    window.print();
                  }, 1000);
                }
              }, 3000);
              
            } catch (error) {
              console.error('Error initializing map:', error);
              document.getElementById('loadingMessage').innerHTML = 
                '<h3>Map Loading Error</h3><p>Unable to load map. Please try again.</p>';
            }
          }
          
          // Initialize map when DOM is ready
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMap);
          } else {
            initializeMap();
          }
          
          // Close window after printing (optional)
          window.addEventListener('afterprint', () => {
            setTimeout(() => {
              window.close();
            }, 1000);
          });
          
          // Manual print button (in case auto-print fails)
          window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
              e.preventDefault();
              if (mapLoaded) {
                window.print();
              } else {
                alert('Please wait for the map to finish loading before printing.');
              }
            }
          });
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-100";
      case "Absent":
        return "text-red-600 bg-red-100";
      case "Late":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-x-hidden md:ml-64 min-h-screen w-full">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-gray-50 text-gray-900 pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Admin User */}
            <div className="flex items-center space-x-3 ml-6">
              <span className="text-gray-900 font-medium">Admin User</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-x-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-6">
              Print Student Map
            </h1>

            {/* Search Form */}
            <Card className="bg-white border-gray-200 mb-8 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Form Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    {/* Student Number */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Student Number
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter student number..."
                        value={studentNumber}
                        onChange={handleStudentNumberChange}
                        className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400 text-sm h-12"
                      />
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">
                        Select Date
                      </Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10 w-full h-12 text-sm"
                          placeholder="mm/dd/yyyy"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div>
                      <Button
                        onClick={handleSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12"
                      >
                        Search
                      </Button>
                    </div>

                    {/* Print Map Button */}
                    <div>
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium w-full h-12"
                        disabled={!selectedStudent}
                      >
                        Print Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            {showStudents && selectedDate ? (
              <Card className="bg-white border-gray-200 overflow-hidden shadow-sm mb-8">
                {/* Table Header */}
                <CardHeader className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Students for{" "}
                        {new Date(selectedDate).toLocaleDateString()}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {students.length} student
                        {students.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {/* Table */}
                <CardContent className="p-0 overflow-x-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            #
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Student Number
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Name
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Email
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Phone
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Address
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Status
                          </th>
                          <th className="text-gray-700 font-medium text-left px-4 py-3 border-b border-gray-200">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student, index) => (
                            <tr
                              key={student.id}
                              className="border-gray-200 hover:bg-gray-50"
                            >
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {index + 1}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.studentNumber}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.name}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.email}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.phone}
                              </td>
                              <td className="text-gray-700 px-4 py-3 border-b border-gray-200">
                                {student.address}
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                    student.status
                                  )}`}
                                >
                                  {student.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 border-b border-gray-200">
                                <Button
                                  onClick={() => handlePrintMap(student)}
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                                >
                                  <Printer className="h-4 w-4" />
                                  <span>Print Map</span>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-gray-200">
                            <td
                              colSpan={8}
                              className="text-gray-700 text-center py-8 px-4 border-b border-gray-200"
                            >
                              No students found matching your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Map Container */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Student Locations Map
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedStudent
                        ? `Showing location for ${selectedStudent.name}`
                        : "Select a student to view their location on the map"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={mapContainer}
                  className="w-full h-96"
                  style={{ minHeight: "500px" }}
                >
                  {/* Leaflet map will be rendered here */}
                </div>
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
