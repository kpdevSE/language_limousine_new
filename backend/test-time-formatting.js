// Test script to verify time formatting functionality
const formatTimeToAMPM = (timeString) => {
  if (!timeString) return "N/A";

  try {
    // If it's already in 12-hour format, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }

    // If it's in 24-hour format, convert to 12-hour
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    }

    return timeString;
  } catch (error) {
    return timeString;
  }
};

// Test cases
const testCases = [
  "14:30", // Should become "2:30 PM"
  "09:15", // Should become "9:15 AM"
  "00:00", // Should become "12:00 AM"
  "12:00", // Should become "12:00 PM"
  "23:45", // Should become "11:45 PM"
  "06:30", // Should become "6:30 AM"
  "3:30 PM", // Should stay "3:30 PM"
  "9:15 AM", // Should stay "9:15 AM"
  "invalid", // Should stay "invalid"
  "", // Should become "N/A"
  null, // Should become "N/A"
  undefined, // Should become "N/A"
];

console.log("🕐 Testing Time Formatting Function\n");

testCases.forEach((testCase, index) => {
  const result = formatTimeToAMPM(testCase);
  console.log(`Test ${index + 1}: "${testCase}" → "${result}"`);
});

console.log("\n✅ Time formatting test completed!");
