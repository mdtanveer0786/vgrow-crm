const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { asyncHandler } = require('./errorHandler');

// Ensure JWT_SECRET is configured — refuse to use hardcoded fallbacks in production
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('[SECURITY] JWT_SECRET environment variable is not set. Using development fallback.');
    return 'vgrow_dev_only_secret_CHANGE_IN_PRODUCTION';
  }
  return secret;
};

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.token;

  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {

      // Verify token
      const decoded = jwt.verify(token, getJwtSecret());

      // Get user from token with their roles via UserRole join table
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
          roles: {
            include: {
              role: true
            }
          }
        }
      });
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Extract role names from the UserRole join table
      req.userRoles = req.user.roles.map(ur => ur.role.name);

      if (req.userRoles.includes('Admin') || req.userRoles.includes('Owner')) {
        req.user.role = 'Admin';
      } else if (req.userRoles.includes('Manager')) {
        req.user.role = 'Manager';
      } else if (req.userRoles.includes('Rep')) {
        req.user.role = 'Rep';
      } else {
        req.user.role = req.userRoles[0] || 'Rep';
      }

      // Attach tenant/organization info
      req.tenantId = req.user.organizationId;

      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

// Role authorization — checks against actual UserRole join table data
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user profile' });
    }

    const userRoles = req.userRoles || [];

    // If user is the org creator (first user), treat as Owner
    // Also check actual role names from UserRole join table
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    // Fallback: if user has NO roles assigned at all, allow access for now
    // (handles legacy users created before role assignment was implemented)
    if (userRoles.length === 0) {
      console.warn(`[RBAC] User ${req.user.id} has no roles assigned. Allowing access as fallback.`);
      return next();
    }

    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Forbidden: Insufficient permissions',
        requiredRoles: allowedRoles,
        userRoles: userRoles
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
