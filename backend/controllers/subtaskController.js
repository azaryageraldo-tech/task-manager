const { Subtask, Task } = require('../models');

exports.createSubtask = async (req, res) => {
  try {
    const { taskId, title, description } = req.body;
    
    // Check if task exists and belongs to user
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const subtask = await Subtask.create({
      taskId,
      title,
      description,
      status: 'pending'
    });

    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubtasksByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Check if task belongs to user
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const subtasks = await Subtask.findAll({
      where: { taskId }
    });

    res.json(subtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const subtask = await Subtask.findOne({
      where: { id },
      include: [{
        model: Task,
        where: { userId: req.user.id }
      }]
    });

    if (!subtask) {
      return res.status(404).json({ message: 'Subtask tidak ditemukan' });
    }

    await subtask.update({ title, description, status });
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await Subtask.findOne({
      where: { id },
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
};