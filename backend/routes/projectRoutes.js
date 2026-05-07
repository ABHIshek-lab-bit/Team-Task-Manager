const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { projectValidation, validate } = require('../middleware/validation');
const { authenticate, isProjectAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectValidation, validate, projectController.createProject);
router.put('/:id', isProjectAdmin, projectValidation, validate, projectController.updateProject);
router.delete('/:id', isProjectAdmin, projectController.deleteProject);

// Team management
router.post('/:id/members', isProjectAdmin, projectController.addMember);
router.delete('/:id/members/:userId', isProjectAdmin, projectController.removeMember);

module.exports = router;
