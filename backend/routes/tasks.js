const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/taskValidation');
const { Task, Subtask } = require('../models'); // Tambahkan import models

router.use(auth);

// Tambahkan validateTask ke route yang memerlukan validasi
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTask, taskController.updateTask);

// Route lainnya tetap sama
router.get('/', taskController.getAllTasks);
router.get('/filter', taskController.getFilteredTasks);
router.get('/upcoming', taskController.getUpcomingDeadlines);
router.get('/stats', taskController.getTaskStats);
router.get('/:id', taskController.getTaskById);
router.get('/:id/subtasks', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Subtask,
        attributes: ['id', 'title', 'completed', 'createdAt', 'updatedAt']
      }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    res.json(task.Subtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/:id', taskController.deleteTask);

module.exports = router;