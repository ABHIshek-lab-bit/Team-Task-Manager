const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            errors: errors.array() 
        });
    }
    next();
};

// User validation rules
exports.signupValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Project validation rules
exports.projectValidation = [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().trim()
];

// Task validation rules
exports.taskValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').optional().trim(),
    body('project_id').isInt().withMessage('Valid project ID is required'),
    body('assigned_to').optional().isInt().withMessage('Valid user ID is required'),
    body('status').optional().isIn(['todo', 'in_progress', 'review', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
    body('due_date').optional().isISO8601().withMessage('Valid date is required')
];
