const express = require('express');
const router = express.Router();
const taskTemplateController = require('../controllers/taskTemplateController');
const auth = require('../middleware/auth');

router.use(auth);

// Template routes
router.post('/task/:taskId/template', taskTemplateController.createTemplateFromTask);
router.post('/template/:templateId/task', taskTemplateController.createTaskFromTemplate);
router.get('/', taskTemplateController.getAllTemplates);
router.delete('/:id', taskTemplateController.deleteTemplate);

module.exports = router;