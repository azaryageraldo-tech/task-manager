const { Task } = require('../models');
const { Op } = require('sequelize');
const { createDeadlineNotification } = require('../utils/notificationHelper');

const taskController = {
  // Membuat tugas baru
  createTask: async (req, res) => {
    try {
      const { title, description, priority, status, deadline } = req.body;
      const task = await Task.create({
        title,
        description,
        priority,
        status,
        deadline,
        userId: req.user.id
      });
      
      await createDeadlineNotification(task);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Mendapatkan semua tugas
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll({
        where: { userId: req.user.id }
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mendapatkan tugas berdasarkan ID
  getTaskById: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (!task) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mengupdate tugas
  updateTask: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (!task) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
      }
      await task.update(req.body);
      
      if (req.body.deadline) {
        await createDeadlineNotification(task);
      }
      
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Menghapus tugas
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });
      if (!task) {
        return res.status(404).json({ message: 'Tugas tidak ditemukan' });
      }
      await task.destroy();
      res.json({ message: 'Tugas berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mendapatkan tugas dengan filter
  getFilteredTasks: async (req, res) => {
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
  },

  // Mendapatkan tugas yang mendekati deadline
  getUpcomingDeadlines: async (req, res) => {
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
  },
  getTaskStats: async (req, res) => {
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
  },
};

module.exports = taskController;