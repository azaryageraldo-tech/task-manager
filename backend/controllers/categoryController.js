const Category = require('../models/category');
const Task = require('../models/task');
const { sequelize } = require('../config/database');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Task,
        attributes: ['id'],
        required: false
      }],
      attributes: {
        include: [[sequelize.fn('COUNT', sequelize.col('Tasks.id')), 'taskCount']]
      },
      group: ['Category.id']
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      name,
      color,
      userId: req.user.id
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const category = await Category.findByPk(req.params.id);
    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};