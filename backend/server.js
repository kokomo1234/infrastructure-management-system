const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Security middleware imports
const { 
  authLimiter, 
  apiLimiter, 
  strictLimiter, 
  securityHeaders, 
  sanitizeInput, 
  corsOptions 
} = require('./middleware/security');
const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Railway deployment (fixes X-Forwarded-For rate limiting issues)
app.set('trust proxy', 1);

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Security middleware (order matters!)
app.use(securityHeaders); // Security headers first
app.use(cors(corsOptions)); // CORS with proper configuration
app.use(bodyParser.json({ limit: '10mb' })); // Limit request size
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput); // Sanitize all inputs

// Rate limiting
app.use('/api/auth', authLimiter); // Strict rate limiting for auth
app.use('/api/migration', strictLimiter); // Strict rate limiting for migration
app.use('/api', apiLimiter); // General API rate limiting

// Public routes (no authentication required)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/db-init', require('./routes/db-init')); // Custom API routes for database operations
app.use('/api/db-diagnostic', require('./routes/db-diagnostic')); // Database diagnostic API
app.use('/api/admin-bootstrap', require('./routes/admin-bootstrap')); // Admin bootstrap API
app.use('/api/create-users-table', require('./routes/create-users-table')); // Admin bootstrap API

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Infrastructure Management API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Protected routes (authentication required)
app.use('/api/tdl', requireAuth, require('./routes/tdl'));
app.use('/api/tsf', requireAuth, require('./routes/tsf'));
app.use('/api/ac', requireAuth, require('./routes/ac'));
app.use('/api/dc', requireAuth, require('./routes/dc'));
app.use('/api/hvac', requireAuth, require('./routes/hvac'));
app.use('/api/gen-tsw', requireAuth, require('./routes/genTsw'));
app.use('/api/autre', requireAuth, require('./routes/autre'));
app.use('/api/besoin', requireAuth, require('./routes/besoin'));
app.use('/api/fournisseurs', requireAuth, require('./routes/fournisseurs'));
app.use('/api/fabricant', requireAuth, require('./routes/fabricant'));

// Admin-only routes
app.use('/api/migration', requireAdmin, require('./routes/migration'));
app.use('/api/migration', requireAdmin, require('./routes/fix-capacity-calculation'));
app.use('/api/migration', requireAdmin, require('./routes/fix-tdl-id-types'));

// User management routes (admin only)
app.use('/api/users', requireAdmin, require('./routes/users'));
app.use('/api/work-orders', requireAuth, require('./routes/workOrders'));

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS policy violation',
      code: 'CORS_ERROR',
      message: 'Origin not allowed'
    });
  }
  next(err);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    code: 'INTERNAL_ERROR',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully.');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔒 Security features enabled`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
});
