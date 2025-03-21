const { Comment, Task } = require('../models');

exports.createComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;
    
    // Check if task exists and user has access
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }

    const comment = await Comment.create({
      taskId,
      userId: req.user.id,
      content
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommentsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.findAll({
      where: { taskId }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment tidak ditemukan' });
    }

    await comment.update({ content });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment tidak ditemukan' });
    }

    await comment.destroy();
    res.json({ message: 'Comment berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};