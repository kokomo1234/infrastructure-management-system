const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules for user creation/update
const userValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('first_name').trim().isLength({ min: 1, max: 255 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1, max: 255 }).withMessage('Last name is required'),
  body('department').optional().trim().isLength({ max: 100 }),
  body('position').optional().trim().isLength({ max: 100 }),
  body('is_active').optional().isBoolean().withMessage('Active status must be boolean')
];

const passwordValidation = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

// GET all users (admin only)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await db.execute('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    // Get users with pagination
    const [users] = await db.execute(
      `SELECT id, email, first_name, last_name, department, position, is_active, last_login, created_at, updated_at 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      users: users.map(user => ({
        ...user,
        display_name: `${user.first_name} ${user.last_name}`
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      code: 'FETCH_USERS_ERROR'
    });
  }
});

// GET user by ID (admin only)
router.get('/:id', async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, email, first_name, last_name, department, position, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
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
        ...user,
        display_name: `${user.first_name} ${user.last_name}`
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      code: 'FETCH_USER_ERROR'
    });
  }
});

// POST create new user (admin only)
router.post('/', [...userValidation, ...passwordValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, first_name, last_name, department, position, is_active = true } = req.body;

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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, email, hashedPassword, first_name, last_name, department || null, position || null, is_active]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        first_name,
        last_name,
        display_name: `${first_name} ${last_name}`,
        department,
        position,
        is_active
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      code: 'CREATE_USER_ERROR'
    });
  }
});

// PUT update user (admin only)
router.put('/:id', userValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, first_name, last_name, department, position, is_active } = req.body;

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if email is already taken by another user
    const [emailCheck] = await db.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.params.id]
    );

    if (emailCheck.length > 0) {
      return res.status(409).json({
        error: 'Email already taken by another user',
        code: 'EMAIL_TAKEN'
      });
    }

    // Update user
    await db.execute(
      `UPDATE users 
       SET email = ?, first_name = ?, last_name = ?, department = ?, position = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [email, first_name, last_name, department || null, position || null, is_active, req.params.id]
    );

    res.json({
      message: 'User updated successfully',
      user: {
        id: req.params.id,
        email,
        first_name,
        last_name,
        display_name: `${first_name} ${last_name}`,
        department,
        position,
        is_active
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      code: 'UPDATE_USER_ERROR'
    });
  }
});

// PUT update user password (admin only)
router.put('/:id/password', passwordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { password } = req.body;

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password
    await db.execute(
      'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.params.id]
    );

    res.json({
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      error: 'Failed to update password',
      code: 'UPDATE_PASSWORD_ERROR'
    });
  }
});

// DELETE user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        error: 'Cannot delete your own account',
        code: 'CANNOT_DELETE_SELF'
      });
    }

    // Check if user exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [req.params.id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Soft delete - deactivate user instead of hard delete
    await db.execute(
      'UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      code: 'DELETE_USER_ERROR'
    });
  }
});

module.exports = router;
