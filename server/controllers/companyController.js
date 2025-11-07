import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
export const getCompanies = async (req, res) => {
  try {
    // Get all unique companies from placement drives
    const drives = await PlacementDrive.find({}, 'companyName companyLogo industry location');
    
    // Create a map to store unique companies
    const companyMap = new Map();
    
    drives.forEach(drive => {
      if (drive.companyName && !companyMap.has(drive.companyName)) {
        companyMap.set(drive.companyName, {
          name: drive.companyName,
          logo: drive.companyLogo,
          industry: drive.industry || 'Technology',
          location: drive.location || 'Not specified'
        });
      }
    });
    
    const companies = Array.from(companyMap.values());
    
    res.json({
      success: true,
      count: companies.length,
      companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get company details
// @route   GET /api/companies/:name
// @access  Public
export const getCompanyDetails = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Find all drives for this company
    const drives = await PlacementDrive.find({ companyName: name });
    
    if (drives.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Get applications for these drives to calculate statistics
    const driveIds = drives.map(drive => drive._id);
    const applications = await Application.find({ driveId: { $in: driveIds } })
      .populate('studentId', 'name')
      .populate('driveId', 'role package');
    
    // Calculate statistics
    const totalDrives = drives.length;
    const totalApplications = applications.length;
    const selectedApplications = applications.filter(app => app.status === 'selected');
    
    // Get unique packages and calculate average
    const packages = drives.map(drive => drive.package?.ctc || 0);
    const validPackages = packages.filter(pkg => pkg > 0);
    const avgPackage = validPackages.length > 0 
      ? (validPackages.reduce((sum, pkg) => sum + pkg, 0) / validPackages.length / 100000).toFixed(2)
      : 0;
    
    // Get roles offered
    const roles = [...new Set(drives.map(drive => drive.role))];
    
    // Get recent drives (last 3)
    const recentDrives = drives
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(drive => ({
        year: new Date(drive.createdAt).getFullYear(),
        role: drive.role,
        package: drive.package?.ctc ? `₹${(drive.package.ctc / 100000).toFixed(2)} LPA` : 'Not specified'
      }));
    
    const companyDetails = {
      name: drives[0].companyName,
      logo: drives[0].companyLogo,
      industry: drives[0].industry || 'Technology',
      location: drives[0].location || 'Not specified',
      description: `Details for ${drives[0].companyName}`,
      totalDrives,
      totalApplications,
      selectedStudents: selectedApplications.length,
      avgPackage: `${avgPackage} LPA`,
      roles,
      recentDrives
    };
    
    res.json({
      success: true,
      company: companyDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get company statistics
// @route   GET /api/companies/:name/stats
// @access  Public
export const getCompanyStats = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Find all drives for this company
    const drives = await PlacementDrive.find({ companyName: name });
    
    if (drives.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    // Get applications for these drives
    const driveIds = drives.map(drive => drive._id);
    const applications = await Application.find({ driveId: { $in: driveIds } });
    
    // Calculate statistics
    const totalDrives = drives.length;
    const totalApplications = applications.length;
    const selectedApplications = applications.filter(app => app.status === 'selected');
    const rejectedApplications = applications.filter(app => app.status === 'rejected');
    
    // Get packages and calculate statistics
    const packages = drives
      .filter(drive => drive.package?.ctc)
      .map(drive => drive.package.ctc);
    
    const minPackage = packages.length > 0 ? Math.min(...packages) : 0;
    const maxPackage = packages.length > 0 ? Math.max(...packages) : 0;
    const avgPackage = packages.length > 0 
      ? (packages.reduce((sum, pkg) => sum + pkg, 0) / packages.length / 100000).toFixed(2)
      : 0;
    
    const stats = {
      totalDrives,
      totalApplications,
      selectedStudents: selectedApplications.length,
      rejectionRate: totalApplications > 0 
        ? ((rejectedApplications.length / totalApplications) * 100).toFixed(2)
        : 0,
      minPackage: minPackage > 0 ? `₹${(minPackage / 100000).toFixed(2)} LPA` : 'N/A',
      maxPackage: maxPackage > 0 ? `₹${(maxPackage / 100000).toFixed(2)} LPA` : 'N/A',
      avgPackage: avgPackage > 0 ? `₹${avgPackage} LPA` : 'N/A'
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};