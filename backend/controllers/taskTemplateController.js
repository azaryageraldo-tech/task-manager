const { TaskTemplate, Task } = require('../models');

// Membuat template baru dari task yang ada
exports.createTemplateFromTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name } = req.body;

    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const template = await TaskTemplate.create({
      name,
      description: task.description,
      priority: task.priority,
      estimatedDuration: task.estimatedDuration,
      userId: req.user.id
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat task dari template
exports.createTaskFromTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { deadline } = req.body;

    const template = await TaskTemplate.findOne({
      where: {
        id: templateId,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    const task = await Task.create({
      title: template.name,
      description: template.description,
      priority: template.priority,
      status: 'pending',
      deadline,
      userId: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan semua template
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await TaskTemplate.findAll({
      where: { userId: req.user.id }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus template
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await TaskTemplate.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    await template.destroy();
    res.json({ message: 'Template berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};