const { Notification, Task } = require('../models');
const { Op } = require('sequelize');

const notificationController = {
  // Mendapatkan semua notifikasi user
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: { userId: req.user.id },
        include: [{
          model: Task,
          attributes: ['title', 'deadline']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengambil notifikasi' });
    }
  },

  // Menandai notifikasi sebagai sudah dibaca
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findOne({
        where: { 
          id: req.params.id,
          userId: req.user.id
        }
      });
      
      if (!notification) {
        return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
      }

      await notification.update({ status: 'read' });
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: 'Gagal memperbarui status notifikasi' });
    }
  }
};

module.exports = notificationController;