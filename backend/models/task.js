const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    priority: {
      type: DataTypes.STRING,
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    deadline: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Task.hasMany(models.Subtask, {
      foreignKey: 'taskId'
    });
    Task.belongsToMany(models.Category, {
      through: 'TaskCategories',
      foreignKey: 'taskId'
    });
  };

  return Task;
};