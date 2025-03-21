const { TaskShare, Task, User } = require('../models');

exports.shareTask = async (req, res) => {
  try {
    const { taskId, sharedUserId, permission } = req.body;

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

    // Check if shared user exists
    const sharedUser = await User.findByPk(sharedUserId);
    if (!sharedUser) {
      return res.status(404).json({ message: 'User yang dituju tidak ditemukan' });
    }

    // Check if share already exists
    const existingShare = await TaskShare.findOne({
      where: {
        taskId,
        sharedUserId
      }
    });

    if (existingShare) {
      return res.status(400).json({ message: 'Task sudah dibagikan ke user ini' });
    }

    const taskShare = await TaskShare.create({
      taskId,
      userId: req.user.id,
      sharedUserId,
      permission
    });

    res.status(201).json(taskShare);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSharedWithMe = async (req, res) => {
  try {
    const shares = await TaskShare.findAll({
      where: { sharedUserId: req.user.id },
      include: [{ model: Task }]
    });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyShares = async (req, res) => {
  try {
    const shares = await TaskShare.findAll({
      where: { userId: req.user.id },
      include: [{ model: Task }]
    });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSharePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission } = req.body;

    const share = await TaskShare.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!share) {
      return res.status(404).json({ message: 'Share tidak ditemukan' });
    }

    await share.update({ permission });
    res.json(share);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeShare = async (req, res) => {
  try {
    const { id } = req.params;

    const share = await TaskShare.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!share) {
      return res.status(404).json({ message: 'Share tidak ditemukan' });
    }

    await share.destroy();
    res.json({ message: 'Share berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};