import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import { generateToken } from '../utils/jwtUtils.js';
import { generateRandomToken } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../services/emailService.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, companyName, rollNumber, batch, cgpa, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role,
      verificationToken: generateRandomToken()
    };

    // Add department for student and hod roles
    if (role !== 'tpo' && role !== 'company') {
      userData.department = department;
    }

    // Add company name for company role
    if (role === 'company') {
      userData.companyName = companyName;
    }

    const user = await User.create(userData);

    // If student, create profile
    if (role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        rollNumber,
        batch,
        cgpa,
        phone,
        backlogs: req.body.backlogs || 0
      });
    }

    // Send verification email (simplified)
    // In a production environment, you would send an actual verification email
    // const emailResult = await sendEmail({
    //   to: email,
    //   subject: 'Verify your email',
    //   html: `<p>Please verify your email by clicking the link</p>`
    // });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        companyName: user.companyName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        companyName: user.companyName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        companyName: user.companyName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};