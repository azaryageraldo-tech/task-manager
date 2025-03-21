const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaskTemplate = sequelize.define('TaskTemplate', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    estimatedDuration: {
      type: DataTypes.INTEGER, // dalam menit
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  TaskTemplate.associate = (models) => {
    TaskTemplate.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return TaskTemplate;
};