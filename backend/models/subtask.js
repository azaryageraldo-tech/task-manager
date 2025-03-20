const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subtask = sequelize.define('Subtask', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tasks',
        key: 'id'
      }
    }
  });

  Subtask.associate = (models) => {
    Subtask.belongsTo(models.Task, {
      foreignKey: 'taskId',
      onDelete: 'CASCADE'
    });
  };

  return Subtask;
};