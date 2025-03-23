const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskcontroller');
const categoryController = require('../controllers/categorycontroller');
const notificationController = require('../controllers/notificationcontroller');

// Protect all routes
router.use(authMiddleware);

// Tasks routes
router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Categories routes
router.get('/categories', categoryController.getAllCategories);
router.post('/categories', categoryController.createCategory);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// Notifications routes
router.get('/notifications', notificationController.getNotifications);

module.exports = router;