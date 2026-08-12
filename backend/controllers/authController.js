const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// Generate JWT token helper
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[SECURITY] JWT_SECRET not set. Using dev fallback.');
  }
  return jwt.sign({ id }, secret || 'vgrow_dev_only_secret_CHANGE_IN_PRODUCTION', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// @desc    Register a new user and organization
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, companyName } = req.body;

  if (!firstName || !lastName || !email || !password || !companyName) {
    res.status(400);
    throw new Error('Please enter all required fields');
  }

  // Check if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create a new Organization (Tenant) for the user
  const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `org-${Date.now()}`;
  const org = await prisma.organization.create({
    data: {
      name: companyName,
      slug: slug
    }
  });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create primary user
  const user = await prisma.user.create({
    data: {
      organizationId: org.id,
      firstName,
      lastName,
      email,
      passwordHash,
      status: 'Active'
    }
  });

  // Helper to send token response in cookie
  const sendTokenResponse = (user, org, statusCode, res) => {
    const token = generateToken(user.id);
    
    const cookieOptions = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    };

    res
      .status(statusCode)
      .cookie('token', token, cookieOptions)
      .json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: token, // keep sending token in body for legacy frontend compatibility
        tenant: org ? { id: org.id, name: org.name } : null
      });
  };

  if (user) {
    sendTokenResponse(user, org, 201, res);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please enter email and password');
  }

  // Check user exists
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      // Find tenant info
      const org = await prisma.organization.findUnique({ where: { id: user.organizationId } });

      const token = generateToken(user.id);
      const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      };

      return res
        .cookie('token', token, cookieOptions)
        .json({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          token: token,
          tenant: org ? { id: org.id, name: org.name } : null
        });
    }
  }

  throw new AppError('Invalid credentials', 401);
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (user) {
    const org = await prisma.organization.findUnique({ where: { id: user.organizationId } });
    const { passwordHash, ...userData } = user;
    res.json({
      user: userData,
      tenant: org
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout User / Clear Cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser
};
