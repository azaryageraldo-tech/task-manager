const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Task, {
      foreignKey: 'taskId',
      onDelete: 'CASCADE'
    });
  };

  return Comment;
};