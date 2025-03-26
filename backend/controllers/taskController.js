const Task = require('../models/task');
const Category = require('../models/category');
const { Op } = require('sequelize');

exports.createTask = async (req, res) => {
  try {
    // Log input data
    console.log('Mencoba membuat task baru');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user?.id);

    // Validasi input
    if (!req.body.title) {
      return res.status(400).json({ message: 'Judul task wajib diisi' });
    }

    // Buat task baru
    const taskData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      deadline: req.body.deadline,
      categoryId: req.body.categoryId,
      userId: req.user.id
    };

    console.log('Data task yang akan dibuat:', taskData);

    const task = await Task.create(taskData);
    console.log('Task berhasil dibuat:', task.id);

    // Ambil task dengan data kategori
    const fullTask = await Task.findOne({
      where: { id: task.id },
      include: ['category']
    });

    res.status(201).json(fullTask);
  } catch (error) {
    console.error('Error saat membuat task:', error);
    res.status(500).json({
      message: 'Gagal membuat task',
      error: error.message
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    console.log('Getting all tasks...');
    
    // Hapus filter userId untuk sementara
    const tasks = await Task.findAll({
      include: ['category'],
      order: [['createdAt', 'DESC']]
    });
    
    console.log('Tasks found:', tasks.length);
    res.json(tasks);
  } catch (error) {
    console.error('Error detail:', error);
    res.status(500).json({ 
      message: 'Failed to fetch tasks',
      error: error.message 
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    console.log('Getting all tasks...');
    console.log('Request headers:', req.headers);
    console.log('User data:', req.user);
    
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: ['category'],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    console.error('Error detail:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
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