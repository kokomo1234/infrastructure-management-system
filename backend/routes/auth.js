const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('department').optional().trim(),
  body('position').optional().trim()
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, first_name, last_name, department, position } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'User already exists with this email',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = require('crypto').randomUUID();

    // Create user
    await db.execute(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, department, position, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [userId, email, hashedPassword, first_name, last_name, department || null, position || null]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        department,
        position,
        is_active: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user - handle both password and password_hash column names
    let users, passwordField;
    
    try {
      // Try password_hash first (new schema)
      const [usersWithHash] = await db.execute(
        'SELECT id, email, password_hash, first_name, last_name, department, position, is_active, last_login FROM users WHERE email = ?',
        [email]
      );
      users = usersWithHash;
      passwordField = 'password_hash';
    } catch (error) {
      // If password_hash column doesn't exist, try password column (old schema)
      try {
        const [usersWithPassword] = await db.execute(
          'SELECT id, email, password, first_name, last_name, department, position, is_active, last_login FROM users WHERE email = ?',
          [email]
        );
        users = usersWithPassword;
        passwordField = 'password';
      } catch (secondError) {
        console.error('Login error - unable to query users table:', secondError);
        return res.status(500).json({
          error: 'Database error',
          code: 'DATABASE_ERROR'
        });
      }
    }

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const user = users[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account is deactivated. Please contact administrator.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password using the correct field
    const storedPassword = user[passwordField];
    const isValidPassword = await bcrypt.compare(password, storedPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    await db.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: `${user.first_name} ${user.last_name}`,
        department: user.department,
        position: user.position,
        is_active: user.is_active,
        last_login: user.last_login
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, department, position, is_active, last_login, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = users[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: `${user.first_name} ${user.last_name}`,
        department: user.department,
        position: user.position,
        is_active: user.is_active,
        last_login: user.last_login,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate new token
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      code: 'REFRESH_ERROR'
    });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', authenticateToken, async (req, res) => {
  // In a production system, you might want to maintain a blacklist of tokens
  // For now, we'll just return success and let the client handle token removal
  res.json({
    message: 'Logout successful'
  });
});

module.exports = router;
