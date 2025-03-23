const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Task = require('./task');
const Category = require('./category'); // Perbaiki nama file menjadi lowercase
const User = require('./user'); // Konsistensi dengan lowercase

// Associations
Task.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Task, { foreignKey: 'categoryId' });

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

Category.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Category, { foreignKey: 'userId' });

module.exports = {
  Task,
  Category,
  User
};