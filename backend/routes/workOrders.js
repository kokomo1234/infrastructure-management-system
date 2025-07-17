const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { requireAuth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Validation rules for work orders
const workOrderValidation = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Priority must be low, medium, high, or critical'),
  body('status').optional().isIn(['draft', 'open', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('type').optional().trim().isLength({ max: 100 }),
  body('site_id').optional().trim().isLength({ max: 50 }),
  body('site_type').optional().isIn(['TDL', 'TSF']).withMessage('Site type must be TDL or TSF'),
  body('equipment_type').optional().trim().isLength({ max: 100 }),
  body('equipment_id').optional().isInt({ min: 1 }).withMessage('Equipment ID must be a positive integer'),
  body('assigned_to').optional().isUUID().withMessage('Assigned to must be a valid user ID'),
  body('scheduled_date').optional().isISO8601().withMessage('Scheduled date must be a valid date'),
  body('due_date').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('estimated_hours').optional().isFloat({ min: 0 }).withMessage('Estimated hours must be positive'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be positive'),
  body('notes').optional().trim().isLength({ max: 2000 }).withMessage('Notes must be less than 2000 characters')
];

// GET all work orders
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const priority = req.query.priority;
    const assigned_to = req.query.assigned_to;

    // Build WHERE clause
    let whereClause = '1=1';
    const params = [];

    if (status) {
      whereClause += ' AND wo.status = ?';
      params.push(status);
    }

    if (priority) {
      whereClause += ' AND wo.priority = ?';
      params.push(priority);
    }

    if (assigned_to) {
      whereClause += ' AND wo.assigned_to = ?';
      params.push(assigned_to);
    }

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM work_orders wo WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get work orders with user information
    const [workOrders] = await db.execute(
      `SELECT 
        wo.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        assignee.first_name as assignee_first_name,
        assignee.last_name as assignee_last_name
       FROM work_orders wo
       LEFT JOIN users creator ON wo.created_by = creator.id
       LEFT JOIN users assignee ON wo.assigned_to = assignee.id
       WHERE ${whereClause}
       ORDER BY wo.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      workOrders: workOrders.map(wo => ({
        ...wo,
        creator_name: wo.creator_first_name ? `${wo.creator_first_name} ${wo.creator_last_name}` : null,
        assignee_name: wo.assignee_first_name ? `${wo.assignee_first_name} ${wo.assignee_last_name}` : null
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({
      error: 'Failed to fetch work orders',
      code: 'FETCH_WORK_ORDERS_ERROR'
    });
  }
});

// GET work order by ID
router.get('/:id', async (req, res) => {
  try {
    const [workOrders] = await db.execute(
      `SELECT 
        wo.*,
        creator.first_name as creator_first_name,
        creator.last_name as creator_last_name,
        assignee.first_name as assignee_first_name,
        assignee.last_name as assignee_last_name
       FROM work_orders wo
       LEFT JOIN users creator ON wo.created_by = creator.id
       LEFT JOIN users assignee ON wo.assigned_to = assignee.id
       WHERE wo.id = ?`,
      [req.params.id]
    );

    if (workOrders.length === 0) {
      return res.status(404).json({
        error: 'Work order not found',
        code: 'WORK_ORDER_NOT_FOUND'
      });
    }

    const workOrder = workOrders[0];
    res.json({
      workOrder: {
        ...workOrder,
        creator_name: workOrder.creator_first_name ? `${workOrder.creator_first_name} ${workOrder.creator_last_name}` : null,
        assignee_name: workOrder.assignee_first_name ? `${workOrder.assignee_first_name} ${workOrder.assignee_last_name}` : null
      }
    });

  } catch (error) {
    console.error('Error fetching work order:', error);
    res.status(500).json({
      error: 'Failed to fetch work order',
      code: 'FETCH_WORK_ORDER_ERROR'
    });
  }
});

// POST create new work order
router.post('/', workOrderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      title,
      description,
      priority,
      status = 'draft',
      type,
      site_id,
      site_type,
      equipment_type,
      equipment_id,
      assigned_to,
      scheduled_date,
      due_date,
      estimated_hours,
      cost,
      notes
    } = req.body;

    // Generate work order ID
    const workOrderId = require('crypto').randomUUID();

    // Create work order
    await db.execute(
      `INSERT INTO work_orders (
        id, title, description, priority, status, type, site_id, site_type,
        equipment_type, equipment_id, assigned_to, created_by, scheduled_date,
        due_date, estimated_hours, cost, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        workOrderId, title, description, priority, status, type, site_id, site_type,
        equipment_type, equipment_id, assigned_to, req.user.id, scheduled_date,
        due_date, estimated_hours, cost, notes
      ]
    );

    res.status(201).json({
      message: 'Work order created successfully',
      workOrder: {
        id: workOrderId,
        title,
        description,
        priority,
        status,
        type,
        site_id,
        site_type,
        equipment_type,
        equipment_id,
        assigned_to,
        created_by: req.user.id,
        scheduled_date,
        due_date,
        estimated_hours,
        cost,
        notes
      }
    });

  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({
      error: 'Failed to create work order',
      code: 'CREATE_WORK_ORDER_ERROR'
    });
  }
});

