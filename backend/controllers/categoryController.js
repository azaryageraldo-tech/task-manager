const { Category, Task } = require('../models');
const { Op } = require('sequelize');

// Get all categories for the current user
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, color, description } = req.body;
    
    // Check if category with same name already exists for this user
    const existingCategory = await Category.findOne({
      where: { 
        name,
        userId: req.user.id
      }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada' });
    }
    
    const category = await Category.create({
      name,
      color,
      description,
      userId: req.user.id
    });
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, color, description } = req.body;
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        where: { 
          name,
          userId: req.user.id,
          id: { [Op.ne]: req.params.id }
        }
      });
      
      if (existingCategory) {
        return res.status(400).json({ message: 'Kategori dengan nama ini sudah ada' });
      }
    }
    
    await category.update({
      name: name || category.name,
      color: color || category.color,
      description: description !== undefined ? description : category.description
    });
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    await category.destroy();
    res.json({ message: 'Kategori berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add category to task
exports.addCategoryToTask = async (req, res) => {
  try {
    const { taskId, categoryId } = req.params;
    
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }
    
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    await task.addCategory(category);
    
    const updatedTask = await Task.findOne({
      where: { id: taskId },
      include: [{ model: Category }]
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove category from task
exports.removeCategoryFromTask = async (req, res) => {
  try {
    const { taskId, categoryId } = req.params;
    
    const task = await Task.findOne({
      where: {
        id: taskId,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }
    
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    await task.removeCategory(category);
    
    const updatedTask = await Task.findOne({
      where: { id: taskId },
      include: [{ model: Category }]
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tasks by category
exports.getTasksByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId: req.user.id
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' });
    }
    
    const tasks = await Task.findAll({
      include: [
        {
          model: Category,
          where: { id: categoryId },
          attributes: ['id', 'name', 'color']
        }
      ],
      where: { userId: req.user.id }
    });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};