const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subtaskController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/task/:taskId', subtaskController.createSubtask);
router.put('/:id/toggle', subtaskController.toggleComplete);
router.delete('/:id', subtaskController.deleteSubtask);

module.exports = router;