const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const auth = require('../middleware/auth');

router.use(auth);

// Subtask routes
router.post('/', subtaskController.createSubtask);
router.get('/task/:taskId', subtaskController.getSubtasksByTaskId);
router.put('/:id', subtaskController.updateSubtask);
router.delete('/:id', subtaskController.deleteSubtask);

module.exports = router;