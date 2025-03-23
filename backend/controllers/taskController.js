const Task = require('../models/task');
const { Op } = require('sequelize');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: ['category'],
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, categoryId } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      deadline,
      categoryId,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Task.update(req.body, {
      where: { id, userId: req.user.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const task = await Task.findByPk(id);
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({
      where: { id, userId: req.user.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: { id, userId: req.user.id },
      include: ['category']
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Get task by id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFilteredTasks = async (req, res) => { // Hapus tanda :
  try {
    const { priority, status, search, category, sortBy, order } = req.query;
    const whereClause = { userId: req.user.id };
    
    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
  
    const orderClause = [];
    if (sortBy) {
      orderClause.push([sortBy, order || 'ASC']);
    } else {
      orderClause.push(['deadline', 'ASC']);
    }
  
    const tasks = await Task.findAll({
      where: whereClause,
      order: orderClause
    });
  
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat memfilter tugas' });
  }
};

exports.getUpcomingDeadlines = async (req, res) => { // Hapus tanda :
  try {
    const sekarang = new Date();
    const tigaHariKedepan = new Date(sekarang.getTime() + (3 * 24 * 60 * 60 * 1000));
  
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        deadline: {
          [Op.between]: [sekarang, tigaHariKedepan]
        },
        status: {
          [Op.ne]: 'completed'
        }
      },
      order: [['deadline', 'ASC']]
    });
  
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil tugas yang mendekati deadline' });
  }
};

exports.getTaskStats = async (req, res) => { // Hapus tanda :
  try {
    const totalTasks = await Task.count({ where: { userId: req.user.id } });
    const completedTasks = await Task.count({ 
      where: { 
        userId: req.user.id,
        status: 'completed'
      }
    });
    const upcomingTasks = await Task.count({
      where: {
        userId: req.user.id,
        deadline: {
          [Op.gt]: new Date()
        }
      }
    });
  
    res.json({
      total: totalTasks,
      completed: completedTasks,
      upcoming: upcomingTasks,
      completion_rate: totalTasks ? (completedTasks / totalTasks * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil statistik tugas' });
  }
};

// Hapus baris module.exports = taskController karena sudah menggunakan exports.*