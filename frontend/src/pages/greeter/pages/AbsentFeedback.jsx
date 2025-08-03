import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { User, Calendar, MessageSquare, Send, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AbsentFeedback() {
  const [selectedDate, setSelectedDate] = useState("08/03/2025");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample student data - you can replace this with your actual data
  const studentsData = [
    { id: "310001", name: "John Smith", flight: "AC 001" },
    { id: "310002", name: "Sarah Johnson", flight: "AM 694" },
    { id: "310003", name: "Michael Chen", flight: "ZG 021" },
    { id: "310004", name: "Emma Wilson", flight: "JL 017" },
    { id: "310005", name: "David Brown", flight: "AC 306" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !feedback.trim()) {
      alert("Please select a student and provide feedback.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Submitted:", { selectedDate, selectedStudent, feedback });
      alert("Feedback submitted successfully!");

      // Reset form
      setSelectedStudent("");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                <UserX className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">
                  Absent Feedback
                </h1>
                <p className="text-sm text-muted-foreground">
                  Report student absences
                </p>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">Greeter</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-6 py-6 space-y-6">
          {/* Form Card */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit Absence Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Select Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate.split("/").reverse().join("-")}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          const formatted = `${(date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}/${date
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${date.getFullYear()}`;
                          setSelectedDate(formatted);
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Student Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="student" className="text-sm font-medium">
                      Select Absent Student
                    </Label>
                    <Select
                      value={selectedStudent}
                      onValueChange={setSelectedStudent}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose one student" />
                      </SelectTrigger>
                      <SelectContent>
                        {studentsData.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{student.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {student.id} • {student.flight}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-sm font-medium">
                      Feedback
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder="Enter feedback about the absence"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide details about the student's absence, any
                      communication received, or relevant observations.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        isSubmitting || !selectedStudent || !feedback.trim()
                      }
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Submissions (Optional) */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Recent Absence Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sample recent submissions */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">John Smith (310001)</p>
                      <p className="text-xs text-muted-foreground">
                        08/02/2025 • Flight AC 001
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Sarah Johnson (310002)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        08/01/2025 • Flight AM 694
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted
                    </div>
                  </div>
                </div>

                {/* Empty state if no recent submissions */}
                {/* <div className="text-center py-8">
                  <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No recent absence reports
                  </p>
                </div> */}
              </CardContent>
            </Card>
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
