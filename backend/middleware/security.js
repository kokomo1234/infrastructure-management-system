const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, param, query, validationResult } = require('express-validator');

// Rate limiting configurations
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts. Please try again later.'
);

const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests. Please try again later.'
);

const strictLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 requests
  'Too many requests to this endpoint. Please try again later.'
);

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API compatibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// Common validation rules
const idValidation = [
  param('id').isNumeric().withMessage('ID must be a number')
];

const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// TDL validation rules
const tdlValidation = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('region').trim().isLength({ min: 1, max: 100 }).withMessage('Region is required and must be less than 100 characters'),
  body('class').optional().trim().isLength({ max: 50 }),
  body('phase').optional().trim().isLength({ max: 50 }),
  body('voltage').optional().trim().isLength({ max: 50 }),
  body('power_factor').optional().isFloat({ min: 0, max: 1 }).withMessage('Power factor must be between 0 and 1'),
  body('status').optional().trim().isIn(['Actif', 'Inactif', 'Maintenance']).withMessage('Invalid status'),
  body('SDS').optional().isBoolean().withMessage('SDS must be boolean'),
  body('esp_plan').optional().isInt({ min: 0 }).withMessage('ESP plan must be a positive integer'),
  body('nb_cab').optional().isInt({ min: 0 }).withMessage('Number of cabinets must be a positive integer'),
  body('charge_ac').optional().isFloat({ min: 0 }).withMessage('AC charge must be positive'),
  body('charge_dc').optional().isFloat({ min: 0 }).withMessage('DC charge must be positive'),
  body('charge_gen').optional().isFloat({ min: 0 }).withMessage('Generator charge must be positive'),
  body('charge_clim').optional().isFloat({ min: 0 }).withMessage('Climate charge must be positive'),
  body('adresse').optional().trim().isLength({ max: 255 }),
  body('ville').optional().trim().isLength({ max: 100 }),
  body('code_postal').optional().trim().isLength({ max: 10 }),
  body('contact_person').optional().trim().isLength({ max: 255 }),
  body('contact_phone').optional().trim().isLength({ max: 20 }),
  body('contact_email').optional().isEmail().withMessage('Invalid email format'),
  body('total_capacity_kw').optional().isFloat({ min: 0 }).withMessage('Total capacity must be positive'),
  body('used_capacity_kw').optional().isFloat({ min: 0 }).withMessage('Used capacity must be positive'),
  body('emergency_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Emergency percentage must be between 0 and 100')
];

// AC Equipment validation rules
const acEquipmentValidation = [
  body('nom').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('type').trim().isLength({ min: 1, max: 100 }).withMessage('Type is required and must be less than 100 characters'),
  body('output_ac').isFloat({ min: 0 }).withMessage('AC output must be positive'),
  body('current_load').optional().isFloat({ min: 0 }).withMessage('Current load must be positive'),
  body('TDL_id').optional().isInt({ min: 1 }).withMessage('TDL ID must be a positive integer'),
  body('TSF_id').optional().isInt({ min: 1 }).withMessage('TSF ID must be a positive integer'),
  body('is_redundant').optional().isBoolean().withMessage('Redundant must be boolean'),
  body('voltage').optional().isFloat({ min: 0 }).withMessage('Voltage must be positive'),
  body('phase').optional().isInt({ min: 1, max: 3 }).withMessage('Phase must be 1, 2, or 3'),
  body('efficiency').optional().isFloat({ min: 0, max: 100 }).withMessage('Efficiency must be between 0 and 100'),
  body('OOD').optional().isBoolean().withMessage('OOD must be boolean'),
  body('SLA').optional().isFloat({ min: 0, max: 100 }).withMessage('SLA must be between 0 and 100')
];

// Sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attempts from string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '');
  };

  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
  next();
};

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://hamciuca.com',
      'https://www.hamciuca.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

module.exports = {
  authLimiter,
  apiLimiter,
  strictLimiter,
  securityHeaders,
  validateRequest,
  idValidation,
  paginationValidation,
  tdlValidation,
  acEquipmentValidation,
  sanitizeInput,
  corsOptions
};
