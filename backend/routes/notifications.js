const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationcontroller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
// Hapus route PUT yang tidak memiliki handler atau tambahkan handler yang sesuai

module.exports = router;