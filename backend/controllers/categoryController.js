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
    console.log('Data kategori yang diterima:', req.body);
    console.log('User ID:', req.user.id);

    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Nama kategori harus diisi' });
    }

    const category = await Category.create({
      name,
      color: color || '#000000',
      userId: req.user.id
    });

    console.log('Kategori berhasil dibuat:', category);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error membuat kategori:', error);
    res.status(500).json({ 
      message: 'Gagal membuat kategori',
      error: error.message 
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    console.log('Mengambil kategori untuk user:', req.user.id);
    
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });

    console.log('Jumlah kategori ditemukan:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Error mengambil kategori:', error);
    res.status(500).json({ message: 'Gagal mengambil kategori' });
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