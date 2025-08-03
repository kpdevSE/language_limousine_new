import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { User, Clock, Save, Info, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

export default function UpdatingWaitingTimeGreeters() {
  const [waitingTimes, setWaitingTimes] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Sample data - you can replace this with your actual data
  const studentsData = [
    {
      id: 1,
      waiting: "15",
      flight: "AC 001",
      arrivalTime: "06:30:00",
      studentNumber: "310001",
      studentGivenName: "John Smith",
    },
    {
      id: 2,
      waiting: "20",
      flight: "AM 694",
      arrivalTime: "07:15:00",
      studentNumber: "310002",
      studentGivenName: "Sarah Johnson",
    },
    {
      id: 3,
      waiting: "10",
      flight: "ZG 021",
      arrivalTime: "08:45:00",
      studentNumber: "310003",
      studentGivenName: "Michael Chen",
    },
    {
      id: 4,
      waiting: "25",
      flight: "JL 017",
      arrivalTime: "09:20:00",
      studentNumber: "310004",
      studentGivenName: "Emma Wilson",
    },
    {
      id: 5,
      waiting: "30",
      flight: "AC 306",
      arrivalTime: "10:10:00",
      studentNumber: "310005",
      studentGivenName: "David Brown",
    },
  ];

  const handleWaitingTimeChange = (studentId, value) => {
    setWaitingTimes((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updated waiting times:", waitingTimes);
      // Handle save logic here
      alert("Waiting times updated successfully!");
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 min-h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
            {/* Mobile Menu Space */}
            <div className="md:hidden w-10" />

            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Update Waiting Time
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage greeter schedules
                </p>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Greeter</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Today's Schedule
                </span>
              </div>
              <Badge variant="secondary">{studentsData.length} Students</Badge>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Instructions:</strong> Adjust waiting times (0-120
              minutes) for each student. These changes will update the greeter's
              schedule immediately after saving.
            </AlertDescription>
          </Alert>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Student Waiting Times
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {studentsData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead className="w-32">Waiting Time</TableHead>
                        <TableHead className="w-24">Flight</TableHead>
                        <TableHead className="w-32">Arrival Time</TableHead>
                        <TableHead className="w-32">Student Number</TableHead>
                        <TableHead>Student Given Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                max="120"
                                defaultValue={student.waiting}
                                onChange={(e) =>
                                  handleWaitingTimeChange(
                                    student.id,
                                    e.target.value
                                  )
                                }
                                className="w-20 text-center"
                                placeholder="0"
                              />
                              <span className="text-xs text-muted-foreground">
                                min
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {student.flight}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.arrivalTime}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.studentNumber}
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.studentGivenName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <Timer className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      No records found for today
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                      Student schedules will appear here when available. Check
                      back later or contact support if you expect to see data.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Tablet Cards View */}
          <div className="lg:hidden space-y-4">
            {studentsData.length > 0 ? (
              studentsData.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold leading-none">
                          {student.studentGivenName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {student.flight}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ID: {student.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Arrival Time
                        </Label>
                        <p className="font-mono text-sm">
                          {student.arrivalTime}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">
                          Student Number
                        </Label>
                        <p className="font-mono text-sm">
                          {student.studentNumber}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Waiting Time
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="120"
                          defaultValue={student.waiting}
                          onChange={(e) =>
                            handleWaitingTimeChange(student.id, e.target.value)
                          }
                          className="w-24 text-center"
                          placeholder="0"
                        />
                        <span className="text-sm text-muted-foreground">
                          minutes
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Timer className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No records found for today
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    Student schedules will appear here when available.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Copyright © 2024. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
