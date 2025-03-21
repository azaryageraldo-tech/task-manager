const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const TaskShare = sequelize.define('TaskShare', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sharedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    permission: {
      type: DataTypes.ENUM('view', 'edit'),
      defaultValue: 'view'
    }
  });

  TaskShare.associate = (models) => {
    TaskShare.belongsTo(models.Task, { foreignKey: 'taskId' });
    TaskShare.belongsTo(models.User, { foreignKey: 'userId' });
    TaskShare.belongsTo(models.User, { foreignKey: 'sharedUserId', as: 'sharedUser' });
  };

  return TaskShare;
};