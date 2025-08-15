const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create Excel template with your actual headers
function createActualTemplate() {
  // Define the headers exactly as they appear in your Excel
  const headers = [
    'Trip #',
    'Actu Arriva Time', // Your actual truncated header
    'Arr Time Dep PU',  // Your actual truncated header
    'Flight #',
    'I or M / F',
    'Student Number',
    'Student Given Name',
    'Student Fam Name', // Your actual truncated header
    'Host Give Name',   // Your actual truncated header
    'Host Fami Name',   // Your actual truncated header
    'Phone H=Home C=Cell B=Business',
    'Address',
    'City',
    'Special Instructions',
    'Study Permit Y or N',
    'School',
    'Staff Member Assigned',
    'Client'
  ];

  // Sample data from your actual Excel
  const sampleData = [
    '1',
    '2:00 AM / 6:00 AM',
    '2:00 AM / 6:00 AM',
    'AS 6047',
    'F',
    'VE158887',
    'Mariana',
    'Palmieri Panazzolo',
    'Angelica',
    'Lim',
    '7782510236',
    '6962 Fleming St',
    'Vancouver',
    'Departs @ 6:00 AM',
    'Y',
    'ILSC',
    'Jaskirat 1st Job',
    'ILSC'
  ];

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([headers, sampleData]);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  // Create templates directory if it doesn't exist
  const templatesDir = path.join(__dirname, 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  // Write the file
  const filePath = path.join(templatesDir, 'actual_student_template.xlsx');
  XLSX.writeFile(workbook, filePath);

  console.log('✅ Excel template created with your actual headers!');
  console.log(`📁 File location: ${filePath}`);
  console.log('\n📋 Template includes your actual headers:');
  headers.forEach((header, index) => {
    console.log(`${index + 1}. ${header}`);
  });
  
  console.log('\n📝 Instructions:');
  console.log('1. Download this template file');
  console.log('2. Fill in your student data (replace the sample row)');
  console.log('3. Make sure the headers in row 1 remain exactly the same');
  console.log('4. Upload the file through the admin panel');
  
  console.log('\n⚠️  Important Notes:');
  console.log('- Do NOT change the header names in row 1');
  console.log('- Keep the exact same order of columns');
  console.log('- Student Number can be left empty for auto-generation');
  console.log('- Make sure at least Student Given Name or Student Family Name is filled');
  console.log('- This template matches your actual Excel structure exactly');

  return filePath;
}

// Also create a CSV version for easier editing
function createActualCSVTemplate() {
  const headers = [
    'Trip #',
    'Actu Arriva Time',
    'Arr Time Dep PU',
    'Flight #',
    'I or M / F',
    'Student Number',
    'Student Given Name',
    'Student Fam Name',
    'Host Give Name',
    'Host Fami Name',
    'Phone H=Home C=Cell B=Business',
    'Address',
    'City',
    'Special Instructions',
    'Study Permit Y or N',
    'School',
    'Staff Member Assigned',
    'Client'
  ];

  const sampleData = [
    '1',
    '2:00 AM / 6:00 AM',
    '2:00 AM / 6:00 AM',
    'AS 6047',
    'F',
    'VE158887',
    'Mariana',
    'Palmieri Panazzolo',
    'Angelica',
    'Lim',
    '7782510236',
    '6962 Fleming St',
    'Vancouver',
    'Departs @ 6:00 AM',
    'Y',
    'ILSC',
    'Jaskirat 1st Job',
    'ILSC'
  ];

  const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
  
  const templatesDir = path.join(__dirname, 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const filePath = path.join(templatesDir, 'actual_student_template.csv');
  fs.writeFileSync(filePath, csvContent);

  console.log('\n✅ CSV template also created!');
  console.log(`📁 CSV file location: ${filePath}`);
  console.log('💡 You can edit the CSV file in Excel and save as .xlsx');

  return filePath;
}

// Create both templates
try {
  createActualTemplate();
  createActualCSVTemplate();
  console.log('\n🎉 Both templates created successfully!');
  console.log('\n📋 Your Excel file should now work perfectly!');
} catch (error) {
  console.error('❌ Error creating templates:', error);
}
