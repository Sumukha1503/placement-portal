import StudentProfile from '../models/StudentProfile.js';
import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';

// GET /api/hod/students
export const getDepartmentStudents = async (req, res) => {
  const students = await StudentProfile.find({ department: req.user.department });
  res.json({ success: true, students });
};

// GET /api/hod/students/:id
export const getStudentDetails = async (req, res) => {
  const student = await StudentProfile.findById(req.params.id);
  res.json({ success: true, student });
};

// PUT /api/hod/students/:id
export const editStudentProfile = async (req, res) => {
  const data = req.body;
  const student = await StudentProfile.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json({ success: true, student });
};

// GET /api/hod/applications/pending
export const getPendingApprovals = async (req, res) => {
  try {
    // First, find all students in the HOD's department by querying the User model
    const studentsInDepartment = await StudentProfile.find()
      .populate({
        path: 'userId',
        match: { department: req.user.department }
      })
      .exec();
    
    // Filter to get only students that matched the department
    const validStudents = studentsInDepartment.filter(student => student.userId !== null);
    const studentIds = validStudents.map(student => student._id);
    
    // Find applications for these students with hod-pending status
    const applications = await Application.find({
      status: 'hod-pending',
      studentId: { $in: studentIds }
    }).populate('studentId driveId');
    
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/hod/applications/:id/approve
export const approveApplication = async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, { status: 'hod-approved' }, { new: true });
  res.json({ success: true, application });
};

// PATCH /api/hod/applications/:id/reject
export const rejectApplication = async (req, res) => {
  const application = await Application.findByIdAndUpdate(req.params.id, { status: 'hod-rejected' }, { new: true });
  res.json({ success: true, application });
};

// GET /api/hod/students/export
export const exportStudentsData = async (req, res) => {
  try {
    // Find all students in the HOD's department
    const students = await StudentProfile.find({ department: req.user.department })
      .populate('userId', 'name email');
    
    // Create Excel workbook
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.default.Workbook();
    const worksheet = workbook.addWorksheet('Department Students');
    
    // Define columns
    worksheet.columns = [
      { header: 'Roll Number', key: 'rollNumber', width: 15 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'CGPA', key: 'cgpa', width: 10 },
      { header: 'Batch', key: 'batch', width: 10 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Backlogs', key: 'backlogs', width: 10 },
      { header: 'Status', key: 'placementStatus', width: 15 }
    ];
    
    // Add data
    students.forEach(student => {
      worksheet.addRow({
        rollNumber: student.rollNumber,
        name: student.userId?.name || 'N/A',
        email: student.userId?.email || 'N/A',
        cgpa: student.cgpa,
        batch: student.batch,
        phone: student.phone,
        backlogs: student.backlogs,
        placementStatus: student.placementStatus
      });
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=students-${req.user.department.replace(/\s+/g, '_')}.xlsx`);
    
    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting students data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hod/reports/department
export const generateDepartmentReport = async (req, res) => {
  try {
    const { format } = req.query; // 'pdf' or 'csv'
    
    // Example data - in a real implementation, this would come from the database
    const reportData = [
      { id: 1, name: 'John Doe', rollNumber: 'CS123', cgpa: 8.5, batch: 2024, status: 'Placed' },
      { id: 2, name: 'Jane Smith', rollNumber: 'CS124', cgpa: 9.2, batch: 2024, status: 'Pending' },
      { id: 3, name: 'Bob Johnson', rollNumber: 'CS125', cgpa: 7.8, batch: 2024, status: 'Not Applied' }
    ];
    
    if (format === 'pdf') {
      // Generate PDF report
      const doc = new (await import('pdfkit')).default();
      
      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=department-report.pdf');
      
      // Pipe the PDF to the response
      doc.pipe(res);
      
      // Add content to PDF
      doc.fontSize(20).text(`Department Report - ${req.user.department}`, { align: 'center' });
      doc.moveDown();
      
      // Add table-like data
      reportData.forEach((item, index) => {
        doc.fontSize(12).text(`${index + 1}. ${item.name} (${item.rollNumber}) - CGPA: ${item.cgpa} - Batch: ${item.batch} - Status: ${item.status}`);
        doc.moveDown();
      });
      
      // Finalize the PDF
      doc.end();
    } else if (format === 'csv') {
      // Generate CSV report
      const ExcelJS = await import('exceljs');
      const workbook = new ExcelJS.default.Workbook();
      const worksheet = workbook.addWorksheet('Department Report');
      
      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Roll Number', key: 'rollNumber', width: 15 },
        { header: 'CGPA', key: 'cgpa', width: 10 },
        { header: 'Batch', key: 'batch', width: 10 },
        { header: 'Status', key: 'status', width: 15 }
      ];
      
      // Add data
      reportData.forEach(item => {
        worksheet.addRow(item);
      });
      
      // Set response headers for CSV
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=department-report.xlsx');
      
      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ success: false, message: 'Invalid format. Use pdf or csv.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/hod/analytics/department
export const getDepartmentAnalytics = async (req, res) => {
  // Example: Calculate stats for dashboard
  res.json({ success: true, stats: {} });
};
