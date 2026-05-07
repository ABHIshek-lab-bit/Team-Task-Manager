const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskValidation, validate } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', taskController.getAllTasks);
router.get('/dashboard', taskController.getDashboard);
router.get('/:id', taskController.getTask);
router.post('/', taskValidation, validate, taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
