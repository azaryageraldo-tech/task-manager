const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.use(auth);

// Category CRUD routes
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Task-Category relationship routes
router.post('/task/:taskId/category/:categoryId', categoryController.addCategoryToTask);
router.delete('/task/:taskId/category/:categoryId', categoryController.removeCategoryFromTask);
router.get('/category/:categoryId/tasks', categoryController.getTasksByCategory);

module.exports = router;