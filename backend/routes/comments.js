const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.use(auth);

// Comment routes
router.post('/', commentController.createComment);
router.get('/task/:taskId', commentController.getCommentsByTaskId);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;