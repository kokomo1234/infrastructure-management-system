const jwt = require('jsonwebtoken');
const db = require('../config/database');

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, department, position, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid token. User not found or inactive.',
        code: 'INVALID_USER'
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(403).json({ 
      error: 'Invalid token.',
      code: 'INVALID_TOKEN'
    });
  }
};

// Role-based Authorization Middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required.',
        code: 'AUTH_REQUIRED'
      });
    }

    // For now, we'll use department as role
    // This can be extended to a proper role system later
    const userRole = req.user.department?.toLowerCase() || 'user';
    
    if (!roles.includes(userRole) && !roles.includes('all')) {
      return res.status(403).json({ 
        error: 'Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: userRole
      });
    }

    next();
  };
};

// Admin-only authorization
const requireAdmin = authorizeRoles('infrastructure', 'admin');

// Read-only authorization (all authenticated users)
const requireAuth = authenticateToken;

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireAuth
};
