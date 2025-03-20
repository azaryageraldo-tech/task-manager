const { Notification, Task } = require('../models');
const { Op } = require('sequelize');

const createDeadlineNotification = async (task) => {
  try {
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3 && diffDays > 0) {
      await Notification.create({
        message: `Tugas "${task.title}" akan berakhir dalam ${diffDays} hari`,
        status: 'unread',
        userId: task.userId,
        taskId: task.id
      });
    }
  } catch (error) {
    console.error('Gagal membuat notifikasi:', error);
  }
};

module.exports = { createDeadlineNotification };