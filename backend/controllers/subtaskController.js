const { Subtask, Task } = require('../models');

const subtaskController = {
  createSubtask: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: { 
          id: req.params.taskId,
          userId: req.user.id
        }
      });

      if (!task) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
      }

      const subtask = await Subtask.create({
        title: req.body.title,
        taskId: task.id
      });

      res.status(201).json(subtask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  toggleComplete: async (req, res) => {
    try {
      const subtask = await Subtask.findOne({
        where: { id: req.params.id },
        include: [{
          model: Task,
          where: { userId: req.user.id }
        }]
      });

      if (!subtask) {
        return res.status(404).json({ message: 'Subtask tidak ditemukan' });
      }

      subtask.completed = !subtask.completed;
      await subtask.save();

      res.json(subtask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteSubtask: async (req, res) => {
    try {
      const subtask = await Subtask.findOne({
        where: { id: req.params.id },
        include: [{
          model: Task,
          where: { userId: req.user.id }
        }]
      });

      if (!subtask) {
        return res.status(404).json({ message: 'Subtask tidak ditemukan' });
      }

      await subtask.destroy();
      res.json({ message: 'Subtask berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = subtaskController;