// PUT update work order
router.put('/:id', workOrderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Check if work order exists
    const [existingWorkOrders] = await db.execute(
      'SELECT id, created_by FROM work_orders WHERE id = ?',
      [req.params.id]
    );

    if (existingWorkOrders.length === 0) {
      return res.status(404).json({
        error: 'Work order not found',
        code: 'WORK_ORDER_NOT_FOUND'
      });
    }

    const {
      title,
      description,
      priority,
      status,
      type,
      site_id,
      site_type,
      equipment_type,
      equipment_id,
      assigned_to,
      scheduled_date,
      due_date,
      estimated_hours,
      actual_hours,
      cost,
      notes,
      completed_date
    } = req.body;

    // Update work order
    await db.execute(
      `UPDATE work_orders SET 
        title = ?, description = ?, priority = ?, status = ?, type = ?, site_id = ?,
        site_type = ?, equipment_type = ?, equipment_id = ?, assigned_to = ?,
        scheduled_date = ?, due_date = ?, estimated_hours = ?, actual_hours = ?,
        cost = ?, notes = ?, completed_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title, description, priority, status, type, site_id, site_type,
        equipment_type, equipment_id, assigned_to, scheduled_date, due_date,
        estimated_hours, actual_hours, cost, notes, completed_date, req.params.id
      ]
    );

    res.json({
      message: 'Work order updated successfully'
    });

  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({
      error: 'Failed to update work order',
      code: 'UPDATE_WORK_ORDER_ERROR'
    });
  }
});

// DELETE work order
router.delete('/:id', async (req, res) => {
  try {
    // Check if work order exists
    const [existingWorkOrders] = await db.execute(
      'SELECT id, created_by FROM work_orders WHERE id = ?',
      [req.params.id]
    );

    if (existingWorkOrders.length === 0) {
      return res.status(404).json({
        error: 'Work order not found',
        code: 'WORK_ORDER_NOT_FOUND'
      });
    }

    const workOrder = existingWorkOrders[0];

    // Only allow creator or admin to delete
    if (workOrder.created_by !== req.user.id && req.user.department?.toLowerCase() !== 'infrastructure') {
      return res.status(403).json({
        error: 'Insufficient permissions to delete this work order',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Delete work order
    await db.execute('DELETE FROM work_orders WHERE id = ?', [req.params.id]);

    res.json({
      message: 'Work order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting work order:', error);
    res.status(500).json({
      error: 'Failed to delete work order',
      code: 'DELETE_WORK_ORDER_ERROR'
    });
  }
});

module.exports = router;
